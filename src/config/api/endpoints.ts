import { type EndpointType } from '@ktsstudio/mediaproject-stores';

import { IS_DEV } from 'config/env';

import { API_URL, STAT_API_URL_DEV, STAT_API_URL_PROD } from './apiUrl';

const createApiEndpoint = (path: string, method: EndpointType['method'] = 'GET'): EndpointType => ({
  url: `${API_URL}${path}`,
  method,
});

const createStatApiEndpoint = (
  path: string,
  method: EndpointType['method'] = 'GET'
): EndpointType => ({
  url: `${IS_DEV ? STAT_API_URL_DEV : STAT_API_URL_PROD}${path}`,
  method,
});

export const ENDPOINTS = {
  /** методы Сбера */
  /** методы для авторизации */
  auth: createApiEndpoint('public-auth/open/miniapp-auth', 'GET'), // request: vk_client (vk/ok), и остальные. response: accessToken
  refreshToken: createApiEndpoint('public-auth/open/refresh', 'GET'), // response: accessToken Каждые 9 минут 55 секунд нужно рефрешить
  /** Мок параметра sign для локальной разработки */
  getTokenLocal: createApiEndpoint('public-auth/open/miniapp-auth-get-dev-sign', 'POST'), // request: sign

  /** метод для федерального округа */
  setFederalDistrict: createApiEndpoint('public-auth/public/set-region', 'PUT'),

  /** методы для героя */
  getHeroList: createApiEndpoint('hero/public/list', 'GET'),
  getHero: createApiEndpoint('hero/public/get', 'GET'), // /id
  createHero: createApiEndpoint('hero/public/create', 'POST'),
  updateHero: createApiEndpoint('hero/public/update', 'PUT'), // /id
  deleteHero: createApiEndpoint('hero/public/delete', 'DELETE'), // /id
  getMilitaryUnits: createApiEndpoint('hero/open/ww2heroes/v2/warunit/suggest', 'GET'), // q

  /**  методы для фото героя */
  uploadPhotoHero: createApiEndpoint('file/public/upload', 'POST'), // request: multipart/form-data
  getPhotoInfo: createApiEndpoint('file/open/info', 'GET'), // id

  /** методы для статистики */
  sendOkStat: createStatApiEndpoint('stats/vk_custom_events', 'POST'),
} as const;
