import type { AnyReceiveOnlyMethodName, ReceiveData } from '@vkontakte/vk-bridge';
import vkBridge from '@vkontakte/vk-bridge';

import { logger } from 'utils/logger';

/**
 * Подписка на события VK
 */
export const vkBridgeSubscribe = <EventType extends AnyReceiveOnlyMethodName>(
  eventType: EventType,
  callback: (data: ReceiveData<EventType>) => void
) => {
  try {
    vkBridge.subscribe((event) => {
      if (event.detail.type !== eventType) {
        return;
      }

      callback(event.detail.data as ReceiveData<EventType>);
    });
  } catch (error) {
    logger.error(error, { vk_api: 'vkBridgeSubscribe' }, { event });
  }
};
