import path from 'path';

import { getLocalIdent } from '@dr.pogodin/babel-plugin-react-css-modules/utils';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import SentryWebpackPlugin from '@sentry/webpack-plugin';
import autoprefixer from 'autoprefixer';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { htmlWebpackPluginTemplateCustomizer } from 'template-ejs-loader';
import TerserPlugin from 'terser-webpack-plugin';
import {
  DefinePlugin,
  ProgressPlugin,
  type WebpackPluginInstance,
  type Configuration,
  type ModuleOptions,
  type RuleSetRule,
  type ResolveOptions,
} from 'webpack';
import { type Configuration as DevServerConfiguration } from 'webpack-dev-server';

import { buildFontsInject } from './tools/fonts';
import tsConfig from './tsconfig.json';

const SRC_PATH = path.resolve(__dirname, 'src');

const PUBLIC_PATH = path.resolve(__dirname, 'public');

const buildFilePath = (entryPath: string, filename: string) =>
  path.join('static', entryPath, filename);

const {
  NODE_ENV = '',
  CI_COMMIT_REF_SLUG = '',
  CI_COMMIT_SHORT_SHA = '',
  SENTRY_AUTH_TOKEN = '',
  IS_ODR: IS_ODR_STR = '',
  SENTRY_URL = '',
  SENTRY_ORG = '',
  SENTRY_PROJECT = '',
} = process.env;

const IS_PROD = NODE_ENV === 'production';

const IS_ODR = IS_ODR_STR === 'true';

const IS_DEFAULT_BRANCH = new Set(['main', 'master']).has(CI_COMMIT_REF_SLUG ?? '');

const { INJECT_FONTS_PRELOAD_LINKS, INJECT_FONTS_FACES } = buildFontsInject({ isLocal: IS_ODR });

/* RULES ANS LOADERS SECTION START */

const RULES_REGEXP = {
  nodeModules: /node_modules/,
  htmlTemplate: /\.html.ejs$/i,
  scripts: /\.([tj])sx?$/,
  styles: /\.(s?css|sass)$/,
  stylesModules: /\.modules?\.(s?css|sass)$/,
  images: /\.(png|jpe?g|webp|svg)$/,
  svg: /\.svg$/i,
  fonts: /\.(woff2)$/,
  staticFonts: /static\/fonts\/.+\.(woff2)$/,
};

const getCSSLoader = (withModules = false): RuleSetRule['use'] => [
  IS_PROD
    ? {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../../',
        },
      }
    : {
        loader: 'style-loader',
      },
  {
    loader: 'css-loader',
    options: {
      modules: withModules && {
        getLocalIdent,
        localIdentName: IS_PROD ? '[hash:base64]' : '[name]__[local]__[hash:base64:5]',
      },
      importLoaders: 2,
      sourceMap: false,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        config: path.resolve(__dirname, 'postcss.config.js'),
        plugins: () => [autoprefixer()],
      },
    },
  },
  {
    loader: 'sass-loader',
    options: {
      sassOptions: {
        includePaths: [SRC_PATH, path.join(SRC_PATH, 'styles')],
      },
    },
  },
];

const getRules = (): ModuleOptions['rules'] => [
  {
    test: RULES_REGEXP.htmlTemplate,
    use: ['html-loader', 'template-ejs-loader'],
  },
  {
    test: RULES_REGEXP.scripts,
    exclude: RULES_REGEXP.nodeModules,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          plugins: [!IS_PROD && require.resolve('react-refresh/babel')].filter(Boolean),
        },
      },
    ],
  },
  {
    test: RULES_REGEXP.styles,
    exclude: RULES_REGEXP.stylesModules,
    use: getCSSLoader(false),
  },
  {
    test: RULES_REGEXP.stylesModules,
    use: getCSSLoader(true),
  },
  {
    test: RULES_REGEXP.images,
    exclude: RULES_REGEXP.svg,
    type: 'asset',
    generator: {
      filename: buildFilePath('img', '[name].[hash][ext]'),
    },
  },
  {
    test: RULES_REGEXP.svg,
    resourceQuery: { not: [/react/] }, // exclude if *.svg?react
    type: 'asset',
    generator: {
      filename: buildFilePath('img', '[name].[hash][ext]'),
    },
  },
  {
    test: RULES_REGEXP.svg,
    resourceQuery: /react/, // include if *.svg?react
    issuer: /\.[jt]sx?$/,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          ref: true,
          memo: true,
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                    cleanupIds: false,
                  },
                },
              },
              'prefixIds',
            ],
          },
        },
      },
    ],
  },
  {
    test: RULES_REGEXP.fonts,
    type: 'asset/resource',
    exclude: RULES_REGEXP.staticFonts,
    generator: {
      filename: 'static/fonts/[name].[hash][ext]',
    },
  },
  {
    test: RULES_REGEXP.staticFonts,
    type: 'asset/resource',
    generator: {
      emit: false,
    },
  },
];

