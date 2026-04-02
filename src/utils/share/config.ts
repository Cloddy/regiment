import { DrawImageConfig } from './types';

export const config: DrawImageConfig = {
  stage: {
    width: 1080,
    height: 1920,
  },
  // фото героя
  photo: {
    x: 15,
    y: 15,
    width: 555,
    height: 735,
  },
  // фон
  background: {
    x: 0,
    y: 0,
    width: 1080,
    height: 1920,
  },
  // фамилия
  lastName: {
    y: 807,
    fontSize: 37,
    align: 'center',
    verticalAlign: 'middle',
    fontFamily: 'Merriweather',
    fontStyle: 'bold',
    lineHeight: 1.2,
    fill: '#C62B34',
  },
  // имя отчество (если есть)
  name: {
    y: 858,
    fontSize: 32,
    align: 'center',
    verticalAlign: 'middle',
    padding: 1,
    lineHeight: 1.2,
    fontFamily: 'Golos Text',
    fontStyle: 'normal',
    fill: '#202020',
  },
  // годы жизни (если есть)
  dates: {
    x: 15,
    y: 950,
    width: 585,
    fontSize: 28,
    align: 'center',
    verticalAlign: 'middle',
    fontFamily: 'Golos Text',
    fontStyle: 'normal',
    fill: '#666666',
  },
  // прямоугольник для войск (если есть)
  rectMilitaryBranch: {
    x: 117,
    y: 710,
    // width: 350,
    height: 74,
  },
  militaryBranch: {
    x: 117,
    y: 729,
    fontSize: 32,
    align: 'center',
    verticalAlign: 'middle',
    padding: 1,
    lineHeight: 1.2,
    fontFamily: 'Golos Text',
    fontStyle: 'normal',
    fill: '#5B4519',
  },
  whiteRect: {
    x: 0,
    y: 0,
    width: 585,
    height: 990, // будет меняться, без войск 1027 - 37
    fill: '#FAFAFA',
    stroke: '#E8E2E4',
    strokeWidth: 1,
    cornerRadius: 12,
  },
};
