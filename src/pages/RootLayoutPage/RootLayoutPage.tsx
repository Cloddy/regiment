import { useInsets } from '@vkontakte/vk-bridge-react';
import { AppRoot, View, Root as VKRoot, SplitLayout } from '@vkontakte/vkui';
import { observer } from 'mobx-react';
import * as React from 'react';

import { getMiniAppRuntime } from 'bridge/runtime';
import { ErrorFallback, VKPanel, LoaderPage, Snackbar } from 'components/special';
import { ROUTES } from 'config/routes/routes';
import { useDateTimer } from 'store/globals/timer';
import { useHistoryStore, useRootStoreInit, useUIStore } from 'store/hooks';
import { useUpdateViewSettings } from 'utils/hooks/useUpdateViewSettings';
import { useSetHistory, useVKViews } from 'utils/router';

type RootLayoutContentProps = {
  safeAreaInsets: React.ComponentProps<typeof AppRoot>['safeAreaInsets'];
};

const RootLayoutContent = observer((props: RootLayoutContentProps) => {
  const { safeAreaInsets } = props;
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
    <SplitLayout popout={popout.node}>
      <AppRoot mode="embedded" scroll="contain" safeAreaInsets={safeAreaInsets}>
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
});

const RootLayoutPageVk: React.FC = () => {
  useSetHistory();
  useUpdateViewSettings();

  const vkBridgeInsets = useInsets();

  return <RootLayoutContent safeAreaInsets={vkBridgeInsets ?? undefined} />;
};

const RootLayoutPageMax: React.FC = () => {
  useSetHistory();
  useUpdateViewSettings();

  return <RootLayoutContent safeAreaInsets={undefined} />;
};

const RootLayoutPage: React.FC = () => {
  return getMiniAppRuntime() === 'max' ? <RootLayoutPageMax /> : <RootLayoutPageVk />;
};

export default RootLayoutPage;
