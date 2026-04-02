// militaryBranch = [ GROUND_FORCES, CAVALRY, ARTILLERY, AIR_FORCE, NAVY, ARMORED_TROOPS, ENGINEERING_TROOPS, CHEMICAL_TROOPS, SIGNAL_TROOPS, RAILWAY_TROOPS, NKVD_TROOPS, AIR_DEFENSE_TROOPS, MILITARY_MEDICAL_SERVICE, AIRBORNE_TROOPS ]
// https://pastebin.vkpartner.ru/AkGcWlcZoZSwSBrMiHsL1VDtINuc6vG4uaOuinL6qkBc7A4EALTKt6EWuMFo67pGcrbnVddB1hVRwDg3.json
export enum MilitaryBranchEnum {
  GROUND_FORCES = 'GROUND_FORCES',
  CAVALRY = 'CAVALRY',
  ARTILLERY = 'ARTILLERY',
  AIR_FORCE = 'AIR_FORCE',
  NAVY = 'NAVY',
  ARMORED_TROOPS = 'ARMORED_TROOPS',
  ENGINEERING_TROOPS = 'ENGINEERING_TROOPS',
  CHEMICAL_TROOPS = 'CHEMICAL_TROOPS',
  SIGNAL_TROOPS = 'SIGNAL_TROOPS',
  RAILWAY_TROOPS = 'RAILWAY_TROOPS',
  NKVD_TROOPS = 'NKVD_TROOPS',
  AIR_DEFENSE_TROOPS = 'AIR_DEFENSE_TROOPS',
  MILITARY_MEDICAL_SERVICE = 'MILITARY_MEDICAL_SERVICE',
  AIRBORNE_TROOPS = 'AIRBORNE_TROOPS',
}

export const militaryBranches: Record<
  MilitaryBranchEnum,
  { id: MilitaryBranchEnum; title: string; shortTitle: string }
> = {
  [MilitaryBranchEnum.GROUND_FORCES]: {
    id: MilitaryBranchEnum.GROUND_FORCES,
    title: 'Сухопутные войска',
    shortTitle: 'Сухопутные войска',
  },
  [MilitaryBranchEnum.CAVALRY]: {
    id: MilitaryBranchEnum.CAVALRY,
    title: 'Кавалерийские части',
    shortTitle: 'Кавалерийские части',
  },
  [MilitaryBranchEnum.ARTILLERY]: {
    id: MilitaryBranchEnum.ARTILLERY,
    title: 'Артиллерийские войска',
    shortTitle: 'Артиллерийские войска',
  },
  [MilitaryBranchEnum.AIR_FORCE]: {
    id: MilitaryBranchEnum.AIR_FORCE,
    title: 'Военно-воздушные силы (ВВС)',
    shortTitle: 'ВВС',
  },
  [MilitaryBranchEnum.NAVY]: {
    id: MilitaryBranchEnum.NAVY,
    title: 'Военно-морской флот (ВМФ)',
    shortTitle: 'ВМФ',
  },
  [MilitaryBranchEnum.ARMORED_TROOPS]: {
    id: MilitaryBranchEnum.ARMORED_TROOPS,
    title: 'Автобронетанковые войска (АБТВ)',
    shortTitle: 'АБТВ',
  },
  [MilitaryBranchEnum.ENGINEERING_TROOPS]: {
    id: MilitaryBranchEnum.ENGINEERING_TROOPS,
    title: 'Инженерные войска',
    shortTitle: 'Инженерные войска',
  },
  [MilitaryBranchEnum.CHEMICAL_TROOPS]: {
    id: MilitaryBranchEnum.CHEMICAL_TROOPS,
    title: 'Химические войска',
    shortTitle: 'Химические войска',
  },
  [MilitaryBranchEnum.SIGNAL_TROOPS]: {
    id: MilitaryBranchEnum.SIGNAL_TROOPS,
    title: 'Войска связи',
    shortTitle: 'Войска связи',
  },
  [MilitaryBranchEnum.RAILWAY_TROOPS]: {
    id: MilitaryBranchEnum.RAILWAY_TROOPS,
    title: 'Железнодорожные войска',
    shortTitle: 'Железнодорожные войска',
  },
  [MilitaryBranchEnum.NKVD_TROOPS]: {
    id: MilitaryBranchEnum.NKVD_TROOPS,
    title: 'Войска НКВД (Народного комиссариата внутренних дел, Пограничные войска)',
    shortTitle: 'Войска НКВД',
  },
  [MilitaryBranchEnum.AIR_DEFENSE_TROOPS]: {
    id: MilitaryBranchEnum.AIR_DEFENSE_TROOPS,
    title: 'Войска противовоздушной обороны (ПВО)',
    shortTitle: 'Войска ПВО',
  },
  [MilitaryBranchEnum.MILITARY_MEDICAL_SERVICE]: {
    id: MilitaryBranchEnum.MILITARY_MEDICAL_SERVICE,
    title: 'Военно-медицинская служба',
    shortTitle: 'Военно-медицинская служба',
  },
  [MilitaryBranchEnum.AIRBORNE_TROOPS]: {
    id: MilitaryBranchEnum.AIRBORNE_TROOPS,
    title: 'Военно-воздушные войска (ВДВ)',
    shortTitle: 'ВДВ',
  },
};
