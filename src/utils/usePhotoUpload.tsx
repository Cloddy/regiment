import * as Sentry from '@sentry/react';
import imageCompression from 'browser-image-compression';
import * as React from 'react';

import { imageErrors } from 'config/errors';
import { acceptTypesArr, ImageSizeType } from 'config/imageTypes';
import { MAX_FILE_SIZE, MAX_UPLOAD_FILE_SIZE, OPTIMIZE_OPTIONS } from 'config/info';
import { useAppParamsStore } from 'store/hooks';
import { toBase64 } from 'utils/toBase64';

import checkImageSize from './checkImageSize';

type PhotoUploadType = {
  onChangePhoto: (event: React.ChangeEvent<HTMLInputElement>) => Promise<string>;
  isError: boolean;
  errorMessage: string;
};

export default (
  setCropPhoto?: (v: string) => void,
  minImageSize?: ImageSizeType
): PhotoUploadType => {
  const { isDev } = useAppParamsStore();

  // Фото в base64
  const [isError, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleUpload = React.useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>
    ): Promise<{
      file: string;
      isError: boolean;
      errorMessage: string;
    }> => {
      if (e.target.files?.length) {
        const [raw]: File[] = [...e.target.files];

        const isImage = acceptTypesArr.includes(raw.type);

        if (!isImage) {
          return {
            file: '',
            isError: true,
            errorMessage: imageErrors.wrongFile,
          };
        }

        if (raw.size > MAX_UPLOAD_FILE_SIZE) {
          return {
            file: '',
            isError: true,
            errorMessage: imageErrors.tooBig,
          };
        }

        let compressedFile: File;

        try {
          compressedFile = await imageCompression(raw, OPTIMIZE_OPTIONS);
        } catch (error) {
          Sentry.captureException(error);

          return {
            file: '',
            isError: true,
            errorMessage: imageErrors.uploadError,
          };
        }

        if (isDev) {
          console.log(
            'Размер файла до сжатия:',
            `${(raw.size / 1024 / 1024).toFixed(2)} Мб`,
            '\nРазмер файла после сжатия:',
            `${(compressedFile.size / 1024 / 1024).toFixed(2)} Мб`
          );
        }

        if (compressedFile.size <= MAX_FILE_SIZE) {
          try {
            const base64 = await toBase64(compressedFile);

            if (minImageSize) {
              const sizeCheckResult = await checkImageSize(base64, minImageSize);

              if (!sizeCheckResult) {
                return {
                  file: '',
                  isError: true,
                  errorMessage: imageErrors.tooSmallSideSize(minImageSize),
                };
              }
            }

            return {
              file: base64,
              isError: false,
              errorMessage: '',
            };
          } catch (error) {
            Sentry.captureException(error);

            return {
              file: '',
              isError: true,
              errorMessage: imageErrors.uploadError,
            };
          }
        } else {
          return {
            file: '',
            isError: true,
            errorMessage: imageErrors.tooBig,
          };
        }
      }

      return {
        file: '',
        isError: false,
        errorMessage: '',
      };
    },
    []
  );

  const onChangePhoto = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<string> => {
      setError(false);
      const {
        file: photoBase64,
        isError: isErrorChangePhoto,
        errorMessage: errorMessageChangePhoto,
      } = await handleUpload(e);

      if (photoBase64) {
        setCropPhoto && setCropPhoto(photoBase64);

        return photoBase64;
      }

      setCropPhoto && setCropPhoto('');
      setError(isErrorChangePhoto);
      setErrorMessage(errorMessageChangePhoto);

      return '';
    },
    []
  );

  return {
    onChangePhoto,
    isError,
    errorMessage,
  };
};
