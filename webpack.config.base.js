const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
    new CopyWebpackPlugin([{
      from: 'src/images',
      to: 'images', // ｢output.path｣を基準
    }]),
    new ImageminPlugin({
      test: /images\/[^\.]+\.(jpe?g|png|gif|svg)$/i,
      cacheFolder: '.cache'
    }),
  ],
};
