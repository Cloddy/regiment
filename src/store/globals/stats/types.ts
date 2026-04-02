import {
  ConversionHitRequest,
  RequestIdProp,
  RetargetingPixelOptions,
  TrackEventRequest,
} from '@vkontakte/vk-bridge';

export enum StatEventEnum {
  // старт приложения
  launch = 'launch',

  // нажатие на кнопку подать заявку на главном экране
  submitButton = 'submit_button',

  // закрытие модалки выбора федерального округа
  cancelRegion = 'cancel_region',

  // выбор федерального округа
  chooseRegion = 'choose_region',

  // просмотр списка героев
  viewHeroes = 'view_heroes',

  // нажатие на кнопку отправки героя
  clickSendHero = 'click_send_hero',

  // герой отправился и сбер ответил айдишником героя
  sendHeroToSber = 'send_hero_to_sber',

  // начал редактирование героя
  editHero = 'edit_hero',

  // пришло уведомление о том, что герой получил автоматический реджект при отправке анкеты.
  rejectHero = 'reject_hero',

  // отмена создания/редактирования героя
  clickCancelHero = 'click_cancel_hero',

  // нажатие на кнопку поделиться
  clickShare = 'click_share',

  // поделился историей
  shareStory = 'share_story',

  // удалил героя
  deleteHero = 'delete_hero',

  // загрузил фото
  uploadPhoto = 'upload_photo',
}

export enum StatFormContextEnum {
  new = 'new',
  edit = 'edit',
}

export enum StatTypeEnum {
  typeClick = 'type_click',
  typeAction = 'type_action',
}

export type StatEventType = {
  event: StatEventEnum;
  type: StatTypeEnum;
  data?: Record<string, string | number>;
};

export type PixelType = {
  VKWebAppRetargetingPixel: RetargetingPixelOptions & RequestIdProp;
  VKWebAppTrackEvent: TrackEventRequest & RequestIdProp;
  VKWebAppSendCustomEvent: Record<string, string>;
  VKWebAppTrackEvent2: (TrackEventRequest & RequestIdProp) | null;
  VKWebAppConversionHit: ConversionHitRequest & RequestIdProp;
};

export type PixelsType = Record<string, PixelType>;

export const pixels: PixelsType = {
  openApp: {
    VKWebAppRetargetingPixel: {
      pixel_code: 'VK-RTRG-1949450-8013V',
      event: 'open_app',
    },
    VKWebAppTrackEvent: {
      event_name: 'open_app',
    },
    VKWebAppSendCustomEvent: {
      event: 'open_app',
    },
    VKWebAppTrackEvent2: null,
    VKWebAppConversionHit: {
      pixel_code: 'VK-RTRG-1949450-8013V',
      conversion_event: 'open_app',
      conversion_value: 1,
    },
  },
  onboarding: {
    VKWebAppRetargetingPixel: {
      pixel_code: 'VK-RTRG-1949450-8013V',
      event: 'onboarding',
    },
    VKWebAppTrackEvent: {
      event_name: 'onboarding',
    },
    VKWebAppSendCustomEvent: {
      event: 'onboarding',
    },
    VKWebAppTrackEvent2: {
      event_name: 'registration',
    },
    VKWebAppConversionHit: {
      pixel_code: 'VK-RTRG-1949450-8013V',
      conversion_event: 'lead',
      conversion_value: 1,
    },
  },
  addHero: {
    VKWebAppRetargetingPixel: {
      pixel_code: 'VK-RTRG-1949450-8013V',
      event: 'add_hero',
    },
    VKWebAppTrackEvent: {
      event_name: 'add_hero',
    },
    VKWebAppSendCustomEvent: {
      event: 'add_hero',
    },
    VKWebAppTrackEvent2: {
      event_name: 'lead',
    },
    VKWebAppConversionHit: {
      pixel_code: 'VK-RTRG-1949450-8013V',
      conversion_event: 'complete_registration',
      conversion_value: 1,
    },
  },
};
