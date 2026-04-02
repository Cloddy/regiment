import { type ApiCallResponse } from '@kts-front/call-api';
import {
  type APIErrorDataType,
  captureAPIException,
  APIExceptionType,
} from '@ktsstudio/mediaproject-stores';
import { type AxiosResponse } from 'axios';

export default (
  errorResponse: ApiCallResponse<unknown, AxiosResponse<any, any>>,
  params?: { payload?: APIExceptionType['payload']; url?: string }
): void => {
  if (!errorResponse.isError) {
    return;
  }

  let error: unknown = errorResponse.data;
  let errorData: APIErrorDataType = { code: '', message: '', status: '' };
  const { payload, url = '' } = params ?? {};

  if ('rawError' in errorResponse) {
    const { code = '', message = '' } = errorResponse.rawError;
    const { statusText: status = '' } = errorResponse.data ?? {};

    error = errorResponse.rawError;
    errorData = { code, message, status };
  }

  captureAPIException({ error, errorData, url: url, payload });
};
