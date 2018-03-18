const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
  mode: 'development',
  entry: {
    'index': 'src/index.ts',
    'test': 'test/test.ts',
  },
  output: {
    path: path.join(__dirname, OUTPUT_PATH, BASE_PATH),
    filename: '[name].bundle.js',
    publicPath: BASE_PATH,
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, OUTPUT_PATH),
    port: 5000,
    host: '0.0.0.0',
    disableHostCheck: true,
    // historyApiFallbackの設定は以下URLを参照:
    // https://github.com/webpack/docs/wiki/webpack-dev-server#the-historyapifallback-option
    historyApiFallback: {
      rewrites: [],
    },
    // proxy: {
    //   '/api/*': 'http://0.0.0.0:5001',
    // },
    hot: true,
  },
  plugins: [
    new CleanWebpackPlugin(
      [OUTPUT_PATH],
      { verbose: true },
    ),
    new webpack.IgnorePlugin(/vertx/),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html', // ｢output.path｣を基準
      template: 'src/index.html',
      inject: false,
      basePath: BASE_PATH,
      bundledScript: '<script type="text/javascript" src="index.bundle.js"></script>',
    }),
    new HtmlWebpackPlugin({
      filename: 'test.html', // ｢output.path｣を基準
      template: 'test/test.html',
      inject: false,
      bundledScript: '<script type="text/javascript" src="test.bundle.js"></script>',
    }),
    // `to: xxx`の`xxx`は`output.path`が基準になる
    new CopyWebpackPlugin([
      { from: 'node_modules/mocha/mocha.css', to: 'node_modules/mocha' },
      { from: 'node_modules/mocha/mocha.js', to: 'node_modules/mocha' },
      { from: 'node_modules/chai/chai.js', to: 'node_modules/chai' },
    ]),
  ],
});
