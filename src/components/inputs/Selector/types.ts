export type DefaultSelectorValueType = {
  id: number;
  name: string;
};

export type Nullable<T> = T | null;

export type SelectorProps<T extends { [key: string]: any }> = {
  contentVisible: boolean;
  setContentVisible: (contentVisible: boolean) => void;
  isError?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;

  currentValue: Nullable<T>;
  setValue: (value: Nullable<T>) => void;

  values: T[];

  label?: string;
  placeholder?: string;

  withEmptyValue?: boolean;
  withBottomMargin?: boolean;

  valueIDProperty?: string;
  valueNameProperty?: string;
};

export type UseSelectorReturnValueType<T extends { [key: string]: any }> = [
  SelectorProps<T>['contentVisible'],
  SelectorProps<T>['setContentVisible'],
  SelectorProps<T>['currentValue'],
  SelectorProps<T>['setValue'],
];
