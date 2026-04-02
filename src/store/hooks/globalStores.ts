import { captureException } from '@sentry/react';

import { type RootStoreType, useRootStore } from 'store/globals/root';

type SubStore<S extends keyof RootStoreType> = S extends `${string}Store` ? S : never;

const createSubStoreHook = <S extends keyof RootStoreType>(
  storeName: SubStore<S>
): (() => RootStoreType[S]) => {
  const getError = () => new Error(`"${storeName}" not found!`);

  return () => {
    try {
      const store = useRootStore()[storeName];

      if (!store) {
        throw getError();
      }

      return store;
    } catch (error) {
      captureException(error);

      throw getError();
    }
  };
};

export const useAppParamsStore = createSubStoreHook('appParamsStore');

export const useHistoryStore = createSubStoreHook('historyStore');

export const useUIStore = createSubStoreHook('uiStore');

export const useUserStore = createSubStoreHook('userStore');

export const useHeroesStore = createSubStoreHook('heroesStore');

export const useStatsStore = createSubStoreHook('statsStore');
