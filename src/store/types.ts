import { VkPlatformType } from '@ktsstudio/mediaproject-vk';

export type OkPlatformType =
  | 'desktop_web_ok'
  | 'mobile_android_ok'
  | 'mobile_ipad_ok'
  | 'mobile_iphone_ok'
  | 'mobile_web_ok';

export type PlatformType = VkPlatformType & OkPlatformType;
