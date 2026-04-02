import * as React from 'react';

import { PanelEnum, ViewEnum } from 'config/routes/enums';
import { ROUTES } from 'config/routes/routes';
import { VKRouteType } from 'config/routes/types';

/**
 * получение списка вьюшек со списком панелей для каждой
 * возвращает массив пар, где первое значение - вьюшка, а второе - массив панелей вьюшки
 * формат возвращаемых данных - [view, viewPanels][]
 */
export const useVKViews = (): [ViewEnum, PanelEnum[]][] => {
  const [views] = React.useState(() =>
    Object.entries(
      Object.values(ROUTES).reduce(
        (viewRoutes, { panel, view }: VKRouteType) => ({
          ...viewRoutes,
          [view]: viewRoutes[view] ? [...viewRoutes[view], panel] : [panel],
        }),
        {} as Record<ViewEnum, PanelEnum[]>
      )
    )
  );

  return views as [ViewEnum, PanelEnum[]][];
};
