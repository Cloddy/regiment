import { PrecisionDateEnum } from 'config/precisionDate';
import { normalizeDeclineHeroReason } from 'entities/declineReason';
import { DateModel, DateStateEnum } from 'store/models/DateModel';
import { Form } from 'store/models/Form';
import normalize from 'utils/normalize';
import { getDatePrecisionByState } from 'utils/validators/date';

import { Hero, HeroPreview } from './client';
import { DateServer, HeroPreviewServer, HeroServer } from './server';

export const normalizeHeroPreview = (data: HeroPreviewServer): HeroPreview => {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    middleName: data.middleName ?? '',
    fileId: data.fileId ?? '',
    birth: data.birth ?? {
      date: '',
      precision: PrecisionDateEnum.DAY,
    },
    death: data.death ?? {
      date: '',
      precision: PrecisionDateEnum.DAY,
    },
    isAlive: data.isAlive ?? false,
    militaryBranch: data.militaryBranch ?? undefined,
    militaryUnit: data.militaryDivision ?? undefined,
  };
};

/** нормализация анкеты героя */
export const normalizeHero = (data: HeroServer): Hero => {
  return {
    ...normalizeHeroPreview(data),
    status: data.status,
    declineHeroReasons: data.rejectionReasons?.map(normalizeDeclineHeroReason),
    id: data.id,
    photo: data.photo ?? '',
  };
};

/** нормализация анкет */
export const normalizeHeroList = (data: HeroServer[]): Hero[] => {
  return data.map(normalizeHero);
};

/** создание модели формы из данных по анкете */
export const createHero = (hero: HeroServer): Form => {
  const form = new Form(hero.id);

  form.init(normalizeHero(hero));

  return form;
};

/** нормализация анкет с моделью формы */
export const normalizeHeroesList = (
  data: HeroServer[]
): { heroesIDs: string[]; heroesEntities: Record<string, Form> } => {
  const [heroesEntities, heroesIDs] = normalize<HeroServer, 'id', Form>({
    array: data,
    parser: createHero,
    key: 'id',
  });

  return {
    heroesEntities,
    heroesIDs,
  };
};

/**
 * Подготовка даты для отправки на сервер при сохранении или редактировании анкеты.
 * Формат date - YYYY-MM-DD.
 * Примеры:
 * - если birth.precision === "DAY", то нужно указать YYYY-MM-DD ("1943-05-28")
 * - если birth.precision === "MOTNH", то нужно передать первый день ("1943-05-01")
 * - если birth.precision === "YEAR", то нужно передать первый день и первый месяц ("1944-01-01")
 * @return DateServer - если дата изменилась
 * @return undefined - если дата не изменилась
 * @return null - если дату убрали
 */
export const prepareDate = (date: DateModel): DateServer | null | undefined => {
  if (date.empty) {
    return null;
  }

  if (!date.changed) {
    return undefined;
  }

  let dateString = date.getStringDate.date ?? '';

  if (date.dateState === DateStateEnum.year) {
    dateString = [date.getStringDate.date, '01', '01'].join('-');
  }

  if (date.dateState === DateStateEnum.monthYear) {
    dateString = [date.getStringDate.date, '01'].join('-');
  }

  return {
    date: dateString,
    precision: getDatePrecisionByState(date.dateState),
  };
};
