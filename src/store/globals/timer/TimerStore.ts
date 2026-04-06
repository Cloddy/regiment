import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { makeAutoObservable } from 'mobx';

import { IS_DEV } from 'config/env';

import { RootStoreType } from '../root';

import { dateOptions } from './types';

dayjs.extend(utc);

export class TimerStore {
  private _checkMay7Interval: NodeJS.Timeout | null = null;

  private _checkMay9Interval: NodeJS.Timeout | null = null;

  // @ts-ignore
  private readonly _rootStore: RootStoreType;

  /** 6 мая 23:59 по Москве */
  may7Date = dayjs.utc(new Date(2026, 4, 6, 23, 59, 0)).utcOffset(3);

  isMay7Came = false;

  /** 9 мая по местному времени */
  may9Date = new Date(2026, 4, 9, 0, 0, 0);

  isMay9Came = false;

  constructor(readonly rootStore: RootStoreType) {
    makeAutoObservable(this, {
      rootStore: false,
    });
    this._rootStore = rootStore;
  }

  setDevMay7Date = () => {
    if (!IS_DEV) {
      return;
    }

    const now = new Date();
    const plusOneMinute = new Date(now.getTime() + 1 * 6 * 1000);

    this.may7Date = dayjs.utc(new Date(plusOneMinute)).utcOffset(3);
    console.log('7 Мая', now, this.may7Date.format());
  };

  setDevMay9Date = () => {
    if (!IS_DEV) {
      return;
    }

    const now = new Date();
    const plusOneMinute = new Date(now.getTime() + 1 * 6 * 1000);

    this.may9Date = new Date(plusOneMinute);
    console.log('9 Мая', this.may9Date);
  };

  checkMay7Date = () => {
    const formatter = new Intl.DateTimeFormat('en-US', dateOptions);
    const now = dayjs.utc(formatter.format(new Date()));

    const isMay7Came = now > this.may7Date;

    if (isMay7Came) {
      this.isMay7Came = true;
      this.stopIntervalOpenMay7();
    }
  };

  startIntervalMay7 = (): void => {
    this._checkMay7Interval = setInterval(this.checkMay7Date, 5000);
    this.checkMay7Date();
  };

  stopIntervalOpenMay7 = (): void => {
    if (this._checkMay7Interval) {
      clearInterval(this._checkMay7Interval);
    }
  };

  checkMay9Date = () => {
    const now = new Date();

    const isMay9Came = now > this.may9Date;

    if (isMay9Came) {
      this.isMay9Came = true;
      this.stopIntervalOpenMay9();
    }
  };

  startIntervalMay9 = (): void => {
    this._checkMay9Interval = setInterval(this.checkMay9Date, 5000);
    this.checkMay9Date();
  };

  stopIntervalOpenMay9 = (): void => {
    if (this._checkMay9Interval) {
      clearInterval(this._checkMay9Interval);
    }
  };

  destroy = () => {
    if (this._checkMay7Interval) {
      clearInterval(this._checkMay7Interval);
      this._checkMay7Interval = null;
    }

    if (this._checkMay9Interval) {
      clearInterval(this._checkMay9Interval);
      this._checkMay9Interval = null;
    }
  };
}
