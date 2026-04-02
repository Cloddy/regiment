import { DeclineHeroReasonType } from './client';
import { DeclineReasonTypeEnum } from './common';
import { DeclineHeroReasonTypeServer } from './server';

const DECLINE_REASONS_DESCRIPTION_MAP: Record<DeclineReasonTypeEnum, DeclineHeroReasonType> = {
  [DeclineReasonTypeEnum.DUPLICATE_APPLICATION]: {
    id: DeclineReasonTypeEnum.DUPLICATE_APPLICATION,
    description: 'Повторная заявка',
    visible: true,
  },
  [DeclineReasonTypeEnum.INVALID_HERO_PHOTO]: {
    id: DeclineReasonTypeEnum.INVALID_HERO_PHOTO,
    description: 'Фото героя не соответствует правилам',
    visible: true,
  },
  [DeclineReasonTypeEnum.TYPO_IN_NAME]: {
    id: DeclineReasonTypeEnum.TYPO_IN_NAME,
    description: 'Опечатка в ФИО',
    visible: true,
  },
  [DeclineReasonTypeEnum.INCORRECT_LIFESPAN]: {
    id: DeclineReasonTypeEnum.INCORRECT_LIFESPAN,
    description: 'Некорректные годы жизни-смерти',
    visible: true,
  },
  [DeclineReasonTypeEnum.TERMS_VIOLATION]: {
    id: DeclineReasonTypeEnum.TERMS_VIOLATION,
    description: 'Нарушение правил Пользовательского соглашения',
    visible: true,
  },
  [DeclineReasonTypeEnum.AUTO_MOD_GIGA]: {
    id: DeclineReasonTypeEnum.AUTO_MOD_GIGA,
    description: 'Заявка отклонена',
    visible: false,
  },
  [DeclineReasonTypeEnum.AUTO_MOD_VIZIER]: {
    id: DeclineReasonTypeEnum.AUTO_MOD_VIZIER,
    description: 'Заявка отклонена',
    visible: false,
  },
};

export const normalizeDeclineHeroReason = (
  data: DeclineHeroReasonTypeServer
): DeclineHeroReasonType => {
  return DECLINE_REASONS_DESCRIPTION_MAP[data];
};
