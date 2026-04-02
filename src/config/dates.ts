import { DefaultSelectorValueType } from 'components/inputs/Selector/types';

const BIRTH_START_YEAR = 1850;

export const DEATH_START_YEAR = 1941;

// todo END_YEAR
const END_YEAR = 2007; // 1945

export const months: (DefaultSelectorValueType & { genitive: string })[] = [
  { id: 0, name: 'Январь', genitive: 'января' },
  { id: 1, name: 'Февраль', genitive: 'февраля' },
  { id: 2, name: 'Март', genitive: 'марта' },
  { id: 3, name: 'Апрель', genitive: 'апреля' },
  { id: 4, name: 'Май', genitive: 'мая' },
  { id: 5, name: 'Июнь', genitive: 'июня' },
  { id: 6, name: 'Июль', genitive: 'июля' },
  { id: 7, name: 'Август', genitive: 'августа' },
  { id: 8, name: 'Сентябрь', genitive: 'сентября' },
  { id: 9, name: 'Октябрь', genitive: 'октября' },
  { id: 10, name: 'Ноябрь', genitive: 'ноября' },
  { id: 11, name: 'Декабрь', genitive: 'декабря' },
];

export const days: DefaultSelectorValueType[] = Array.from({ length: 31 }, (_, i) => ({
  id: i,
  name: (i + 1).toString(),
}));

export const birthYears: DefaultSelectorValueType[] = Array.from(
  { length: END_YEAR - BIRTH_START_YEAR + 1 },
  (_, i) => ({
    id: i,
    name: (BIRTH_START_YEAR + i).toString(),
  })
);

export const deathYears: DefaultSelectorValueType[] = Array.from(
  { length: new Date().getFullYear() - DEATH_START_YEAR + 1 },
  (_, i) => ({
    id: i,
    name: (DEATH_START_YEAR + i).toString(),
  })
);

export const DEFAULT_SELECTOR_VISIBLE = {
  day: false,
  month: false,
  year: false,
};
