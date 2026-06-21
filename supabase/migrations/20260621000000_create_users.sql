-- usersテーブルの作成
create table if
  not exists public.users (
    id uuid primary key default gen_random_uuid (),
    name text not null,
    email text not null unique,
    password_hash text not null,
    created_at timestamp with time zone not null default now ()
  );

-- Row Level Security (RLS) の有効化
alter table public.users enable row level security;

-- ポリシーの作成 (必要に応じてカスタマイズしてください)
-- 開発初期段階として、すべての操作を許可するポリシーを定義します
create policy "Allow public read access" on public.users for select using (
  true
);

create policy "Allow public insert access" on public.users for insert with check (
  true
);

create policy "Allow public update access" on public.users for update using (
  true
);

create policy "Allow public delete access" on public.users for delete using (
  true
);
