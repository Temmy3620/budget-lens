-- usersテーブルにオンボーディング完了フラグを追加
ALTER TABLE public.users ADD COLUMN onboarded BOOLEAN NOT NULL DEFAULT false;
