import { API_ERROR_CONFIG, ApiErrorEnum } from 'config/api/errors';

type ErrorResponse<T> = {
  data: T & { status: number };
};

export const isTokenExpired = <T, E extends ErrorResponse<T>>(error?: E) => {
  console.log('isTokenExpired', error);

  if (error && error?.data) {
    const { status } = API_ERROR_CONFIG[ApiErrorEnum.tokenExpired];

    return error.data.status === status;
  }

  return false;
};
