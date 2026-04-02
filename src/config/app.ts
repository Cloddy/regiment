import { WindowSize } from '@ktsstudio/mediaproject-style';
import { SetViewSettingsPropsType } from '@ktsstudio/mediaproject-vk';
import { AppearanceType } from '@vkontakte/vk-bridge';

type AppearanceConfigType =
  | {
      withVkAppearance: false;
      viewSettings: SetViewSettingsPropsType;
    }
  | {
      withVkAppearance: true;
    };

type AppConfigType = {
  isInternal: boolean;
  mobileWindowSize?: WindowSize;
  desktopWindowSize?: WindowSize;
  defaultAppearance: AppearanceType;
} & AppearanceConfigType;

// установить свои параметры
export const app: AppConfigType = {
  isInternal: false,
  mobileWindowSize: {
    width: 375,
    height: 812,
  },
  desktopWindowSize: {
    width: 768,
    height: 600,
  },
  defaultAppearance: 'light',
  // нужно ли потдягивать тему ВК
  withVkAppearance: false,
  viewSettings: {
    /**
     * обязательное
     * Тема для значков статус-бара. Возможные значения:
     * • light — светлая
     * • dark — тёмная
     */
    status_bar_style: 'dark',

    /**
     * опциональное
     * Цвет экшен-бара в формате HEX-кода.
     * Например: #00ffff.
     * Используйте значение none для задания прозрачного цвета.
     *
     * Поле работает только на Android.
     */
    action_bar_color: 'white',

    /**
     * опциональное
     * Цвет навигационного бара в формате HEX-кода.
     * Например: #00ffff.
     *
     * Поле работает только на Android.
     */
    navigation_bar_color: 'white',
  },
};
