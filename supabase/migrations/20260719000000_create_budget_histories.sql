-- =========================================================================
-- CREATE BUDGET HISTORIES TABLE
-- =========================================================================

CREATE TABLE public.budget_histories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  total_amount INTEGER NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  categories_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index creation
CREATE INDEX idx_budget_histories_user_id ON public.budget_histories(user_id);
CREATE INDEX idx_budget_histories_created_at ON public.budget_histories(created_at);

-- Row Level Security (RLS)
ALTER TABLE public.budget_histories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow users to read their own budget histories" ON public.budget_histories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own budget histories" ON public.budget_histories
  FOR INSERT WITH CHECK (auth.uid() = user_id);
