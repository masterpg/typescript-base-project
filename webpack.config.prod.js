const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

// ビルド結果の出力パス
const OUTPUT_PATH = 'public';

// 基準パス
// 例: /aaa/bbb/ccc/ (パスの最初と最後は"/"をつけること)
const BASE_PATH = '/';

module.exports = merge(baseConfig, {
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
    new CopyWebpackPlugin([{
      from: 'src/images',
      to: 'images', // ｢output.path｣を基準
    }]),
    new CopyWebpackPlugin([
      {
        from: 'src/manifest.json',
      }, {
        from: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-*.js',
      }, {
        from: 'node_modules/reflect-metadata/Reflect.js',
        to: 'node_modules/reflect-metadata', // ｢output.path｣を基準
      }, {
        from: 'bower_components/polymer-decorators/polymer-decorators.js',
        to: 'bower_components/polymer-decorators', // ｢output.path｣を基準
      },
    ]),
    new SWPrecacheWebpackPlugin({
      staticFileGlobs: [
        path.join(OUTPUT_PATH, BASE_PATH, 'bower_components/**/*'),
        path.join(OUTPUT_PATH, BASE_PATH, 'node_modules/**/*'),
        path.join(OUTPUT_PATH, BASE_PATH, 'index.bundle.*.js'),
        path.join(OUTPUT_PATH, BASE_PATH, 'index.html'),
        path.join(OUTPUT_PATH, BASE_PATH, 'manifest.json'),
      ],
      navigateFallback: 'index.html',
      stripPrefix: path.join(OUTPUT_PATH, BASE_PATH),
    }),
  ],
});
