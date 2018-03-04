const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, 'tsconfig.json') })],
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
        use: [{
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              sourceMap: true,
            },
          },
        }],
        exclude: [/node_modules/, /bower_components/],
      },
      {
        // ｢/src/index.html｣と｢/test/test.html｣を対象外とし、｢.html｣ファイルが対象
        // 参考: http://nymemo.com/phpcate/293/
        test: /^(?!.*(?:\/src\/index.html|\/test\/test.html)).*\.html$/,
        use: {
          loader: 'html-loader'
        }
      },
    ]
  },
  plugins: [
    new ImageminPlugin({
      test: /images\/[^\.]+\.(jpe?g|png|gif|svg)$/i,
      cacheFolder: '.cache'
    }),
  ],
};
