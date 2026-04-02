import { MilitaryBranchEnum } from 'config/militaryBranch';
import { PrecisionDateEnum } from 'config/precisionDate';
import { StatusEnum } from 'config/statuses';
import { DeclineHeroReasonTypeServer } from 'entities/declineReason';

export type DateServer = {
  date: string;
  precision: PrecisionDateEnum;
};

export type HeroPreviewServer = {
  firstName: string;
  lastName: string;
  middleName?: string | null;
  fileId?: string | null;
  birth?: DateServer | null;
  death?: DateServer | null;
  isAlive?: boolean | null;
  militaryDivision?: string | null;
  militaryBranch?: MilitaryBranchEnum | null;
  militaryDivisionId?: number | null;
};

export type HeroServer = HeroPreviewServer & {
  id: string;
  status: StatusEnum;
  rejectionReasons: DeclineHeroReasonTypeServer[];
  photo?: string;
};
