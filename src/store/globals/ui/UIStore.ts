import type { RootStoreType } from '../root';

import { ModalModel } from './ModalModel';
import { PopoutModel } from './PopoutModel';
import { SnackbarModel } from './SnackbarModel';

export class UIStore {
  readonly popout = new PopoutModel();
  readonly snackbar = new SnackbarModel();
  readonly modal: ModalModel;

  constructor(readonly rootStore: RootStoreType) {
    this.modal = new ModalModel(rootStore.historyStore);
  }
}
