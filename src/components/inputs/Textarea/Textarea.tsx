import cn from 'clsx';
import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import './Textarea.modules.scss';

export type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isError?: boolean;
  errorMessage?: string;
  preprocessingFunc?: (v: string) => string;
  minLength?: number;
  maxLength?: number;
  isDisabled?: boolean;
  canReset?: boolean;
  withBottomMargin?: boolean;
  minRows?: number;
};

const Textarea: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  className,
  isError,
  errorMessage,
  preprocessingFunc,
  minLength,
  maxLength,
  isDisabled,
  canReset,
  withBottomMargin,
  minRows,
}: Props) => {
  const onChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (preprocessingFunc) {
      onChange(preprocessingFunc(e.target.value));
    } else {
      onChange(e.target.value);
    }
  };

  const reset = React.useCallback(() => onChange(''), []);

  return (
    <div styleName={cn(withBottomMargin && 'bottom-margin')} className={className}>
      <div styleName="input-wrapper">
        <TextareaAutosize
          styleName={cn(
            'input',
            (isError || errorMessage) && 'input_error',
            isDisabled && 'input_disabled',
            canReset && 'input_with-cross'
          )}
          value={value}
          onChange={onChangeInput}
          minLength={minLength}
          maxLength={maxLength}
          minRows={minRows}
        />
        <label styleName={cn('label', value && 'label_focused')}>{placeholder}</label>
        {canReset && value && <div styleName="cross" onClick={reset} />}
        {errorMessage && <div styleName="error">{errorMessage}</div>}
      </div>
      <div styleName="symbols-count">
        {value.length} / {maxLength}
      </div>
    </div>
  );
};

Textarea.defaultProps = {
  className: '',
  isError: false,
  errorMessage: '',
  preprocessingFunc: undefined,
  minLength: 3,
  maxLength: 40,
  isDisabled: false,
  canReset: false,
  withBottomMargin: false,
  minRows: 2,
};

export default React.memo(Textarea);
