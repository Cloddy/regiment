import Konva from 'konva';

import { HeroCardPreview } from 'entities/hero';

export type DrawProps = {
  callback: (b: Blob | null) => Promise<void>;
  id: string;
} & HeroCardPreview;

export type DrawImageConfig = {
  stage: Konva.StageConfig;
  photo: Omit<Konva.ImageConfig, 'image'>;
  background: Omit<Konva.ImageConfig, 'image'>;
  lastName: Konva.TextConfig;
  name: Konva.TextConfig;
  dates: Konva.TextConfig;
  rectMilitaryBranch: Omit<Konva.ImageConfig, 'image'>;
  militaryBranch: Konva.TextConfig;
  whiteRect: Konva.RectConfig;
};
