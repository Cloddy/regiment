import { observer } from 'mobx-react';
import * as React from 'react';
import { Element } from 'react-scroll';

import { CheckboxWithLabel } from 'components/common';
import { ImagesInput, Input } from 'components/inputs';
import { MAX_LENGTHS } from 'config/info';
import { StatusEnum } from 'config/statuses';
import { Form as FormModel } from 'store/models/Form';
import { validateFirstName, validateLastName, validateMiddleName } from 'utils/strings/remove';

import DateInput from './DateInput';
import FormBlock from './FormBlock';
import { MilitaryBranchSelector } from './MilitaryBranchSelector';
import { MilitaryUnitSearch } from './MilitaryUnitSearch';

import './Form.modules.scss';

type Props = {
  data: FormModel | null;
  isEdit: boolean;
  errorMessage?: React.ReactNode;
  footer?: React.ReactNode;
};

const Form: React.FC<Props> = ({ data, isEdit, errorMessage = '', footer }: Props) => {
  if (!data) {
    return null;
  }

  const canEditHero = !isEdit || data?.status !== StatusEnum.UNDER_REVIEW;

  return (
    <div styleName="container">
      <FormBlock
        title="Как зовут вашего героя?"
        description={<>Для участия в&nbsp;шествии обязательны фамилия и&nbsp;имя</>}
      >
        <Element name={data.lastName.rest?.name ?? ''}>
          <Input
            {...data.lastName.bind}
            placeholder="Введите фамилию"
            maxLength={MAX_LENGTHS.lastName}
            preprocessingFunc={validateLastName}
            canReset
            withBottomMargin
            isDisabled={!canEditHero}
            label="Фамилия"
            isRequired
          />
        </Element>
        <Element name={data.firstName.rest?.name ?? ''}>
          <Input
            {...data.firstName.bind}
            placeholder="Введите имя"
            maxLength={MAX_LENGTHS.firstName}
            preprocessingFunc={validateFirstName}
            canReset
            withBottomMargin
            isDisabled={!canEditHero}
            isRequired
            label="Имя"
          />
        </Element>
        <Element name={data.middleName.rest?.name ?? ''}>
          <Input
            {...data.middleName.bind}
            placeholder="Введите отчество"
            maxLength={MAX_LENGTHS.middleName}
            preprocessingFunc={validateMiddleName}
            canReset
            isDisabled={!canEditHero}
            label="Отчество"
          />
        </Element>
      </FormBlock>
      <FormBlock
        title="Дата рождения"
        description={
          <>
            {/* todo end year */}
            Укажите данные, которые вам известны, остальные поля вы&nbsp;можете оставить пустыми.
            Дата рождения должна быть между 1850 и&nbsp;2007 годами
          </>
        }
      >
        <DateInput data={data.birthday} disabled={!canEditHero} />
      </FormBlock>
      <FormBlock
        title="Дата смерти"
        description={
          <>Укажите данные, которые вам известны, остальные поля вы&nbsp;можете оставить пустыми</>
        }
      >
        <DateInput
          data={data.deathDate}
          disabled={data.alive.value || !canEditHero}
          styleName="death-date-block"
        />
        <CheckboxWithLabel
          checked={data.alive.value}
          onCheck={(value) => data.alive.setValue(value)}
          isDisabled={!canEditHero}
        >
          Жив по&nbsp;настоящее время
        </CheckboxWithLabel>
      </FormBlock>
      <FormBlock
        title="Боевой путь"
        description={
          <>
            Если вы&nbsp;не&nbsp;знаете в&nbsp;каких войсках служил ваш герой&nbsp;&mdash; оставьте
            это поле пустым
          </>
        }
      >
        <div styleName="military-block">
          <MilitaryBranchSelector data={data.militaryBranch} disabled={!canEditHero} />
          <MilitaryUnitSearch data={data.militaryUnit} disabled={!canEditHero} />
        </div>
      </FormBlock>
      <FormBlock
        title="Фото героя"
        description={<>Если у&nbsp;вас нет фото героя&nbsp;&mdash; оставьте это поле пустым</>}
      >
        <ImagesInput key={data.id} isDisabled={!canEditHero} {...data.imageFieldData} />
      </FormBlock>
      <div styleName="responsibility-block">
        <div styleName="responsibility-block__title">Уведомление об&nbsp;ответственности</div>
        <div styleName="responsibility-block__text">
          Лица, размещающие сведения, в&nbsp;том числе в&nbsp;сети &laquo;Интернет&raquo;,
          в&nbsp;которых отрицаются преступления нацизма, установленные приговором Нюрнбергского
          трибунала, содержатся оскорбления памяти защитников Отечества, унижение чести
          и&nbsp;достоинства ветеранов Великой Отечественной войны, могут быть признаны виновными
          в&nbsp;совершении преступлений, предусмотренных ч.1, ч.2 и&nbsp;ч.3 ст.354.1
          УК&nbsp;РФ&nbsp;и&nbsp;привлечены к&nbsp;уголовной и&nbsp;административной ответственности
        </div>
      </div>
      {errorMessage && <div styleName="error">{errorMessage}</div>}
      {footer}
    </div>
  );
};

export default observer(Form);
