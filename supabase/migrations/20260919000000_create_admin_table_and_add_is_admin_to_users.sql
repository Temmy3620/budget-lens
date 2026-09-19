-- 1. admin テーブルの作成
CREATE TABLE IF NOT EXISTS public.admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS (Row Level Security) の有効化
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーが自身のメールアドレスと一致する行のみ SELECT できるようにポリシーを設定
-- （他ユーザーの管理者アドレス一覧は参照できないように保護）
CREATE POLICY "Allow authenticated users to read their own admin record"
  ON public.admin
  FOR SELECT
  TO authenticated
  USING (
    email = (auth.jwt() ->> 'email')
  );

-- 2. users テーブルに is_admin カラムを追加
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON TABLE public.admin IS '管理者ユーザーのホワイトリストテーブル';
COMMENT ON COLUMN public.users.is_admin IS '管理者フラグ（Stripe決済バイパス等に使用）';
