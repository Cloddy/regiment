import { Icon24Dismiss } from '@vkontakte/icons';
import { Snackbar as VKSnackbar } from '@vkontakte/vkui';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Button, ButtonSize } from 'components/common';
import { useRootStore } from 'store/globals/root';
import { useAppParamsStore, useUIStore } from 'store/hooks';
import './Snackbar.module.scss';

const Snackbar: React.FC = () => {
  const { snackbar } = useUIStore();
  const { reload } = useRootStore();
  const { search } = useAppParamsStore();

  const onReload = () => {
    reload();
    snackbar.closeSnackbar();
  };

  if (!snackbar.isSnackbarOpen) {
    return null;
  }

  return (
    <VKSnackbar
      styleName="snackbar"
      mode="default"
      layout="horizontal"
      action={<Icon24Dismiss styleName="snackbar__close-button" />}
      onClose={snackbar.closeSnackbar}
      duration={snackbar.duration}
      before={snackbar.icon}
    >
      {snackbar.message}
      {snackbar.message === 'Произошла ошибка' && search && (
        <Button styleName="button" size={ButtonSize.small} onClick={onReload}>
          Перезагрузить страницу
        </Button>
      )}
    </VKSnackbar>
  );
};

export default observer(Snackbar);
