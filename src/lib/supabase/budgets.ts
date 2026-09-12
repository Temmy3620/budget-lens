import type { SupabaseClient } from "@supabase/supabase-js";
import type { BudgetSetting } from "@/components/budgets/types";
import { createClient } from "@/lib/supabase/client";

/**
 * データベースからログインユーザーのIDに該当する予算設定一覧を取得する
 * @param userId ログインユーザーのID
 * @param client Supabaseクライアント（オプション）
 * @param options オプション（includeArchived: true でアーカイブされた予算も含めて取得）
 */
export async function getBudgets(
	userId: string,
	client?: SupabaseClient,
	options?: { includeArchived?: boolean },
): Promise<BudgetSetting[]> {
	const supabase = client ?? createClient();
	let query = supabase
		.from("budgets")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: true });

	if (!options?.includeArchived) {
		query = query.eq("is_archived", false);
	}

	const { data, error } = await query;

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
		isArchived: budget.is_archived ?? false,
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
		isArchived: data.is_archived ?? false,
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
		isArchived: data.is_archived ?? false,
	};
}

/**
 * 予算設定を削除またはアーカイブする。
 * - 今月以降（未来含む）の出費が存在する場合は削除をブロック
 * - 過去月のみに出費が存在する場合はアーカイブ（論理削除）
 * - 出費が一切存在しない場合は物理削除
 * @param id 予算レコードのID
 * @param client Supabaseクライアント（オプション）
 */
export async function deleteBudget(
	id: string,
	client?: SupabaseClient,
): Promise<{ success: boolean; archived?: boolean; error?: string }> {
	const supabase = client ?? createClient();

	try {
		// 日本時間 (JST) での当月1日の日付文字列 ("YYYY-MM-01") を生成
		const nowJST = new Date(
			new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
		);
		const currentYear = nowJST.getFullYear();
		const currentMonth = String(nowJST.getMonth() + 1).padStart(2, "0");
		const startOfCurrentMonth = `${currentYear}-${currentMonth}-01`;

		// 1. 今月以降（当月1日以降）に使われている出費があるかチェック
		const { count: currentOrFutureCount, error: currentOrFutureError } =
			await supabase
				.from("expenses")
				.select("id", { count: "exact", head: true })
				.eq("budget_id", id)
				.gte("date", startOfCurrentMonth);

		if (currentOrFutureError) {
			console.warn(
				"Failed to check current/future expenses from Supabase:",
				currentOrFutureError,
			);
			return {
				success: false,
				error: "データベース接続エラーが発生しました。",
			};
		}

		if (currentOrFutureCount !== null && currentOrFutureCount > 0) {
			return {
				success: false,
				error:
					"今月以降の出費で使用されているため削除できません。出費のカテゴリを変更するか削除してください。",
			};
		}

		// 2. 過去月（当月1日より前）に使われている出費があるかチェック
		const { count: pastCount, error: pastError } = await supabase
			.from("expenses")
			.select("id", { count: "exact", head: true })
			.eq("budget_id", id)
			.lt("date", startOfCurrentMonth);

		if (pastError) {
			console.warn("Failed to check past expenses from Supabase:", pastError);
			return {
				success: false,
				error: "データベース接続エラーが発生しました。",
			};
		}

		if (pastCount !== null && pastCount > 0) {
			// 過去の出費が存在する場合は論理削除（アーカイブ）
			const { error: archiveError } = await supabase
				.from("budgets")
				.update({ is_archived: true })
				.eq("id", id);

			if (archiveError) {
				console.warn("Failed to archive budget in Supabase:", archiveError);
				return {
					success: false,
					error: "カテゴリのアーカイブに失敗しました。",
				};
			}

			return { success: true, archived: true };
		}

		// 3. 出費が一切ない場合は物理削除
		const { error } = await supabase.from("budgets").delete().eq("id", id);

		if (error) {
			console.warn("Failed to delete budget from Supabase:", error);
			return { success: false, error: "カテゴリの削除に失敗しました。" };
		}

		return { success: true, archived: false };
	} catch (err) {
		console.warn("Unexpected error in deleteBudget:", err);
		return { success: false, error: "予期しないエラーが発生しました。" };
	}
}

/**
 * 複数の予算設定を一括で追加する
 * @param userId ログインユーザーのID
 * @param budgetsData 予算設定データの配列
 * @param client Supabaseクライアント（オプション）
 */
export async function addBudgets(
	userId: string,
	budgetsData: Omit<BudgetSetting, "id">[],
	client?: SupabaseClient,
): Promise<BudgetSetting[]> {
	const supabase = client ?? createClient();
	const { data, error } = await supabase
		.from("budgets")
		.insert(
			budgetsData.map((b) => ({
				user_id: userId,
				name: b.name,
				budget: b.budget,
				color: b.color,
				memo: b.memo || null,
			})),
		)
		.select();

	if (error) {
		console.error("Failed to add budgets bulk to Supabase:", error);
		throw error;
	}

	return (data || []).map((budget) => ({
		id: budget.id,
		name: budget.name,
		budget: budget.budget,
		color: budget.color,
		memo: budget.memo || undefined,
		isArchived: budget.is_archived ?? false,
	}));
}
