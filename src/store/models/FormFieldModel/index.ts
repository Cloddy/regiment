import { makeAutoObservable } from 'mobx';

import isNil from 'utils/validators/isNil';

import configDefaultState from './config/defaultState';
import { notChanged } from './config/utils';

type ValidatorType<V, R> = (value: V, rest: R) => string | null;

type CheckIsChangedType<V> = (value: V, initialValue?: V) => boolean;

interface FormFieldConstructor<V, R> {
  errorMessage?: string;
  emptyValueErrorMessage?: string;
  value?: V;
  validator?: ValidatorType<V, R>;
  rest?: R;
  isRequired?: boolean;
  onValueChange?: VoidFunction;
  checkIsChanged?: CheckIsChangedType<V>;
}

class FormFieldModel<V = string, R = any> {
  errorMessage?: string;

  readonly defaultErrorMessage: string;

  readonly emptyValueErrorMessage: string;

  defaultValue: V;

  value: V;

  validator?: ValidatorType<V, R>;

  readonly isRequired: boolean;

  onValueChange?: VoidFunction;

  rest?: R;

  checkIsChanged?: CheckIsChangedType<V>;

  constructor({
    errorMessage,
    emptyValueErrorMessage = configDefaultState.emptyValueErrorMessage,
    value,
    validator,
    isRequired = false,
    rest = undefined,
    onValueChange,
    checkIsChanged,
  }: FormFieldConstructor<V, R> = {}) {
    this.defaultValue = value as V;
    this.defaultErrorMessage = errorMessage ?? '';

    this.value = value as V;
    this.errorMessage = errorMessage;
    this.emptyValueErrorMessage = emptyValueErrorMessage;
    this.validator = validator;
    this.isRequired = isRequired;
    this.onValueChange = onValueChange;
    this.rest = rest;
    this.checkIsChanged = checkIsChanged;

    makeAutoObservable(this);
  }

  get changed(): boolean {
    if (this.checkIsChanged) {
      return this.checkIsChanged(this.value, this.defaultValue);
    }

    if (typeof this.value === 'string' && typeof this.defaultValue === 'string') {
      return this.value.trim() !== this.defaultValue.trim();
    }

    return this.value !== this.defaultValue;
  }

  reset = (): void => {
    this.errorMessage = this.defaultErrorMessage;
    this.value = this.defaultValue;
  };

  setValue = (value: V, isInitial?: boolean, rest?: R): void => {
    this.onValueChange && this.onValueChange();
    this.value = value;
    this.errorMessage = '';

    if (isInitial) {
      this.defaultValue = value;
    }

    if (rest) {
      this.rest = rest;
    }
  };

  setValidator = (validator: ValidatorType<V, R>): void => {
    this.validator = validator;
  };

  setOnValueChange = (onValueChange: VoidFunction): void => {
    this.onValueChange = onValueChange;
  };

  setRest = (rest: R): void => {
    this.rest = rest;
  };

  setErrorMessage = (errorMessage: string): void => {
    this.errorMessage = errorMessage;
  };

  validate = (): boolean => {
    let valueToValidate: V = this.value;

    if (typeof valueToValidate === 'string') {
      valueToValidate = valueToValidate.trim() as V;
    }

    if (
      this.isRequired &&
      (isNil(valueToValidate) ||
        ((typeof valueToValidate === 'string' || Array.isArray(valueToValidate)) &&
          valueToValidate?.length < 1))
    ) {
      this.errorMessage = this.emptyValueErrorMessage;

      return false;
    }

    if (!this.validator) {
      return true;
    }

    if (!this.isRequired && notChanged(valueToValidate)) {
      return true;
    }

    const errorMessage = this.validator(valueToValidate, this.rest as R);

    if (typeof errorMessage === 'string') {
      this.errorMessage = errorMessage;

      return false;
    }

    this.errorMessage = '';

    return true;
  };

  validated = (): boolean => {
    if (
      this.isRequired &&
      (isNil(this.value) ||
        ((typeof this.value === 'string' || Array.isArray(this.value)) && this.value?.length < 1))
    ) {
      return false;
    }

    if (!this.validator) {
      return true;
    }

    if (!this.isRequired && notChanged(this.value)) {
      return true;
    }

    const errorMessage = this.validator(this.value, this.rest as R);

    return typeof errorMessage !== 'string';
  };

  get bind(): any {
    return {
      value: this.value,
      errorMessage: this.errorMessage,
      onChange: this.setValue,
      rest: this.rest,
    };
  }
}

export default FormFieldModel;
