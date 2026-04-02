import dayjs, { extend } from 'dayjs';
import customParser from 'dayjs/plugin/customParseFormat';

import { DefaultSelectorValueType } from 'components/inputs/Selector/types';
import { PrecisionDateEnum } from 'config/precisionDate';
import { DateStateEnum } from 'store/models/DateModel';

extend(customParser);

// - Проверка даты рождения на диапазон 1850-01-01 — 2007-12-31
// - Проверка даты смерти на диапазон 1941-06-22 — текущая

export const getDate = (date: dayjs.ConfigType, format = 'YYYY-MM-DD'): dayjs.Dayjs =>
  dayjs(date, format, true);

export const addLeadingZero = (num: number): string => `${num < 10 ? '0' : ''}${num}`;

export const isLeapYear = (year: number): boolean =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

export const monthHas30Days = (month: number): boolean =>
  month === 4 || month === 6 || month === 9 || month === 11;

const startBirthdayDate = getDate('1850-01-01');
const endBirthdayDate = getDate('2008-01-01'); // todo END_YEAR getDate('1946-01-01')

const specialDeathDates = ['1941-06', '1941'];
const startDeathDate = getDate('1941-06-22');
const endDeathDate = dayjs(new Date());

export const dateErrors = {
  incompleteDate: 'Неполная дата',
  wrongDate: 'Некорректная дата',
  wrongBirthday: 'Введите дату между 01.01.1850 и 31.12.2007', // todo END_YEAR текущей
  wrongDeathDate: 'Введите дату между 22.06.1941 и текущей',
  birthdayAfterDeathDate: 'Дата рождения должна быть раньше даты смерти',
};

export type DateValidatorType = (dateString: string, format: string) => string;

export type StringDateType =
  | {
      date: null;
      format: null;
    }
  | {
      date: string;
      format: string;
    };

export const validateBirthday = (dateString: string, format: string): string | null => {
  const date = getDate(dateString, format);

  if (!date.isBefore(endBirthdayDate) || date.isBefore(startBirthdayDate)) {
    return dateErrors.wrongBirthday;
  }

  return null;
};

export const validateDeathDate = (dateString: string, format: string): string | null => {
  const date = getDate(dateString, format);

  if (
    (!date.isBefore(endDeathDate) || date.isBefore(startDeathDate)) &&
    !specialDeathDates.includes(dateString)
  ) {
    return dateErrors.wrongDeathDate;
  }

  return null;
};

export const validateBirthdayBeforeDeathDate = (
  birthdayString: StringDateType,
  deathDateString: StringDateType
): string | null => {
  const birthday = getDate(birthdayString.date, birthdayString.format ?? undefined);
  const deathDate = getDate(deathDateString.date, deathDateString.format ?? undefined);

  if (!birthday.isBefore(deathDate, 'day')) {
    return dateErrors.birthdayAfterDeathDate;
  }

  return null;
};

export const checkIsDateValueChanged = (
  value: DefaultSelectorValueType | undefined,
  initialValue: DefaultSelectorValueType | undefined
) => {
  return value?.name !== initialValue?.name;
};

export const getDatePrecisionByState = (dateState: DateStateEnum): PrecisionDateEnum => {
  switch (dateState) {
    case DateStateEnum.year:
      return PrecisionDateEnum.YEAR;
    case DateStateEnum.monthYear:
      return PrecisionDateEnum.MONTH;
    default:
      return PrecisionDateEnum.DAY;
  }
};
