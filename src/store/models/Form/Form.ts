import { FieldModel } from '@ktsstudio/mediaproject-stores';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { makeAutoObservable } from 'mobx';

import { HeroFieldsEnum } from 'config/heroFields';
import { MilitaryBranchEnum } from 'config/militaryBranch';
import { StatusEnum } from 'config/statuses';
import {
  DeclineHeroReasonType,
  DeclineReasonTypeEnum,
  normalizeDeclineHeroReason,
} from 'entities/declineReason';
import {
  Hero,
  HeroCardPreview,
  HeroImageField,
  HeroPreviewServer,
  prepareDate,
} from 'entities/hero';
import { ImageFormField } from 'store/models/FormFieldModel/types';
import { validateEnoughSymbols } from 'utils/validators/common';
import {
  dateErrors,
  validateBirthday,
  validateBirthdayBeforeDeathDate,
  validateDeathDate,
} from 'utils/validators/date';

import { DateModel } from '../DateModel';
import FormFieldModel from '../FormFieldModel';
import { MilitaryUnitType } from '../FormList';

dayjs.extend(utc);

export class Form {
  readonly id: string;

  /** имя */
  firstName = new FormFieldModel<string, { name: HeroFieldsEnum }>({
    value: '',
    isRequired: true,
    validator: validateEnoughSymbols(),
    rest: {
      name: HeroFieldsEnum.firstName,
    },
  });

  /** фамилия */
  lastName = new FormFieldModel<string, { name: HeroFieldsEnum }>({
    value: '',
    isRequired: true,
    validator: validateEnoughSymbols(),
    rest: {
      name: HeroFieldsEnum.lastName,
    },
  });

  /** отчество */
  middleName = new FormFieldModel<string, { name: HeroFieldsEnum }>({
    value: '',
    validator: validateEnoughSymbols(undefined, true),
    rest: {
      name: HeroFieldsEnum.middleName,
    },
  });

  /** дата рождения */
  birthday = new DateModel({
    fieldName: HeroFieldsEnum.birthday,
    // @ts-ignore
    validator: validateBirthday,
  });

  /** дата смерти */
  deathDate = new DateModel({
    fieldName: HeroFieldsEnum.deathDate,
    // @ts-ignore
    validator: validateDeathDate,
  });

  /** жив? */
  alive = new FormFieldModel({
    value: false,
  });

  /** фото героя */
  photo: ImageFormField = new FormFieldModel<string, { id?: string }>({
    value: '',
  });

  /** фронт */
  militaryBranch = new FormFieldModel<MilitaryBranchEnum | undefined>({
    value: undefined,
  });

  /** воинская часть */
  militaryUnit = new FormFieldModel<MilitaryUnitType | undefined>({
    value: undefined,
    checkIsChanged: (curr, prev) => {
      if (curr?.value === prev?.value) {
        return false;
      }

      return true;
    },
  });

  /** статус анкеты героя */
  status: StatusEnum = StatusEnum.UNDER_REVIEW;

  /** список проблем с анкетой героя */
  private readonly _problems = new FieldModel<DeclineHeroReasonType[]>([]);

  /**
   * Для отправки на бэк.
   * Установка null в nullable-поле позволит очистить его, undefined поля игнорятся
   * */
  get sendData(): HeroPreviewServer {
    return {
      firstName: this.firstName.value.trim(),
      lastName: this.lastName.value.trim(),
      middleName: this.middleName.value ? this.middleName.value.trim() : null,
      birth: prepareDate(this.birthday),
      death: this.alive.value ? null : prepareDate(this.deathDate),
      isAlive: this.alive.value,
      fileId: this.photo.rest?.id || null,
      militaryBranch: this.militaryBranch.value ?? null,
      militaryDivision: this.militaryUnit.value?.value ? this.militaryUnit.value?.value : null,
      militaryDivisionId: Number(this.militaryUnit.value?.id)
        ? Number(this.militaryUnit.value?.id)
        : undefined,
    };
  }

  get imageFieldData(): HeroImageField {
    return {
      id: this.id,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      middleName: this.middleName.value,
      photoField: this.photo,
      alive: this.alive.value,
      birthday: this.birthday.getPreviewStringDate,
      deathDate: this.deathDate.getPreviewStringDate,
      militaryBranch: this.militaryBranch.value,
      resetErrorMessage: this.resetHeroPhotosMessages,
    };
  }

  get cardPreview(): HeroCardPreview {
    return {
      id: this.id,
      fullName: this.fullName,
      photo: this.photo.value,
      militaryBranch: this.militaryBranch.value,
      militaryUnit: this.militaryUnit.value?.value,
      birthday: this.birthday.getHeroesCardDate,
      deathDate: this.deathDate.getHeroesCardDate,
      alive: this.alive.value,
      status: this.status,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      middleName: this.middleName.value,
    };
  }

  get fullName() {
    return `${this.lastName.value} ${this.firstName.value} ${this.middleName?.value ?? ''}`;
  }