/* RULES ANS LOADERS  SECTION END */

/* PLUGINS SECTION START */

const getProdPlugins = (): (WebpackPluginInstance | boolean | '')[] => [
  new MiniCssExtractPlugin({
    filename: buildFilePath('css', 'bundle.[name].[contenthash].css'),
  }),
  new CleanWebpackPlugin(),
  new ForkTsCheckerWebpackPlugin(),
  SENTRY_AUTH_TOKEN &&
    IS_DEFAULT_BRANCH &&
    new SentryWebpackPlugin({
      authToken: SENTRY_AUTH_TOKEN,
      url: SENTRY_URL,
      org: SENTRY_ORG,
      project: SENTRY_PROJECT,
      release: `${CI_COMMIT_SHORT_SHA}${IS_ODR ? '-odr' : ''}`,
      include: './public',
      ignore: ['node_modules', 'webpack.config.js'],
      cleanArtifacts: true,
      debug: true,
    }),
];

const getDevPlugins = (): WebpackPluginInstance[] => [
  new ReactRefreshWebpackPlugin(),
  new ForkTsCheckerWebpackPlugin({
    typescript: {
      configFile: path.resolve(__dirname, 'tsconfig.json'),
    },
  }),
];

const getPlugins = (): WebpackPluginInstance[] =>
  [
    new ProgressPlugin(),
    new DefinePlugin({
      ['process.env']: {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        API_URL: JSON.stringify(process.env.API_URL),
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: htmlWebpackPluginTemplateCustomizer({
        templatePath: path.join(SRC_PATH, 'index.html.ejs'),
        htmlLoaderOption: {},
        templateEjsLoaderOption: {
          delimiter: '|',
          openDelimiter: '{',
          closeDelimiter: '}',
          data: {
            INJECT_FONTS_PRELOAD_LINKS,
            INJECT_FONTS_FACES,
          },
        },
      }),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(SRC_PATH, 'static'),
          to: path.join(PUBLIC_PATH, 'static'),
          noErrorOnMissing: true,
        },
      ],
    }),
    ...(IS_PROD ? getProdPlugins() : getDevPlugins()),
  ].filter(Boolean) as WebpackPluginInstance[];

/* PLUGINS SECTION END */

/* DEV SERVER SECTION START */

const proxyPort = process.env.API_PROXY_PORT;

const proxyTarget = proxyPort
  ? `https://localhost:${proxyPort}`
  : 'https://regiment-25-front.ktsdev.ru';

const getDevServer = (): DevServerConfiguration => ({
  host: '0.0.0.0',
  port: '9091',
  historyApiFallback: true,
  hot: true,
  server: 'https',
  proxy: [
    {
      context: ['/api'],
      changeOrigin: true,
      secure: true,
      target: proxyTarget,
    },
  ],
});

/* DEV SERVER SECTION END */

/* ALIASES SECTION START */

const getAliases = (): ResolveOptions => ({
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'],
  alias: Object.fromEntries(
    Object.keys(tsConfig.compilerOptions.paths)
      .map((alias) => alias.replace('/*', ''))
      .map((alias) => [alias, path.join(SRC_PATH, alias)])
  ),
});

/* ALIASES SECTION END */

/* OPTIMIZATION SECTION START */

const getOptimizations = (): Configuration['optimization'] => ({
  minimize: IS_PROD,
  minimizer: IS_PROD
    ? [
        new TerserPlugin({
          terserOptions: {
            sourceMap: true,
          },
        }),
        new CssMinimizerPlugin(),
      ]
    : [],
});

/* OPTIMIZATION SECTION END */

const config: Configuration = {
  entry: path.resolve(SRC_PATH, 'main.tsx'),
  mode: IS_PROD ? 'production' : 'development',
  devtool: IS_PROD ? 'hidden-source-map' : 'source-map',
  output: {
    path: PUBLIC_PATH,
    publicPath: IS_ODR ? './' : '/',
    filename: buildFilePath('js', '[name].[contenthash:8].js'),
  },
  resolve: getAliases(),
  optimization: getOptimizations(),
  module: {
    rules: getRules(),
  },
  plugins: getPlugins(),
  devServer: getDevServer(),
};

export default config;
