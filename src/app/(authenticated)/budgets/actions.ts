"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/dal";
import {
	addBudget,
	updateBudget,
	deleteBudget,
	getBudgets,
} from "@/lib/supabase/budgets";
import type { BudgetSetting } from "@/components/budgets/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// 履歴スナップショットを生成して保存するヘルパー関数
async function saveBudgetHistorySnapshot(userId: string, supabase: SupabaseClient) {
	// 該当ユーザーの全予算設定を取得
	const allBudgets = await getBudgets(userId, supabase);

	// 合計予算額の算出
	const totalAmount = allBudgets.reduce((sum, item) => sum + item.budget, 0);

	// スナップショットの作成（UI用 budget と要件の amount 両方を保持）
	const snapshot = allBudgets.map((b) => ({
		id: b.id,
		name: b.name,
		budget: b.budget,
		amount: b.budget, // 要件の amount としても格納
		color: b.color,
		memo: b.memo,
	}));

	// 履歴テーブルへ挿入
	const { error } = await supabase.from("budget_histories").insert({
		user_id: userId,
		total_amount: totalAmount,
		categories_snapshot: snapshot,
	});

	if (error) {
		console.error("Failed to insert budget history snapshot:", error);
		throw error;
	}
}

/**
 * 予算設定の新規追加 Server Action
 */
export async function addBudgetAction(
	userId: string,
	budgetData: Omit<BudgetSetting, "id">,
): Promise<BudgetSetting> {
	const user = await getCurrentUser();
	if (!user || user.id !== userId) {
		throw new Error("Unauthorized");
	}

	const supabase = await createClient();

	// 1. 予算設定の追加
	const newBudget = await addBudget(userId, budgetData, supabase);

	// 2. 履歴スナップショットの保存
	await saveBudgetHistorySnapshot(userId, supabase);

	// 3. キャッシュ再検証
	revalidatePath("/budgets");
	revalidatePath("/history");

	return newBudget;
}

/**
 * 予算設定の更新 Server Action
 */
export async function updateBudgetAction(
	id: string,
	budgetData: Omit<BudgetSetting, "id">,
): Promise<BudgetSetting> {
	const user = await getCurrentUser();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const supabase = await createClient();

	// 更新対象レコードの所有権確認（セキュリティ）
	const { data: existing, error: checkError } = await supabase
		.from("budgets")
		.select("user_id")
		.eq("id", id)
		.single();

	if (checkError || !existing || existing.user_id !== user.id) {
		throw new Error("Unauthorized or not found");
	}

	// 1. 予算設定の更新
	const updatedBudget = await updateBudget(id, budgetData, supabase);

	// 2. 履歴スナップショットの保存
	await saveBudgetHistorySnapshot(user.id, supabase);

	// 3. キャッシュ再検証
	revalidatePath("/budgets");
	revalidatePath("/history");

	return updatedBudget;
}

/**
 * 予算設定の削除 Server Action
 */
export async function deleteBudgetAction(
	id: string,
): Promise<{ success: boolean; error?: string }> {
	const user = await getCurrentUser();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const supabase = await createClient();

	// 削除対象レコードの所有権確認
	const { data: existing, error: checkError } = await supabase
		.from("budgets")
		.select("user_id")
		.eq("id", id)
		.single();

	if (checkError || !existing || existing.user_id !== user.id) {
		return { success: false, error: "権限がありません。" };
	}

	// 1. 予算設定の削除
	const result = await deleteBudget(id, supabase);

	if (!result.success) {
		return result;
	}

	// 2. 履歴スナップショットの保存
	await saveBudgetHistorySnapshot(user.id, supabase);

	// 3. キャッシュ再検証
	revalidatePath("/budgets");
	revalidatePath("/history");

	return { success: true };
}
