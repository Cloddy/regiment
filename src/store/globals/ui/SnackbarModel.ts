import { action, computed, makeObservable, observable } from 'mobx';
import { ReactNode } from 'react';

import {
  DEFAULT_SNACKBAR_MESSAGES,
  SNACKBAR_DEFAULT_DURATION,
  SNACKBAR_GOALS_ICONS,
  SnackbarMessageType,
} from 'config/snackbars';

export class SnackbarModel {
  snackbarMessage: SnackbarMessageType | null = null;

  constructor() {
    makeObservable(this, {
      snackbarMessage: observable,

      openSnackbarMessage: action,
      closeSnackbar: action,

      isSnackbarOpen: computed,
      duration: computed,
      message: computed,
      icon: computed,
    });
  }

  get duration(): number {
    return this.snackbarMessage?.duration ?? SNACKBAR_DEFAULT_DURATION;
  }

  get message(): ReactNode | null {
    return this.snackbarMessage?.text ? this.snackbarMessage?.text : null;
  }

  get icon(): ReactNode | null {
    return this.snackbarMessage?.goal ? SNACKBAR_GOALS_ICONS[this.snackbarMessage?.goal] : null;
  }

  get isSnackbarOpen(): boolean {
    return this.snackbarMessage !== null;
  }

  openSnackbarMessage = (message?: SnackbarMessageType): void => {
    this.snackbarMessage = message ?? DEFAULT_SNACKBAR_MESSAGES.error;
  };

  triggerDefaultErrorMessage = (): void => {
    this.openSnackbarMessage(DEFAULT_SNACKBAR_MESSAGES.error);
  };

  closeSnackbar = (): void => {
    this.snackbarMessage = null;
  };
}
