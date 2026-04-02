import { ENDPOINTS } from './endpoints';

// TODO: Обновлять состояние готовности по эндпойнтам
export const API_READY_STATE: Record<keyof typeof ENDPOINTS, boolean> = {
  auth: true,
  refreshToken: true,
  getTokenLocal: false,
  setFederalDistrict: true,
  getHeroList: true,
  getHero: true,
  createHero: true,
  updateHero: true,
  deleteHero: true,
  uploadPhotoHero: true,
  getPhotoInfo: true,
  sendOkStat: true,
  getMilitaryUnits: true,
};
