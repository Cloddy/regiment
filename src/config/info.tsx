import * as React from 'react';

import { ImageSizeType } from './imageTypes';

export const MAX_ACCOUNTS = 20; // максимальное число анкет

export const backendIds = ['VK-', 'OK-', 'BPO-'];

export const checkInBackendIds = (id: string): boolean => {
  return (
    backendIds.filter((backendId) => {
      const re = new RegExp(backendId, 'g');

      return id.match(re);
    }).length > 0
  );
};

export const IMAGE_ASPECT_RATIO = 3 / 4;

const MAX_FILE_SIZE_MB = 1;

const MAX_UPLOAD_FILE_SIZE_MB = 5;

/** Максимальный размер сжатого файла в байтах */
export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

/** Максимальный размер загружаемого файла в байтах */
export const MAX_UPLOAD_FILE_SIZE = MAX_UPLOAD_FILE_SIZE_MB * 1024 * 1024;

export const OPTIMIZE_OPTIONS = {
  maxSizeMB: MAX_FILE_SIZE_MB,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

export const maxImageSizeInfoLines = (minImageSize: ImageSizeType) => (
  <>
    <p>Максимальный размер: {MAX_UPLOAD_FILE_SIZE_MB}&nbsp;МБ</p>
    <p>
      Минимальные размеры фото: {minImageSize.width}x{minImageSize.height}
    </p>
    <p>Разрешенные типы файлов: *.png, *.jpg, *.jpeg</p>
  </>
);

export const MAX_LENGTHS = {
  firstName: 50,
  lastName: 50,
  middleName: 50,
};
