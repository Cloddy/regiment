import { type RootStoreType } from 'store/globals/root';

export interface IGlobalStore {
  readonly rootStore: RootStoreType;

  init: (...args: any[]) => Promise<boolean>;

  destroy: VoidFunction;
}
