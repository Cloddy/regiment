import { makeAutoObservable } from 'mobx';

import { imageErrors } from 'config/errors';
import { ImageSizeType } from 'config/imageTypes';
import { ILocalStore } from 'store/interfaces';
import { Form } from 'store/models/Form/Form';
import { ImageFormField } from 'store/models/FormFieldModel/types';
import checkImageSize from 'utils/checkImageSize';

export class CropStore implements ILocalStore {
  cropPhoto = ''; // исходная картинка

  minSize: ImageSizeType | null = null;

  photoField: ImageFormField | null = null;

  form: Form | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  init = (photoField: ImageFormField, form: Form | null, minSize?: ImageSizeType): void => {
    this.photoField = photoField;
    this.form = form;
    minSize && (this.minSize = minSize);
  };

  setCropPhoto = (value: string): void => {
    this.cropPhoto = value;
  };

  onSaveCropPhoto = async (value: string): Promise<void> => {
    if (this.minSize) {
      const imageSizeResult = await checkImageSize(value, this.minSize);

      if (!imageSizeResult) {
        const message = imageErrors.tooSmallSideSize(this.minSize);

        this.photoField?.setErrorMessage(message);

        return;
      }
    }

    this.photoField?.setValue(value, false, { id: '' });
  };

  readonly destroy = () => {};
}
