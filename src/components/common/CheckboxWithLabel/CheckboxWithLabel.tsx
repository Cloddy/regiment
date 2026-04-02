import cn from 'clsx';
import * as React from 'react';

import './CheckboxWithLabel.module.scss';

type Props = DefaultProps & {
  checked?: boolean;
  onCheck?: (v: boolean) => void;
  isDisabled?: boolean;
};

const CheckboxWithLabel: React.FC<Props> = ({
  children,
  checked,
  onCheck,
  isDisabled,
  className,
}: Props) => {
  const toggleCheck = () => {
    if (onCheck) {
      onCheck(!checked);
    }
  };

  return (
    <div
      styleName={cn('checkbox', isDisabled && 'checkbox_disabled')}
      className={className}
      onClick={isDisabled ? undefined : toggleCheck}
    >
      <input
        styleName="checkbox__input"
        type="checkbox"
        checked={checked}
        disabled={isDisabled}
        readOnly
      />
      <label styleName="checkbox__label">{children}</label>
    </div>
  );
};

CheckboxWithLabel.defaultProps = {
  onCheck: undefined,
  checked: false,
  isDisabled: false,
  className: '',
};

export default React.memo(CheckboxWithLabel);
