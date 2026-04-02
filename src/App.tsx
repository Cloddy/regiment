import vkBridge, {
  EGetLaunchParamsResponsePlatforms,
  parseURLSearchParamsForGetLaunchParams,
} from '@vkontakte/vk-bridge';
import { useAdaptivity, useAppearance } from '@vkontakte/vk-bridge-react';
import { ConfigProvider, AdaptivityProvider } from '@vkontakte/vkui';
import * as React from 'react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';

import { app } from 'config/app';
import { RootLayoutPage } from 'pages/RootLayoutPage';
import { useAppParamsStore } from 'store/hooks';
import { transformVKBridgeAdaptivity } from 'utils/vk';

type RouterType = typeof MemoryRouter | typeof BrowserRouter;

/**
 * Интеграция с VK Mini Apps
 * @see https://vkcom.github.io/VKUI/#/integrations-vk-mini-apps
 */
const App: React.FC = () => {
  const { isOdr, search } = useAppParamsStore();

  const Router: RouterType = isOdr ? MemoryRouter : BrowserRouter;

  const vkAppearance = useAppearance() ?? app.defaultAppearance;
  const appearance = app.withVkAppearance ? vkAppearance : app.defaultAppearance;
  const { vk_platform: vkPlatform } = parseURLSearchParamsForGetLaunchParams(search);
  // Конвертируем значения из VK Bridge в параметры AdaptivityProvider
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

export default App;
