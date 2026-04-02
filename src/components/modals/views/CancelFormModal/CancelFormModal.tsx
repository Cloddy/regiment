import { observer } from 'mobx-react';
import * as React from 'react';

import { ButtonTheme } from 'components/common';
import Modal from 'components/modals/Modal';
import { ModalEnum, PanelEnum } from 'config/routes/enums';
import { useHeroesStore, useHistoryStore } from 'store/hooks';

import './CancelFormModal.module.scss';

const CancelFormModal: React.FC = () => {
  const { goBack, replace } = useHistoryStore();
  const { hasAtLeastOneHero } = useHeroesStore();

  const onCancel = React.useCallback(() => {
    replace({ panel: hasAtLeastOneHero ? PanelEnum.heroes : PanelEnum.start });
  }, [hasAtLeastOneHero]);

  return (
    <Modal
      id={ModalEnum.cancelForm}
      fullWidth
      withGoBack
      withLogo
      buttons={[
        {
          children: 'Продолжить заполнение',
          onClick: goBack,
        },
        {
          children: 'Отменить',
          onClick: onCancel,
          theme: ButtonTheme.bordered,
        },
      ]}
    >
      <h2 styleName="title">Отменить изменения?</h2>
      <p styleName="description">
        Внесённые данные будут потеряны. Чтобы сохранить информацию, завершите заполнение анкеты
      </p>
    </Modal>
  );
};

export default observer(CancelFormModal);
