import { captureVKBridgeException } from '@ktsstudio/mediaproject-stores';
import bridge from '@vkontakte/vk-bridge';

// разрешение уведомлений в вк
export const requestVKNotifications = async (
  onSuccess: () => Promise<void>,
  isOk: boolean
): Promise<void> => {
  if (isOk) {
    return;
  }

  try {
    const { result } = await bridge.send('VKWebAppAllowNotifications');

    if (result) {
      await onSuccess();
    }
  } catch (error: any) {
    captureVKBridgeException({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      error,
      url: 'VKWebAppAllowNotifications',
    });

    console.log('VKWebAppAllowNotifications error allow', error);
  }
};
