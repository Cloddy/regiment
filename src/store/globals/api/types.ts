import { BaseResponse } from '@kts-front/types';

export type DefaultResponse = Pick<BaseResponse, 'isError'>;

export enum LSKey {
  token = 'token',
}
