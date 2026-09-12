import DashboardClient from "@/components/dashboard/dashboard-client";
import { getBudgets } from "@/lib/supabase/budgets";
import { getCurrentUser } from "@/lib/supabase/dal";
import { getExpenses } from "@/lib/supabase/expenses";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
	title: "ダッシュボード - YariKuru",
	description:
		"今月の残り予算や最近の支出履歴、カテゴリ別支出割合を確認できます。",
};

export default async function DashboardPage() {
	const user = await getCurrentUser();
	if (!user) return null;

	const supabase = await createClient();
	const [budgets, expenses] = await Promise.all([
		getBudgets(user.id, supabase, { includeArchived: true }),
		getExpenses(user.id, supabase),
	]);

	return (
		<DashboardClient
			user={user}
			initialBudgets={budgets}
			initialExpenses={expenses}
		/>
	);
}
