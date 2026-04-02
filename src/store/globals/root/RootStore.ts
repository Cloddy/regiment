import { RootStore as BaseRootStore } from '@ktsstudio/mediaproject-stores';
import { loadImages } from '@ktsstudio/mediaproject-utils';
import { type NavigateFunction } from 'react-router';

import IMAGES from 'assets/images';
import { ENDPOINTS } from 'config/api';
import { PanelEnum } from 'config/routes/enums';
import { ROUTES_CONFIG } from 'config/routes/routes';
import { AppStateModel } from 'store/models/AppStateModel';
import { initStoreContext } from 'utils/initStoreContext';

import { ApiStore } from '../api';
import { AppParamsStore } from '../appParams';
import { HeroesStore } from '../heroes';
import { HistoryStore } from '../history';
import { StatsStore } from '../stats';
import { StorageStore } from '../storage';
import { TimerStore } from '../timer';
import { UIStore } from '../ui';
import { UserStore } from '../user';

type RootStoreInitProps = {
  navigate: NavigateFunction;
};

class RootStore extends BaseRootStore {
  private _isFirstInit = true;

  readonly appState = new AppStateModel();

  readonly appParamsStore = new AppParamsStore();

  readonly apiStore = new ApiStore(this);
  readonly historyStore = new HistoryStore(this);
  readonly uiStore = new UIStore(this);
  readonly userStore = new UserStore(this);
  readonly storageStore = new StorageStore(this);
  readonly heroesStore = new HeroesStore(this);
  readonly statsStore = new StatsStore(this);
  readonly timerStore = new TimerStore(this);

  constructor() {
    super(ENDPOINTS);

    void this.statsStore.sendLaunch();
  }

  readonly reload = () => {
    this._replaceToDefaultPanel();
    this.appState.reset();
  };

  readonly init = async (initProps: RootStoreInitProps): Promise<boolean> => {
    if (!this.appState.initial) {
      return true;
    }

    this.appState.setLoading();

    const results = await Promise.all(this._getInitTasks(initProps));

    console.log('results', results);
    let heroesInit = false;

    if (results[results.length - 1] !== false) {
      heroesInit = await this.heroesStore.init();
    }

    const success = [...results, heroesInit].every((ok) => ok);

    if (success) {
      this.appState.setLoadedSuccessfully();
    } else {
      this.appState.setLoadedWithError();
    }

    this._replaceToDefaultPanel();

    return success;
  };

  private readonly _getInitTasks = (initProps: RootStoreInitProps): Promise<boolean>[] => {
    const tasks: Promise<boolean>[] = [];

    if (this._isFirstInit) {
      tasks.push(this._firstInit());
      this._isFirstInit = false;
    }

    tasks.push(this.historyStore.init(initProps.navigate));
    tasks.push(this.userStore.init());

    return tasks;
  };

  private readonly _firstInit = async (): Promise<boolean> => {
    await loadImages(IMAGES);

    return true;
  };

  private readonly _replaceToDefaultPanel = () => {
    this.historyStore.replace({
      panel: this.heroesStore.hasAtLeastOneHero ? PanelEnum.heroes : ROUTES_CONFIG.defaultPanel,
    });
  };

  readonly destroy = (): void => {
    this.historyStore.destroy();
    this.userStore.destroy();
  };
}

export type RootStoreType = RootStore;

export const {
  store: rootStore,
  StoreContext: RootStoreContext,
  StoreProvider: RootStoreProvider,
  useStoreContext: useRootStore,
} = initStoreContext(() => new RootStore(), 'rootStore');
