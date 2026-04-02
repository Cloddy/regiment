import { init } from '@ktsstudio/mediaproject-stores';
import { type StackFrame, ErrorEvent } from '@sentry/react';

import { type AppParamsStore } from 'store/globals/appParams';

const odrFixFilename = (stackFrame: StackFrame) => {
  if (stackFrame.filename) {
    stackFrame.filename = `~${stackFrame.filename.replace(
      // отправляем название файла и путь до него после папки public
      // чтобы правильно определились sourcemap к файлу
      /^.+public/g,
      ''
    )}`;
  }
};

const odrFixBeforeSend = (event: ErrorEvent) => {
  const stacktraceFrames = event.exception?.values?.[0]?.stacktrace?.frames ?? [];

  stacktraceFrames.forEach(odrFixFilename);

  return event;
};

export const initSentry = ({ isProd, isDev, isOdr, userId }: AppParamsStore) => {
  init(
    {
      dsn: process.env.SENTRY_DSN,
      normalizeDepth: 6,
      beforeSend: isOdr ? odrFixBeforeSend : undefined,
    },
    isProd,
    isDev,
    {
      id: String(userId),
    }
  );
};
