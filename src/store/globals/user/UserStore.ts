import { FieldModel } from '@ktsstudio/mediaproject-stores';
import { computed, makeObservable } from 'mobx';

import { ENDPOINTS } from 'config/api';
import { USE_MOCKS } from 'config/env';
import { FederalDistrictEnum } from 'config/federalDistricts';
import { SnackbarMessageGoalsEnum } from 'config/snackbars';
import { MOCK_USER, UserServer } from 'entities/user';
import { DefaultResponse } from 'store/globals/api/types';
import { type RootStoreType } from 'store/globals/root';
import { type IGlobalStore } from 'store/interfaces';
import { ApiRequest } from 'store/models/ApiRequest';
import { parseJwt } from 'store/utils/parseJwt';
import createUrlParams from 'utils/createUrlParams';

import { ApiAuth } from './types';

// интервал обновления токена в миллисекундах
const REFRESH_AUTH_INTERVAL = 270000; // 4,5 минуты 270000

export class UserStore implements IGlobalStore {
  private readonly _rootStore: RootStoreType;

  private readonly _user: FieldModel<null | UserServer> = new FieldModel<null | UserServer>(null);

  timerId: NodeJS.Timeout | null = null;

  private readonly _requests: {
    auth: ApiRequest<ApiAuth>;
    refresh: ApiRequest<ApiAuth>;
    setFederalDistrict: ApiRequest<ApiAuth>;
  };

  constructor(readonly rootStore: RootStoreType) {
    this._rootStore = rootStore;
    this._requests = {
      auth: this._rootStore.apiStore.createRequest({ ...ENDPOINTS.auth }),
      refresh: this._rootStore.apiStore.createRequest({ ...ENDPOINTS.refreshToken }),
      setFederalDistrict: this._rootStore.apiStore.createRequest({
        ...ENDPOINTS.setFederalDistrict,
      }),
    };

    makeObservable(this, {
      user: computed,
    });
  }

  get user(): null | UserServer {
    return this._user.value;
  }

  get hasSelectedRegion(): boolean {
    return Boolean(this._user.value?.region);
  }

  readonly init = async (): Promise<boolean> => {
    if (USE_MOCKS) {
      this._user.changeValue(MOCK_USER);

      return true;
    }

    const response = await this._auth();

    if (response.isError) {
      return false;
    }

    return true;
  };

  private readonly _auth = async (): Promise<DefaultResponse> => {
    const params = createUrlParams(this._rootStore.appParamsStore.search);

    const res = await this._requests.auth.fetchRefresh({
      params,
      withoutSnackbar: true,
    });

    if (res.isError) {
      return res;
    }

    this._rootStore.apiStore.setAuthToken(res.data.accessToken);

    const user = parseJwt(res.data.accessToken);

    if (user) {
      console.log('Регион:', user.region);

      this._user.changeValue(user);
    }

    if (this.timerId) {
      clearInterval(this.timerId);
    }

    this.timerId = setInterval(() => {
      void this.refreshAuth();
    }, REFRESH_AUTH_INTERVAL);

    return res;
  };

  refreshAuth = async (isDuble = false): Promise<DefaultResponse | undefined> => {
    if (USE_MOCKS) {
      return;
    }

    // console.log('skipRefresh', this._requests.refresh.skipRefresh);
    if (this._requests.refresh.skipRefresh) {
      return;
    }

    // Сначала удаляем устаревший токен
    delete this._requests.refresh.axiosInstance.defaults.headers.common.Authorization;

    const res = await (isDuble
      ? this._requests.refresh.fetchRefresh({ withoutSnackbar: true })
      : this._requests.refresh.fetch({ withoutRefresh: true, withoutSnackbar: true }));

    console.log('refreshAuth isError', res.isError);

    if (res.isError) {
      return res;
    }

    this._rootStore.apiStore.setAuthToken(res.data.accessToken);

    return res;
  };

  setFederalDistrict = async (federalDistrict: FederalDistrictEnum): Promise<boolean> => {
    if (this._requests.setFederalDistrict.isLoading) {
      return false;
    }

    const res = await this._requests.setFederalDistrict.fetch({
      url: `${ENDPOINTS.setFederalDistrict.url}/${federalDistrict}`,
      data: {},
    });

    if (res.isError) {
      return false;
    }

    if (this._user.value) {
      this._user.changeValue({ ...this._user.value, region: federalDistrict });
    }

    this._rootStore.apiStore.setAuthToken(res.data.accessToken);

    void this._rootStore.statsStore.sendChooseRegion();

    return true;
  };

  resetFederalDistrict = async (): Promise<boolean> => {
    if (this._requests.setFederalDistrict.isLoading || !this._rootStore.appParamsStore.isDev) {
      return false;
    }

    const res = await this._requests.setFederalDistrict.fetch({
      url: `${ENDPOINTS.setFederalDistrict.url}/null`,
    });

    if (res.isError) {
      return false;
    }

    if (this._user.value) {
      this._user.changeValue({ ...this._user.value, region: null });
    }

    this._rootStore.uiStore.snackbar.openSnackbarMessage({
      text: 'Федеральный округ успешно сброшен',
      goal: SnackbarMessageGoalsEnum.success,
    });

    return true;
  };

  destroy = () => {
    Object.values(this._requests).forEach((item) => item.destroy());

    if (this.timerId) {
      clearInterval(this.timerId);

      this.timerId = null;
    }
  };
}
