import type { FontProps } from './types';

export const FONTS: FontProps[] = [
  {
    name: 'Golos Text',
    genericFamily: 'sans-serif',
    basePath: 'static/fonts/GolosText/GolosText',
    variants: [
      {
        fileNamePostfix: '-Regular',
        weight: 400,
      },
      {
        fileNamePostfix: '-Medium',
        weight: 500,
      },
      {
        fileNamePostfix: '-SemiBold',
        weight: 600,
      },
    ],
    formats: ['woff2'],
    display: 'swap',
  },
  {
    name: 'Merriweather',
    genericFamily: 'serif',
    basePath: 'static/fonts/Merriweather/Merriweather',
    variants: [
      {
        fileNamePostfix: '-Regular',
        weight: 400,
      },
      {
        fileNamePostfix: '-Bold',
        weight: 700,
      },
      {
        fileNamePostfix: '-Black',
        weight: 900,
      },
    ],
    formats: ['woff2'],
    display: 'swap',
  },
  {
    name: 'Roboto',
    genericFamily: 'serif',
    basePath: 'static/fonts/Roboto/Roboto',
    variants: [
      {
        fileNamePostfix: '-Regular',
        weight: 400,
      },
    ],
    formats: ['woff2'],
    display: 'swap',
  },
  {
    name: 'Roboto Serif',
    genericFamily: 'serif',
    basePath: 'static/fonts/RobotoSerif/RobotoSerif',
    variants: [
      {
        fileNamePostfix: '-Regular',
        weight: 400,
      },
      {
        fileNamePostfix: '-SemiBold',
        weight: 600,
      },
    ],
    formats: ['woff2'],
    display: 'swap',
  },
];
