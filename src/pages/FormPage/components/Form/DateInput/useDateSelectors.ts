import * as React from 'react';

import { DefaultSelectorValueType } from 'components/inputs/Selector/types';
import { days, DEATH_START_YEAR, DEFAULT_SELECTOR_VISIBLE, months } from 'config/dates';
import { HeroFieldsEnum } from 'config/heroFields';
import { isLeapYear, monthHas30Days } from 'utils/validators/date';

const JUNE_MONTH_ID = 5;

export const useDateSelectors = ({
  day,
  month,
  year,
  setDay,
  setMonth,
  type,
}: {
  day?: DefaultSelectorValueType;
  month?: DefaultSelectorValueType;
  year?: DefaultSelectorValueType;
  setDay: (value: DefaultSelectorValueType) => void;
  setMonth: (value: DefaultSelectorValueType) => void;
  type: HeroFieldsEnum.birthday | HeroFieldsEnum.deathDate;
}) => {
  const [contentVisible, setContentVisible] = React.useState(DEFAULT_SELECTOR_VISIBLE);
  const [daysArray, setDaysArray] = React.useState<DefaultSelectorValueType[]>(days);
  const [monthsArray, setMonthsArray] = React.useState<DefaultSelectorValueType[]>(months);

  // Обновляет массив дней в зависимости от года и месяца
  const updateDaysArray = React.useCallback(() => {
    const isLeap = year?.name ? isLeapYear(Number(year.name)) : false;
    const has30Days = month?.id ? monthHas30Days(month.id + 1) : false;

    let daysInMonth = has30Days ? 30 : 31;

    // Определяем количество дней в феврале
    if (month?.id === 1) {
      daysInMonth = isLeap ? 29 : 28;
    }

    const newDayArrays = days.slice(0, daysInMonth);

    let lastAvailableDay = newDayArrays.length;

    const today = new Date();

    // Для текущего года не показываем будущие месяцы
    if (year?.name && year?.name === today.getFullYear().toString()) {
      setMonthsArray((m) => m.slice(0, today.getMonth() + 1));

      // Если был выбран месяц в будущем, сбрасываем до последнего возможного
      if (month?.id !== undefined && month.id > today.getMonth()) {
        setMonth(months[today.getMonth()]);
      }

      // Для текущего месяца не показываем будущие дни
      if (month?.id !== undefined && month.id === today.getMonth()) {
        setDaysArray((d) => d.slice(0, today.getDate()));
        lastAvailableDay = today.getDate();
      }

      // Для даты смерти начальная дата – 22 июня 1941 года
    } else if (type === HeroFieldsEnum.deathDate && year?.name === String(DEATH_START_YEAR)) {
      setMonthsArray(months.slice(JUNE_MONTH_ID));

      // Если выбран месяц до июня, сбрасываем на июнь
      if (month?.id !== undefined && month.id < JUNE_MONTH_ID) {
        setMonth(months[JUNE_MONTH_ID]);
      }

      // Если выбран июнь, то показываем дни с 22
      if (month?.id !== undefined && month.id === JUNE_MONTH_ID) {
        setDaysArray(days.slice(21));
        lastAvailableDay = 22;

        // Если текущий день меньше 22, то задаем первый доступный день месяца
        if (day?.name && Number(day.name) < lastAvailableDay) {
          setDay(days[lastAvailableDay - 1]);
        }
      } else {
        setDaysArray(newDayArrays);
      }
    } else {
      setMonthsArray(months);
      setDaysArray(newDayArrays);
    }

    // Если текущий день больше доступного количества дней в месяце, то задаем последний доступный день месяца
    if (day?.name && Number(day.name) > lastAvailableDay) {
      setDay(days[lastAvailableDay - 1]);
    }
  }, [day, month, year, setDay, setMonth, type]);

  const onSelectorOpen = React.useCallback(
    (value: keyof typeof DEFAULT_SELECTOR_VISIBLE) => () => {
      setContentVisible((prev) => ({
        ...DEFAULT_SELECTOR_VISIBLE,
        [value]: !prev[value],
      }));
    },
    []
  );

  React.useEffect(() => {
    updateDaysArray();
  }, [day, month, year]);

  return { contentVisible, daysArray, monthsArray, onSelectorOpen };
};
