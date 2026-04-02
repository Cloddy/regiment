import {
  Platform,
  PlatformProvider,
  PanelHeader as VKPanelHeader,
  type PanelHeaderProps,
} from '@vkontakte/vkui';
import * as React from 'react';

import logoBp from 'assets/img/header/bp-logo.png';
import pobeda from 'assets/img/header/pobeda.png';
import { IS_DEV } from 'config/env';
import { PanelEnum } from 'config/routes/enums';
import { useRootStore } from 'store/globals/root';
import { useHistoryStore, useUserStore } from 'store/hooks';

import './PanelHeader.module.scss';

const PanelHeader: React.FC<PanelHeaderProps> = ({ className, children, ...props }) => {
  const { resetFederalDistrict } = useUserStore();
  const { setDevMay7Date, setDevMay9Date } = useRootStore().timerStore;
  const [countDev, setCountDev] = React.useState(0);
  const { push } = useHistoryStore();

  const onResetFederalDistrict = React.useCallback(() => {
    if (!IS_DEV) {
      return;
    }

    void resetFederalDistrict();
    push({ panel: PanelEnum.start });
  }, [resetFederalDistrict]);

  const onClick = () => {
    if (!IS_DEV) {
      return;
    }

    if (countDev === 0) {
      setDevMay7Date();
      setCountDev(countDev + 1);

      return;
    }

    if (countDev === 1) {
      setDevMay9Date();
      setCountDev(countDev + 1);
    }
  };

  return (
    <PlatformProvider value={Platform.IOS}>
      <VKPanelHeader
        styleName="panel-header"
        className={className}
        transparent
        delimiter="none"
        before={
          <div styleName="logo-container">
            <img styleName="logo" src={logoBp} onClick={onResetFederalDistrict} />
            <img styleName="logo" src={pobeda} onClick={onClick} />
          </div>
        }
        fixed={false}
        {...props}
      >
        {children}
      </VKPanelHeader>
    </PlatformProvider>
  );
};

export default PanelHeader;
