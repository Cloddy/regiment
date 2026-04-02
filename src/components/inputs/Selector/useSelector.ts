import * as React from 'react';

import { UseSelectorReturnValueType, Nullable } from './types';

function useSelector<T extends { [key: string]: any }>(
  initialValue: Nullable<T>
): UseSelectorReturnValueType<T> {
  const [contentVisible, setContentVisible] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState<Nullable<T>>(initialValue);

  return [contentVisible, setContentVisible, currentValue, setCurrentValue];
}

export default useSelector;
