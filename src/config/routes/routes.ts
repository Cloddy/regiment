import { ErrorFallback } from 'components/special';
import { FormPage } from 'pages/FormPage';
import { HeroesPage } from 'pages/HeroesPage';
import StartPage from 'pages/StartPage';

import { PanelEnum, ViewEnum } from './enums';
import { VKRoutesRecord, VKRoutesConfig } from './types';

export const ROUTES: VKRoutesRecord = {
  [PanelEnum.start]: {
    panel: PanelEnum.start,
    view: ViewEnum.main,
    Component: StartPage,
  },
  [PanelEnum.form]: {
    panel: PanelEnum.form,
    view: ViewEnum.main,
    Component: FormPage,
  },
  [PanelEnum.heroes]: {
    panel: PanelEnum.heroes,
    view: ViewEnum.main,
    Component: HeroesPage,
  },
  [PanelEnum.error]: {
    panel: PanelEnum.error,
    view: ViewEnum.main,
    Component: ErrorFallback,
  },
};

export const ROUTES_CONFIG: VKRoutesConfig = {
  routes: ROUTES,
  defaultPanel: PanelEnum.start,
  initialActivePanels: {
    [ViewEnum.main]: PanelEnum.start,
  },
};
