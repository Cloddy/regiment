import { captureVKBridgeException } from '@ktsstudio/mediaproject-stores';
import vkBridge from '@vkontakte/vk-bridge';

import { getMiniAppRuntime } from 'bridge/runtime';
import { ENDPOINTS } from 'config/api/endpoints';
import { ApiRequest } from 'store/models/ApiRequest';

import { RootStoreType } from '../root';

import {
  StatEventEnum,
  StatFormContextEnum,
  StatTypeEnum,
  StatEventType,
  PixelType,
  pixels,
} from './types';

export class StatsStore {
  private readonly _requests: {
    sendOkStat: ApiRequest<null>;
  };

  constructor(private readonly _rootStore: RootStoreType) {
    this._requests = {
      sendOkStat: this._rootStore.apiStore.createRequest({ ...ENDPOINTS.sendOkStat }),
    };
  }

  sendStat = async (event: StatEventType) => {
    const dataToSend = JSON.stringify({
      ...event.data,
      network: this._rootStore.appParamsStore.isOk ? 'ok' : 'vk',
      user_id: this._rootStore.appParamsStore.userId,
    });

    if (this._rootStore.appParamsStore.isOk) {
      await this.sendOkStat(event, dataToSend);
    } else {
      await this.sendVkStat(event, dataToSend);
    }
  };

  sendOkStat = async (event: StatEventType, dataToSend: string) => {
    if (this._requests.sendOkStat.isLoading) {
      return;
    }

    const events = JSON.stringify([
      {
        user_id: this._rootStore.appParamsStore.userId,
        mini_app_id: this._rootStore.appParamsStore.isOk
          ? 53323244
          : this._rootStore.appParamsStore.appId,
        type: event.type,
        type_action: {
          type: 'type_mini_app_custom_event_item',
        },
        url: location.href,
        vk_platform: this._rootStore.appParamsStore.platform,
        event: event.event,
        screen: this._rootStore.historyStore.panel ?? '',
        json: dataToSend,
      },
    ]);

    const query = this._rootStore.appParamsStore.search.slice(1);

    const res = await this._requests.sendOkStat.fetch({
      data: {
        vk_app_id: this._rootStore.appParamsStore.isOk
          ? 53323244
          : this._rootStore.appParamsStore.appId,
        vk_user_id: this._rootStore.appParamsStore.userId,
        events,
        miniapp_query_params: query,
      },
      withoutSnackbar: true,
    });

    if (!res.isError) {
      // todo: убрать после тестирования
      console.log('sendOkStat: ', events);
    }
  };

  sendVkStat = async (event: StatEventType, dataToSend: string) => {
    if (getMiniAppRuntime() !== 'vk') {
      return;
    }

    try {
      // @ts-ignore
      const result = await vkBridge.send('VKWebAppSendCustomEvent', {
        event: event.event,
        type: event.type,
        json: dataToSend,
        screen: '',
      });

      // todo: убрать после тестирования
      console.log('sendVkStat: ', {
        event: event.event,
        type: event.type,
        json: dataToSend,
        screen: '',
      });
      console.log('sendVkStat result: ', result);
    } catch (e: any) {
      captureVKBridgeException({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        error: e,
        url: 'VKWebAppSendCustomEvent',
      });
    }
  };

  sendLaunch = async () => {
    await this.sendStat({
      event: StatEventEnum.launch,
      type: StatTypeEnum.typeAction,
      data: {
        hash: location.hash,
      },
    });

    await this.sendPixel(pixels.openApp);
  };

  sendChooseRegion = async () => {
    await this.sendStat({
      event: StatEventEnum.chooseRegion,
      type: StatTypeEnum.typeAction,
      data: {
        hash: location.hash,
      },
    });
  };

  sendViewHeroes = async (heroesCount: number) => {
    await this.sendStat({
      event: StatEventEnum.viewHeroes,
      type: StatTypeEnum.typeAction,
      data: {
        heroes_count: heroesCount,
      },
    });
  };

  sendClickSendHero = async () => {
    await this.sendStat({
      event: StatEventEnum.clickSendHero,
      type: StatTypeEnum.typeClick,
      data: {
        hash: location.hash,
      },
    });
  };

