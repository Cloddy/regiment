export default (queryString: string): Record<string, string> => {
  const urlParams = new URLSearchParams(queryString);
  const entries = urlParams.entries();

  const result = {};

  for (const [key, value] of entries) {
    // @ts-ignore
    result[key] = value;
  }

  return result;
};
