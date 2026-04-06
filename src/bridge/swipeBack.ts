import { captureVKBridgeException } from '@ktsstudio/mediaproject-stores';
import bridge from '@vkontakte/vk-bridge';

import { getMiniAppRuntime } from './runtime';

export const setVkSwipeBackEnabled = (enabled: boolean): void => {
  if (getMiniAppRuntime() !== 'vk') {
    return;
  }

  const method = enabled ? 'VKWebAppEnableSwipeBack' : 'VKWebAppDisableSwipeBack';

  if (bridge.supports(method)) {
    bridge.send(method).catch((error) => {
      captureVKBridgeException({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        error,
        url: method,
      });
    });
  }
};
