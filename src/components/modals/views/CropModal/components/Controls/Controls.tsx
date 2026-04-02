import * as React from 'react';

import RotateIcon from 'assets/img/form/rotate.svg?react';
import ZoomInIcon from 'assets/img/form/zoom-in.svg?react';
import ZoomOutIcon from 'assets/img/form/zoom-out.svg?react';
import { HERO_PHOTOS_MIN_SIZE } from 'config/imageTypes';

import './Controls.module.scss';

const ZOOM_STEP = 0.1;

type Props = {
  cropper: Cropper | null;
  disableZoomIn: boolean;
  setCanZoomIn: (value: boolean) => void;
};

const Controls: React.FC<Props> = ({ cropper, disableZoomIn, setCanZoomIn }) => {
  React.useEffect(() => {
    const canvasWidth = cropper?.getCroppedCanvas()?.width ?? 0;

    setCanZoomIn(canvasWidth > HERO_PHOTOS_MIN_SIZE.width);
  }, [cropper]);

  const handleZoomIn = React.useCallback(() => {
    cropper?.zoom(ZOOM_STEP);
  }, [cropper]);

  const handleZoomOut = React.useCallback(() => {
    cropper?.zoom(-ZOOM_STEP);
  }, [cropper]);

  const handleRotate = React.useCallback(() => {
    cropper?.rotate(-90);

    const canvas = cropper?.getCanvasData();

    if (canvas) {
      // не даем области для кропа вылезти за границы изображения
      cropper?.setCropBoxData(canvas);
    }
  }, [cropper]);

  return (
    <div styleName="controls">
      <button styleName="control" onClick={handleZoomIn} disabled={disableZoomIn}>
        <ZoomInIcon />
        Увеличить
      </button>
      <button styleName="control" onClick={handleZoomOut}>
        <ZoomOutIcon />
        Уменьшить
      </button>
      <button styleName="control" onClick={handleRotate}>
        <RotateIcon />
        Повернуть
      </button>
    </div>
  );
};

export default React.memo(Controls);
