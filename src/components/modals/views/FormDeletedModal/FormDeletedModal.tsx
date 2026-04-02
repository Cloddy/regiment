import * as React from 'react';

import Modal from 'components/modals/Modal';
import { ModalEnum, PanelEnum } from 'config/routes/enums';
import { useHistoryStore } from 'store/hooks';

import './FormDeletedModal.module.scss';

type Props = {
  hasAtLeastOneHero: boolean;
};

const FormDeletedModal: React.FC<Props> = ({ hasAtLeastOneHero }) => {
  const { push } = useHistoryStore();

  const goToHeroesPage = React.useCallback(() => {
    push({ panel: hasAtLeastOneHero ? PanelEnum.heroes : PanelEnum.start });
  }, [hasAtLeastOneHero]);

  return (
    <Modal
      id={ModalEnum.formDeleted}
      buttons={[
        {
          children: hasAtLeastOneHero ? 'Перейти к моим героям' : 'Перейти на главную',
          onClick: goToHeroesPage,
        },
      ]}
    >
      <h2 styleName="title">Заявка удалена</h2>
      <p styleName="description">
        Данные о&nbsp;герое удалены. Заявка не&nbsp;будет отображаться на&nbsp;странице &laquo;Мои
        герои&raquo;
      </p>
    </Modal>
  );
};

export default FormDeletedModal;
