import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { ButtonTheme } from 'components/common';
import Modal from 'components/modals/Modal';
import { ModalEnum } from 'config/routes/enums';
import { useHistoryStore } from 'store/hooks';
import { useCropStore } from 'store/locals/CropStore';

import { Controls, PhotoCropper } from './components';

import './CropModal.modules.scss';

const CropModal: React.FC = () => {
  const { goBack } = useHistoryStore();
  const { cropPhoto, onSaveCropPhoto, photoField } = useCropStore();

  const [cropper, setCropper] = React.useState<Cropper | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const cropperRef = React.useRef<Cropper | null>(null);

  const [canZoomIn, setCanZoomIn] = React.useState(true);

  React.useEffect(() => {
    // В событиях кроппера корректно используется только реф
    // https://github.com/react-cropper/react-cropper/issues/305
    cropperRef.current = cropper;
  }, [cropper]);

  const onSave = React.useCallback(async () => {
    if (cropper && !isLoading) {
      setIsLoading(true);

      await onSaveCropPhoto(cropper.getCroppedCanvas().toDataURL());

      setIsLoading(false);

      if (!photoField?.errorMessage) {
        goBack();
      }
    }
  }, [cropper, isLoading, photoField?.errorMessage]);

  return (
    <Modal
      id={ModalEnum.crop}
      withLogo
      withGoBack
      fullWidth
      buttons={[
        {
          children: 'Сохранить',
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick: isLoading ? undefined : onSave,
          isDisabled: isLoading,
        },
        {
          children: 'Отменить',
          onClick: goBack,
          theme: ButtonTheme.bordered,
        },
      ]}
    >
      <h2 styleName="title">Фото героя</h2>
      <div styleName={clsx('content', photoField?.errorMessage && 'content_error')}>
        <PhotoCropper
          photo={cropPhoto}
          setCropper={setCropper}
          cropperRef={cropperRef}
          setCanZoomIn={setCanZoomIn}
        />
        <Controls cropper={cropper} disableZoomIn={!canZoomIn} setCanZoomIn={setCanZoomIn} />
        {photoField?.errorMessage && <p styleName="error">{photoField.errorMessage}</p>}
      </div>
    </Modal>
  );
};

export default observer(CropModal);
