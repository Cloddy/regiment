import { captureException } from '@ktsstudio/mediaproject-stores';
import bridge from '@vkontakte/vk-bridge';

import { type AppParamsStore } from 'store/globals/appParams';
import { getViewSettingsSetter } from 'utils/getViewSettingsSetter';

import { getMaxWebApp } from './maxWebApp';
import { getMiniAppRuntime } from './runtime';

export const initMiniApp = (appParamsStore: AppParamsStore): void => {
  const runtime = getMiniAppRuntime();

  if (runtime === 'max') {
    try {
      getMaxWebApp()?.ready();
    } catch (error: unknown) {
      captureException({ error });
    }

    const setViewSettings = getViewSettingsSetter(appParamsStore);

    void Promise.resolve(setViewSettings()).catch((error: unknown) => captureException({ error }));

    return;
  }

  if (runtime === 'vk') {
    const setViewSettings = getViewSettingsSetter(appParamsStore);

    void bridge
      .send('VKWebAppInit')
      .then(setViewSettings)
      .catch((error: unknown) => captureException({ error }));
  }
};
