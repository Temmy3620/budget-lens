-- ==========================================
-- 0. 既存のデモユーザーデータの初期化 (クリーンアップ)
-- ==========================================
-- テーブルが存在する場合のみ削除を実行して初期セットアップ時のエラーを防止します。
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'expenses') THEN
    DELETE FROM public.expenses WHERE user_id = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'budgets') THEN
    DELETE FROM public.budgets WHERE user_id = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    DELETE FROM public.users WHERE id = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
  END IF;
END $$;

-- auth.users は常に存在するため直接削除可能です
DELETE FROM auth.users WHERE id = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';


-- ==========================================
-- 1. テストユーザーの作成 (auth.users)
-- ==========================================
-- トリガーによって public.users にも自動的にレコードが作成されます
-- メールアドレス: demo-user@example.com
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'authenticated',
  'authenticated',
  'demo-user@example.com',
  crypt('HJJKyrgHUTi', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"デモユーザー"}',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 2. 予算カテゴリデータの作成 (public.budgets)
-- ==========================================
INSERT INTO public.budgets (id, user_id, name, budget, color, memo)
VALUES
  (
    'b1111111-1111-1111-1111-111111111111',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '食費',
    80000,
    'from-orange-500 to-amber-400',
    'スーパー、コンビニ、外食、カフェ代など'
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '住宅・光熱費',
    120000,
    'from-blue-500 to-indigo-400',
    '家賃、電気・ガス・水道代、インターネット回線など'
  ),
  (
    'b3333333-3333-3333-3333-333333333333',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '交通費',
    20000,
    'from-cyan-500 to-teal-400',
    '電車・バス運賃、タクシー、ガソリン代など'
  ),
  (
    'b4444444-4444-4444-4444-444444444444',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '娯楽・エンタメ',
    30000,
    'from-purple-500 to-pink-400',
    '書籍、映画、ゲーム、旅行、趣味の支出など'
  ),
  (
    'b5555555-5555-5555-5555-555555555555',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'その他・雑費',
    50000,
    'from-emerald-500 to-green-400',
    '日用品、衣服、医療費、美容、その他の不定期な支出'
  )
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 3. 出費明細データの作成 (public.expenses)
-- ==========================================
INSERT INTO public.expenses (id, user_id, budget_id, amount, date, memo, created_at)
VALUES
  (
    'e1111111-1111-1111-1111-111111111111',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'b1111111-1111-1111-1111-111111111111',
    4520,
    '2026-06-20',
    'スーパーマーケットライフ',
    now() - INTERVAL '1 day'
  ),
  (
    'e2222222-2222-2222-2222-222222222222',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'b3333333-3333-3333-3333-333333333333',
    3000,
    '2026-06-19',
    'モバイルSuicaチャージ',
    now() - INTERVAL '2 days'
  ),
  (
    'e3333333-3333-3333-3333-333333333333',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'b4444444-4444-4444-4444-444444444444',
    2000,
    '2026-06-18',
    '映画チケット (新宿バルト9)',
    now() - INTERVAL '3 days'
  ),
  (
    'e4444444-4444-4444-4444-444444444444',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'b1111111-1111-1111-1111-111111111111',
    1200,
    '2026-06-15',
    'カフェ・ドトール',
    now() - INTERVAL '6 days'
  ),
  (
    'e5555555-5555-5555-5555-555555555555',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'b5555555-5555-5555-5555-555555555555',
    1500,
    '2026-06-10',
    'ドラッグストアで日用品',
    now() - INTERVAL '11 days'
  )
ON CONFLICT (id) DO NOTHING;
