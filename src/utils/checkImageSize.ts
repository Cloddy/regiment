import { captureException } from '@sentry/react';

import { ImageSizeType } from 'config/imageTypes';

import { loadOnlyImage } from './loadImages';

export default async (src: string, minImageSize: ImageSizeType): Promise<boolean> => {
  try {
    const image = await loadOnlyImage(src);

    return image.width >= minImageSize.width && image.height >= minImageSize.height;
  } catch (error) {
    captureException(error);

    return false;
  }
};
