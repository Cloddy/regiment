import { getMiniAppRuntime } from 'bridge/runtime';

import { RootStoreType } from '../root';

import { MaxStorage, VKStorage } from './storages';

export default class StorageStore {
  private readonly _rootStore: RootStoreType;
  storage: MaxStorage | VKStorage;
  getItem: (typeof this.storage)['getItem'];
  setItem: (typeof this.storage)['setItem'];
  removeItem: (typeof this.storage)['removeItem'];

  constructor(rootStore: RootStoreType) {
    this._rootStore = rootStore;
    this.storage =
      getMiniAppRuntime() === 'max' ? new MaxStorage(this._rootStore) : new VKStorage(this._rootStore);

    this.getItem = this.storage.getItem;
    this.setItem = this.storage.setItem;
    this.removeItem = this.storage.removeItem;
  }
}
