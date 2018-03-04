const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(baseConfig, {
  entry: {
    'public/index': 'src/index.ts',
    'public/test': 'test/test.ts',
  },
  output: {
    path: __dirname,
    filename: '[name].bundle.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: __dirname,
    hot: true,
    port: 5000,
  },
  plugins: [
    new webpack.IgnorePlugin(/vertx/),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'public/index.html',
      template: 'src/index.html',
      inject: false,
      basePath: '',
      bundledScript: '<script type="text/javascript" src="index.bundle.js"></script>',
    }),
    new HtmlWebpackPlugin({
      filename: 'public/test.html', // ｢output.path｣を基準
      template: 'test/test.html',
      inject: false,
      bundledScript: '<script type="text/javascript" src="test.bundle.js"></script>',
    }),
    new CopyWebpackPlugin([{
      from: 'src/images',
      to: 'public/images', // ｢output.path｣を基準
    }]),
  ],
});