import { setVkSwipeBackEnabled } from 'bridge/swipeBack';
import { Action } from 'history';
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { NavigateFunction, Location } from 'react-router';

import { ViewEnum, PanelEnum, ModalEnum } from 'config/routes/enums';
import { ROUTES_CONFIG, ROUTES } from 'config/routes/routes';
import { type RootStoreType } from 'store/globals/root';
import { type IGlobalStore } from 'store/interfaces';

import { LocationType, PushOrReplaceParamsType, PanelStatesMapType } from './types';
import { buildVKPathname, getInitialStateCash } from './utils';

type PrivateFields =
  | '_navigateFunction'
  | '_location'
  | '_lastAction'
  | '_lastView'
  | '_historyArray'
  | '_stateCache'
  | '_activePanels'
  | '_fullLocation'
  | '_isFirstPanel'
  | '_uniqueHistoryArray'
  | '_navigate';

export class HistoryStore implements IGlobalStore {
  /**
   * Поля, которые берутся из хуков react-router
   */
  private _navigateFunction: NavigateFunction | null = null;
  private _location: Location | null = null;
  private _lastAction: Action | null = null;

  /**
   * Вьюшка последнего локейшена
   */
  private _lastView: ViewEnum | null = null;

  /**
   * История изменения панелей в текущей вьюшке.
   * За счет изменения стейта в массиве могут повторяться панели
   */
  private _historyArray: string[] = [];

  /**
   * Мапа, отражающая, какая была активная панель у конкретной вью на момент
   * закрытия этой вью. Хранение таких данных позволяет менять вью без сброса
   * активной панели предыдущей вью и, следовательно, без рендера лишней панели
   * в предыдущей вью
   */
  private _activePanels: Record<ViewEnum, PanelEnum> = { ...ROUTES_CONFIG.initialActivePanels };

  /**
   * Мапа для хранения стейта всех панелей.
   * Сохраняем кэш, чтобы избежать бага с обновлением стейта при свайпбэке:
   * {@link https://github.com/ktsstudio/create-mediaproject/issues/54}.
   */
  private _stateCache: PanelStatesMapType = getInitialStateCash();

  constructor(readonly rootStore: RootStoreType) {
    makeObservable<HistoryStore, PrivateFields>(this, {
      _navigateFunction: false,
      _location: observable.ref,
      _activePanels: observable.ref,
      _lastAction: observable,
      _lastView: false,
      _historyArray: observable.ref,
      _stateCache: observable.ref,

      _fullLocation: computed,
      _isFirstPanel: computed,
      _uniqueHistoryArray: computed,
      panel: computed,
      view: computed,
      modal: computed,
      modalOpened: computed,
      state: computed,
      swipeBackHistory: computed,
      lastAction: computed,

      _navigate: false,
      setLocation: action,
    });

    // включаем свайпбэк
    reaction(
      () => this._isFirstPanel,
      (isFirst: boolean) => {
        setVkSwipeBackEnabled(isFirst);
      }
    );
  }

  readonly init = (navigate: NavigateFunction): Promise<boolean> => {
    this.setNavigateFunction(navigate);

    return Promise.resolve(true);
  };

  readonly destroy = (): void => {};

  private get _fullLocation(): LocationType {
    let panel = null;

    if (this._location) {
      const { pathname } = this._location;

      panel = pathname.split('/')[2] as PanelEnum;
    }

    const route = panel ? ROUTES[panel] : null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const modal = this._location?.state?.modal as ModalEnum | null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const state = this._location?.state as PanelStatesMapType;

    return {
      view: route?.view ?? null,
      panel: route?.panel ?? null,
      modal,
      state,
    };
  }

  /**
   * В истории текущей вьюшки только одна панель
   */
  private get _isFirstPanel(): boolean {
    return this._historyArray.length <= 1;
  }

  /**
   * История без повторения панелей
   */
  private get _uniqueHistoryArray(): string[] {
    return this._historyArray.reduce((acc, value) => {
      if (!acc.length || acc[acc.length - 1] !== value) {
        acc.push(value);
      }

      return acc;
    }, [] as string[]);
  }

