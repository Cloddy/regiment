import { DeclineReasonTypeEnum } from './common';

export type DeclineHeroReasonType = {
  id: DeclineReasonTypeEnum;
  description: string;
  visible: boolean;
};
