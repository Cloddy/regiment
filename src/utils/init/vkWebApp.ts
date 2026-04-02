import { captureException } from '@ktsstudio/mediaproject-stores';
import bridge from '@vkontakte/vk-bridge';

import { type AppParamsStore } from 'store/globals/appParams';
import { getViewSettingsSetter } from 'utils/getViewSettingsSetter';

export const initVKWebApp = (appParamsStore: AppParamsStore) => {
  const setViewSettings = getViewSettingsSetter(appParamsStore);

  void bridge
    .send('VKWebAppInit')
    .then(setViewSettings)
    .catch((error: unknown) => captureException({ error }));
};
