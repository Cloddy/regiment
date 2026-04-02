import { captureVKBridgeException } from '@ktsstudio/mediaproject-stores';
import bridge from '@vkontakte/vk-bridge';

import { RootStoreType } from 'store/globals/root';

import { StorageLikeObject } from '../types';

export class VKStorage implements StorageLikeObject {
  constructor(readonly rootStore: RootStoreType) {}

  private _getItemFromVkStorage = async (key: string): Promise<string | null> => {
    try {
      const { keys } = await bridge.send('VKWebAppStorageGet', { keys: [key] });

      // если ключа или в целом ключей нет, то возвращается null
      if (!keys) {
        return null;
      }

      return keys[0].value;
    } catch (e: any) {
      captureVKBridgeException({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        error: e,
        url: 'VKWebAppStorageGet',
      });

      this.rootStore.uiStore.snackbar.triggerDefaultErrorMessage();

      // если возникла ошибка, то возвращается null
      return null;
    }
  };

  private _setVKItem = (key: string, value: string): void => {
    bridge
      .send('VKWebAppStorageSet', {
        key: key,
        value: value,
      })
      .catch((e: any) => {
        captureVKBridgeException({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          error: e,
          url: 'VKWebAppStorageSet',
        });

        this.rootStore.uiStore.snackbar.triggerDefaultErrorMessage();
      });
  };

  getItem = async (key: string): Promise<string | null> => {
    return await this._getItemFromVkStorage(key);
  };

  setItem = (key: string, value: string): void => {
    void this._setVKItem(key, value);
  };

  removeItem = (key: string): void => {
    void this._setVKItem(key, '');
  };
}
