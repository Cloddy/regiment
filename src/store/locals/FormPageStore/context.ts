import { createContextLocalStore } from 'store/utils';

import FormPageStore from './FormPageStore';

const { Provider: FormPageStoreProvider, useStore: useFormPageStore } =
  createContextLocalStore(FormPageStore);

export { FormPageStoreProvider, useFormPageStore };
