-- budget_historiesテーブルに対して、認証済みユーザーが自身の予算履歴を削除できるようにするDELETEポリシーを追加
CREATE POLICY "Allow users to delete their own budget histories" ON public.budget_histories
  FOR DELETE USING (auth.uid() = user_id);
