import type { WindowType } from '@ktsstudio/mediaproject-vk';

declare global {
  interface Window extends WindowType {
    API_URL_FROM_TEMPLATE: string;
  }
}
