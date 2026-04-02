import { isAndroid, isIOS } from 'utils/platform';

export const IS_LOCAL_DEV = process.env.NODE_ENV === 'development';

export const IS_PROD = process.env.NODE_ENV === 'production';

const devDomain = 'ktsdev';
const domains = location.hostname.split('.');
const domain = domains[domains.length - 2];

export const IS_DEV = domain?.includes(devDomain) || IS_LOCAL_DEV;

export const [IS_IOS, IS_ANDROID] = [isIOS(), isAndroid()];
