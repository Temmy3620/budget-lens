-- =========================================================================
-- ADD is_archived COLUMN TO budgets TABLE
-- =========================================================================

ALTER TABLE public.budgets
ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_budgets_user_id_archived ON public.budgets(user_id, is_archived);
