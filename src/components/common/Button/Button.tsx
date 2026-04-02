import { noop } from '@ktsstudio/mediaproject-utils';
import cn from 'clsx';
import * as React from 'react';

import styles from './Button.modules.scss';

export type ButtonProps = {
  children: React.ReactNode;
  id?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  className?: string;
  theme?: ButtonTheme;
  size?: ButtonSize;
  canClick?: boolean;
  before?: React.ReactNode;
  stretched?: boolean;
};

export enum ButtonTheme {
  filled = 'filled',
  bordered = 'bordered',
}

export enum ButtonSize {
  small = 'small-size', // 1.6rem
  standard = 'standard-size', // 1.8rem
  large = 'large-size', // 2rem
}

const Button: React.FC<ButtonProps> = ({
  children,
  id,
  onClick,
  isDisabled,
  className = styles.button_default,
  theme,
  size,
  canClick,
  before,
  stretched,
}: ButtonProps) => {
  return (
    <div
      styleName={cn(
        'button',
        `button_${theme}`,
        `button_${size}`,
        isDisabled && 'button_disabled',
        isDisabled && !canClick && 'button_cant-click',
        stretched && 'button_stretched'
      )}
      id={id}
      className={className}
      onClick={onClick}
    >
      {before && <div styleName="button__before">{before}</div>}
      {children}
    </div>
  );
};

Button.defaultProps = {
  onClick: noop,
  isDisabled: false,
  className: styles.button_default,
  theme: ButtonTheme.filled,
  size: ButtonSize.small,
  canClick: false,
};

export default React.memo(Button);
