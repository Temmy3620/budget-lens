# Budget Lens

予算の管理と可視化を行う Next.js アプリケーションです。

## 🚀 開発サーバーの起動

開発サーバーをポート `3005` で起動します。

```bash
pnpm dev
```

起動後、ブラウザで [http://localhost:3005](http://localhost:3005) を開いて確認できます。

---

## ⚡ Supabase 開発・管理コマンド

プロジェクトには、Supabase と連携するための各種コマンドが定義されています。

### 1. Supabase CLI へのログイン
Supabase アカウントと連携するためにログインを行います。

```bash
pnpm supabase:login
```

### 2. リモートプロジェクトとの紐付け
リモートの Supabase プロジェクトとローカル環境をリンクします。実行前に環境変数 `SUPABASE_PROJECT_ID` にプロジェクトの参照IDを設定してください。

```bash
# プロジェクトIDを設定してからリンクを実行
export SUPABASE_PROJECT_ID="あなたのプロジェクトID"
pnpm supabase:link
```

### 3. マイグレーションのデプロイ
ローカルで作成したマイグレーションファイル（`supabase/migrations/` 内）をリモートデータベースへ反映します。

```bash
pnpm supabase:deploy
```

### 4. シードデータの投入
テスト用のユーザー情報（`supabase/seed.sql` 内）をリモートデータベースに直接流し込みます。

```bash
pnpm supabase:seed
```

---

## 🔑 シードデータのパスワード設定方法

`supabase/seed.sql` に設定するパスワードは、セキュリティのために **SHA-256** でハッシュ化されたものである必要があります。

### ハッシュ値の生成手順
ターミナルで以下のコマンドを実行し、生成された64文字の文字列を `supabase/seed.sql` の `password_hash` 列の値に設定してください。

```bash
node -e "console.log(require('crypto').createHash('sha256').update('設定したい平文パスワード').digest('hex'))"
```

---

## 🛠️ 技術スタック
- **Framework**: Next.js v16.2 (App Router)
- **Runtime / Package Manager**: Node.js & pnpm
- **Styling**: Tailwind CSS v4 (globals.css 内の `@theme inline` でカスタマイズ)
- **Database / Backend**: Supabase
