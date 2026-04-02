export enum FederalDistrictEnum {
  central = 'central',
  northwestern = 'northwestern',
  southern = 'southern',
  northcaucasian = 'northcaucasian',
  volga = 'volga',
  ural = 'ural',
  siberian = 'siberian',
  fareastern = 'fareastern',
  historicregions = 'historicregions',
  foreigncountries = 'foreigncountries',
}

export type FederalDistrictType = { id: FederalDistrictEnum; title: string };

export const federalDistricts: Record<FederalDistrictEnum, FederalDistrictType> = {
  [FederalDistrictEnum.central]: {
    id: FederalDistrictEnum.central,
    title: 'Центральный федеральный округ',
  },
  [FederalDistrictEnum.northwestern]: {
    id: FederalDistrictEnum.northwestern,
    title: 'Северо-Западный федеральный округ',
  },
  [FederalDistrictEnum.southern]: {
    id: FederalDistrictEnum.southern,
    title: 'Южный федеральный округ',
  },
  [FederalDistrictEnum.northcaucasian]: {
    id: FederalDistrictEnum.northcaucasian,
    title: 'Северо-Кавказский федеральный округ',
  },
  [FederalDistrictEnum.volga]: {
    id: FederalDistrictEnum.volga,
    title: 'Приволжский федеральный округ',
  },
  [FederalDistrictEnum.ural]: {
    id: FederalDistrictEnum.ural,
    title: 'Уральский федеральный округ',
  },
  [FederalDistrictEnum.siberian]: {
    id: FederalDistrictEnum.siberian,
    title: 'Сибирский федеральный округ',
  },
  [FederalDistrictEnum.fareastern]: {
    id: FederalDistrictEnum.fareastern,
    title: 'Дальневосточный федеральный округ',
  },
  [FederalDistrictEnum.historicregions]: {
    id: FederalDistrictEnum.historicregions,
    title: 'Исторические регионы',
  },
  [FederalDistrictEnum.foreigncountries]: {
    id: FederalDistrictEnum.foreigncountries,
    title: 'Зарубежные страны',
  },
};

export const federalDistrictsArray: FederalDistrictType[] = Object.values(federalDistricts);
