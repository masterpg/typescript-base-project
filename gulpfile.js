const gulp = require('gulp');
const path = require('path');
const del = require('del');
const sequence = require('run-sequence');
const merge = require('merge-stream');
const vfs = require('vinyl-fs');
const shell = require('gulp-shell');
const _ = require('lodash');
const browserSync = require('browser-sync');

const webpackStream = require('webpack-stream');
const webpack = require('webpack');

//----------------------------------------------------------------------
//
//  Constants
//
//----------------------------------------------------------------------

/**
 * Web公開ディレクトリです。
 */
const PUBLIC_DIR = 'public';

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
 * flowを実行します。
 */
gulp.task('flow', shell.task([
  './node_modules/.bin/flow'
], {ignoreErrors: true}));

/**
 * json-serverを起動します。
 */
gulp.task('json-server', shell.task([
  './node_modules/.bin/json-server --watch ./data/db.json --port 5001',
]));

gulp.task('browser-sync', () => {
  browserSync.init({
    port: 5000,
    ui: {port: 5005},
    open: false,
    server: {
      baseDir: "./public/",
    }
  });
});

/**
 * プロジェクトをクリーンします。
 */
gulp.task('clean', () => {
  return del(['public']);
});

//--------------------------------------------------
//  開発サーバー起動
//--------------------------------------------------

/**
 * 開発サーバーを起動します。
 */
gulp.task('serve', (done) => {
  // 変更監視処理
  gulp.watch(['src/**/*.js'], ['flow']);

  return sequence(
    'clean:dev',
    'build:dev',
    ['browser-sync', 'json-server'],
    done
  );
});

/**
 * 公開ディレクトリ(開発環境用)のクリーンを行います。
 */
gulp.task('clean:dev', () => {
  return del([
    path.join(PUBLIC_DIR, '**/*'),
    path.join('!' + PUBLIC_DIR, 'images/**'),
    path.join('!' + PUBLIC_DIR, 'app.bundle.*.js'),
  ]);
});

/**
 * webpack(開発環境用)を実行します。
 */
gulp.task('webpack:dev', shell.task([
  `webpack --config ./webpack.config.${ENV_DEV}`
]));

/**
 * 公開ディレクトリ(開発環境用)の構築を行います。
 */
gulp.task('build:dev', () => {
  return sequence(
    'build-dev-resources',
    'flow',
    'webpack:dev'
  );
});

/**
 * 公開ディレクトリに開発環境用のリソースを準備します。
 */
gulp.task('build-dev-resources', () => {
  // node_modulesのシンボリックリンクを作成
  const node = vfs.src('node_modules', {followSymlinks: false})
    .pipe(vfs.symlink(PUBLIC_DIR));
  const manifest = vfs.src('manifest.json', {followSymlinks: false})
    .pipe(vfs.symlink(PUBLIC_DIR));
  // service-worker.jsのシンボリックリンクを作成
  const serviceWorker = vfs.src('service-worker.js', {followSymlinks: false})
    .pipe(vfs.symlink(PUBLIC_DIR));

  return merge(node, manifest, serviceWorker);
});

//--------------------------------------------------
//  本番環境用ビルド
//--------------------------------------------------

/**
 * 公開ディレクトリ(本番環境用)の構築を行います。
 */
gulp.task('build', (done) => {
  return sequence(
    'clean',
    'webpack:prod',
    'build-prod-resources',
    'build-service-worker',
    done
  );
});

/**
 * ビルド結果を検証するための開発サーバーを起動します。
 */
gulp.task('serve:build', (done) => {
  return sequence(
    ['browser-sync', 'json-server'],
    done
  );
});

/**
 * webpack(本番環境用)を実行します。
 */
gulp.task('webpack:prod', shell.task([
  `webpack --config ./webpack.config.${ENV_PROD}`
]));

/**
 * 公開ディレクトリに本番環境用のリソースを準備します。
 */
gulp.task('build-prod-resources', () => {
  const files = gulp.src([
    'manifest.json',
  ]).pipe(gulp.dest(PUBLIC_DIR));

  const webcomponents = gulp.src(
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-*.js',
    {base: 'node_modules'}
  ).pipe(gulp.dest(path.join(PUBLIC_DIR, 'node_modules')));

  return merge(files, webcomponents);
});

/**
 * service-worker.jsを生成します。
 */
gulp.task('build-service-worker', shell.task([
  `cd ${PUBLIC_DIR} && sw-precache --config=../sw-precache-config.js`,
]));
