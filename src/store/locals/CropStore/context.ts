import { createContextLocalStore } from 'store/utils';

import { CropStore } from './CropStore';

const { Provider: CropStoreProvider, useStore: useCropStore } = createContextLocalStore(CropStore);

export { CropStoreProvider, useCropStore };
