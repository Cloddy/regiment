import {
  Icon28CheckCircleOutline,
  Icon28ErrorCircleOutline,
  Icon28InfoCircleOutline,
} from '@vkontakte/icons';
import * as React from 'react';

const SuccessIcon = <Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />;
const ErrorIcon = <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />;
const InfoIcon = <Icon28InfoCircleOutline fill="var(--vkui--color_accent_orange)" />;

export enum SnackbarMessageGoalsEnum {
  success = 'success',
  error = 'error',
  info = 'info',
  story = 'story',
  moment = 'moment',
}

/**
 * Тип содержит в себе текст (text) и цель (goal) сообщения. Если цели сообщения нет,
 * в снекбаре не будет отображена иконка перед текстом
 */
export type SnackbarMessageType = {
  text: React.ReactNode;
  goal?: SnackbarMessageGoalsEnum;
  duration?: number;
};

export const SNACKBAR_GOALS_ICONS: Record<SnackbarMessageGoalsEnum, React.JSX.Element | null> = {
  [SnackbarMessageGoalsEnum.success]: SuccessIcon,
  [SnackbarMessageGoalsEnum.error]: ErrorIcon,
  [SnackbarMessageGoalsEnum.info]: InfoIcon,
  [SnackbarMessageGoalsEnum.story]: SuccessIcon,
  [SnackbarMessageGoalsEnum.moment]: SuccessIcon,
};

export const DEFAULT_SNACKBAR_MESSAGES = {
  error: {
    text: 'Произошла ошибка',
    goal: SnackbarMessageGoalsEnum.error,
  },
  success: {
    text: 'Действие успешно выполнено',
    goal: SnackbarMessageGoalsEnum.success,
  },
  story: {
    text: 'История опубликована',
    goal: SnackbarMessageGoalsEnum.success,
  },
  moment: {
    text: 'Момент опубликован',
    goal: SnackbarMessageGoalsEnum.success,
  },
};

export const SNACKBAR_DEFAULT_DURATION = 4000;
