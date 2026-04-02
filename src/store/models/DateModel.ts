import { makeAutoObservable } from 'mobx';

import { DefaultSelectorValueType } from 'components/inputs/Selector/types';
import { days, months, birthYears, deathYears } from 'config/dates';
import { HeroFieldsEnum } from 'config/heroFields';
import { PrecisionDateEnum } from 'config/precisionDate';
import { DateClient } from 'entities/hero';
import {
  addLeadingZero,
  checkIsDateValueChanged,
  dateErrors,
  DateValidatorType,
  getDate,
  StringDateType,
} from 'utils/validators/date';
import isNil from 'utils/validators/isNil';

import FormFieldModel from './FormFieldModel';

export enum DateStateEnum {
  empty,
  full,
  monthYear,
  year,
  incomplete,
}

export class DateModel {
  fieldName: HeroFieldsEnum;

  day = new FormFieldModel<DefaultSelectorValueType | undefined>({
    value: undefined,
    onValueChange: () => (this.errorMessage = ''),
    checkIsChanged: checkIsDateValueChanged,
  });

  month = new FormFieldModel<DefaultSelectorValueType | undefined>({
    value: undefined,
    onValueChange: () => (this.errorMessage = ''),
    checkIsChanged: checkIsDateValueChanged,
  });

  year = new FormFieldModel<DefaultSelectorValueType | undefined>({
    value: undefined,
    onValueChange: () => (this.errorMessage = ''),
    checkIsChanged: checkIsDateValueChanged,
  });

  errorMessage = '';

  validator?: DateValidatorType;

  constructor({
    fieldName,
    validator = undefined,
  }: {
    fieldName: HeroFieldsEnum;
    validator?: DateValidatorType;
  }) {
    this.fieldName = fieldName;
    this.validator = validator;

    makeAutoObservable(this);
  }

  get changed(): boolean {
    return this.day.changed || this.month.changed || this.year.changed;
  }

  get dateState(): DateStateEnum {
    const dayEmpty = !this.day.value;
    const monthEmpty = isNil(this.month.value);
    const yearEmpty = !this.year.value;

    switch (true) {
      case dayEmpty && monthEmpty && yearEmpty:
        return DateStateEnum.empty;
      case !dayEmpty && !monthEmpty && !yearEmpty:
        return DateStateEnum.full;
      case dayEmpty && !monthEmpty && !yearEmpty:
        return DateStateEnum.monthYear;
      case dayEmpty && monthEmpty && !yearEmpty:
        return DateStateEnum.year;
      default:
        return DateStateEnum.incomplete;
    }
  }

  get empty(): boolean {
    return this.dateState === DateStateEnum.empty;
  }

  get getPreviewStringDate(): string {
    if (this.dateState === DateStateEnum.empty || this.dateState === DateStateEnum.incomplete) {
      return '';
    }

    const day = isNil(this.day.value) ? null : addLeadingZero(Number(this.day.value?.name));
    const month = isNil(this.month.value) ? null : addLeadingZero(this.month.value.id + 1);
    const year = this.year.value?.name ?? '';

    switch (this.dateState) {
      case DateStateEnum.full:
        return [day, month, year].join('.');
      case DateStateEnum.monthYear:
        return [month, year].join('.');
      case DateStateEnum.year:
        return year;
    }
  }

  get getStringDate(): StringDateType {
    if (this.dateState === DateStateEnum.empty || this.dateState === DateStateEnum.incomplete) {
      return { date: null, format: null };
    }

    const day = isNil(this.day.value) ? null : addLeadingZero(Number(this.day.value?.name));
    const month = isNil(this.month.value) ? null : addLeadingZero(this.month.value.id + 1);
    const year = this.year.value?.name ?? null;

    switch (this.dateState) {
      case DateStateEnum.full:
        return { date: [year, month, day].join('-'), format: 'YYYY-MM-DD' };
      case DateStateEnum.monthYear:
        return { date: [year, month].join('-'), format: 'YYYY-MM' };
      case DateStateEnum.year:
        return { date: year, format: 'YYYY' } as StringDateType;
    }
  }

  get getSharingStringDate(): string {
    if (this.dateState === DateStateEnum.empty || this.dateState === DateStateEnum.incomplete) {
      return '';
    }

    const day = isNil(this.day.value) ? null : addLeadingZero(Number(this.day.value?.name));
    const month = isNil(this.month.value) ? null : addLeadingZero(this.month.value.id + 1);
    const year = this.year.value?.name ?? '';

    switch (this.dateState) {
      case DateStateEnum.full:
        return [day, month, year].join('.');
      case DateStateEnum.monthYear:
        return [month, year].join('-');
      case DateStateEnum.year:
        return year;
    }
  }

  get getHeroesCardDate(): string {
    if (this.dateState === DateStateEnum.empty || this.dateState === DateStateEnum.incomplete) {
      return '';
    }

    let monthName = this.month.value?.name.toLowerCase();

    if (this.dateState === DateStateEnum.full && this.month.value) {
      monthName = months[this.month.value.id].genitive;
    }

    return [this.day.value?.name, monthName, this.year.value?.name].join(' ').trim();
  }

  /**
   * Устанавливает год, месяц и день на основе переданной даты и точности.
   * С сервера дата всегда приходит в формате YYYY-MM-DD. Если дата пустая, в date передается пустая строка
   */
  setDate = ({ date, precision }: DateClient, isInitial?: boolean) => {
    if (!date) {
      return;
    }

    const [year, month, day] = date.split('-');
    const years = this.fieldName === HeroFieldsEnum.birthday ? birthYears : deathYears;

    this.year.setValue(
      years.find((y) => y.name === year),
      isInitial
    );

    if (precision !== PrecisionDateEnum.YEAR) {
      this.month.setValue(months[parseInt(month) - 1], isInitial);
    }

    if (precision === PrecisionDateEnum.DAY) {
      this.day.setValue(days[parseInt(day) - 1], isInitial);
    }
  };

  setErrorMessage = (errorMessage: string) => {
    this.errorMessage = errorMessage;
  };

  validate = (): boolean => {
    if (this.dateState === DateStateEnum.empty) {
      return true;
    }

    if (this.dateState === DateStateEnum.incomplete) {
      this.setErrorMessage(dateErrors.incompleteDate);

      return false;
    }

    const { date, format } = this.getStringDate;

    if (format && !getDate(date, format).isValid()) {
      this.setErrorMessage(dateErrors.wrongDate);

      return false;
    }

    const validatorMessage = this.validator && date && this.validator(date, format);

    if (validatorMessage) {
      this.setErrorMessage(validatorMessage);

      return false;
    }

    return true;
  };
}