  get panel(): PanelEnum | null {
    return this._fullLocation.panel;
  }

  get view(): ViewEnum | null {
    return this._fullLocation.view;
  }

  get modal(): ModalEnum | null {
    return this._fullLocation.modal;
  }

  get modalOpened(): boolean {
    return this.modal !== null;
  }

  get state(): PanelStatesMapType {
    return this._stateCache;
  }

  /**
   * История панелей для передачи во View.
   * Если массив пустой, свайпбэк не будет работать
   */
  get swipeBackHistory(): string[] {
    return this.modalOpened ? [] : this._uniqueHistoryArray;
  }

  get lastAction(): Action | null {
    return this._lastAction;
  }

  private _navigate = <PanelT extends PanelEnum>(
    { panel, modal, state }: PushOrReplaceParamsType<PanelT>,
    replace = false
  ): void => {
    if (!this._navigateFunction) {
      return;
    }

    const currentPanel = this.panel;

    const panelToNavigate = panel ?? currentPanel;

    if (!panelToNavigate) {
      return;
    }

    const currentState = currentPanel === panelToNavigate ? this._stateCache[panelToNavigate] : {};

    this._navigateFunction(buildVKPathname(panelToNavigate), {
      state: {
        ...currentState,
        modal,
        ...(state ?? {}),
      },
      replace,
    });
  };

  getActivePanelByView = (view: ViewEnum): PanelEnum => {
    return this._activePanels[view];
  };

  setNavigateFunction = (navigate: NavigateFunction): void => {
    this._navigateFunction = navigate;
  };

  setLocation = (location: Location, lastAction: Action): void => {
    this._location = location;
    this._lastAction = lastAction;

    if (!this.view || !this.panel) {
      return;
    }

    // Обновляем запись о последней активной панели во вьюшке
    this._activePanels = {
      ...this._activePanels,
      [this.view]: this.panel,
    };

    // Перезаписываем стейт текущей панели
    this._stateCache = {
      ...this._stateCache,
      [this.panel]: location.state as PanelStatesMapType[typeof this.panel],
    };

    // Переход на новую вьюшку
    if (this.view !== this._lastView) {
      this._lastView = this.view;
      this._historyArray = [this.panel];
    }

    // Создаем новый массив, чтобы сработало изменение _historyArray и _isFirstPanel
    const newHistoryArray = [...this._historyArray];

    switch (lastAction) {
      case Action.Pop:
        newHistoryArray.pop();
        this._historyArray = newHistoryArray;
        break;
      case Action.Replace:
        newHistoryArray.pop();
        this._historyArray = [...newHistoryArray, this.panel];
        break;
      case Action.Push:
        this._historyArray = [...newHistoryArray, this.panel];
        break;
    }
  };

  push = <PanelT extends PanelEnum>(params: PushOrReplaceParamsType<PanelT>) => {
    this._navigate(params);
  };

  replace = <PanelT extends PanelEnum>(params: PushOrReplaceParamsType<PanelT>) => {
    this._navigate(params, true);
  };

  goBack = () => {
    if (!this._navigateFunction) {
      return;
    }

    this._navigateFunction(-1);
  };

  /**
   * customNavigate используется для перехода на несколько страниц вперед или назад
   * с отслеживанием изменений через useEffect в setHistory.
   * чтобы перейти на 2 страницы назад передаем -2, чтобы перейти вперед передаем 2
   * @param value
   * Почему не navigate(-2) ?
   * navigate(-2) не работает потому что изменения схлопываются в одно изменение
   * и мы не можем отследить историю панелей. Поэтому мы вызываем navigate в цикле,
   * так изменения происходят незаметно для пользователя и мы можем отследить историю панелей
   */
  customNavigate = (value: number) => {
    if (!this._navigateFunction) {
      return;
    }

    const times = Math.abs(value);

    for (let i = 0; i < times; i++) {
      this._navigateFunction(value > 0 ? 1 : -1);
    }
  };
}
