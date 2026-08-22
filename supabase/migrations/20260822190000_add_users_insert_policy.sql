-- usersテーブルに対して、認証済みユーザーが自身のプロフィールを登録できるようにするINSERTポリシーを追加します。
CREATE POLICY "Allow users to insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
