# Budget Lens - Gemini / Antigravity ガイド

このファイルは、本プロジェクトで作業する Gemini および Antigravity エージェント向けの開発手順、コマンドのショートカット、スタイリングとルーティングの規則をまとめたものです。

## 0. AIへの指示 (AI Instructions)
- **応答言語**: ユーザーへの回答や対話は、原則として**常に日本語**で行ってください。(Please always respond to the user in Japanese.)

## 主要な技術スタックとバージョン
- **Next.js**: v16.2.9 (App Router 使用)
- **React**: v19.2.4
- **パッケージマネージャー**: `pnpm` (v10.15.1)
- **スタイリング**: Tailwind CSS v4.3.1

## 参考リファレンス
- 基本的な開発ルールは [AGENTS.md](file:///Users/temmy/budget-lens/budget-lens/AGENTS.md) に記載されています。
- バージョン固有の Next.js ガイドは `node_modules/next/dist/docs/` に格納されています。

## よく使うコマンド

- **開発サーバー起動**: `pnpm dev` （ポート `3005` で起動）
- **本番用ビルド**: `pnpm build`
- **本番サーバー起動**: `pnpm start` （ポート `3005` で起動）
- **静的解析 (Linter)**: `pnpm lint`

## プロジェクトの規約

### インポートと TypeScript 設定
- ルートパスのエイリアスは `@/*` で、プロジェクトのルートディレクトリ `./*` を指します（[tsconfig.json](file:///Users/temmy/budget-lens/budget-lens/tsconfig.json) を参照）。
  - 例: `import Layout from "@/app/layout"` など

### スタイリング (Tailwind CSS v4)
- グローバルスタイルおよび構成は [globals.css](file:///Users/temmy/budget-lens/budget-lens/app/globals.css) に記述されています。
- **注意**: Tailwind CSS v4 が導入されており、テーマのカスタマイズは CSS ファイル内の `@theme inline` ブロックで定義されます。**`tailwind.config.js` や `tailwind.config.ts` は作成しないでください。**

### ルーティングとナビゲーション
- Next.js の App Router を使用しています（[app/](file:///Users/temmy/budget-lens/budget-lens/app) ディレクトリ以下）。
- クライアントサイドの遷移（ナビゲーション）が遅い問題を修正する場合は、`Suspense` だけでは不十分です。ルートページから `unstable_instant` をエクスポートする必要があります。詳細は `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md` を参照してください。
