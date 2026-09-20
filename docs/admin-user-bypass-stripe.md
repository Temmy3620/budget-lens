# 管理者ユーザーによるStripe決済バイパスおよび管理者管理設計書

- **作成日**: 2026-09-19
- **ステータス**: 完了

---

## 1. 背景・課題 (Why)
- **現状の課題**:
  - 本番環境のStripeでは、アカウント所有者（アプリ開発者自身）のクレジットカードを用いた自己決済が規約および不正防止機能によって拒否されます。
  - そのため、本番環境で開発者自身のアカウントを用いて実動作確認・テストを行ったり、日常的に本番アプリを利用したりすることができません（`/subscribe` から先に進めない）。
- **目的・ゴール**:
  - 管理者（admin）ユーザーとして本番環境に登録・ログインした際に、Stripe決済画面をバイパスしてオンボーディングやダッシュボード画面へ遷移できるようにする。
  - 管理対象ユーザーは `admin` テーブルを介して柔軟に管理可能とし、開発者自身の本番テスト・実運用を可能にする。
- **スコープ外**:
  - アプリ内専用の管理画面（GUIによるユーザー一覧表示やデータ直接編集等のダッシュボード機能）の新規作成。今回はSupabaseダッシュボード（Table Editor）からの直接レコード管理を前提とします。

---

## 2. 実装方針・概要 (How)
- **全体のアプローチ**:
  - `admin` テーブルを作成し、管理者対象のメールアドレス等を登録（将来的な権限や追加属性の保持を考慮）。
  - `public.users` テーブルに `is_admin` (BOOLEAN, DEFAULT FALSE) カラムを追加。
  - アプリケーション層（`src/lib/supabase/dal.ts` のJIT同期処理）において、ログインユーザーのメールアドレスが `admin` テーブルに存在するか検証し、`users.is_admin` を同期更新する。
  - `middleware.ts` において、`is_admin === true` のユーザーはサブスクリプション有効状態と同等に扱い、`/subscribe` へのリダイレクトをスキップする。
  - 設定画面（`/settings`）において、管理者ユーザーにはStripeポータル遷移ボタンを表示せず、「管理者アカウント（課金不要）」バッジを表示して安全に扱えるようにする。

- **アーキテクチャ・設計変更**:
  - **DB層 (Supabase)**:
    - `admin` テーブルの作成
      - `id`: UUID (PRIMARY KEY, DEFAULT gen_random_uuid())
      - `email`: TEXT (NOT NULL, UNIQUE)
      - `role`: TEXT (NOT NULL, DEFAULT 'admin') ※将来の権限拡張用
      - `description`: TEXT (管理者メモ用)
      - `created_at`: TIMESTAMPTZ (DEFAULT now())
      - RLS設定: 一般ユーザーからの直接アクセスを遮断し、サーバーサイド（認証済み処理）からのみ読み取り可能に制御。
    - `users` テーブルへのカラム追加
      - `is_admin`: BOOLEAN (NOT NULL, DEFAULT FALSE)
  - **アプリケーション層 / DAL ([src/lib/supabase/dal.ts](file:///Users/temmy/budget-lens/budget-lens/src/lib/supabase/dal.ts))**:
    - `getCurrentUser` 内のJIT同期ロジックで、`admin` テーブルに対象ユーザーの `email` が含まれるか照合。
    - 含まれる場合は `users.is_admin = true` に更新。
    - これにより、新規登録時はもちろん、既存アカウントであっても `admin` テーブルにメールアドレスを追加するだけで次回ログイン/アクセス時に自動で管理者権限が付与される。
  - **ルーティング・ミドルウェア ([src/lib/supabase/middleware.ts](file:///Users/temmy/budget-lens/budget-lens/src/lib/supabase/middleware.ts))**:
    - `users` テーブル取得時に `is_admin` を合わせて取得。
    - アクセス判定を `const hasAccess = is_admin || hasActiveSub;` とし、`!hasAccess` の場合のみ `/subscribe` へ転送。
  - **設定画面コンポーネント**:
    - [src/app/(authenticated)/settings/page.tsx](file:///Users/temmy/budget-lens/budget-lens/src/app/(authenticated)/settings/page.tsx) から `isAdmin` を取得。
    - [BillingSettingsSection.tsx](file:///Users/temmy/budget-lens/budget-lens/src/components/settings/BillingSettingsSection.tsx) に `isAdmin` を渡し、管理者専用の表示（「管理者アカウント / 決済不要」）に切り替え。Stripeカスタマーポータルボタンを無効化・非表示にしてエラーを防止。

---

## 3. 検討した代替案・選ばなかった理由

- **案A: 環境変数（ADMIN_EMAILS）によるホワイトリスト方式**:
  - **採用しなかった理由**: 管理者を追加・変更するたびにデプロイや環境変数の再設定・サーバー再起動が必要となり運用の柔軟性に欠けるため。Supabase Table Editorから直接編集できるDBテーブル方式を採用。
- **案B: DBトリガー（auth.users作成時）による判定**:
  - **採用しなかった理由**: 既に本番環境に登録済みのユーザーを後から管理者に昇格させるケースに追従しにくく、SQL関数の保守やデバッグがアプリケーションコードより煩雑になるため。アプリケーション層（JIT同期）を採用。
- **案C: 管理者の `subscription_status` を直接 `'active'` に設定する方式**:
  - **採用しなかった理由**: Stripeに顧客情報（`stripe_customer_id`）が存在しないため、Stripe Webhookの動作時やカスタマーポータル呼び出し時に不整合・クラッシュの原因となる。`subscription_status` と `is_admin` は明確に責務を分離する方針を採用。

---

## 4. 影響範囲・破壊的変更
- **影響を受ける既存ページ / コンポーネント**:
  - [src/lib/supabase/middleware.ts](file:///Users/temmy/budget-lens/budget-lens/src/lib/supabase/middleware.ts): リダイレクト判定条件の追加
  - [src/lib/supabase/dal.ts](file:///Users/temmy/budget-lens/budget-lens/src/lib/supabase/dal.ts): JIT同期時の `admin` 照合および `is_admin` 更新処理
  - [src/app/(authenticated)/settings/page.tsx](file:///Users/temmy/budget-lens/budget-lens/src/app/(authenticated)/settings/page.tsx): `is_admin` の取得とProps渡し
  - [src/components/settings/BillingSettingsSection.tsx](file:///Users/temmy/budget-lens/budget-lens/src/components/settings/BillingSettingsSection.tsx): 管理者向け表示の切り替え
- **DB / API スキーマの変更有無**:
  - **変更あり**: 
    - 新規マイグレーション作成: `admin` テーブル作成
    - `users` テーブルに `is_admin` カラム追加
- **SEO / パフォーマンスへの懸念・対策**:
  - `middleware.ts` では既存の `users` クエリで取得カラムに `is_admin` を含めるのみのため、新たなDB往復コストは発生せず、パフォーマンスへの影響はありません。
  - `admin` テーブルはメールアドレスで検索するため、`email` カラムに UNIQUE インデックスが付与され、高速に照合可能です。
