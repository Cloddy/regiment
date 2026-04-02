import * as React from 'react';

import { ButtonTheme } from 'components/common';
import Modal from 'components/modals/Modal';
import { ModalEnum, PanelEnum } from 'config/routes/enums';
import { useHistoryStore } from 'store/hooks';

import './FormSentModal.module.scss';

type Props = {
  canAddNewHero: boolean;
};

const FormSentModal: React.FC<Props> = ({ canAddNewHero }) => {
  const { replace } = useHistoryStore();

  const onClick = React.useCallback(
    (panel: PanelEnum) => () => {
      replace({ panel, state: { isEdit: false, heroId: '' } });
    },
    []
  );

  return (
    <Modal
      id={ModalEnum.formSent}
      buttons={[
        {
          children: 'Перейти к моим героям',
          onClick: onClick(PanelEnum.heroes),
        },
        {
          children: 'Добавить ещё героя',
          onClick: onClick(PanelEnum.form),
          theme: ButtonTheme.bordered,
          isDisabled: !canAddNewHero,
        },
      ]}
    >
      <h2 styleName="title">Заявка на модерации</h2>
      <p styleName="description">
        Статус модерации можно отслеживать на&nbsp;странице &laquo;Мои герои&raquo;.
        По&nbsp;завершении проверки вам придёт уведомление
      </p>
    </Modal>
  );
};

export default FormSentModal;
