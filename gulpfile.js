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

// 基準パスです。
// 例: /boo/foo/woo/ (パスの最初と最後は"/"をつけること)
const BASE_PATH = '/';

/**
 * ソースディレクトリです。
 */
const SRC_DIR = 'src';

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

//--------------------------------------------------
//  開発サーバー起動
//--------------------------------------------------

/**
 * 開発サーバーを起動します。
 */
gulp.task('serve', (done) => {
  return sequence(
    'clean:dev',
    'build:resources:dev',
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
 * webpack-dev-server(開発環境用)を起動します。
 */
gulp.task('webpack-dev-server', shell.task([
  `node_modules/.bin/webpack-dev-server --config webpack.config.${ENV_DEV}`,
]));

/**
 * browser-sync(本番環境用のビルド結果検証用)を起動します。
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

//--------------------------------------------------
//  ビルドタスク
//--------------------------------------------------

//------------------------------
//  本番環境用

let _orgOutputPath = '';
let _orgBasePath = '';
const regOutputPath = /\s*OUTPUT_PATH\s*=\s*["']([^"']*)["'];/;
const regBasePath = /\s*BASE_PATH\s*=\s*["']([^"']*)["'];/;

/**
 * 公開ディレクトリ(本番環境用)の構築を行います。
 */
gulp.task('build', (done) => {
  return sequence(
    'clean',
    'build:before:prod',
    'build:webpack:prod',
    'build:after:prod',
    done
  );
});

/**
 * webpack(本番環境用)を実行します。
 */
gulp.task('build:webpack:prod', shell.task([
  `node_modules/.bin/webpack --config webpack.config.${ENV_PROD}`
]));

/**
 * ビルド前処理を行います。
 */
gulp.task('build:before:prod', () => {
  // webpack.config.prod.js の内容を次のように書き換える
  //   OUTPUT_PATH = 'dist'; ⇒ OUTPUT_PATH = 'public';
  //   BASE_PATH = '/'; ⇒ BASE_PATH = '/aaa/bbb/ccc/';
  return gulp.src(['webpack.config.prod.js'])
    .pipe(replace(regOutputPath, (match, $1) => {
      _orgOutputPath = $1;
      return match.replace($1, OUTPUT_PATH);
    }))
    .pipe(replace(regBasePath, (match, $1) => {
      _orgBasePath = $1;
      return match.replace($1, BASE_PATH);
    }))
    .pipe(gulp.dest('./'));
});

/**
 * ビルド後処理を行います。
 */
gulp.task('build:after:prod', () => {
  // webpack.config.prod.js の内容を元に戻す
  //   OUTPUT_PATH = 'public'; ⇒ OUTPUT_PATH = '【元の値】';
  //   BASE_PATH = '/aaa/bbb/ccc/'; ⇒ BASE_PATH = '【元の値】';
  return gulp.src(['webpack.config.prod.js'])
    .pipe(replace(regOutputPath, (match, $1) => {
      return match.replace($1, _orgOutputPath);
    }))
    .pipe(replace(regBasePath, (match, $1) => {
      return match.replace($1, _orgBasePath);
    }))
    .pipe(gulp.dest('./'));
});

//------------------------------
//  開発環境用
// (開発サーバー起動時に使用)

/**
 * 公開ディレクトリ(開発環境用)の構築を行います。
 */
gulp.task('build:dev', () => {
  return sequence(
    'clean:dev',
    'build:resources:dev',
    'build:webpack:dev'
  );
});

/**
 * webpack(開発環境用)を実行します。
 */
gulp.task('build:webpack:dev', shell.task([
  `node_modules/.bin/webpack --config webpack.config.${ENV_DEV}`
]));

/**
 * 公開ディレクトリに開発環境用のリソースを準備します。
 */
gulp.task('build:resources:dev', () => {
  // node_modulesのシンボリックリンクを作成
  const node = vfs.src('node_modules', { followSymlinks: false })
    .pipe(vfs.symlink(OUTPUT_PATH));
  // bower_componentsのシンボリックリンクを作成
  const bower = vfs.src('bower_components', { followSymlinks: false })
    .pipe(vfs.symlink(OUTPUT_PATH));
  const manifest = vfs.src(`${SRC_DIR}/manifest.json`, { followSymlinks: false })
    .pipe(vfs.symlink(OUTPUT_PATH));
  // service-worker.jsのシンボリックリンクを作成
  const serviceWorker = vfs.src(`${SRC_DIR}/service-worker.js`, { followSymlinks: false })
    .pipe(vfs.symlink(OUTPUT_PATH));

  return merge(node, bower, manifest, serviceWorker);
});

//--------------------------------------------------
//  共通/その他
//--------------------------------------------------

/**
 * プロジェクトをクリーンします。
 */
gulp.task('clean', () => {
  return del([OUTPUT_PATH, CACHE_DIR]);
});

/**
 * 公開ディレクトリ(開発環境用)のクリーンを行います。
 */
gulp.task('clean:dev', () => {
  return del([
    path.join(OUTPUT_PATH, '**/*'),
    // path.join(`!${OUTPUT_PATH}`, 'images/**'),
  ]);
});
