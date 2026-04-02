const { generateScopedNameFactory } = require('@dr.pogodin/babel-plugin-react-css-modules/utils');

module.exports = (api) => {
  api.cache(() => process.env.NODE_ENV);

  const IS_DEV = process.env.NODE_ENV === 'development';
  const IS_PROD = process.env.NODE_ENV === 'production';

  return {
    presets: [
      [
        require('@babel/preset-env'),
        {
          useBuiltIns: 'entry',
          corejs: 3,
          targets: IS_PROD
            ? '> 0.2%, not dead, not op_mini all, not IE 11'
            : 'last 1 chrome version, last 1 firefox version, last 1 safari version',
        },
      ],
      require('@babel/preset-react'),
      require('@babel/preset-typescript'),
    ],
    plugins: [
      IS_DEV && 'react-refresh/babel',
      [require('babel-plugin-styled-components'), { displayName: IS_DEV }],
      [require('@babel/plugin-proposal-decorators'), { legacy: true }],
      require('@babel/plugin-proposal-export-default-from'),
      [
        '@dr.pogodin/react-css-modules',
        {
          filetypes: {
            '.scss': {
              syntax: 'postcss-scss',
              plugins: ['postcss-nested'],
            },
          },
          generateScopedName: IS_PROD
            ? generateScopedNameFactory('[hash:base64]')
            : generateScopedNameFactory('[name]__[local]__[hash:base64:5]'),
          webpackHotModuleReloading: true,
          autoResolveMultipleImports: true,
          handleMissingStyleName: 'warn',
        },
      ],
    ].filter(Boolean),
  };
};
