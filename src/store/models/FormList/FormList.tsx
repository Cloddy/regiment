import { FieldModel } from '@ktsstudio/mediaproject-stores';
import * as Sentry from '@sentry/react';
import imageCompression from 'browser-image-compression';
import { makeAutoObservable } from 'mobx';
import * as React from 'react';

import { ENDPOINTS } from 'config/api';
import { ErrorEnum, errorMessages, imageErrors } from 'config/errors';
import { HeroFieldsEnum } from 'config/heroFields';
import { MAX_ACCOUNTS, MAX_FILE_SIZE, OPTIMIZE_OPTIONS } from 'config/info';
import { StatusEnum } from 'config/statuses';
import { createHero } from 'entities/hero';
import { HeroesStore } from 'store/globals/heroes';
import { RootStoreType } from 'store/globals/root';
import { Form } from 'store/models/Form';
import { ImageFormField } from 'store/models/FormFieldModel/types';
import generateId from 'utils/generateId';
import { dataUrlToFile } from 'utils/toBase64';

import { ApiRequest } from '../ApiRequest';

import { defaultBuffImage, defaultForm } from './config';
import {
  HeroResponse,
  DeleteHeroResponse,
  ScrollCallbackType,
  UploadImageResponse,
  MilitaryUnitType,
} from './types';

/** класс для списка анкет героев в виде формы */
export class FormList {
  private readonly _rootStore: RootStoreType;

  private readonly _isLoading = new FieldModel<boolean>(false); // при отправке формы

  readonly buffForm = new FieldModel<Form | null>(null); // для добавления

  private readonly _isSend = new FieldModel<boolean>(false); // отправлены анкеты

  private readonly _errorMessage = new FieldModel<React.ReactNode>(
    errorMessages[ErrorEnum.noError]
  );

  private readonly _errorField = new FieldModel<HeroFieldsEnum | null>(null);

  // фотография перед редактированием анкеты
  private readonly _buffImage = new FieldModel<UploadImageResponse>(defaultBuffImage);

  // список воинских частей
  private readonly _militaryUnits = new FieldModel<MilitaryUnitType[]>([]);

  private readonly _requests: {
    uploadPhotoHero: ApiRequest<UploadImageResponse>;
    createHero: ApiRequest<HeroResponse>;
    updateHero: ApiRequest<HeroResponse>;
    deleteHero: ApiRequest<DeleteHeroResponse>;
    getHero: ApiRequest<HeroResponse>;
    getMilitaryUnits: ApiRequest<{ data: MilitaryUnitType[] }>;
  };

  get errorMessage(): React.ReactNode {
    return this._errorMessage.value;
  }

  get canAddForm(): boolean {
    return this._rootStore.heroesStore.formsCount < MAX_ACCOUNTS;
  }

  get isSending(): boolean {
    return (
      this._isLoading.value ||
      this._requests.createHero.isLoading ||
      this._requests.updateHero.isLoading
    );
  }

  get isDeleting(): boolean {
    return this._requests.deleteHero.isLoading;
  }

  get isHeroLoading(): boolean {
    return this._requests.getHero.isLoading;
  }

  private get _heroesStore(): HeroesStore {
    return this._rootStore.heroesStore;
  }

  constructor(rootStore: RootStoreType) {
    this._rootStore = rootStore;

    this._requests = {
      uploadPhotoHero: this._rootStore.apiStore.createRequest(ENDPOINTS.uploadPhotoHero),
      createHero: this._rootStore.apiStore.createRequest(ENDPOINTS.createHero),
      updateHero: this._rootStore.apiStore.createRequest(ENDPOINTS.updateHero),
      deleteHero: this._rootStore.apiStore.createRequest(ENDPOINTS.deleteHero),
      getHero: this._rootStore.apiStore.createRequest(ENDPOINTS.getHero),
      getMilitaryUnits: this._rootStore.apiStore.createRequest(ENDPOINTS.getMilitaryUnits),
    };

    makeAutoObservable(this);
  }

