import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface Expense {
	id: string;
	budgetId: string; // 予算カテゴリID (DBカラム: budget_id)
	amount: number;
	date: string; // "YYYY-MM-DD"
	memo: string;
	createdAt: string;
}

interface ExpenseRow {
	id: string;
	budget_id: string | null;
	amount: number;
	date: string;
	memo: string | null;
	created_at: string;
}

/**
 * DBのレコードをフロントエンド用モデル Expense にマッピングする
 */
function mapRowToExpense(row: ExpenseRow): Expense {
	return {
		id: row.id,
		budgetId: row.budget_id || "",
		amount: row.amount,
		date: row.date,
		memo: row.memo || "",
		createdAt: row.created_at,
	};
}

/**
 * データベースからログインユーザーのIDに該当する出費一覧を取得する
 * @param userId ログインユーザーのID
 * @param client Supabaseクライアント（オプション）
 */
export async function getExpenses(
	userId: string,
	client?: SupabaseClient,
): Promise<Expense[]> {
	const supabase = client ?? createClient();
	const { data, error } = await supabase
		.from("expenses")
		.select("*")
		.eq("user_id", userId)
		.order("date", { ascending: false })
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Failed to fetch expenses from Supabase:", error);
		throw error;
	}

	return (data || []).map(mapRowToExpense);
}

/**
 * 新しい出費を追加する
 * @param userId ログインユーザーのID
 * @param expenseData 出費データ
 * @param client Supabaseクライアント（オプション）
 */
export async function addExpense(
	userId: string,
	expenseData: Omit<Expense, "id" | "createdAt">,
	client?: SupabaseClient,
): Promise<Expense> {
	const supabase = client ?? createClient();
	const { data, error } = await supabase
		.from("expenses")
		.insert({
			user_id: userId,
			budget_id: expenseData.budgetId || null,
			amount: expenseData.amount,
			date: expenseData.date,
			memo: expenseData.memo,
		})
		.select()
		.single();

	if (error) {
		console.error("Failed to insert expense into Supabase:", error);
		throw error;
	}

	return mapRowToExpense(data);
}

/**
 * 指定したIDの出費を削除する
 * @param id 出費レコードのID
 * @param client Supabaseクライアント（オプション）
 */
export async function deleteExpense(
	id: string,
	client?: SupabaseClient,
): Promise<void> {
	const supabase = client ?? createClient();
	const { error } = await supabase.from("expenses").delete().eq("id", id);

	if (error) {
		console.error("Failed to delete expense from Supabase:", error);
		throw error;
	}
}

/**
 * 指定したIDの出費を更新する
 * @param id 出費レコードのID
 * @param updatedData 更新するデータ
 * @param client Supabaseクライアント（オプション）
 */
export async function updateExpense(
	id: string,
	updatedData: Omit<Expense, "id" | "createdAt">,
	client?: SupabaseClient,
): Promise<Expense> {
	const supabase = client ?? createClient();
	const { data, error } = await supabase
		.from("expenses")
		.update({
			budget_id: updatedData.budgetId || null,
			amount: updatedData.amount,
			date: updatedData.date,
			memo: updatedData.memo,
		})
		.eq("id", id)
		.select()
		.single();

	if (error) {
		console.error("Failed to update expense in Supabase:", error);
		throw error;
	}

	return mapRowToExpense(data);
}

/**
 * 出費一覧からカテゴリごとの支出合計額を集計する
 * @param expenses 出費レコードの配列
 * @returns カテゴリIDをキー、支出合計額を値とするオブジェクト
 */
export function calculateCategorySpent(
	expenses: Expense[],
): Record<string, number> {
	return expenses.reduce(
		(acc, curr) => {
			const bId = curr.budgetId || "unclassified";
			acc[bId] = (acc[bId] || 0) + curr.amount;
			return acc;
		},
		{} as Record<string, number>,
	);
}
