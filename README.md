# n0lendly

Googleカレンダー予約アプリ（仮）

demo: https://n0lendly.herokuapp.com/

---

# Setup for Mac

## 環境変数

環境変数を下記のように設定する。

```
# http
export PORT=8080

# Google OAuth2
export AUTH_CLIENT_ID=clientid
export AUTH_CLIENT_SECRET=clientsecret
export AUTH_REDIRECT_URI=http://example.com/login/callback

# PostgreSQL
export DB_HOST=127.0.0.1
export DB_PORT=5432
export DB_USER=username
export DB_NAME=dbname
export DB_PASSWORD=dbpassword
```

## PostgreSQL

RDBMSとして[PostgreSQL](https://qiita.com/_daisuke/items/13996621cf51f835494b)を使用

```
postgres -D /usr/local/var/postgres 
```

## Go 

### エントリーポイント

アプリケーションのエントリーポイントは`main.go`

```
go run main.go
```

でこれを起動する。

### パッケージ管理

パッケージ管理として[glide](https://github.com/Masterminds/glide)を使用しているため

```
$GOPATH/src/n0lendly
```

というディレクトリに対して

```
glide update
```

を行う。

## npm

開発時のみ、`n0lendly/tsx`で

```
npm install
```

また、`npm run build`もしくは`npm run watch`でビルドする。

## Google OAuth2

[Googleカレンダー](https://console.cloud.google.com/apis/library/calendar-json.googleapis.com/)のAPIを使う。

---

# Heroku

* アプリ本体をpush
* postgresqlを追加してアプリに紐付ける
* 環境変数を設定（PORTは設定しない）
