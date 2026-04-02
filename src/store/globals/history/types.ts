import { ModalEnum, PanelEnum, ViewEnum } from 'config/routes/enums';

export interface BaseStateType {
  modal?: ModalEnum;
}

export type PanelStatesMapType = {
  // Проверка на наличие типов для всех панелей
  [T in PanelEnum]: {
    [PanelEnum.start]: { deletePayload: string } & BaseStateType;
    [PanelEnum.form]: {
      deletePayload?: string;
      isEdit?: boolean;
      heroId?: string;
    } & BaseStateType;
    [PanelEnum.heroes]: { deletePayload: string } & BaseStateType;
    [PanelEnum.error]: { deletePayload: string } & BaseStateType;
  }[T];
};

export interface PushOrReplaceParamsType<PanelT extends PanelEnum> {
  panel?: PanelEnum;
  modal?: ModalEnum;
  state?: PanelStatesMapType[PanelT];
}

export interface LinkPayloadType<PanelT extends PanelEnum> {
  panel: PanelEnum;
  modal?: ModalEnum;
  state?: PanelStatesMapType[PanelT];
  replace?: boolean;
}

export interface LocationType {
  view: ViewEnum | null;
  panel: PanelEnum | null;
  modal: ModalEnum | null;
  state: PanelStatesMapType;
}
