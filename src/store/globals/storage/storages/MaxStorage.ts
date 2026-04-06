import { getMaxWebApp } from 'bridge/maxWebApp';

import { RootStoreType } from 'store/globals/root';

import { StorageLikeObject } from '../types';

const normalizeGet = async (
  value: Promise<string | null | undefined> | string | null | undefined
): Promise<string | null> => {
  const resolved = await Promise.resolve(value);

  if (resolved == null || resolved === '') {
    return null;
  }

  return resolved;
};

export class MaxStorage implements StorageLikeObject {
  constructor(readonly rootStore: RootStoreType) {}

  private get _deviceStorage() {
    return getMaxWebApp()?.DeviceStorage;
  }

  private _localFallbackGet = async (key: string): Promise<string | null> => {
    try {
      return localStorage.getItem(key);
    } catch {
      this.rootStore.uiStore.snackbar.triggerDefaultErrorMessage();

      return null;
    }
  };

  private _localFallbackSet = (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      this.rootStore.uiStore.snackbar.triggerDefaultErrorMessage();
    }
  };

  getItem = async (key: string): Promise<string | null> => {
    const ds = this._deviceStorage;

    if (ds?.getItem) {
      return normalizeGet(ds.getItem(key));
    }

    return this._localFallbackGet(key);
  };

  setItem = (key: string, value: string): void => {
    const ds = this._deviceStorage;

    if (ds?.setItem) {
      void Promise.resolve(ds.setItem(key, value)).catch(() => {
        this.rootStore.uiStore.snackbar.triggerDefaultErrorMessage();
      });

      return;
    }

    this._localFallbackSet(key, value);
  };

  removeItem = (key: string): void => {
    const ds = this._deviceStorage;

    if (ds?.removeItem) {
      void Promise.resolve(ds.removeItem(key)).catch(() => {
        this.rootStore.uiStore.snackbar.triggerDefaultErrorMessage();
      });

      return;
    }

    try {
      localStorage.removeItem(key);
    } catch {
      this.rootStore.uiStore.snackbar.triggerDefaultErrorMessage();
    }
  };
}
