import { useMemo, useEffect } from 'react';
import vkBridge, { type VKBridgeSubscribeHandler } from '@vkontakte/vk-bridge';

import { getMiniAppRuntime } from 'bridge/runtime';
import { useAppParamsStore } from 'store/hooks';
import { getViewSettingsSetter } from 'utils/getViewSettingsSetter';

export const useUpdateViewSettings = (): void => {
  const appParamsStore = useAppParamsStore();

  const setViewSettings = useMemo(() => getViewSettingsSetter(appParamsStore), [appParamsStore]);

  useEffect(() => {
    const runtime = getMiniAppRuntime();

    if (runtime === 'max') {
      void setViewSettings();

      return;
    }

    if (runtime !== 'vk') {
      return;
    }

    const sub: VKBridgeSubscribeHandler = (event) => {
      if (event.detail.type === 'VKWebAppViewRestore') {
        void setViewSettings();
      }
    };

    vkBridge.subscribe(sub);

    return () => {
      vkBridge.unsubscribe(sub);
    };
  }, [setViewSettings]);
};
