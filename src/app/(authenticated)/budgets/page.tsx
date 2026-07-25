import BudgetsClient from "@/components/budgets/budgets-client";
import { getBudgets } from "@/lib/supabase/budgets";
import { getCurrentUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
	title: "予算設定 - Budget Lens",
	description:
		"管理したいカテゴリを自由に入力して追加し、それぞれの月間予算を設定します。",
};

export default async function BudgetsPage() {
	const user = await getCurrentUser();
	if (!user) return null;

	const supabase = await createClient();
	const initialSettings = await getBudgets(user.id, supabase);

	return <BudgetsClient initialSettings={initialSettings} userId={user.id} />;
}
