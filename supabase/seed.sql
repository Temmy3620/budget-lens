-- 初期ユーザーデータの挿入
insert into
  public.users (id, name, email, password_hash)
values
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '名前',
    'メール',
    'パスワードhash'
    -- node -e "console.log(require('crypto').createHash('sha256').update('パスワード').digest('hex'))" --
  )
on conflict (email) do nothing;
