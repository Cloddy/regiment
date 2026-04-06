import vkBridge from '@vkontakte/vk-bridge';

import { getMaxWebApp } from './maxWebApp';

export type MiniAppRuntime = 'vk' | 'max' | 'browser';

const hasVkLaunchParams = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const { search } = window.location;

  return /[?&]vk_app_id=/.test(search) || /[?&]vk_user_id=/.test(search);
};

/**
 * Признаки сессии MAX в URL / initData.
 * @see https://dev.max.ru/docs/webapps/bridge
 */
const hasMaxLaunchContext = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const { search, hash } = window.location;
  const loc = `${search}${hash}`;

  if (/[?&#]WebAppVersion=/.test(loc) || /[?&#]initData=/.test(loc)) {
    return true;
  }

  const unsafe = getMaxWebApp()?.initDataUnsafe;

  return Boolean(unsafe?.query_id);
};

/**
 * Запуск внутри клиента MAX (включая web: у MAX задаётся `WebApp.platform === 'web'`).
 * Не считаем MAX, если в URL параметры VK Mini App — приоритет у VK.
 */
export const isMaxShell = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (hasVkLaunchParams()) {
    return false;
  }

  const webApp = getMaxWebApp();

  if (!webApp?.ready) {
    return false;
  }

  return (
    hasMaxLaunchContext() ||
    Boolean(webApp.initData) ||
    Boolean(webApp.platform) ||
    Boolean(webApp.version) ||
    Boolean(webApp.initDataUnsafe?.user)
  );
};

/**
 * Определяет среду запуска.
 * MAX: клиент подставил `window.WebApp` с platform/version/initData (в т.ч. web).
 * VK: WebView или query vk_app_id / vk_user_id.
 */
export const getMiniAppRuntime = (): MiniAppRuntime => {
  if (typeof window === 'undefined') {
    return 'browser';
  }

  if (isMaxShell()) {
    return 'max';
  }

  try {
    if (vkBridge.isWebView() || hasVkLaunchParams()) {
      return 'vk';
    }
  } catch {
    if (hasVkLaunchParams()) {
      return 'vk';
    }
  }

  return 'browser';
};

export const isMaxMiniApp = (): boolean => getMiniAppRuntime() === 'max';

export const isVkMiniApp = (): boolean => getMiniAppRuntime() === 'vk';
