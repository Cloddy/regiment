import * as React from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import { HERO_PHOTOS_MIN_SIZE } from 'config/imageTypes';
import { IMAGE_ASPECT_RATIO } from 'config/info';

import './PhotoCropper.modules.scss';

type Props = PropsWithClassName & {
  photo: string | null;
  cropperRef: React.RefObject<Cropper>;
  setCropper: (v: Cropper) => void;
  setCanZoomIn: (v: boolean) => void;
};

const PhotoCropper: React.FC<Props> = ({
  className,
  photo,
  cropperRef,
  setCropper,
  setCanZoomIn,
}) => {
  const lastCroppedCanvasWidthRef = React.useRef(0);
  const lastCropBoxWidthRef = React.useRef(0);

  const onCrop = React.useCallback(
    (e: Cropper.CropEvent<HTMLImageElement>) => {
      const croppedCanvasWidth = cropperRef.current?.getCroppedCanvas()?.width;
      const cropBoxWidth = cropperRef.current?.getCropBoxData()?.width;

      if (!croppedCanvasWidth) {
        return;
      }

      if (
        croppedCanvasWidth <= HERO_PHOTOS_MIN_SIZE.width &&
        lastCroppedCanvasWidthRef.current > croppedCanvasWidth
      ) {
        e.preventDefault();
      } else if (cropBoxWidth) {
        lastCroppedCanvasWidthRef.current = croppedCanvasWidth;
        lastCropBoxWidthRef.current = cropBoxWidth;
      }
    },
    [cropperRef]
  );

  const onZoom = React.useCallback(
    (e: Cropper.ZoomEvent<HTMLImageElement>) => {
      const canvas = cropperRef.current?.getCanvasData();
      const croppedCanvasWidth = cropperRef.current?.getCroppedCanvas()?.width;
      const cropBoxWidth = cropperRef.current?.getCropBoxData()?.width;
      const zoomingIn = e.detail.oldRatio < e.detail.ratio;

      if (canvas && cropBoxWidth && cropBoxWidth > canvas.width) {
        // не даем области для кропа вылезти за границы изображения
        cropperRef.current?.setCropBoxData(canvas);
      }

      if (!croppedCanvasWidth) {
        return;
      }

      const disableZoomIn = croppedCanvasWidth <= HERO_PHOTOS_MIN_SIZE.width && zoomingIn;

      if (disableZoomIn) {
        e.preventDefault();
      } else {
        lastCroppedCanvasWidthRef.current = croppedCanvasWidth;
      }

      setCanZoomIn(!disableZoomIn);
    },
    [cropperRef, setCanZoomIn]
  );

  if (!photo) {
    return null;
  }

  return (
    <div styleName="wrapper">
      <Cropper
        styleName="cropper"
        className={className}
        src={photo}
        onInitialized={setCropper}
        aspectRatio={IMAGE_ASPECT_RATIO}
        initialAspectRatio={IMAGE_ASPECT_RATIO}
        viewMode={2}
        center={false}
        dragMode="move"
        guides={false}
        cropBoxResizable
        background={false}
        responsive
        autoCropArea={1}
        checkOrientation={false}
        minCropBoxWidth={70}
        crop={onCrop}
        zoom={onZoom}
      />
    </div>
  );
};

export default React.memo(PhotoCropper);
