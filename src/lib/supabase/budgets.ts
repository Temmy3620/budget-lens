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

/**
 * 新しい予算設定を追加する
 * @param userId ログインユーザーのID
 * @param budgetData 予算設定データ
 * @param client Supabaseクライアント（オプション）
 */
export async function addBudget(
	userId: string,
	budgetData: Omit<BudgetSetting, "id">,
	client?: SupabaseClient,
): Promise<BudgetSetting> {
	const supabase = client ?? createClient();
	const { data, error } = await supabase
		.from("budgets")
		.insert({
			user_id: userId,
			name: budgetData.name,
			budget: budgetData.budget,
			color: budgetData.color,
			memo: budgetData.memo || null,
		})
		.select()
		.single();

	if (error) {
		console.error("Failed to add budget to Supabase:", error);
		throw error;
	}

	return {
		id: data.id,
		name: data.name,
		budget: data.budget,
		color: data.color,
		memo: data.memo || undefined,
	};
}

/**
 * 予算設定を更新する
 * @param id 予算レコードのID
 * @param budgetData 更新する予算設定データ
 * @param client Supabaseクライアント（オプション）
 */
export async function updateBudget(
	id: string,
	budgetData: Omit<BudgetSetting, "id">,
	client?: SupabaseClient,
): Promise<BudgetSetting> {
	const supabase = client ?? createClient();
	const { data, error } = await supabase
		.from("budgets")
		.update({
			name: budgetData.name,
			budget: budgetData.budget,
			color: budgetData.color,
			memo: budgetData.memo || null,
		})
		.eq("id", id)
		.select()
		.single();

	if (error) {
		console.error("Failed to update budget in Supabase:", error);
		throw error;
	}

	return {
		id: data.id,
		name: data.name,
		budget: data.budget,
		color: data.color,
		memo: data.memo || undefined,
	};
}

/**
 * 予算設定を削除する。紐づく出費（Expense）が存在する場合は削除処理をブロックする。
 * @param id 予算レコードのID
 * @param client Supabaseクライアント（オプション）
 */
export async function deleteBudget(
	id: string,
	client?: SupabaseClient,
): Promise<{ success: boolean; error?: string }> {
	const supabase = client ?? createClient();

	try {
		// 紐づく出費が存在するかどうかチェック
		const { count, error: countError } = await supabase
			.from("expenses")
			.select("id", { count: "exact", head: true })
			.eq("budget_id", id);

		if (countError) {
			console.warn(
				"Failed to check linked expenses from Supabase:",
				countError,
			);
			return {
				success: false,
				error: "データベース接続エラーが発生しました。",
			};
		}

		if (count !== null && count > 0) {
			return {
				success: false,
				error: "このカテゴリは現在出費で使用されているため削除できません。",
			};
		}

		const { error } = await supabase.from("budgets").delete().eq("id", id);

		if (error) {
			console.warn("Failed to delete budget from Supabase:", error);
			return { success: false, error: "カテゴリの削除に失敗しました。" };
		}

		return { success: true };
	} catch (err) {
		console.warn("Unexpected error in deleteBudget:", err);
		return { success: false, error: "予期しないエラーが発生しました。" };
	}
}
