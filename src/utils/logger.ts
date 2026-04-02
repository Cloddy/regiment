import * as Sentry from '@sentry/react';
import { captureException } from '@sentry/react';
import { isAxiosError } from 'axios';

import { IS_DEV, IS_LOCAL_DEV } from 'config/env';

class Logger {
  private static readonly _PREFIX = '[APP]';

  readonly info = (...args: unknown[]) => {
    if (IS_DEV) {
      console.log(Logger._PREFIX, ...args);
    }
  };

  readonly error = (
    rawError: unknown,
    tags: Record<string, string> = {},
    extra?: Record<string, unknown>
  ) => {
    const error = normalizeError(rawError);

    if (IS_DEV) {
      this.info('--- ERROR ---');
      this.info(error);
      tags && this.info('Tags:', tags);
      extra && this.info('Extra:', extra);
      this.info('--- ERROR ---');
    }

    if (!IS_LOCAL_DEV) {
      console.log('--- ERROR ---', error);

      if (isAxiosError(error)) {
        const { url = '' } = tags;

        error.name = `API ${url} ${error?.code ?? ''} ${error?.status ?? ''}`;
      }

      Sentry.captureException(error, {
        tags: tags,
        extra: {
          error,
          errorData: extra?.data,
          params: extra?.params,
        },
      });
    }
  };
}

export const logger = new Logger();

const normalizeError = (data: unknown): Error => {
  if (data instanceof Error) {
    return data;
  }

  return new Error(serializeData(data));
};

const serializeData = (data: unknown): string => {
  if (typeof data === 'string') {
    return data;
  }

  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    captureException(error);

    return 'Error serializing data';
  }
};
