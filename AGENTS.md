<!-- BEGIN:nextjs-agent-rules -->
# あなたの知っているNext.jsではありません

このバージョンには破壊的変更が含まれており、API、規約、ファイル構造がトレーニングデータと異なる場合があります。コードを記述する前に、`node_modules/next/dist/docs/` にある関連ガイドを確認してください。非推奨（deprecated）のアラートに注意してください。
<!-- END:nextjs-agent-rules -->

# プロジェクトの概要とガイドライン

## 0. プロジェクトのスタックと環境
- **フレームワーク**: Next.js (v16.2) App Routerを使用。
- **パッケージマネージャー**: `pnpm` (run tasks using `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`).
- **ポート**: デフォルトのポートは **3005** に設定されています (`pnpm dev -p 3005`)。
- **インポート**: パスエイリアス `@/*` はプロジェクトのルート `./*` を指します（[tsconfig.json](file:///Users/temmy/budget-lens/budget-lens/tsconfig.json) で定義）。

## 1. スタイリング (Tailwind CSS v4)
- このプロジェクトでは **Tailwind CSS v4** を使用しています。
- グローバルスタイルおよび設定は [globals.css](file:///Users/temmy/budget-lens/budget-lens/app/globals.css) にあります。
- **`tailwind.config.js` は存在しません。** テーマの設定は、CSS内の `@theme inline` を使用して直接定義されています：
  ```css
  @theme inline {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --font-sans: var(--font-geist-sans);
    --font-mono: var(--font-geist-mono);
  }
  ```

## 2. 重要なAIヒントとガイド
- **Next.js バージョン別ドキュメント**: APIやルーティングの規約については、常に `node_modules/next/dist/docs/` を参照してください。
- **クライアントサイドナビゲーションの注意**: クライアントサイドでの遷移が遅い問題を修正する場合、`Suspense` だけでは不十分です。ルートから `unstable_instant` をエクスポートする必要があります。詳細は [instant-navigation.md](file:///Users/temmy/budget-lens/budget-lens/node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md) を参照してください。
