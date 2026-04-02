import type { RequestPropsMap } from '@vkontakte/vk-bridge';
import vkBridge from '@vkontakte/vk-bridge';

import { logger } from 'utils/logger';
import { vkBridgeSubscribe } from 'utils/vk/vkBridgeSubscribe';

const VIEW_SETTINGS: RequestPropsMap['VKWebAppSetViewSettings'] = {
  status_bar_style: 'light',
  action_bar_color: '#3F1C14',
  navigation_bar_color: '#3F1C14',
};

export const configureViewSettings = () => {
  vkBridge
    .supportsAsync('VKWebAppSetViewSettings')
    .then(async (isSupported) => {
      if (isSupported) {
        try {
          const setViewSettings = async (): Promise<void> => {
            await vkBridge.send('VKWebAppSetViewSettings', VIEW_SETTINGS);
          };

          await setViewSettings();
          vkBridgeSubscribe('VKWebAppViewRestore', setViewSettings);
        } catch (error) {
          logger.info('VK configure view settings:', { error });
        }
      }
    })
    .catch((error) => {
      logger.error(error, {
        vk_api: 'supportsAsync VKWebAppSetViewSettings',
      });
    });
};
