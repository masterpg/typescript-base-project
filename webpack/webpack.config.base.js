const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = {
  entry: {
    'index': path.join(process.cwd(), '/src/index.ts'),
  },
  output: {
    path: path.join(process.cwd(), 'public'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: path.join(process.cwd(), 'tsconfig.json') })],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        loader: 'tslint-loader',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /bower_components/],
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      },
    ]
  },
  plugins: [
    // webpackでバンドルされたファイル(index.bundle.js等)のscriptタグを
    // 指定したhtmlに自動で埋め込んでくれるプラグイン
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
    }),
    new CopyWebpackPlugin([{
      from: path.join(process.cwd(), 'src/images'),
      to: path.join(process.cwd(), 'public/images'),
    }]),
    new ImageminPlugin({
      test: /images\/[^\.]+\.(jpe?g|png|gif|svg)$/i,
      cacheFolder: '.cache'
    }),
  ],
};
