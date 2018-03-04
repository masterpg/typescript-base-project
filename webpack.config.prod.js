const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(baseConfig, {
  entry: {
    'index': 'src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].bundle.[chunkhash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',  // ｢output.path｣を基準
      template: 'src/index.html',
      inject: true,
      basePath: '/',
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
  ],
});
