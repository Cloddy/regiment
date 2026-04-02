import { initMarkup as initMarkupBase } from '@ktsstudio/mediaproject-style';

import { app } from 'config/app';

export const initMarkup = (isMobile: boolean) => {
  initMarkupBase({
    isMobile,
    mobileWindowSize: app.mobileWindowSize,
    desktopWindowSize: app.desktopWindowSize,
  });
};
