import { HeroFieldsEnum } from 'config/heroFields';
import { HeroServer } from 'entities/hero';

export type ScrollCallbackType = (field: HeroFieldsEnum) => void;

export type UploadImageResponse = {
  id: string;
  url: string;
};

export type HeroResponse = {
  hero: HeroServer;
};

export type DeleteHeroResponse = {
  id: string;
};

export type MilitaryUnitType = {
  id: string;
  value: string;
};
