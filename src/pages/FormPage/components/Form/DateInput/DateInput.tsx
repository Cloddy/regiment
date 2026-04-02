import { Nullable } from '@kts-front/types';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Element } from 'react-scroll';

import { Selector } from 'components/inputs';
import { DefaultSelectorValueType } from 'components/inputs/Selector/types';
import { birthYears, deathYears } from 'config/dates';
import { HeroFieldsEnum } from 'config/heroFields';
import { DateModel } from 'store/models/DateModel';

import { useDateSelectors } from './useDateSelectors';

import './DateInput.modules.scss';

interface Props {
  data: DateModel;
  disabled?: boolean;
  className?: string;
}

const DateInput: React.FC<Props> = ({ data, disabled, className }: Props) => {
  const { day, month, year, errorMessage, fieldName } = data;

  const { contentVisible, daysArray, monthsArray, onSelectorOpen } = useDateSelectors({
    day: day.value,
    month: month.value,
    year: year.value,
    setDay: day.setValue,
    setMonth: month.setValue,
    type: fieldName as HeroFieldsEnum.birthday | HeroFieldsEnum.deathDate,
  });

  const isError = !disabled && Boolean(errorMessage);

  return (
    <Element name={fieldName} styleName="date-input-wrapper" className={className}>
      <Selector
        contentVisible={contentVisible.day}
        setContentVisible={onSelectorOpen('day')}
        currentValue={day.value ?? null}
        setValue={day.setValue as (value: Nullable<DefaultSelectorValueType>) => void}
        values={daysArray}
        label="День"
        placeholder="Выберите день"
        isError={isError}
        isDisabled={disabled}
        withEmptyValue
      />
      <Selector
        contentVisible={contentVisible.month}
        setContentVisible={onSelectorOpen('month')}
        currentValue={month.value ?? null}
        setValue={month.setValue as (value: Nullable<DefaultSelectorValueType>) => void}
        values={monthsArray}
        label="Месяц"
        placeholder="Выберите месяц"
        isError={isError}
        isDisabled={disabled}
        withEmptyValue
      />
      <Selector
        contentVisible={contentVisible.year}
        setContentVisible={onSelectorOpen('year')}
        currentValue={year.value ?? null}
        setValue={year.setValue as (value: Nullable<DefaultSelectorValueType>) => void}
        values={data.fieldName === HeroFieldsEnum.birthday ? birthYears : deathYears}
        label="Год"
        placeholder="Выберите год"
        isError={isError}
        isDisabled={disabled}
        withEmptyValue
      />
      {isError && <div styleName="error">{errorMessage}</div>}
    </Element>
  );
};

DateInput.defaultProps = {
  disabled: false,
  className: '',
};

export default observer(DateInput);
