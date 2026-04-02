import { observer } from 'mobx-react';
import * as React from 'react';

import { useRootStore } from 'store/globals/root';

import { Button, ButtonTheme } from '../Button';

import './GoToWatchPolk.modules.scss';

type Props = {
  theme?: ButtonTheme;
  className?: string;
};

const GoToWatchPolk: React.FC<Props> = ({ theme = ButtonTheme.bordered, className }) => {
  const { search } = useRootStore().appParamsStore;

  const { isMay7Came, isMay9Came } = useRootStore().timerStore;

  const { snackbar } = useRootStore().uiStore;

  const onShowInfo = () => {
    snackbar.openSnackbarMessage({
      text: <>Трансляция будет доступна 9&nbsp;мая с&nbsp;12:00 по местному времени</>,
    });
  };

  console.log('isMay7Came', isMay7Came);
  console.log('isMay9Came', isMay9Came);

  if (isMay7Came && !isMay9Came) {
    return (
      <Button
        isDisabled
        canClick
        className={className}
        theme={theme}
        onClick={onShowInfo}
        stretched
      >
        Перейти в шествие
      </Button>
    );
  }

  if (isMay9Came) {
    return (
      <a
        className={className}
        styleName="link"
        href={`https://2025.polkrf.ru/${search ?? ''}`}
        target="_blank"
        rel="norefferer noreferrer"
      >
        <Button theme={theme} stretched>
          Перейти в шествие
        </Button>
      </a>
    );
  }

  return null;
};

export default observer(GoToWatchPolk);
