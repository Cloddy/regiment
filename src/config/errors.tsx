import * as React from 'react';

import { ImageSizeType } from './imageTypes';

export enum GlobalErrorsEnum {
  externalApiError = 'external_api_error',
  notAuthorized = 'not_authorized',
  heroNotFound = 'hero_not_found',
  default = 'default',
  heroModerationBlock = 'hero_moderation_block',
  storyModerationBlock = 'story_moderation_block',
}

export const globalErrorMessages: Record<GlobalErrorsEnum, string> = {
  [GlobalErrorsEnum.default]: 'Произошла ошибка! Перезагрузите приложение или попробуйте позже',
  [GlobalErrorsEnum.externalApiError]:
    'Произошла критическая ошибка. Пожалуйста, перезагрузите приложение или попробуйте позже',
  [GlobalErrorsEnum.heroNotFound]: 'Произошла ошибка. Данный герой был удален',
  [GlobalErrorsEnum.notAuthorized]:
    'Произошла ошибка авторизации. Пожалуйста, перезагрузите приложение или попробуйте позже',
  [GlobalErrorsEnum.heroModerationBlock]:
    'Произошла ошибка. Данную заявку нельзя редактировать или удалять',
  [GlobalErrorsEnum.storyModerationBlock]:
    'Произошла ошибка. Данную историю нельзя редактировать или удалять',
};

export enum ErrorEnum {
  commonError = 'commonError',
  region = 'region',
  noError = 'noError',
  validate = 'validate',
  uploadImageError = 'upload_image_error',
}

export const errorMessages: Record<ErrorEnum, React.ReactNode> = {
  [ErrorEnum.commonError]: (
    <>
      Произошла ошибка! <br />
      Перезагрузите приложение или&nbsp;попробуйте позже
    </>
  ),
  [ErrorEnum.region]: 'Регион не выбран',
  [ErrorEnum.validate]: 'Проверьте правильность заполнения полей',
  [ErrorEnum.noError]: '',
  [ErrorEnum.uploadImageError]: 'Произошла ошибка при загрузке фотографии',
};

export const imageErrors = {
  notFound: 'Фотография не отправлена',
  wrongFile: 'Неверный тип файла',
  tooBig: 'Слишком большой файл',
  tooSmallSideSize: (minSize: ImageSizeType) =>
    `Размеры фотографии должны быть не меньше ${minSize.width}х${minSize.height} пикселей`,
  uploadError: 'Произошла ошибка при загрузке фотографии',
  photoLimit: 'Достигнут лимит по загрузке фотографий',
};
