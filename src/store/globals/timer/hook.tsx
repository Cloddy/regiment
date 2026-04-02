import * as React from 'react';

import { useRootStore } from '../root';

export const useDateTimer = () => {
  const {
    startIntervalMay7,
    startIntervalMay9,
    stopIntervalOpenMay7,
    stopIntervalOpenMay9,
    destroy,
  } = useRootStore().timerStore;

  React.useEffect(() => {
    startIntervalMay7();
    startIntervalMay9();

    return () => {
      stopIntervalOpenMay7();
      stopIntervalOpenMay9();
      destroy();
    };
  }, []);
};
