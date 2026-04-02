import { AxiosResponse } from 'axios';

export interface ExtendedErrorResponse {
  isError: true;
  isCancelled: boolean;
}

export type ErrorResponse = {
  code: string;
} & AxiosResponse;

export type DefaultErrorResponse = AxiosResponse<{ error: { message: string } }>;
