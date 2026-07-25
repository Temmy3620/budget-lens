import ExpensesClient from "@/components/expenses/expenses-client";
import { getBudgets } from "@/lib/supabase/budgets";
import { getExpenses } from "@/lib/supabase/expenses";
import { getCurrentUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
	title: "支出管理 - Budget Lens",
	description:
		"日々の出費を記録し、設定した予算カテゴリごとの残り予算をチェックします。",
};

export default async function ExpensesPage() {
	const user = await getCurrentUser();
	if (!user) return null;

	const supabase = await createClient();
	const [budgets, expenses] = await Promise.all([
		getBudgets(user.id, supabase),
		getExpenses(user.id, supabase),
	]);

	return <ExpensesClient initialBudgets={budgets} initialExpenses={expenses} />;
}
