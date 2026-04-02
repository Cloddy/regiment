import { FederalDistrictEnum } from 'config/federalDistricts';

export type UserServer = {
  id: string;
  phone?: string;
  vkId?: string;
  okId?: string;
  sberId?: string;
  region: FederalDistrictEnum | null;
};
