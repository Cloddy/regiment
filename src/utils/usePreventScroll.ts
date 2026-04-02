import { captureException } from '@sentry/react';
import * as React from 'react';

import { SCROLL_CONTAINER_ID } from 'config/ui';

const usePreventScroll = (modalShown: boolean) => {
  React.useEffect(() => {
    const container = document.getElementById(SCROLL_CONTAINER_ID);

    if (modalShown && container) {
      try {
        container.style.overflowY = 'hidden';
      } catch (error) {
        captureException(error);
      }
    }

    return () => {
      if (modalShown && container) {
        container.style.overflowY = 'auto';
      }
    };
  }, [modalShown]);
};

export default usePreventScroll;
