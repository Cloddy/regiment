import { LinkProps } from 'react-router-dom';

import { PanelEnum } from 'config/routes/enums';
import { ROUTES } from 'config/routes/routes';

import { LinkPayloadType, PanelStatesMapType } from './types';

// билдит урл текущий страницы, получая вьюшку текущей панели из конфига
export const buildVKPathname = (panel: PanelEnum): string => `/${ROUTES[panel].view}/${panel}`;

// билдит объект для передачи в Link, чтобы работал переход по ссылке
export const buildLinkPayload = <PanelT extends PanelEnum>({
  panel,
  state,
  replace = false,
}: LinkPayloadType<PanelT>): Pick<LinkProps, 'to' | 'state' | 'replace'> => ({
  to: buildVKPathname(panel),
  state,
  replace,
});

export const getInitialStateCash = (): PanelStatesMapType =>
  Object.values(PanelEnum).reduce((state, currentPanel: PanelEnum) => {
    return {
      ...state,
      [currentPanel]: {},
    };
  }, {} as PanelStatesMapType);
