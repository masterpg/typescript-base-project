const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

/**
 * ビルド結果の出力パス
 * 注意: この値は`gulp serve`コマンド実行時に設定されます
 */
const OUTPUT_PATH = 'public';

/**
 * 基準パス
 * 注意: この値は`gulp serve`コマンド実行時に設定されます
 */
const BASE_PATH = '/';

/**
 * キャッシュディレクトリ
 * 注意: この値は`gulp build`コマンド実行時に設定されます
 */
const CACHE_DIR = '.cache';

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: {
    'index': 'src/index.ts',
  },
  output: {
    path: path.join(__dirname, OUTPUT_PATH, BASE_PATH),
    filename: '[name].bundle.[chunkhash].js',
    publicPath: BASE_PATH,
  },
  plugins: [
    new CleanWebpackPlugin(
      [OUTPUT_PATH, CACHE_DIR],
      { verbose: true },
    ),
    new HtmlWebpackPlugin({
      filename: 'index.html',  // ｢output.path｣を基準
      template: 'src/index.html',
      inject: true,
      basePath: BASE_PATH,
      bundledScript: '',
    }),
    new webpack.NormalModuleReplacementPlugin(
      /app\/config\/config\.dev\.ts/,
      'config.prod.ts'
    ),
    new SWPrecacheWebpackPlugin({
      staticFileGlobs: [
        path.join(OUTPUT_PATH, BASE_PATH, 'bower_components/**/*'),
        path.join(OUTPUT_PATH, BASE_PATH, 'node_modules/**/*'),
        path.join(OUTPUT_PATH, BASE_PATH, 'index.bundle.*.js'),
        path.join(OUTPUT_PATH, BASE_PATH, 'index.html'),
        path.join(OUTPUT_PATH, BASE_PATH, 'manifest.json'),
      ],
      navigateFallback: 'index.html',
      navigateFallbackWhitelist: [/^(?!\/api).*$/],
      stripPrefix: path.join(OUTPUT_PATH, BASE_PATH),
    }),
  ],
});
