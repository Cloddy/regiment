import { AppParamsStore as BaseAppParamsStore } from '@ktsstudio/mediaproject-stores';
import { findGetParameter } from '@ktsstudio/mediaproject-utils';
import { checkVkPlatform } from '@ktsstudio/mediaproject-vk';
import { observable, makeObservable } from 'mobx';

import { API_URL } from 'config/api/apiUrl';
import { userInWhitelist } from 'config/whitelist';
import { PlatformType } from 'store/types';

export class AppParamsStore extends BaseAppParamsStore {
  // базовые параметры вк миниаппа
  userId: number;
  appId: number;
  notificationsEnabled: boolean;
  language: string | null;
  ref: string | null;
  scope: string | null;
  groupId: string | null;
  viewerGroupRole: string | null;
  platform: PlatformType;
  isOdr: boolean;
  isMobile: boolean;
  isIos: boolean;
  isAndroid: boolean;
  isMvk: boolean;
  isOk: boolean;

  constructor() {
    super(API_URL);

    this.userId = Number(findGetParameter('vk_user_id'));
    this.appId = Number(findGetParameter('vk_app_id'));
    this.notificationsEnabled = findGetParameter('vk_are_notifications_enabled') === '1';
    this.language = findGetParameter('vk_language');
    this.ref = findGetParameter('vk_ref');
    this.scope = findGetParameter('vk_access_token_settings');
    this.groupId = findGetParameter('group_id');
    this.viewerGroupRole = findGetParameter('vk_viewer_group_role');
    this.isOdr = findGetParameter('odr_enabled') === '1';

    this.isOk = findGetParameter('vk_client') === 'ok';

    this.platform = 'mobile_iphone' as PlatformType;

    const deviceInfo = checkVkPlatform(this.platform);

    if (deviceInfo) {
      this.isMobile = deviceInfo.isMobile;
      this.isIos = deviceInfo.isIos;
      this.isAndroid = deviceInfo.isAndroid;
      this.isMvk = deviceInfo.isMvk;
    } else {
      this.isMobile = false;
      this.isIos = false;
      this.isAndroid = false;
      this.isMvk = false;
    }

    makeObservable<this>(this, {
      userId: observable,
      appId: observable,
      notificationsEnabled: observable,
      language: observable,
      ref: observable,
      scope: observable,
      groupId: observable,
      viewerGroupRole: observable,
      platform: observable,
      isOdr: observable,
      isMobile: observable,
      isIos: observable,
      isAndroid: observable,
      isMvk: observable,
      isOk: observable,
    });
  }

  get isMobileWebOkOrDesktopOk() {
    return this.platform === 'desktop_web_ok' || this.platform === 'mobile_web_ok';
  }

  get userInWhitelist(): boolean {
    return this.isDev && userInWhitelist(this.userId);
  }
}
