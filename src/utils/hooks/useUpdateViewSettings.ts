import { useEventSubscribe } from '@ktsstudio/mediaproject-vk';
import { useMemo } from 'react';

import { useAppParamsStore } from 'store/hooks';
import { getViewSettingsSetter } from 'utils/getViewSettingsSetter';

export const useUpdateViewSettings = (): void => {
  const appParamsStore = useAppParamsStore();

  const setViewSettings = useMemo(() => {
    const setter = getViewSettingsSetter(appParamsStore);

    return () => void setter();
  }, [appParamsStore]);

  useEventSubscribe('VKWebAppViewRestore', setViewSettings, [appParamsStore]);
};
