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
 * Признаки запуска внутри MAX (скрипт max-web-app.js может подгружаться и вне клиента).
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
 * Определяет среду запуска.
 * MAX: `window.WebApp` + стартовые параметры / данные сессии MAX.
 * VK: WebView или типичные query-параметры мини-приложения.
 */
export const getMiniAppRuntime = (): MiniAppRuntime => {
  if (typeof window === 'undefined') {
    return 'browser';
  }

  const webApp = getMaxWebApp();

  if (webApp?.ready && hasMaxLaunchContext()) {
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
