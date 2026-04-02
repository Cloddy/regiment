import bgImageDesktop from './bg-image-desktop.jpg';
import bgImage from './bg-image.jpg';
import check from './check.svg';
import info from './info.svg';
import loaderBg from './loader-bg.svg';
import loader from './loader.png';
import modalBg from './modal-bg.png';
import modalLogo from './modal-logo.png';
import stub from './stub-image.jpg';

export const COMMON_IMAGES: Record<string, string> = {
  bgImage,
  bgImageDesktop,
  check,
  info,
  loader,
  modalBg,
  modalLogo,
  stub,
  loaderBg,
};

export const COMMON_IMAGES_STATIC: string[] = Object.values(COMMON_IMAGES);
