import { RootStoreType } from '../root';

import { VKStorage } from './storages';

export default class StorageStore {
  private readonly _rootStore: RootStoreType;
  storage: VKStorage;
  getItem: (typeof this.storage)['getItem'];
  setItem: (typeof this.storage)['setItem'];
  removeItem: (typeof this.storage)['removeItem'];

  constructor(rootStore: RootStoreType) {
    this._rootStore = rootStore;
    this.storage = new VKStorage(this._rootStore);

    this.getItem = this.storage.getItem;
    this.setItem = this.storage.setItem;
    this.removeItem = this.storage.removeItem;
  }
}
