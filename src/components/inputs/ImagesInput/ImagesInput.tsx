import { sleep } from '@ktsstudio/mediaproject-utils';
import cn from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';

import PlusSVG from 'assets/img/common/plus.svg?react';
import { Loader, TrashButton } from 'components/common';
import { acceptTypes, HERO_PHOTOS_MIN_SIZE } from 'config/imageTypes';
import { maxImageSizeInfoLines } from 'config/info';
// import { militaryBranches } from 'config/militaryBranch';
import { ModalEnum } from 'config/routes/enums';
import { HeroImageField } from 'entities/hero';
import { useHistoryStore } from 'store/hooks';
import { useCropStore } from 'store/locals/CropStore';
import { useFormPageStore } from 'store/locals/FormPageStore';
import usePhotoUpload from 'utils/usePhotoUpload';

import './ImagesInput.modules.scss';

type Props = PropsWithClassName &
  HeroImageField & {
    isDisabled?: boolean;
  };

const ImagesInput: React.FC<Props> = ({
  photoField,
  className,
  id,
  firstName,
  lastName,
  middleName,
  birthday,
  deathDate,
  alive,
  resetErrorMessage,
  isDisabled,
  // militaryBranch,
}: Props) => {
  const { push } = useHistoryStore();
  const { currentForm } = useFormPageStore();
  const { setCropPhoto, init } = useCropStore();

  const [isLoading, setIsLoading] = React.useState(false);

  const {
    onChangePhoto: handleOnChangePhoto,
    isError,
    errorMessage: uploadErrorMessage,
  } = usePhotoUpload(setCropPhoto, HERO_PHOTOS_MIN_SIZE);

  const errorMessage = photoField.errorMessage || (isError ? uploadErrorMessage : '');

  // Для очистки поля фото и ошибок
  const onInputClick = React.useCallback(
    (event: React.SyntheticEvent<HTMLInputElement>) => {
      (event.target as HTMLInputElement).value = '';
      resetErrorMessage();
    },
    [resetErrorMessage]
  );

  const onChangeInput = React.useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = await handleOnChangePhoto(event);

    if (result) {
      push({ modal: ModalEnum.crop });
    }
  }, []);

  const handleOnClickPhotoVeteran = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsLoading(true);
      init(photoField, currentForm, HERO_PHOTOS_MIN_SIZE);
      await onChangeInput(event);
      await sleep(500);
      setIsLoading(false);
    },
    [photoField, currentForm]
  );

  const onDeleteVeteran = () => {
    resetErrorMessage();
    photoField.setValue('', false, { id: '' });
  };

  const photoVeteran = photoField.value;

  return (
    <>
      <div styleName="root" className={className} data-id={id}>
        <div styleName={cn('input-wrapper', photoVeteran && errorMessage && 'input-wrapper_error')}>
          {photoVeteran ? (
            <>
              <img src={photoVeteran} alt="Фото героя" styleName="photo" />
              {!isDisabled && <TrashButton styleName="trash-button" onClick={onDeleteVeteran} />}
            </>
          ) : (
            <div
              styleName={cn('input', isDisabled && 'input_disabled', errorMessage && 'input_error')}
            >
              <PlusSVG styleName="input__icon" />
              <div styleName="input__title">Фото героя</div>
              <div styleName="input__requirements">
                {maxImageSizeInfoLines(HERO_PHOTOS_MIN_SIZE)}
              </div>
              <label
                htmlFor={`${id}_veteran-uploader`}
                styleName={cn('input__label', isDisabled && 'input__label_disabled')}
              />
            </div>
          )}
        </div>
        <div styleName="data">
          <div styleName="data__wrapper">
            {/* {militaryBranch && (
              <div styleName="military-branch">
                <p>{militaryBranches[militaryBranch].title}</p>
              </div>
            )} */}
            <div styleName="last-name">{lastName || 'Фамилия'}</div>
            <div styleName="first-name">
              {firstName || 'Имя'} {firstName && !middleName ? '' : middleName || 'Отчество'}
            </div>
            <div styleName="info">
              <hr styleName="line" />
              <div styleName="dates">
                {!birthday && !alive && !deathDate ? 'Даты жизни' : ''}
                {birthday || (deathDate || alive ? '...' : '')}
                {alive ? ' - по настоящее время' : deathDate ? ` - ${deathDate}` : ''}
              </div>
            </div>
          </div>
        </div>
        <input
          type="file"
          id={`${id}_veteran-uploader`}
          style={{ display: 'none' }}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onChange={isDisabled ? undefined : handleOnClickPhotoVeteran}
          onClick={isDisabled ? undefined : onInputClick}
          accept={acceptTypes}
        />
      </div>
      {errorMessage && <div styleName="root__error">{errorMessage}</div>}
      {isLoading && <Loader withBackground withoutProgress />}
    </>
  );
};

ImagesInput.defaultProps = {
  className: '',
  isDisabled: false,
};

export default observer(ImagesInput);
