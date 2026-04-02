export const notChanged = (value: unknown): boolean => {
  return [null, undefined, false, '', []].includes(
    value as string | boolean | never[] | null | undefined
  );
};
