type Key = string | number | symbol;
type NEType = { id: Key };

export type NormilizeResultType<NE extends NEType, K extends keyof NE> = [
  // @ts-ignore
  Record<NE[K], NE>,
  NE[K][],
];

function normalize<E, K extends keyof NE = 'id', NE extends NEType = NEType>(options: {
  array: E[];
  key?: K;
  parser?: (data: E) => NE;
}): NormilizeResultType<NE, K> {
  const { array, key = 'id', parser = (data): E => data } = options;

  const result = array.reduce<{
    // @ts-ignore
    entities: Record<NE[K], NE>;
    keys: NE[K][];
  }>(
    (acc, value) => {
      const parsedItem = parser(value) as NE;
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const keyValue = value[key];

      if (
        typeof keyValue === 'string' ||
        typeof keyValue === 'number' ||
        typeof keyValue === 'symbol'
      ) {
        return {
          entities: {
            ...acc.entities,
            [keyValue]: parsedItem,
          },
          // @ts-ignore
          keys: acc.keys.concat(keyValue as NE[K]),
        };
      }

      return acc;
    },
    // @ts-ignore
    { entities: {} as Record<NE[K], NE>, keys: [] }
  );

  return [result.entities, result.keys];
}

export default normalize;
