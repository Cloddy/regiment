import { observer } from 'mobx-react';
import * as React from 'react';

import { ButtonTheme } from 'components/common';
import Modal from 'components/modals/Modal';
import { ModalEnum } from 'config/routes/enums';
import { useHistoryStore } from 'store/hooks';

import './DeleteModal.modules.scss';

type DeleteModalProps = {
  onDelete: (deletePayload?: string) => Promise<void>;
  onClose?: VoidFunction;
  withoutGoBack?: boolean;
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  onDelete,
  onClose = undefined,
  withoutGoBack = false,
}: DeleteModalProps) => {
  const { goBack, state, panel } = useHistoryStore();

  const [isLoading, setIsLoading] = React.useState(false);

  const onBack = () => {
    onClose?.();
    goBack();
  };

  const onDeleteForm = async () => {
    setIsLoading(true);

    await onDelete(panel ? state[panel].deletePayload : undefined);
    onClose?.();

    setIsLoading(false);

    if (!withoutGoBack) {
      setTimeout(() => goBack(), 100); // для safari
    }
  };

  return (
    <Modal
      id={ModalEnum.deleteForm}
      withLogo
      withGoBack
      fullWidth
      buttons={[
        {
          onClick: onDeleteForm,
          children: 'Всё равно удалить',
          isDisabled: isLoading,
        },
        {
          onClick: onBack,
          children: 'Отменить',
          theme: ButtonTheme.bordered,
          isDisabled: isLoading,
        },
      ]}
    >
      <h2 styleName="title">Удалить заявку</h2>
      <p styleName="text">
        Внесённые данные будут потеряны. Заявка не&nbsp;будет отображаться на&nbsp;странице
        &laquo;Мои герои&raquo;
      </p>
    </Modal>
  );
};

export default observer(DeleteModal);
