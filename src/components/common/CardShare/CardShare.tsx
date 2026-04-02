import cn from 'clsx';
import * as React from 'react';

import { images } from 'assets/img/account';
import { images as imagesForm } from 'assets/img/form';
import ButtonSquare, { IconEnum } from 'components/common/ButtonSquare';
import { useAppParamsStore } from 'store/hooks';

import './CardShare.modules.scss';

type Props = {
  firstName: string;
  lastName: string;
  middleName: string;
  photoVeteran: string;
  id: string;
  onChoose: (id: string) => void;
  isChosen: boolean;
};

const CardShare: React.FC<Props> = ({
  isChosen,
  onChoose,
  firstName,
  lastName,
  photoVeteran,
  middleName,
  id,
}: Props) => {
  const onClick = () => {
    onChoose(id);
  };

  const { isMobile } = useAppParamsStore();

  return (
    <div styleName={cn('root', isChosen && 'root_chosen')} onClick={onClick}>
      <div styleName="container">
        <div styleName="wrapper">
          <div
            style={{
              backgroundImage: `url(${photoVeteran ? photoVeteran : imagesForm.man})`,
            }}
            styleName="photo"
          />
          <img styleName="band" src={images.miniBand} alt="band" />
        </div>
        <div styleName="wrapper">
          <div styleName="name name_last">{lastName}</div>
          <div styleName="name name_first">
            {firstName}
            {isMobile ? <br /> : ' '}
            {middleName}
          </div>
        </div>
        <ButtonSquare
          styleName={cn('check', isChosen && 'check_chosen')}
          icon={IconEnum.check}
          canClick={false}
        />
      </div>
    </div>
  );
};

export default React.memo(CardShare);
