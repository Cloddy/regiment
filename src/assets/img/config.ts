import { COMMON_IMAGES_STATIC } from './common';

export const allStatics: string[] = [
  ...COMMON_IMAGES_STATIC,
  ...(require('./start').statics as string[]),
  ...(require('./heroes').statics as string[]),
  ...(require('./form').statics as string[]),
  ...(require('./account').statics as string[]),
  ...(require('./notifications').statics as string[]),
  ...(require('./footer').statics as string[]),
  ...(require('./header').statics as string[]),
];
