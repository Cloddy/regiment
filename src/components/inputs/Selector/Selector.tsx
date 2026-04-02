import cn from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';

import Arrow from 'assets/img/form/arrow.svg?react';

import { SelectorItem } from '../SelectorItem';

import { DefaultSelectorValueType, SelectorProps, Nullable } from './types';
import { getCurrentOption } from './utils';

import './Selector.modules.scss';

const Selector = <T extends { [key: string]: any } = DefaultSelectorValueType>({
  contentVisible,
  setContentVisible,
  isError = false,
  errorMessage = '',
  isDisabled = false,
  currentValue = null,
  values,
  setValue,
  label,
  placeholder = 'Выберите из списка',
  withEmptyValue = false,
  withBottomMargin = false,
  valueIDProperty = 'id',
  valueNameProperty = 'name',
}: SelectorProps<T>) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  const onChangeContentVisible = React.useCallback(() => {
    if (isDisabled) {
      return;
    }

    setContentVisible(!contentVisible);
  }, [isDisabled, contentVisible, setContentVisible]);

  const onSelect = React.useCallback(
    (value: Nullable<T>) => () => {
      setValue(value);
      setContentVisible(false);
    },
    [setContentVisible, setValue]
  );

  React.useEffect(() => {
    const onBlur = (event: MouseEvent) => {
      if (!contentRef.current?.contains(event.target as Node)) {
        setContentVisible(false);
      }
    };

    if (contentVisible) {
      document.addEventListener('click', onBlur);
    }

    return () => {
      document.removeEventListener('click', onBlur);
    };
  }, [contentVisible]);

  const scrolled = React.useMemo(() => values.length > 5, [values]);

  const [currentId, currentName] = React.useMemo(
    () => getCurrentOption(currentValue, valueIDProperty, valueNameProperty),
    [currentValue, valueIDProperty, valueNameProperty]
  );

  return (
    <>
      <div
        styleName={cn(
          'content',
          contentVisible && 'content_visible',
          isDisabled && 'content_disabled',
          withBottomMargin && !errorMessage && 'content_with-bottom-margin'
        )}
        ref={contentRef}
      >
        {label && <div styleName="label">{label}</div>}
        <div styleName="input-wrapper">
          <div
            styleName={cn(
              'input',
              Boolean(currentValue) && 'input_valued',
              contentVisible && 'input_focused',
              isError && 'input_error'
            )}
            onClick={isDisabled ? undefined : onChangeContentVisible}
          >
            <span styleName={currentName ? 'value' : 'placeholder'}>
              {currentName || placeholder}
            </span>
          </div>
          <Arrow styleName="icon" />
        </div>
        <div styleName={cn('list', scrolled && 'list_scrolled')}>
          <div styleName="list__inner">
            {withEmptyValue && (
              <SelectorItem key="emptyValue" onClick={onSelect(null)} name={placeholder} empty />
            )}
            {values.map((value: T) => {
              const [valueId, valueName] = getCurrentOption(
                value,
                valueIDProperty,
                valueNameProperty
              );

              return (
                <SelectorItem
                  key={valueId}
                  onClick={onSelect(value)}
                  selected={valueId === currentId}
                  name={valueName}
                />
              );
            })}
          </div>
        </div>
      </div>
      {errorMessage && <div styleName="error">{errorMessage}</div>}
    </>
  );
};

export default observer(Selector);
