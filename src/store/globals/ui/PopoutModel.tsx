import { ScreenSpinner } from '@vkontakte/vkui';
import { makeObservable, computed, action, observable } from 'mobx';
import * as React from 'react';

export class PopoutModel {
  private _node: React.ReactNode | null = null;

  constructor() {
    makeObservable<this, '_node' | '_setNode'>(this, {
      _node: observable,
      node: computed,
      _setNode: action.bound,
    });
  }

  /**
   * Передаётся в качестве значения свойства popout компонента [SplitLayout](https://vkcom.github.io/VKUI/5.2.3/#/SplitLayout):
   * - [ActionSheet](https://vkcom.github.io/VKUI/5.2.3/#/ActionSheet)
   * - [Alert](https://vkcom.github.io/VKUI/5.2.3/#/Alert)
   * - [ScreenSpinner](https://vkcom.github.io/VKUI/5.2.3/#/ScreenSpinner)
   */
  get node(): React.ReactNode | null {
    return this._node;
  }

  private readonly _setNode = (node: React.ReactNode | null) => {
    this._node = node;
  };

  readonly show = (node: React.ReactNode) => {
    this._setNode(node);
  };

  readonly hide = () => {
    this._setNode(null);
  };

  readonly showScreenSpinner = (timeout = -1) => {
    this.show(<ScreenSpinner state="loading" />);

    if (timeout > 0) {
      setTimeout(this.hide, timeout);
    }
  };
}
