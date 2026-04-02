import { Nullable } from './types';

export const getCurrentOption = <T extends { [key: string]: any }>(
  currentValue: Nullable<T>,
  valueIDProperty: keyof T,
  valueNameProperty: keyof T
): [string, string] => {
  if (currentValue === null) {
    return ['', ''];
  }

  const currId = String(currentValue[valueIDProperty]);
  const currName = String(currentValue[valueNameProperty]);

  return [currId, currName];
};
