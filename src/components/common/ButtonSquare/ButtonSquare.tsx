import cn from 'clsx';
import * as React from 'react';

import CheckSVG from 'assets/img/account/check.c.svg';
import PenSVG from 'assets/img/account/pen.c.svg';
import TrashSVG from 'assets/img/account/trash.c.svg';

import styles from './ButtonSquare.modules.scss';

export enum IconEnum {
  pen = 'pen',
  trash = 'trash',
  check = 'check',
}

const Icons = {
  [IconEnum.pen]: PenSVG,
  [IconEnum.trash]: TrashSVG,
  [IconEnum.check]: CheckSVG,
};

type Props = {
  icon: IconEnum;
  onClick?: (v?: any) => void;
  canClick?: boolean;
  className?: string;
};

const ButtonSquare: React.FC<Props> = ({ icon, onClick, canClick, className }: Props) => {
  const Component = Icons[icon];

  return (
    <div
      className={className}
      styleName={cn('button', canClick && 'button_can-click')}
      onClick={onClick}
    >
      <Component styleName="button__icon" />
    </div>
  );
};

ButtonSquare.defaultProps = {
  canClick: true,
  className: styles.button_d,
  onClick: () => {},
};

export default React.memo(ButtonSquare);