  get loadingMilitaryUnits(): boolean {
    return this._requests.getMilitaryUnits.isLoading;
  }

  get militaryUnits(): MilitaryUnitType[] {
    return this._militaryUnits.value;
  }

  setError = (value: ErrorEnum | string = ErrorEnum.noError): void => {
    let msg: React.ReactNode = value;

    if (Object.values(ErrorEnum).includes(value as ErrorEnum)) {
      msg = errorMessages[value as ErrorEnum];
    }

    this._errorMessage.changeValue(msg);
  };

  resetBuffForm = (): Form => this.buffForm.changeValue(new Form(generateId()));

  /** загрузка одной анкеты */
  loadHero = async (heroId: string): Promise<boolean> => {
    if (this.isHeroLoading) {
      return false;
    }

    const { data, isError } = await this._requests.getHero.fetch({
      url: [ENDPOINTS.getHero.url, heroId].join('/'),
    });

    if (isError) {
      this.setError(data?.data?.error?.message ?? ErrorEnum.commonError);
    } else if (data) {
      // todo: убрать после тестирования анкет
      if (this._rootStore.appParamsStore.userInWhitelist) {
        const form = this._heroesStore.getFormById(heroId);

        this._heroesStore.addForm(
          createHero({
            ...data.hero,
            rejectionReasons: form?.problems.map((p) => p.id) ?? data.hero.rejectionReasons,
            status: form?.status ?? data.hero.status,
          })
        );
      } else {
        this._heroesStore.addForm(createHero(data.hero));
      }
    }

    return !isError;
  };

  /** удаление анкеты */
  deleteHero = async (heroID: string): Promise<boolean> => {
    if (this.isDeleting) {
      return false;
    }

    const { data, isError } = await this._requests.deleteHero.fetch({
      url: [ENDPOINTS.deleteHero.url, heroID].join('/'),
      data: {},
    });

    if (isError) {
      this.setError(data?.data?.error?.message ?? ErrorEnum.commonError);
    } else {
      void this._rootStore.statsStore.sendDeleteHero();

      this._heroesStore.removeForm(data.id);
    }

    return !isError;
  };

  /** отправка изображения героя */
  sendSingleImage = async (image: ImageFormField): Promise<boolean> => {
    if (!image.value || this._requests.uploadPhotoHero.isLoading) {
      return true;
    }

    const file = await dataUrlToFile(image.value, 'image');

    let uploadData: { image: File } = { image: file };

    if (file.size > MAX_FILE_SIZE) {
      try {
        const compressedFile = await imageCompression(file, OPTIMIZE_OPTIONS);
        const compressedFileToUpload = new File([compressedFile], file.name, { type: file.type });

        uploadData = { image: compressedFileToUpload };
      } catch (error) {
        Sentry.captureException(error);

        return false;
      }
    }

    if (this._rootStore.appParamsStore.isDev) {
      console.log(
        'Размер файла перед отправкой:',
        `${(uploadData.image.size / 1024 / 1024).toFixed(2)} Мб`
      );
    }

    const { data, isError } = await this._requests.uploadPhotoHero.fetch({
      data: uploadData,
      multipartFormData: true,
    });

    if (isError) {
      image.setErrorMessage(data?.data?.error?.message ?? imageErrors.uploadError);
    } else if (data) {
      void this._rootStore.statsStore.sendUploadPhoto();

      image.setValue(data.url, false, { id: data.id });
    }

    return !isError;
  };

