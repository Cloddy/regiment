export const isAndroid = () => {
  const info = (navigator.platform ?? '') + navigator.userAgent;

  return info.toLowerCase().indexOf('android') > -1;
};
