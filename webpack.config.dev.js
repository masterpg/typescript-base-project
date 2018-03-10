const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: {
    'index': 'src/index.ts',
    'test': 'test/test.ts',
  },
  output: {
    path: __dirname,
    filename: '[name].bundle.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    hot: true,
    port: 5000,
  },
  plugins: [
    new webpack.IgnorePlugin(/vertx/),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html', // ｢output.path｣を基準
      template: 'src/index.html',
      inject: false,
      basePath: '',
      bundledScript: '<script type="text/javascript" src="index.bundle.js"></script>',
    }),
    new HtmlWebpackPlugin({
      filename: 'test.html', // ｢output.path｣を基準
      template: 'test/test.html',
      inject: false,
      bundledScript: '<script type="text/javascript" src="test.bundle.js"></script>',
    }),
  ],
});
