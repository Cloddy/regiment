import type { PlatformType } from 'store/types';

/** Минимальная типизация MAX Bridge (`window.WebApp`). */
export type MaxWebAppDeviceStorage = {
  setItem: (key: string, value: string) => Promise<void> | void;
  getItem: (key: string) => Promise<string | null | undefined> | string | null | undefined;
  removeItem: (key: string) => Promise<void> | void;
  clear?: () => Promise<void> | void;
};

export type MaxWebAppUnsafeUser = {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
};

export type MaxWebApp = {
  ready: () => void;
  initDataUnsafe?: {
    user?: MaxWebAppUnsafeUser;
    query_id?: string;
  };
  platform?: string;
  version?: string;
  DeviceStorage?: MaxWebAppDeviceStorage;
};

export const getMaxWebApp = (): MaxWebApp | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return (window as Window & { WebApp?: MaxWebApp }).WebApp;
};

/** Платформа MAX → ближайший `PlatformType` для существующей логики. */
export const mapMaxPlatformToAppPlatform = (maxPlatform?: string): PlatformType => {
  const mapped =
    maxPlatform === 'ios'
      ? 'mobile_iphone'
      : maxPlatform === 'android'
        ? 'mobile_android'
        : maxPlatform === 'desktop'
          ? 'desktop_web'
          : 'mobile_web';

  return mapped as PlatformType;
};
