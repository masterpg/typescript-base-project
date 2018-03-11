const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

// ビルド結果の出力パス
// 注意: この値は`gulp build`コマンド実行時に設定されます
const OUTPUT_PATH = 'public';

// 基準パス
// 注意: この値は`gulp build`コマンド実行時に設定されます
const BASE_PATH = '/';

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: {
    'index': 'src/index.ts',
  },
  output: {
    path: path.join(__dirname, OUTPUT_PATH, BASE_PATH),
    filename: '[name].bundle.[chunkhash].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',  // ｢output.path｣を基準
      template: 'src/index.html',
      inject: true,
      basePath: BASE_PATH,
      bundledScript: '',
    }),
    new webpack.NormalModuleReplacementPlugin(
      /environments\/environment\.ts/,
      'environment.prod.ts'
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
  devServer: {
    contentBase: path.resolve(__dirname, OUTPUT_PATH),
    port: 5010,
    host: '0.0.0.0',
    disableHostCheck: true,
    proxy: {
      '/api/*': 'http://0.0.0.0:5001',
    },
  },
});
