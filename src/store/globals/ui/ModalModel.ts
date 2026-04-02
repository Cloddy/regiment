import { makeObservable, computed } from 'mobx';

import { ModalEnum } from 'config/routes/enums';

import { type HistoryStore, type BaseStateType } from '../history';

export class ModalModel {
  constructor(private readonly _historyStore: HistoryStore) {
    makeObservable<this>(this, {
      id: computed,
      isOpen: computed,
    });
  }

  get id(): ModalEnum | null {
    return this._historyStore.modal;
  }

  get isOpen(): boolean {
    return this._historyStore.modalOpened;
  }

  readonly open = (id: ModalEnum, payload?: Omit<BaseStateType, 'modal'>) => {
    // @ts-ignore
    this._historyStore.push({ modal: id, state: payload });
  };

  readonly close = () => {
    this.isOpen && this._historyStore.goBack();
  };
}
