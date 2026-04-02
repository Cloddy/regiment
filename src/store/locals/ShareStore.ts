import { ILocalStore, MetaModel } from '@ktsstudio/mediaproject-stores';
import * as Sentry from '@sentry/react';
import { makeAutoObservable, runInAction } from 'mobx';

import { IMAGES_API_URL } from 'config/api/apiUrl';
import { IS_DEV } from 'config/env';
import { DEFAULT_SNACKBAR_MESSAGES } from 'config/snackbars';
import { HeroCardPreview } from 'entities/hero';
import { RootStoreType } from 'store/globals/root';
import drawStory from 'utils/share/drawStory';
import shareStory from 'utils/share/shareStory';

export class ShareStore implements ILocalStore {
  private readonly _rootStore: RootStoreType;

  meta = new MetaModel();

  constructor(readonly rootStore: RootStoreType) {
    makeAutoObservable(this, {
      rootStore: false,
    });

    this._rootStore = rootStore;
  }

  get isSharing() {
    return this.meta.isLoading;
  }

  get isError() {
    return this.meta.isError;
  }

  get isShared() {
    return this.meta.isLoaded;
  }

  drawStoryImage = async (data: HeroCardPreview): Promise<boolean> => {
    if (this.meta.isLoading) {
      return false;
    }

    this.meta.setLoadedStartMeta();

    console.log('drawStoryImage data', data);

    // заменяем url на прокси для обхода CORS
    const photoPath = data.photo.split('/').slice(-2).join('/');
    const photo = IS_DEV ? `${IMAGES_API_URL}/${photoPath}` : data.photo;

    const result = await drawStory({
      ...data,
      photo,
      callback: this.shareInStory,
    });

    console.log('drawStoryImage result', result);

    if (!result) {
      this._rootStore.uiStore.snackbar.triggerDefaultErrorMessage();
      this.meta.setLoadedErrorMeta();

      return false;
    }

    return true;
  };

  // шеринг в историю
  shareInStory = async (blob: Blob | null): Promise<void> => {
    if (!blob) {
      return;
    }

    console.log('shareInStory before', this.isSharing);

    if (
      this._rootStore.appParamsStore.platform === 'desktop_web' ||
      this._rootStore.appParamsStore.platform === 'mobile_web'
    ) {
      // issue https://github.com/VKCOM/vk-bridge/issues/585
      this.meta.setLoadedSuccessMeta();
    }

    try {
      const result = await shareStory({
        blob,
        statFunc: this.rootStore.statsStore.sendShareStory,
        isOk: this.rootStore.appParamsStore.isOk,
        appId: this.rootStore.appParamsStore.appId,
        platform: this.rootStore.appParamsStore.platform,
      });

      runInAction(() => {
        console.log('shareInStory result', result);
        const snackbar = this._rootStore.appParamsStore.isOk
          ? DEFAULT_SNACKBAR_MESSAGES.moment
          : DEFAULT_SNACKBAR_MESSAGES.story;

        if (result !== null) {
          this._rootStore.uiStore.snackbar.openSnackbarMessage(
            result ? snackbar : DEFAULT_SNACKBAR_MESSAGES.error
          );
        }

        this.meta.setLoadedSuccessMeta();
      });

      console.log('shareInStory after', this.isSharing);
    } catch (error) {
      Sentry.captureException(error);
      console.warn(error);
      this._rootStore.uiStore.snackbar.triggerDefaultErrorMessage();
      this.meta.setLoadedErrorMeta();
    }
  };

  readonly destroy = () => {};
}
