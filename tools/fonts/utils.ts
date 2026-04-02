import { FONT_FORMAT } from './mappings';
import type { FontFormatExt, FontProps } from './types';

const isUrl = (str: string) => /^(https?|ftp):\/\//.test(str);

export interface FontBuilderProps {
  isLocal?: boolean;
}

export const DATA_FONT_PRELOAD_LAZY_SRC = 'data-font-preload-lazy-src';

const getNormalizedPath = ({
  basePath,
  fileNamePostfix,
  format,
  isLocal,
}: {
  basePath: string;
  fileNamePostfix: string;
  format: FontFormatExt;
  isLocal?: boolean;
}) => {
  let normalizedBasePath = basePath;

  if (!isUrl(basePath)) {
    normalizedBasePath = basePath.replace(/^\.?\//, '');
    normalizedBasePath = isLocal ? `./${normalizedBasePath}` : `/${normalizedBasePath}`;
  }

  return `${normalizedBasePath}${fileNamePostfix}.${format}`;
};

export const getFontPreloadLinksBuilder = ({
  isLocal,
  preloadFormats = [],
}: FontBuilderProps & { preloadFormats?: FontFormatExt[] }) => {
  const testSet = new Set(preloadFormats);
  const testPredicate = testSet.size === 0 ? () => true : testSet.has.bind(testSet);

  return ({ basePath, variants, formats }: FontProps) => {
    if (isLocal && !isUrl(basePath)) {
      return '';
    }

    return variants
      .flatMap(({ fileNamePostfix }) =>
        formats.filter(testPredicate).map((format) => {
          const fullPath = getNormalizedPath({ basePath, fileNamePostfix, format, isLocal });

          return `
            <link
              rel="preload"
              as="font"
              type="font/${format}"
              crossOrigin="anonymous"
              ${DATA_FONT_PRELOAD_LAZY_SRC}="${fullPath}"
            />
          `
            .trim()
            .replace(/\s+/g, ' ');
        })
      )
      .join('\n');
  };
};

export const getFontFaceCSSBuilder =
  ({ isLocal }: FontBuilderProps) =>
  ({ name, basePath, variants, display = 'auto', formats }: FontProps) => {
    return variants
      .flatMap(({ fileNamePostfix, ...variant }) => {
        const srcSet = formats
          .map((format) => {
            const fullPath = getNormalizedPath({ basePath, fileNamePostfix, format, isLocal });

            return `url("${fullPath}") format("${FONT_FORMAT[format]}")`;
          })
          .join(', ');

        return `
          @font-face {
            font-family: "${name}";
            src: local("${name}"), ${srcSet};
            font-weight: ${variant.weight ?? 400};
            font-style: ${variant.style ?? 'normal'};
            font-display: ${display};
          }
        `
          .trim()
          .replace(/\s\s+/g, '\n');
      })
      .join('\n');
  };
