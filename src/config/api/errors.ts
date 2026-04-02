export enum ApiErrorEnum {
  tokenExpired = 'token-expired',
}

export const API_ERROR_CONFIG: Record<ApiErrorEnum, { status?: number; message?: string }> = {
  [ApiErrorEnum.tokenExpired]: {
    status: 401,
    message: 'Invalid token',
  },
};