  /** callback - для скролла до ошибки */
  create = async (callback: ScrollCallbackType): Promise<boolean> => {
    if (!this.buffForm.value || this.isSending) {
      return false;
    }

    this._isLoading.changeValue(true);
    this._errorMessage.reset();
    this._isSend.reset();
    this._errorField.reset();

    const { isCorrect, errorField } = this.buffForm.value.validateForm();

    if (!isCorrect && !this._errorField.value) {
      this._errorField.changeValue(errorField);
    }

    if (!isCorrect) {
      this.setError(ErrorEnum.validate);
      this._isLoading.changeValue(false);

      callback(this._errorField.value!);

      return false;
    }

    // загрузить фото
    const { photo } = this.buffForm.value;
    const imagesUploadResult = await this.sendSingleImage(photo);

    if (!imagesUploadResult) {
      this.setError(ErrorEnum.uploadImageError);
      this._isLoading.changeValue(false);

      return false;
    }

    const { data, isError } = await this._requests.createHero.fetch({
      data: this.buffForm.value.sendData,
    });

    if (isError) {
      this.setError(data?.data?.error?.message ?? ErrorEnum.commonError);
    } else {
      if (data.hero.status === StatusEnum.REJECTED) {
        void this._rootStore.statsStore.sendRejectHero();
      }

      this._isSend.changeValue(true);
      this._heroesStore.addForm(this.buffForm.value);
      this.resetBuffForm();
    }

    this._isLoading.changeValue(false);

    return this._isSend.value;
  };

  // запомнить загруженные фотографии перед редактированием
  rememberImages = (heroId: string): void => {
    const currentForm = this._heroesStore.getFormById(heroId);

    if (currentForm) {
      this._buffImage.changeValue({
        url: currentForm.photo.value,
        id: currentForm.photo.rest?.id ?? '',
      });
    }
  };

  // callback - для скролла до ошибки
  edit = async (heroId: string, callback: ScrollCallbackType): Promise<boolean> => {
    if (this.isSending) {
      return false;
    }

    this._isLoading.changeValue(true);
    this._errorMessage.reset();
    this._isSend.reset();
    this._errorField.reset();

    const currentForm = this._heroesStore.getFormById(heroId);

    if (!currentForm) {
      Sentry.captureException('try to edit unknown form', {
        extra: {
          heroId,
        },
      });

      return false;
    }

    const { isCorrect, errorField } = currentForm.validateForm();

    if (!isCorrect) {
      this._errorField.changeValue(errorField);
      this.setError(ErrorEnum.validate);
      this._isLoading.changeValue(false);

      callback(this._errorField.value!);

      return false;
    }

    const { photo } = currentForm;

    if (photo.value !== this._buffImage.value.url) {
      const imagesUploadResult = await this.sendSingleImage(photo);

      if (!imagesUploadResult) {
        this.setError(ErrorEnum.uploadImageError);
        this._isLoading.changeValue(false);

        return false;
      }

      this.rememberImages(heroId);
    }

    const { data, isError } = await this._requests.updateHero.fetch({
      data: currentForm.sendData,
      url: [ENDPOINTS.updateHero.url, heroId].join('/'),
    });

    if (isError) {
      this.setError(data?.data?.error?.message ?? ErrorEnum.commonError);
    } else {
      this._heroesStore.addForm(createHero(data.hero));
      this._isSend.changeValue(true);
    }

    this._isLoading.changeValue(false);

    return this._isSend.value;
  };

  fetchMilitaryUnits = async (search = ''): Promise<boolean> => {
    if (this.loadingMilitaryUnits) {
      return false;
    }

    const response = await this._requests.getMilitaryUnits.fetch({
      params: { q: search },
    });

    if (!response.isError) {
      // const uniqueUnits = new Set(response.data?.data ?? []);
      const uniqueUnits = FormList.filterFirstUniqueByValue(response.data?.data);

      this._militaryUnits.changeValue(Array.from(uniqueUnits));
    }

    return !response.isError;
  };

  reset = (): void => {
    const DEFAULT_ID = generateId();
    const form = new Form(DEFAULT_ID);

    form.init(defaultForm);
    this.resetBuffForm();
  };

  static filterFirstUniqueByValue(items: MilitaryUnitType[]): MilitaryUnitType[] {
    const seen = new Set<string>();

    return items.filter((item) => {
      if (seen.has(item.value)) {
        return false;
      }

      seen.add(item.value);

      return true;
    });
  }
}
