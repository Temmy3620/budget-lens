import type { BudgetSetting } from "@/components/budgets/types";
import type { Expense } from "@/lib/supabase/expenses";

export interface MonthlyHistorySummary {
	month: number; // 1 〜 12
	totalBudget: number;
	totalSpent: number;
	budgets: BudgetSetting[];
	expenses: Expense[];
}

export interface YearHistory {
	year: number;
	months: MonthlyHistorySummary[];
}
