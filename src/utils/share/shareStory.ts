import * as Sentry from '@sentry/react';
import bridge, { ErrorData, ErrorDataClientError } from '@vkontakte/vk-bridge';

import { PlatformType } from 'store/types';

type Props = {
  blob: Blob;
  statFunc?: () => Promise<void>;
  isOk: boolean;
  appId: number;
  platform: PlatformType;
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  const reader = new FileReader();

  reader.readAsDataURL(blob);

  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
  });
};

export const shareStoryVK = async ({
  blob,
  statFunc,
  appId,
  platform,
}: Props): Promise<boolean | null> => {
  try {
    const base64 = await blobToBase64(blob);

    const { result } = await bridge.send('VKWebAppShowStoryBox', {
      background_type: 'image',
      blob: base64,
      locked: true,
      attachment: {
        text: 'open',
        type: 'url',
        url: appId ? `https://vk.com/app${appId}` : '',
      },
    });

    if (result && statFunc) {
      void statFunc();
    }

    console.log('share ok', result);

    return true;
  } catch (error: unknown) {
    console.log('share error', error);

    const { error_data } = error as ErrorData;

    // В ОК на андроид при открытии окна редактирования момента возвращается ошибка,
    // хотя сам момент отправить возможно
    const isFakeUnsupportedPlatform =
      platform === 'mobile_android_ok' && error_data.error_code === 6;

    if (
      (error_data as ErrorDataClientError)?.error_reason === 'User denied' ||
      isFakeUnsupportedPlatform
    ) {
      return null;
    }

    Sentry.captureException(error);

    return false;
  }
};

export default async (options: Props): Promise<boolean | null | undefined> => {
  return shareStoryVK(options);
};
