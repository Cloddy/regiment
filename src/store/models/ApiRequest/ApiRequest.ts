import type { ApiCallArgs, ApiCallResponse, ApiRequestParams } from '@kts-front/call-api';
import { ApiRequest as BaseApiRequest } from '@kts-front/call-api';
import { FieldModel } from '@ktsstudio/mediaproject-stores';
import type { AxiosResponse } from 'axios';
import { action, computed, makeObservable, observable } from 'mobx';

import { PanelEnum } from 'config/routes/enums';
import { DefaultErrorResponse, ExtendedErrorResponse } from 'entities/api';
import { isTokenExpired } from 'store/globals/api/utils';
import { RootStoreType } from 'store/globals/root';
import reportAPIException from 'store/utils/reportAPIException';

export default class ApiRequest<
  ResponseData,
  ErrorResponse extends AxiosResponse = DefaultErrorResponse,
> extends BaseApiRequest<ResponseData, ErrorResponse> {
  readonly tokenExpired = new FieldModel<boolean>(false);

  refresh401Count = 0;

  get skipRefresh() {
    // console.log('this.refresh401Count', this.refresh401Count);
    return this.refresh401Count >= 2;
  }

  constructor(
    params: ApiRequestParams,
    private readonly _rootStore: RootStoreType
  ) {
    super(params);

    makeObservable(this, {
      skipRefresh: computed,
      refresh401Count: observable,
      fetch: action,
      fetchRefresh: action,
    });
  }

  fetch = async <
    T extends ResponseData = ResponseData,
    E extends ErrorResponse = ErrorResponse,
    R extends Record<string, unknown> | FormData = Record<string, unknown>,
  >(
    params?: Partial<ApiCallArgs<R>> & {
      mockResponse?: ApiCallResponse<T, E>;
      withoutRefresh?: boolean;
      withoutSnackbar?: boolean;
      isAuth?: boolean;
    }
  ): Promise<ApiCallResponse<T, E>> => {
    let response = await this.call<T, E, R>({
      ...params,
      config: {
        ...params?.config,
        withCredentials: true,
      },
    });

    console.log('fetch', params, response);

    // Если ошибка авторизации, пробуем авторизоваться и повторить запрос еще раз
    // @ts-ignore
    if (response.isError && isTokenExpired<T, E>(response)) {
      this.tokenExpired.changeValue(true);

      // если упал рефреш -> вызываем автризацию
      if (params?.withoutRefresh) {
        this.changeRefresh401Count();
        const authResponse = await this._rootStore.userStore.init();

        if (authResponse) {
          response = await this.call<T, E, R>({
            ...params,
            config: {
              ...params?.config,
              withCredentials: true,
            },
          });

          if (response.isError) {
            this.changeRefresh401Count();
          }

          this.tokenExpired.changeValue(false);
        } else {
          this.changeRefresh401Count();
          this._rootStore.historyStore.replace({ panel: PanelEnum.error });

          return { isError: true };
        }
      } else {
        console.log('this.skipRefresh', this.skipRefresh, this.refresh401Count);

        if (this.skipRefresh) {
          const authResponse = await this._rootStore.userStore.init();

          if (authResponse) {
            // если авторизация ок , вызываем метод
            response = await this.call<T, E, R>({
              ...params,
              config: {
                ...params?.config,
                withCredentials: true,
              },
            });

            this.tokenExpired.changeValue(false);
          } else {
            this._rootStore.historyStore.replace({ panel: PanelEnum.error });

            return { isError: true };
          }
        } else {
          // если упал другой метод -> вызываем сначала рефреш
          const refetchResponse = await this._rootStore.userStore.refreshAuth(true);

          console.log('refetchResponse', refetchResponse);

          // если рефреш упал -> вызываем авторизацию
          if (refetchResponse === undefined || refetchResponse?.isError) {
            this.changeRefresh401Count();
            const authResponse = await this._rootStore.userStore.init();

            if (authResponse) {
              // если авторизация ок , вызываем метод
              response = await this.call<T, E, R>({
                ...params,
                config: {
                  ...params?.config,
                  withCredentials: true,
                },
              });

              this.tokenExpired.changeValue(false);
            } else {
              this._rootStore.historyStore.replace({ panel: PanelEnum.error });

              return { isError: true };
            }
          } else {
            // если рефреш ок, вызываем метод
            response = await this.call<T, E, R>({
              ...params,
              config: {
                ...params?.config,
                withCredentials: true,
              },
            });

            this.tokenExpired.changeValue(false);
          }
        }
      }
    }

    if (response.isError && !(response as ExtendedErrorResponse).isCancelled) {
      reportAPIException(response, { url: params?.url });

      if (!params?.withoutSnackbar) {
        this._rootStore.uiStore.snackbar.triggerDefaultErrorMessage();
      }
    }

    return response;
  };

  fetchRefresh = async <
    T extends ResponseData = ResponseData,
    E extends ErrorResponse = ErrorResponse,
    R extends Record<string, unknown> | FormData = Record<string, unknown>,
  >(
    params?: Partial<ApiCallArgs<R>> & {
      mockResponse?: ApiCallResponse<T, E>;
      withoutRefresh?: boolean;
      withoutSnackbar?: boolean;
    }
  ): Promise<ApiCallResponse<T, E>> => {
    const response = await this.call<T, E, R>({
      ...params,
      config: {
        ...params?.config,
        withCredentials: true,
      },
    });

    console.log('fetchRefresh', params, response);

    // @ts-ignore
    if (response.isError && isTokenExpired<T, E>(response)) {
      console.log('AUTH 401');
      this.changeRefresh401Count();
    }

    if (response.isError && !(response as ExtendedErrorResponse).isCancelled) {
      reportAPIException(response, { url: params?.url });

      // @ts-ignore
      if (!params?.withoutSnackbar) {
        this._rootStore.uiStore.snackbar.triggerDefaultErrorMessage();
      }
    }

    return response;
  };

  changeRefresh401Count = () => {
    this.refresh401Count += 1;
  };
}
