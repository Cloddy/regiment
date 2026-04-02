/* eslint-disable no-bitwise */

const generateId = (a?: string): string => {
  if (typeof a === 'string') {
    const aParsedInt = parseInt(a);

    return (
      aParsedInt ^ // unless b is 8,
      ((Math.random() * // in which case
        16) >> // a random number form
        (aParsedInt / 4))
    ) // 8 to 11
      .toString(16);
  }

  return ((1e10).toString() + 1e10 + 1e1)
    .replace(
      // replacing
      /[01]/g, // zeroes and ones with
      generateId // random hex digits
    )
    .toLowerCase();
};

export default generateId;
/* eslint-enable no-bitwise */