  sendSendHeroToSber = async (context: StatFormContextEnum) => {
    await this.sendStat({
      event: StatEventEnum.sendHeroToSber,
      type: StatTypeEnum.typeAction,
      data: {
        context,
      },
    });

    if (context === StatFormContextEnum.new) {
      await this.sendPixel(pixels.addHero);
    }
  };

  sendEditHero = async () => {
    await this.sendStat({
      event: StatEventEnum.editHero,
      type: StatTypeEnum.typeAction,
      data: {
        hash: location.hash,
      },
    });
  };

  sendRejectHero = async () => {
    await this.sendStat({
      event: StatEventEnum.rejectHero,
      type: StatTypeEnum.typeAction,
      data: {
        type: 'auto',
      },
    });
  };

  sendClickCancelHero = async (context: StatFormContextEnum) => {
    await this.sendStat({
      event: StatEventEnum.clickCancelHero,
      type: StatTypeEnum.typeClick,
      data: {
        context,
      },
    });
  };

  sendClickShare = async () => {
    await this.sendStat({
      event: StatEventEnum.clickShare,
      type: StatTypeEnum.typeClick,
      data: {
        hash: location.hash,
      },
    });
  };

  sendShareStory = async () => {
    await this.sendStat({
      event: StatEventEnum.shareStory,
      type: StatTypeEnum.typeAction,
      data: {
        hash: location.hash,
      },
    });
  };

  sendDeleteHero = async () => {
    await this.sendStat({
      event: StatEventEnum.deleteHero,
      type: StatTypeEnum.typeAction,
      data: {
        hash: location.hash,
      },
    });
  };

  sendUploadPhoto = async () => {
    await this.sendStat({
      event: StatEventEnum.uploadPhoto,
      type: StatTypeEnum.typeAction,
      data: {
        hash: location.hash,
      },
    });
  };

  sendSubmitButton = async () => {
    await this.sendStat({
      event: StatEventEnum.submitButton,
      type: StatTypeEnum.typeClick,
    });

    await this.sendPixel(pixels.onboarding);
  };

  sendCancelRegion = async () => {
    await this.sendStat({
      event: StatEventEnum.cancelRegion,
      type: StatTypeEnum.typeClick,
    });
  };

  sendPixel = async (pixel: PixelType) => {
    if (this._rootStore.appParamsStore.isOk) {
      return;
    }

    if (getMiniAppRuntime() !== 'vk') {
      return;
    }

    try {
      const result = await vkBridge.send(
        'VKWebAppRetargetingPixel',
        pixel.VKWebAppRetargetingPixel
      );

      console.log('VKWebAppRetargetingPixel', result, pixel.VKWebAppRetargetingPixel);
    } catch (e) {
      console.log('error VKWebAppRetargetingPixel', e);
    }

    try {
      const result = await vkBridge.send('VKWebAppTrackEvent', pixel.VKWebAppTrackEvent);

      console.log('VKWebAppTrackEvent', result, pixel.VKWebAppTrackEvent);
    } catch (e) {
      console.log('error VKWebAppTrackEvent', e);
    }

    try {
      // @ts-ignore
      const result = await vkBridge.send('VKWebAppSendCustomEvent', pixel.VKWebAppSendCustomEvent);

      console.log('VKWebAppSendCustomEvent', result, pixel.VKWebAppSendCustomEvent);
    } catch (e) {
      console.log('error VKWebAppSendCustomEvent', e);
    }

    if (pixel.VKWebAppTrackEvent2) {
      try {
        const result = await vkBridge.send('VKWebAppTrackEvent', pixel.VKWebAppTrackEvent2);

        console.log('VKWebAppTrackEvent', result, pixel.VKWebAppTrackEvent2);
      } catch (e) {
        console.log('error VKWebAppTrackEvent', e);
      }
    }

    try {
      const result = await vkBridge.send('VKWebAppConversionHit', pixel.VKWebAppConversionHit);

      console.log('VKWebAppConversionHit', result, pixel.VKWebAppConversionHit);
    } catch (e) {
      console.log('error VKWebAppConversionHit', e);
    }
  };

  destroy = () => {
    Object.values(this._requests).forEach((item) => item.destroy());
  };
}
