import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { BudgetSetting } from "@/components/budgets/types";

/**
 * データベースからログインユーザーのIDに該当する予算設定一覧を取得する
 * @param userId ログインユーザーのID
 * @param client Supabaseクライアント（オプション）
 */
export async function getBudgets(
	userId: string,
	client?: SupabaseClient,
): Promise<BudgetSetting[]> {
	const supabase = client ?? createClient();
	const { data, error } = await supabase
		.from("budgets")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: true });

	if (error) {
		console.error("Failed to fetch budgets from Supabase:", error);
		throw error;
	}

	return (data || []).map((budget) => ({
		id: budget.id,
		name: budget.name,
		budget: budget.budget,
		color: budget.color,
		memo: budget.memo || undefined,
	}));
}
