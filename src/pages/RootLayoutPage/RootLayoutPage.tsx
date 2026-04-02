import { useInsets } from '@vkontakte/vk-bridge-react';
import { AppRoot, View, Root as VKRoot, SplitLayout } from '@vkontakte/vkui';
import { observer } from 'mobx-react';
import * as React from 'react';

import { ErrorFallback, VKPanel, LoaderPage, Snackbar } from 'components/special';
import { ROUTES } from 'config/routes/routes';
import { useDateTimer } from 'store/globals/timer';
import { useHistoryStore, useRootStoreInit, useUIStore } from 'store/hooks';
import { useUpdateViewSettings } from 'utils/hooks/useUpdateViewSettings';
import { useSetHistory, useVKViews } from 'utils/router';

const RootLayoutPage: React.FC = () => {
  useSetHistory();
  useUpdateViewSettings();

  const vkBridgeInsets = useInsets();
  const views = useVKViews();
  const { appState } = useRootStoreInit();
  const { popout } = useUIStore();
  const {
    view: activeView,
    panel: activePanel,
    goBack,
    swipeBackHistory,
    getActivePanelByView,
  } = useHistoryStore();

  useDateTimer();

  if (appState.loadedWithError) {
    return <ErrorFallback />;
  }

  if (!appState.loadedSuccessfully || !activeView || !activePanel) {
    return <LoaderPage />;
  }

  return (
    // про режимы подключения: https://vkcom.github.io/VKUI/#/Modes
    // параметры mode="embedded" scroll="contain" используем для работы свайпбэка
    <SplitLayout popout={popout.node}>
      <AppRoot mode="embedded" scroll="contain" safeAreaInsets={vkBridgeInsets ?? undefined}>
        <VKRoot activeView={activeView}>
          {views.map(([view, viewPanels]) => (
            <View
              key={view}
              id={view}
              activePanel={getActivePanelByView(view)}
              history={swipeBackHistory}
              onSwipeBack={goBack}
            >
              {viewPanels.map((panel) => {
                const { Component, ...componentProps } = ROUTES[panel];

                return (
                  <VKPanel key={panel} id={panel} {...componentProps}>
                    <Component />
                  </VKPanel>
                );
              })}
            </View>
          ))}
        </VKRoot>
        <Snackbar />
      </AppRoot>
    </SplitLayout>
  );
};

export default observer(RootLayoutPage);
