const gulp = require('gulp');
const path = require('path');
const del = require('del');
const sequence = require('run-sequence');
const merge = require('merge-stream');
const vfs = require('vinyl-fs');
const shell = require('gulp-shell');
const _ = require('lodash');
const browserSync = require('browser-sync');
const replace = require('gulp-replace');

//----------------------------------------------------------------------
//
//  Constants
//
//----------------------------------------------------------------------

/**
 * ビルド結果の出力パスです。
 */
const OUTPUT_PATH = 'public';

/**
 * 基準パスです。
 * 例: /boo/foo/woo/ (パスの最初と最後は"/"をつけること)
 */
const BASE_PATH = '/';

/**
 * キャッシュディレクトリです。
 */
const CACHE_DIR = '.cache';

/**
 * 環境定数(開発)です。
 */
const ENV_DEV = 'dev';

/**
 * 環境定数(本番)です。
 */
const ENV_PROD = 'prod';

//----------------------------------------------------------------------
//
//  Tasks
//
//----------------------------------------------------------------------

/**
 * json-serverを起動します。
 */
gulp.task('json-server', shell.task([
  'node json-server.js',
]));

//--------------------------------------------------
//  本番環境用タスク
//--------------------------------------------------

/**
 * 本番環境用のビルド結果を検証するための開発サーバーを起動します。
 */
gulp.task('serve:prod', (done) => {
  return sequence(
    ['browser-sync', 'json-server'],
    done
  );
});

/**
 * browser-syncを起動します。
 */
gulp.task('browser-sync', () => {
  browserSync.init({
    port: 5010,
    ui: { port: 5015 },
    open: false,
    server: {
      baseDir: OUTPUT_PATH,
    }
  });
});

/**
 * ビルドを実行します。
 */
gulp.task('build', (done) => {
  return sequence(
    // 'clean',
    'build:before:prod',
    'build:webpack:prod',
    done
  );
});

/**
 * webpackを実行します。
 */
gulp.task('build:webpack:prod', shell.task([
  `node_modules/.bin/webpack --config webpack.config.${ENV_PROD}`
]));

/**
 * ビルド前処理を行います。
 */
gulp.task('build:before:prod', () => {
  return replaceWebpackConfigPath(ENV_PROD, OUTPUT_PATH, BASE_PATH);
});

//--------------------------------------------------
//  開発環境用タスク
//--------------------------------------------------

/**
 * 開発サーバーを起動します。
 */
gulp.task('serve', (done) => {
  return sequence(
    'build:before:dev',
    ['webpack-dev-server', 'json-server'],
    done
  );
});

/**
 * webpack-dev-serverを起動します。
 */
gulp.task('webpack-dev-server', shell.task([
  `node_modules/.bin/webpack-dev-server --config webpack.config.${ENV_DEV}`,
]));

/**
 * ビルドを実行します。
 */
gulp.task('build:dev', () => {
  return sequence(
    'build:before:dev',
    'build:webpack:dev'
  );
});

/**
 * ビルド前処理を行います。
 */
gulp.task('build:before:dev', () => {
  return replaceWebpackConfigPath(ENV_DEV, OUTPUT_PATH, BASE_PATH);
});

/**
 * webpackを実行します。
 */
gulp.task('build:webpack:dev', shell.task([
  `node_modules/.bin/webpack --config webpack.config.${ENV_DEV}`
]));

//--------------------------------------------------
//  共通/その他
//--------------------------------------------------

/**
 * プロジェクトをクリーンします。
 */
gulp.task('clean', () => {
  return del([OUTPUT_PATH, CACHE_DIR]);

  // 削除対象の除外例をのコメントで残しておく:
  // return del([
  //   path.join(OUTPUT_PATH, '**/*'),
  //   path.join(`!${OUTPUT_PATH}`, 'images/**'),
  // ]);
});

//----------------------------------------------------------------------
//
//  Functions
//
//----------------------------------------------------------------------

/**
 * webpack.config.[env].js の内容を次のように書き換えます。
 *   OUTPUT_PATH = 'dist'; ⇒ OUTPUT_PATH = '[outputPath]';
 *   BASE_PATH = '/'; ⇒ BASE_PATH = '[basePath]';
 *
 * @param env
 * @param outputPath
 * @param basePath
 */
function replaceWebpackConfigPath(env, outputPath, basePath) {
  const REG_OUTPUT_PATH = /\s*OUTPUT_PATH\s*=\s*(["'][^"']*["']);/;
  const REG_BASE_PATH = /\s*BASE_PATH\s*=\s*(["'][^"']*["']);/;
  const REG_CACHE_DIR = /\s*CACHE_DIR\s*=\s*(["'][^"']*["']);/;

  // webpack.config.prod.js の内容を次のように書き換える
  //   OUTPUT_PATH = 'dist'; ⇒ OUTPUT_PATH = 'public';
  //   BASE_PATH = '/'; ⇒ BASE_PATH = '/aaa/bbb/ccc/';
  return gulp.src([`webpack.config.${env}.js`])
    .pipe(replace(REG_OUTPUT_PATH, (match, $1) => {
      return match.replace($1, `'${outputPath}'`);
    }))
    .pipe(replace(REG_BASE_PATH, (match, $1) => {
      return match.replace($1, `'${basePath}'`);
    }))
    .pipe(replace(REG_CACHE_DIR, (match, $1) => {
      return match.replace($1, `'${CACHE_DIR}'`);
    }))
    .pipe(gulp.dest('./'));
}
