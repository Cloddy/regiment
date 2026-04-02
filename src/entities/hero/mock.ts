import { MilitaryBranchEnum } from 'config/militaryBranch';
import { PrecisionDateEnum } from 'config/precisionDate';
import { StatusEnum } from 'config/statuses';
import { DeclineReasonTypeEnum } from 'entities/declineReason';

import { HeroServer } from './server';

export const MOCK_HERO: HeroServer = {
  id: '1',
  firstName: 'Константин',
  lastName: 'Константинопольский',
  middleName: 'Константинович',
  photo:
    'https://bpo-dev-files.obs.ru-moscow-1.hc.sbercloud.ru/bpo-dev-files/dp5YXIVCE7DNyDgBGEs7ygMqveYKGwM7.jpg',
  isAlive: false,
  birth: {
    date: '1925-01-01',
    precision: PrecisionDateEnum.DAY,
  },
  death: { date: '1945-05-01', precision: PrecisionDateEnum.MONTH },
  militaryBranch: MilitaryBranchEnum.ARTILLERY,
  status: StatusEnum.APPROVED,
  rejectionReasons: [DeclineReasonTypeEnum.INVALID_HERO_PHOTO],
};

export const MOCK_HEROES: HeroServer[] = [
  MOCK_HERO,
  {
    ...MOCK_HERO,
    id: '2',
    firstName: 'Иваниваниваниваниван',
    lastName: 'Ивановиваниваниваниваниван',
    middleName: 'Ивановичвановичванович',
    birth: {
      date: '1925-01-01',
      precision: PrecisionDateEnum.DAY,
    },
    isAlive: false,
    status: StatusEnum.REJECTED,
    rejectionReasons: [DeclineReasonTypeEnum.TYPO_IN_NAME],
  },
  {
    ...MOCK_HERO,
    id: '3',
    photo: '',
    birth: {
      date: '1925-01-01',
      precision: PrecisionDateEnum.DAY,
    },
    death: { date: '1945-05-09', precision: PrecisionDateEnum.DAY },
    isAlive: false,
    status: StatusEnum.UNDER_REVIEW,
  },
];
