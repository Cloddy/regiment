import { setVkViewSettings } from '@ktsstudio/mediaproject-vk';

import { app } from 'config/app';
import { type AppParamsStore } from 'store/globals/appParams';

export const getViewSettingsSetter =
  (appParamsStore: AppParamsStore): (() => Promise<void>) =>
  async () => {
    if (!app.withVkAppearance) {
      await setVkViewSettings(app.viewSettings, appParamsStore.platform);
    }
  };
