import { DeviceInfo, VK_PLATFORM_CLASSNAME } from '@ktsstudio/mediaproject-vk';

import { OkPlatformType } from 'store/types';

const DESKTOP_OK_PLATFORMS: OkPlatformType[] = ['desktop_web_ok'];

const IOS_OK_PLATFORMS: OkPlatformType[] = ['mobile_ipad_ok', 'mobile_iphone_ok'];

const ANDROID_OK_PLATFORMS: OkPlatformType[] = ['mobile_android_ok'];

const { desktop, android, ios, mobile } = VK_PLATFORM_CLASSNAME;

const OK_PLATFORM_CLASSNAME = {
  desktop,
  android,
  ios,
  mobile,
  mok: 'mok',
};

/**
 * Утилита для вычисления информации о текущей платформе, на которой запущено приложение в Одноклассниках.
 * В зависимости от платформы возвращает нужные параметры и добавляет нужные класснеймы на тег body.
 *
 * Аналог утилиты checkVkPlatform из mediaproject-vk
 */
const checkOkPlatform = (platform: OkPlatformType | undefined): DeviceInfo | null => {
  if (!platform) {
    return null;
  }

  const isMobile = Boolean(platform && !DESKTOP_OK_PLATFORMS.includes(platform));

  /**
   * Если обнаружили, что открыта десктопная версия,
   * дальнейших проверок на платформу не делаем
   */
  if (!isMobile) {
    document.body.classList.add(OK_PLATFORM_CLASSNAME.desktop);

    return { isMobile: false, isIos: false, isAndroid: false, isMvk: false };
  }

  document.body.classList.add(OK_PLATFORM_CLASSNAME.mobile);

  /**
   * Проверяем, открыты ли мобильное приложение или мобильный браузер на IOS
   */
  if (IOS_OK_PLATFORMS.includes(platform)) {
    document.body.classList.add(OK_PLATFORM_CLASSNAME.ios);

    return { isMobile: true, isIos: true, isAndroid: false, isMvk: false };
  }

  /**
   * Проверяем, открыты ли мобильное приложение или мобильный браузер на Android
   */
  if (ANDROID_OK_PLATFORMS.includes(platform)) {
    document.body.classList.add(OK_PLATFORM_CLASSNAME.android);

    return { isMobile: true, isIos: false, isAndroid: true, isMvk: false };
  }

  document.body.classList.add(OK_PLATFORM_CLASSNAME.mok);

  if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
    document.body.classList.add(OK_PLATFORM_CLASSNAME.ios);

    return { isMobile: true, isIos: true, isAndroid: false, isMvk: true };
  }

  if (/android/i.test(navigator.userAgent)) {
    document.body.classList.add(OK_PLATFORM_CLASSNAME.android);

    return { isMobile: true, isIos: false, isAndroid: true, isMvk: true };
  }

  return { isMobile: true, isIos: false, isAndroid: false, isMvk: true };
};

export { checkOkPlatform };
