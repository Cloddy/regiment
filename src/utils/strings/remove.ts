import { MAX_LENGTHS } from 'config/info';

/* eslint-disable no-useless-escape */
export const removeNotDigits = (str: string): string => {
  return str.replace(/[^\d]/g, '');
};

export const removeNotDigitsAndPoint = (str: string): string => {
  return str.replace(/[^\d.]/g, '');
};

export const removeNotKiril = (str: string, maxLen: number): string => {
  return str
    .replace(/[^а-яёА-ЯЁ\-\s]/gi, '')
    .replace(/\s{1,}/g, ' ')
    .replace(/-{1,}/g, '-')
    .replace(/^[\s-]+/, '')
    .slice(0, maxLen);
};

export const removeNotDigitsAndSpec = (str: string): string => {
  return str.replace(/[^a-zA-Z\d.,+={};:"'±§!@#$%^&*`~|<>\\//\]/[/]/gi, '');
};

export const validateLastName = (str: string) => removeNotKiril(str, MAX_LENGTHS.lastName);

export const validateFirstName = (str: string) => removeNotKiril(str, MAX_LENGTHS.firstName);

export const validateMiddleName = (str: string) => removeNotKiril(str, MAX_LENGTHS.middleName);

/* eslint-disable no-useless-escape */
