-- =========================================================================
-- 1. CLEANUP & INITIAL SCHEMA SETUP
-- =========================================================================

-- Drop existing resources if they exist to ensure clean setup
DROP TABLE IF EXISTS public.expenses;
DROP TABLE IF EXISTS public.budgets;
DROP TABLE IF EXISTS public.users;

-- =========================================================================
-- 2. TABLES CREATION
-- =========================================================================

-- users profiles table (linked 1:1 with auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- budgets categories table (per-user monthly budget configs)
CREATE TABLE public.budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(50) NOT NULL,
  budget INTEGER NOT NULL DEFAULT 0 CHECK (budget >= 0),
  color VARCHAR(50) NOT NULL DEFAULT 'from-gray-500 to-slate-400',
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- expenses details table
CREATE TABLE public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  budget_id UUID REFERENCES public.budgets(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  date DATE NOT NULL,
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 3. INDEXES
-- =========================================================================
CREATE INDEX idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_expenses_budget_id ON public.expenses(budget_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);

-- =========================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- users policies
CREATE POLICY "Allow users to read their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- budgets policies
CREATE POLICY "Allow users to manage their own budgets" ON public.budgets
  FOR ALL USING (auth.uid() = user_id);

-- expenses policies
CREATE POLICY "Allow users to manage their own expenses" ON public.expenses
  FOR ALL USING (auth.uid() = user_id);
