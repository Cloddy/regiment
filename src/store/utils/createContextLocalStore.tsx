import * as React from 'react';

import type { ILocalStore } from 'store/interfaces';

export const createContextLocalStore = <T extends ILocalStore>(
  Constructor: new (...args: any[]) => T
) => {
  const Context = React.createContext<T | null>(null);

  const Provider = ({ children, store }: React.PropsWithChildren<{ store: T }>) => (
    <Context.Provider value={store}>{children}</Context.Provider>
  );

  const useStore = () => {
    const context = React.useContext(Context);

    if (!context) {
      throw new Error(`${Constructor.name} not found`);
    }

    return context;
  };

  return {
    Provider,
    useStore,
  };
};
