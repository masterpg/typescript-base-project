const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'index': `${process.cwd()}/src/index.ts`,
  },
  output: {
    path: path.join(process.cwd(), 'public'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
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
        exclude: /node_modules/
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
  ],
};
