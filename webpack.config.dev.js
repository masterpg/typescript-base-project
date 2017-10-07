const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');
const path = require('path');
const webpack = require('webpack');

module.exports = merge(baseConfig, {
  output: {
    filename: '[name].bundle.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    hot: true,
    port: 5000,
  },
  plugins: [
    new webpack.IgnorePlugin(/vertx/),
    new webpack.HotModuleReplacementPlugin(),
  ],
  watch: true,
});
