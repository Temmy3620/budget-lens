-- usersテーブルにStripe関連のカラムを追加
ALTER TABLE public.users 
  ADD COLUMN stripe_customer_id TEXT,
  ADD COLUMN stripe_subscription_id TEXT,
  ADD COLUMN subscription_status TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE;
