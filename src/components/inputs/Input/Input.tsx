import cn from 'clsx';
import * as React from 'react';
import InputMask from 'react-input-mask';

import './Input.modules.scss';

export type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isError?: boolean;
  errorMessage?: string;
  mask?: string | (string | RegExp)[];
  preprocessingFunc?: (v: string) => string;
  maxLength?: number;
  isDisabled?: boolean;
  canReset?: boolean;
  withBottomMargin?: boolean;
  label?: string;
  isRequired?: boolean;
};

const Input: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  isError,
  errorMessage,
  mask,
  preprocessingFunc,
  maxLength,
  isDisabled,
  canReset,
  withBottomMargin,
  label,
  isRequired,
}: Props) => {
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (preprocessingFunc) {
      onChange(preprocessingFunc(e.target.value));
    } else {
      onChange(e.target.value);
    }
  };

  const reset = React.useCallback(() => onChange(''), [onChange]);

  const showResetButton = canReset && !isDisabled;

  return (
    <div>
      {label && (
        <label styleName="label">
          {label}
          {isRequired && <span styleName="required">*</span>}
        </label>
      )}
      <div
        styleName={cn(
          'input-wrapper',
          withBottomMargin && !errorMessage && 'input-wrapper_with-bottom-margin'
        )}
      >
        <InputMask mask={mask ?? ''} value={value} onChange={onChangeInput}>
          {() => (
            <input
              styleName={cn(
                'input',
                (isError || errorMessage) && 'input_error',
                isDisabled && 'input_disabled',
                showResetButton && 'input_with-cross'
              )}
              value={value}
              onChange={onChangeInput}
              type="text"
              maxLength={maxLength}
              placeholder={placeholder}
            />
          )}
        </InputMask>
        {showResetButton && value && <div styleName="cross" onClick={reset} />}
      </div>
      {errorMessage && <div styleName="error">{errorMessage}</div>}
    </div>
  );
};

Input.defaultProps = {
  className: '',
  isError: false,
  errorMessage: '',
  mask: undefined,
  preprocessingFunc: undefined,
  maxLength: 40,
  isDisabled: false,
  canReset: false,
  withBottomMargin: false,
};

export default React.memo(Input);
