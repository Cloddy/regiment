import { FederalDistrictEnum } from 'config/federalDistricts';

import { UserServer } from './server';

/** Пользователь для локальной разработки без бэкенда (`USE_MOCKS=true`). */
export const MOCK_USER: UserServer = {
  id: 'mock-user',
  vkId: '1',
  region: FederalDistrictEnum.central,
};
