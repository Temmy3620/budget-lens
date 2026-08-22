"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/dal";

export type ResetResult = {
	success: boolean;
	error?: string;
};

/**
 * ログインユーザーのすべてのデータを初期化する Server Action
 * (expenses, budget_histories, budgets を削除し、オンボーディングを未完了に戻す)
 */
export async function resetAllUserDataAction(): Promise<ResetResult> {
	const user = await getCurrentUser();
	if (!user) {
		return { success: false, error: "認証されていません。" };
	}

	const supabase = await createClient();

	try {
		// 1. 出費データ（expenses）の削除
		const { error: expensesError } = await supabase
			.from("expenses")
			.delete()
			.eq("user_id", user.id);

		if (expensesError) {
			console.error("Failed to delete user expenses:", expensesError);
			throw new Error("出費データの削除に失敗しました。");
		}

		// 2. 予算履歴データ（budget_histories）の削除
		const { error: historyError } = await supabase
			.from("budget_histories")
			.delete()
			.eq("user_id", user.id);

		if (historyError) {
			console.error("Failed to delete user budget histories:", historyError);
			throw new Error("予算履歴データの削除に失敗しました。");
		}

		// 3. 予算カテゴリ設定（budgets）の削除
		const { error: budgetsError } = await supabase
			.from("budgets")
			.delete()
			.eq("user_id", user.id);

		if (budgetsError) {
			console.error("Failed to delete user budgets:", budgetsError);
			throw new Error("予算カテゴリ設定の削除に失敗しました。");
		}

		// 4. Supabase Auth メタデータの更新 (onboarded: false)
		const { error: authError } = await supabase.auth.updateUser({
			data: { onboarded: false },
		});

		if (authError) {
			console.error("Failed to reset user auth metadata:", authError);
			throw new Error("ユーザー認証情報の初期化に失敗しました。");
		}

		// 5. usersテーブルのオンボーディング完了フラグを更新
		const { error: dbError } = await supabase
			.from("users")
			.update({ onboarded: false })
			.eq("id", user.id);

		if (dbError) {
			console.error("Failed to reset users table onboarded flag:", dbError);
			throw new Error("データベースプロフィールの初期化に失敗しました。");
		}
	} catch (err) {
		// pnpm devのコンソールに目立つように詳細をダンプ
		console.error("\n🔴 ========== ERROR IN resetAllUserDataAction ==========");
		if (err && typeof err === "object") {
			console.error("Error Details:", JSON.stringify(err, null, 2));
		} else {
			console.error("Error Details:", err);
		}
		console.error("========================================================\n");

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

	// 6. キャッシュ再検証
	revalidatePath("/", "layout");

	return { success: true };
}
