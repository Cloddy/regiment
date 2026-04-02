/* eslint-disable array-bracket-newline */
import { debounce } from '@vkontakte/vkjs';
import { CustomSelect, FormItem } from '@vkontakte/vkui';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Arrow from 'assets/img/form/arrow.svg?react';
import { SelectorItem } from 'components/inputs';
import { useFormPageStore } from 'store/locals/FormPageStore';
import FormFieldModel from 'store/models/FormFieldModel';
import { MilitaryUnitType } from 'store/models/FormList';

import s from './MilitaryUnitSearch.module.scss';

type Props = {
  data: FormFieldModel<MilitaryUnitType | undefined>;
  disabled?: boolean;
};

const MilitaryUnitSearch: React.FC<Props> = ({ data, disabled }) => {
  const {
    militaryUnitsOptions,
    formList: { fetchMilitaryUnits, loadingMilitaryUnits },
  } = useFormPageStore();

  const [searchValue, setSearchValue] = React.useState<string>(data.value?.value ?? '');

  const debouncedFetchMilitaryUnits = React.useCallback(debounce(fetchMilitaryUnits, 500), [
    fetchMilitaryUnits,
  ]);

  const chooseOption = React.useCallback(
    (value: MilitaryUnitType) => () => {
      data.setValue(value || undefined);
      setSearchValue(value.value);
    },
    [data.value]
  );

  const clearTempValue = React.useCallback(async () => {
    const oldValue = data.value?.value ?? '';

    if (oldValue !== searchValue) {
      setSearchValue(oldValue);
      await fetchMilitaryUnits(oldValue);
    }
  }, [data.value?.value, searchValue]);

  const fetchOnOpen = React.useCallback(async () => {
    if (searchValue) {
      await fetchMilitaryUnits(searchValue);
    }
  }, [searchValue]);

  const searchUnits = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await debouncedFetchMilitaryUnits(e.target.value);
    },
    [debouncedFetchMilitaryUnits]
  );

  const renderDropdown = React.useCallback(() => {
    const isEdit = militaryUnitsOptions.length === 1 && militaryUnitsOptions[0].label === '';

    return (
      <div className={s.list}>
        {(isEdit || militaryUnitsOptions.length === 0) && (
          <div className={s.empty}>Ничего не&nbsp;найдено</div>
        )}
        {((isEdit && militaryUnitsOptions.length > 1) ||
          (!isEdit && militaryUnitsOptions.length > 0)) && (
          <SelectorItem
            key="emptyValue"
            name="Выберите из списка"
            empty
            onClick={chooseOption({
              id: '00',
              value: '',
            })}
          />
        )}
        {militaryUnitsOptions.map((unit) => (
          <SelectorItem
            key={`${unit.value}-${unit.label}`}
            name={unit.label}
            selected={unit.value === searchValue}
            onClick={chooseOption({
              id: unit.value,
              value: unit.label,
            })}
          />
        ))}
      </div>
    );
  }, [militaryUnitsOptions, searchValue, chooseOption]);

  return (
    <FormItem className={s['form-item']} top="Воинская часть" htmlFor="custom-search-military-unit">
      <CustomSelect
        className={clsx(s['custom-select'], disabled && s.disabled)}
        id="custom-search-military-unit"
        placeholder="Выберите из списка"
        searchable
        options={militaryUnitsOptions}
        value={data.value?.id}
        defaultValue={data.value?.id}
        disabled={loadingMilitaryUnits || disabled}
        fetching={loadingMilitaryUnits}
        icon={<Arrow className={s.icon} />}
        popupDirection="bottom"
        onInputChange={searchUnits}
        onOpen={fetchOnOpen}
        renderDropdown={renderDropdown}
        onBlur={clearTempValue}
      />
    </FormItem>
  );
};

export default observer(MilitaryUnitSearch);
