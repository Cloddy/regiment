import vkBridge, {
  EGetLaunchParamsResponsePlatforms,
  parseURLSearchParamsForGetLaunchParams,
} from '@vkontakte/vk-bridge';
import { useAdaptivity, useAppearance } from '@vkontakte/vk-bridge-react';
import { ConfigProvider, AdaptivityProvider, useAdaptivityWithJSMediaQueries } from '@vkontakte/vkui';
import * as React from 'react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';

import { getMiniAppRuntime } from 'bridge/runtime';
import { app } from 'config/app';
import { RootLayoutPage } from 'pages/RootLayoutPage';
import { useAppParamsStore } from 'store/hooks';
import { transformVKBridgeAdaptivity } from 'utils/vk';

type RouterType = typeof MemoryRouter | typeof BrowserRouter;

/**
 * VK Mini Apps: адаптивность и тема из VK Bridge.
 * @see https://vkcom.github.io/VKUI/#/integrations-vk-mini-apps
 */
const AppVk: React.FC = () => {
  const { isOdr, search } = useAppParamsStore();

  const Router: RouterType = isOdr ? MemoryRouter : BrowserRouter;

  const vkAppearance = useAppearance() ?? app.defaultAppearance;
  const appearance = app.withVkAppearance ? vkAppearance : app.defaultAppearance;
  const { vk_platform: vkPlatform } = parseURLSearchParamsForGetLaunchParams(search);
  const vkBridgeAdaptivityProps = transformVKBridgeAdaptivity(useAdaptivity());

  return (
    <ConfigProvider
      appearance={appearance}
      platform={vkPlatform === EGetLaunchParamsResponsePlatforms.DESKTOP_WEB ? 'vkcom' : undefined}
      isWebView={vkBridge.isWebView()}
      transitionMotionEnabled
      hasCustomPanelHeaderAfter={!app.isInternal}
    >
      <AdaptivityProvider {...vkBridgeAdaptivityProps}>
        <Router>
          <RootLayoutPage />
        </Router>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

/**
 * MAX: без VK Bridge React — адаптивность через media queries VKUI.
 */
const AppMax: React.FC = () => {
  const { isOdr } = useAppParamsStore();
  const Router: RouterType = isOdr ? MemoryRouter : BrowserRouter;
  const adaptivityProps = useAdaptivityWithJSMediaQueries();

  return (
    <ConfigProvider
      appearance={app.defaultAppearance}
      isWebView
      transitionMotionEnabled
      hasCustomPanelHeaderAfter={!app.isInternal}
    >
      <AdaptivityProvider {...adaptivityProps}>
        <Router>
          <RootLayoutPage />
        </Router>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  return getMiniAppRuntime() === 'max' ? <AppMax /> : <AppVk />;
};

export default App;
