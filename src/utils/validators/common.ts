import { pluralize } from '@ktsstudio/mediaproject-utils';

export const validateEnoughSymbols =
  (minCount = 2, empty = false) =>
  (value: string): string | null =>
    value.length < minCount
      ? `Введите хотя бы ${pluralize(minCount, {
          one: 'символ',
          two: 'символа',
          five: 'символов',
        })}${empty ? ' или оставьте поле пустым' : ''}`
      : null;
