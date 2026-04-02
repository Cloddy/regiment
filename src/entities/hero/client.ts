import { MilitaryBranchEnum } from 'config/militaryBranch';
import { PrecisionDateEnum } from 'config/precisionDate';
import { StatusEnum } from 'config/statuses';
import { DeclineHeroReasonType } from 'entities/declineReason';
import { ImageFormField } from 'store/models/FormFieldModel/types';

export type DateClient = {
  date: string;
  precision: PrecisionDateEnum;
};

export type HeroPreview = {
  firstName: string;
  lastName: string;
  middleName: string;
  fileId: string;
  birth: DateClient;
  death: DateClient;
  isAlive: boolean;
  militaryBranch?: MilitaryBranchEnum;
  militaryUnit?: string;
  militaryUnitId?: string;
};

export type Hero = HeroPreview & {
  id: string;
  status: StatusEnum;
  declineHeroReasons: DeclineHeroReasonType[];
  photo: string;
};

export type HeroCardPreview = {
  id: string;
  fullName: string;
  photo: string;
  militaryBranch?: MilitaryBranchEnum;
  militaryUnit?: string;
  birthday: string;
  deathDate: string;
  alive: boolean;
  status: StatusEnum;
  firstName: string;
  lastName: string;
  middleName: string;
};

export type HeroImageField = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  deathDate: string;
  birthday: string;
  alive: boolean;
  photoField: ImageFormField;
  militaryBranch?: MilitaryBranchEnum;
  resetErrorMessage: VoidFunction;
};
