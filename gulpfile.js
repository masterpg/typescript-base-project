const gulp = require('gulp');
const path = require('path');
const del = require('del');
const sequence = require('run-sequence');
const merge = require('merge-stream');
const vfs = require('vinyl-fs');
const shell = require('gulp-shell');
const _ = require('lodash');
const browserSync = require('browser-sync');

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

//--------------------------------------------------
//  開発サーバー起動
//--------------------------------------------------

/**
 * 開発サーバーを起動します。
 */
gulp.task('serve', (done) => {
  return sequence(
    'clean:dev',
    'build:dev',
    ['webpack-dev-server', 'json-server'],
    done
  );
});

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
 * json-serverを起動します。
 */
gulp.task('json-server', shell.task([
  'node_modules/.bin/json-server --watch data/db.json --port 5001',
]));

/**
 * webpack-dev-serverを起動します。
 */
gulp.task('webpack-dev-server', shell.task([
  'node_modules/.bin/webpack-dev-server --config webpack/webpack.config.dev.js',
]));

/**
 * browser-syncを起動します。
 */
gulp.task('browser-sync', () => {
  browserSync.init({
    port: 5000,
    ui: { port: 5005 },
    open: false,
    server: {
      baseDir: "./public/",
    }
  });
});

//--------------------------------------------------
//  ビルドタスク
//--------------------------------------------------

//------------------------------
//  本番環境用

/**
 * 公開ディレクトリ(本番環境用)の構築を行います。
 */
gulp.task('build', (done) => {
  return sequence(
    'clean',
    'build:webpack:prod',
    'build:resources:prod',
    'build:service-worker',
    done
  );
});

/**
 * webpack(本番環境用)を実行します。
 */
gulp.task('build:webpack:prod', shell.task([
  `node_modules/.bin/webpack --config webpack/webpack.config.${ENV_PROD}`
]));

/**
 * 公開ディレクトリに本番環境用のリソースを準備します。
 */
gulp.task('build:resources:prod', () => {
  const files = gulp.src([
    'src/manifest.json',
  ]).pipe(gulp.dest(PUBLIC_DIR));

  const webcomponents = gulp.src(
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-*.js',
    { base: 'node_modules' }
  ).pipe(gulp.dest(path.join(PUBLIC_DIR, 'node_modules')));

  return merge(files, webcomponents);
});

/**
 * service-worker.jsを生成します。
 */
gulp.task('build:service-worker', shell.task([
  `cd ${PUBLIC_DIR} && sw-precache --config=../src/sw-precache-config.js`,
]));

//------------------------------
//  開発環境用
// (開発サーバー起動時に使用)

/**
 * 公開ディレクトリ(開発環境用)の構築を行います。
 */
gulp.task('build:dev', () => {
  return sequence(
    'build:resources:dev',
    'build:webpack:dev'
  );
});

/**
 * webpack(開発環境用)を実行します。
 */
gulp.task('build:webpack:dev', shell.task([
  `node_modules/.bin/webpack --config webpack/webpack.config.${ENV_DEV}`
]));

/**
 * 公開ディレクトリに開発環境用のリソースを準備します。
 */
gulp.task('build:resources:dev', () => {
  // node_modulesのシンボリックリンクを作成
  const node = vfs.src('node_modules', { followSymlinks: false })
    .pipe(vfs.symlink(PUBLIC_DIR));
  // imagesのシンボリックリンクを作成
  const images = vfs.src('src/images', { followSymlinks: false })
    .pipe(vfs.symlink(PUBLIC_DIR));
  // manifest.jsonのシンボリックリンクを作成
  const manifest = vfs.src('src/manifest.json', { followSymlinks: false })
    .pipe(vfs.symlink(PUBLIC_DIR));
  // service-worker.jsのシンボリックリンクを作成
  const serviceWorker = vfs.src('src/service-worker.js', { followSymlinks: false })
    .pipe(vfs.symlink(PUBLIC_DIR));

  return merge(node, images, manifest, serviceWorker);
});

//--------------------------------------------------
//  共通/その他
//--------------------------------------------------

/**
 * プロジェクトをクリーンします。
 */
gulp.task('clean', () => {
  return del(['public']);
});

/**
 * 公開ディレクトリ(開発環境用)のクリーンを行います。
 */
gulp.task('clean:dev', () => {
  return del([
    path.join(PUBLIC_DIR, '**/*'),
    path.join(`!${PUBLIC_DIR}`, 'images/**'),
    path.join(`!${PUBLIC_DIR}`, 'app.bundle.js'),
  ]);
});
