import { PrecisionDateEnum } from 'config/precisionDate';
import { StatusEnum } from 'config/statuses';
import { Hero } from 'entities/hero';

import { UploadImageResponse } from './types';

export const defaultForm: Hero = {
  firstName: '',
  lastName: '',
  middleName: '',
  photo: '',
  fileId: '',
  birth: {
    date: '',
    precision: PrecisionDateEnum.DAY,
  },
  death: {
    date: '',
    precision: PrecisionDateEnum.DAY,
  },
  isAlive: false,
  status: StatusEnum.UNDER_REVIEW,
  declineHeroReasons: [],
  militaryBranch: undefined,
  id: '0',
};

export const defaultBuffImage: UploadImageResponse = {
  url: '',
  id: '',
};
