"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/dal";
import { addBudgets } from "@/lib/supabase/budgets";
import { saveBudgetHistorySnapshot } from "@/app/(authenticated)/budgets/actions";
import type { BudgetSetting } from "@/components/budgets/types";

export type OnboardingResult = {
	success: boolean;
	error?: string;
};

/**
 * オンボーディング完了 Server Action
 * @param budgetsData 設定された予算カテゴリの配列
 */
export async function completeOnboardingAction(
	budgetsData: Omit<BudgetSetting, "id">[],
): Promise<OnboardingResult> {
	const user = await getCurrentUser();
	if (!user) {
		return { success: false, error: "認証されていません。" };
	}

	const supabase = await createClient();

	try {
		// 1. 予算設定の一括追加 (もし予算が空でなければ追加)
		if (budgetsData.length > 0) {
			await addBudgets(user.id, budgetsData, supabase);
		}

		// 2. 履歴スナップショットの保存
		await saveBudgetHistorySnapshot(user.id, supabase);

		// 3. Supabase Auth メタデータの更新
		const { error: authError } = await supabase.auth.updateUser({
			data: { onboarded: true },
		});
		if (authError) {
			console.error("Failed to update user auth metadata:", authError);
			throw new Error("ユーザー認証情報の更新に失敗しました。");
		}

		// 4. usersテーブルのオンボーディング完了フラグ更新
		const { error: dbError } = await supabase
			.from("users")
			.update({ onboarded: true })
			.eq("id", user.id);

		if (dbError) {
			console.error("Failed to update users table onboarded flag:", dbError);
			throw new Error("データベースのプロフィール更新に失敗しました。");
		}
	} catch (err) {
		// pnpm devのコンソールに目立つように詳細をダンプ
		console.error(
			"\n🔴 ========== ERROR IN completeOnboardingAction ==========",
		);
		if (err && typeof err === "object") {
			console.error("Error Details:", JSON.stringify(err, null, 2));
		} else {
			console.error("Error Details:", err);
		}
		console.error(
			"==========================================================\n",
		);

		let errorMessage = "予期しないエラーが発生しました。";
		if (err instanceof Error) {
			errorMessage = err.message;
		} else if (
			err &&
			typeof err === "object" &&
			"message" in err &&
			typeof err.message === "string"
		) {
			errorMessage = err.message;
		} else if (typeof err === "string") {
			errorMessage = err;
		}

		return {
			success: false,
			error: errorMessage,
		};
	}

	// 5. キャッシュ再検証
	revalidatePath("/", "layout");

	return { success: true };
}
