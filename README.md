# flow-base-project

## 環境構築

yarnをインストールします。

```console
$ npm install -g yarn
```

プロジェクトの依存パッケージをインストールします。

```console
$ yarn install
```


## 開発サーバー

開発サーバーを起動します。

```console
$ gulp serve
```

起動したらブラウザで`http://localhost:5000/`にアクセスすることで画面が表示されます。


## プロジェクトビルド

次のコマンドで本番環境を想定したプロジェクトをビルドすることができます。

```console
$ gulp build 
```

ビルド結果を検証したい場合、次のコマンドでビルド結果の検証用サーバーを起動します。

```console
$ gulp serve:prod
```

起動したらブラウザで`http://localhost:5000/`にアクセスすることで画面が表示されます。

