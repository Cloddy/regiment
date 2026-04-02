import {
  ApiRequestParams,
  ApiStore as BaseApiStore,
  HttpAuthorizationScheme,
} from '@kts-front/call-api';
import { FieldModel } from '@ktsstudio/mediaproject-stores';
import { AxiosResponse } from 'axios';

import { ApiRequest } from 'store/models/ApiRequest';

import { RootStoreType } from '../root';

export default class ApiStore extends BaseApiStore {
  readonly authToken = new FieldModel<string | null>(null);

  constructor(private readonly _rootStore: RootStoreType) {
    super({
      getAuthorizationCallback: () => {
        if (this.authToken.value) {
          return {
            scheme: HttpAuthorizationScheme.Bearer,
            data: this.authToken.value,
          };
        }

        return null;
      },
      useRealResponseData: true,
    });
  }

  override createRequest<ResponseData, ErrorResponse extends AxiosResponse = AxiosResponse>(
    requestParams: ApiRequestParams['requestParams'] = {}
  ): ApiRequest<ResponseData, ErrorResponse> {
    return new ApiRequest<ResponseData, ErrorResponse>(
      {
        requestParams,
        axiosInstance: this._axiosInstance,
      },
      this._rootStore
    );
  }

  readonly setAuthToken = (token: string | null): void => {
    this.authToken.changeValue(token);
  };
}
