import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { fixActive } from '@ktsstudio/mediaproject-utils';
import * as React from 'react';
import { createRoot } from 'react-dom/client';

import '@vkontakte/vkui/dist/vkui.css';

import { RootStoreProvider, rootStore } from 'store/globals/root';
import { initMiniApp } from 'bridge/initMiniApp';
import { initSentry, initEruda, initMarkup } from 'utils/init';

import './styles/global.scss';

import App from './App';

const startApp = () => {
  initEruda(rootStore.appParamsStore.isDev);
  initSentry(rootStore.appParamsStore);
  initMiniApp(rootStore.appParamsStore);
  fixActive();

  requestAnimationFrame(() => {
    initMarkup(rootStore.appParamsStore.isMobile);
  });

  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <RootStoreProvider>
        <App />
      </RootStoreProvider>
    </React.StrictMode>
  );
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
