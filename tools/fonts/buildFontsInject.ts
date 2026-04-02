import { FONTS } from './config';
import {
  getFontPreloadLinksBuilder,
  getFontFaceCSSBuilder,
  FontBuilderProps,
  DATA_FONT_PRELOAD_LAZY_SRC,
} from './utils';

export const buildFontsInject = (
  params: FontBuilderProps = {}
): {
  INJECT_FONTS_PRELOAD_LINKS: string;
  INJECT_FONTS_FACES: string;
} => {
  const buildFontFace = getFontFaceCSSBuilder(params);
  const buildPreloadLinks = getFontPreloadLinksBuilder({ ...params, preloadFormats: ['woff2'] });

  const INJECT_FONTS_PRELOAD_LINKS = FONTS.map(buildPreloadLinks).join('\n').concat(`
    <script type="text/javascript">
      document.head.querySelectorAll('[${DATA_FONT_PRELOAD_LAZY_SRC}]')
        .forEach((link) => {
          link.href = link.getAttribute('${DATA_FONT_PRELOAD_LAZY_SRC}');
          link.removeAttribute('${DATA_FONT_PRELOAD_LAZY_SRC}');
        });
    </script>
`);

  const INJECT_FONTS_FACES = FONTS.map(buildFontFace).join('\n');

  return {
    INJECT_FONTS_PRELOAD_LINKS,
    INJECT_FONTS_FACES,
  };
};
