// str = "Иван-Андрей"
// str.split('-') => ["Иван", "Андрей"]
export const splitHyphen = (str: string): string[] => {
  const arr = str.split('-');

  if (arr.length > 1) {
    arr[0] = arr[0] + '-';
  }

  return arr;
};

export const maxCountString = (str: string, max: number): string => {
  let newStr = str;

  if (str.length > max) {
    newStr = str.slice(0, max - 1) + '...';
  }

  return newStr;
};