  /** показывать кнопку сохранить при добавлении новой анкеты, если обязательные поля заполнены */
  get showAddButton(): boolean {
    return Boolean(this.firstName.value) && Boolean(this.lastName.value);
  }

  /** показывать кнопку сохранить при редактировании анкеты, если обязательные поля заполнены */
  get showSaveEditsButton(): boolean {
    return this.showAddButton && this.formChanged;
  }

  get empty(): boolean {
    return (
      !this.firstName.value &&
      !this.lastName.value &&
      !this.middleName.value &&
      this.birthday.empty &&
      this.deathDate.empty &&
      !this.alive.value &&
      !this.photo.value &&
      !this.militaryBranch.value &&
      !this.militaryUnit.value
    );
  }

  get formChanged(): boolean {
    return (
      this.firstName.changed ||
      this.lastName.changed ||
      this.middleName.changed ||
      this.birthday.changed ||
      this.deathDate.changed ||
      this.alive.changed ||
      this.photo.changed ||
      this.militaryBranch.changed ||
      this.militaryUnit.changed
    );
  }

  get problems(): DeclineHeroReasonType[] {
    const notVisibleProblems = this._problems.value.filter((p) => !p.visible);

    // Если все причины отклонения не видимы, оставляем только первую, чтобы отобразить общее описание
    if (this._problems.value.length && notVisibleProblems.length === this._problems.value.length) {
      return [this._problems.value[0]];
    }

    return this._problems.value.filter((p) => p.visible);
  }

  constructor(id: string) {
    this.id = id;

    makeAutoObservable(this, {
      id: false,
    });
  }

  setStatus = (status: StatusEnum): void => {
    this.status = status;
  };

  setProblems = (problems: DeclineReasonTypeEnum[]): void => {
    this._problems.changeValue(problems.map(normalizeDeclineHeroReason));
  };

  validateFields = (
    fields: FormFieldModel<string, any>[],
    errorFieldName: HeroFieldsEnum | null,
    isCorrect: boolean
  ): [HeroFieldsEnum | null, boolean] => {
    return fields.reduce(
      (previous, current) => {
        const valid = current.validate();

        return valid ? previous : [previous[0] || current.rest?.name, previous[1] && valid];
      },
      [errorFieldName, isCorrect]
    );
  };

  validateForm = (): { isCorrect: boolean; errorField: HeroFieldsEnum | null } => {
    let errorFieldName: HeroFieldsEnum | null = null;
    let isCorrect = true;

    [errorFieldName, isCorrect] = this.validateFields(
      [this.lastName, this.firstName, this.middleName],
      errorFieldName,
      isCorrect
    );

    let isCorrectBirthday = true;

    if (!this.birthday.validate()) {
      if (!errorFieldName) {
        errorFieldName = this.birthday.fieldName;
      }

      isCorrectBirthday = false;
      isCorrect = false;
    }

    let isCorrectDeathDate = true;

    if (!this.deathDate.empty && !this.alive.value) {
      isCorrectDeathDate = this.deathDate.validate();

      if (!errorFieldName && !isCorrectDeathDate) {
        errorFieldName = this.deathDate.fieldName;
      }

      isCorrect = isCorrectDeathDate && isCorrect;
    }

    let isCorrectBirthdayBeforeDeathday = true;

    if (
      isCorrectBirthday &&
      isCorrectDeathDate &&
      !this.birthday.empty &&
      !this.deathDate.empty &&
      !this.alive.value
    ) {
      const errorMessage = validateBirthdayBeforeDeathDate(
        this.birthday.getStringDate,
        this.deathDate.getStringDate
      );

      if (errorMessage) {
        isCorrectBirthdayBeforeDeathday = false;
        this.birthday.setErrorMessage(errorMessage);

        if (!errorFieldName) {
          errorFieldName = this.birthday.fieldName;
        }
      } else if (this.birthday.errorMessage === dateErrors.birthdayAfterDeathDate) {
        this.birthday.setErrorMessage('');
      }
    }

    isCorrect = isCorrect && isCorrectBirthdayBeforeDeathday;

    return {
      isCorrect,
      errorField: errorFieldName,
    };
  };

  init = ({
    firstName,
    lastName,
    middleName,
    photo,
    fileId,
    birth,
    death,
    isAlive,
    status,
    declineHeroReasons,
    militaryBranch,
    militaryUnit,
    militaryUnitId,
  }: Hero): void => {
    this.firstName.setValue(firstName, true);
    this.lastName.setValue(lastName, true);
    this.middleName.setValue(middleName, true);
    this.alive.setValue(isAlive, true);
    this.birthday.setDate(birth, true);
    this.deathDate.setDate(death, true);
    this.militaryBranch.setValue(militaryBranch, true);
    this.militaryUnit.setValue(
      militaryUnit
        ? {
            id: militaryUnitId ?? '0',
            value: militaryUnit,
          }
        : { id: '00', value: '' },
      true
    );

    this.photo.setValue(photo, true, { id: fileId });

    this.setStatus(status);

    this._problems.changeValue(declineHeroReasons);
  };

  resetHeroPhotosMessages = (): void => {
    this.photo.setErrorMessage('');
  };
}
