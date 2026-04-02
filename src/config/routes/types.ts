import * as React from 'react';

import { PanelEnum, ViewEnum } from './enums';

export interface VKPanelConfigProps {
  /** @default false */
  fixedHeight?: boolean;
}

export interface VKRouteType {
  panel: PanelEnum;
  view: ViewEnum;
  Component: React.FC;
  config?: VKPanelConfigProps;
}

export type VKRoutesRecord = Record<PanelEnum, VKRouteType>;

export interface VKRoutesConfig {
  routes: VKRoutesRecord;
  defaultPanel: PanelEnum;

  /**
   * Начальные значения активных панелей каждой из вью.
   * Несильно важно, какие именно панели конкретной вью здесь будут указаны,
   * так как происходит слежение за историей и смена текущей активной панели
   */
  initialActivePanels: Record<ViewEnum, PanelEnum>;
}
