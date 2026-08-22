"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updatePassword } from "@/lib/supabase/auth";
import type { ResetPasswordFormState } from "@/types/auth";
import { ResetPasswordFormSchema } from "./schemas";

/**
 * パスワード更新アクション
 */
export async function resetPassword(
	_state: ResetPasswordFormState,
	formData: FormData,
): Promise<ResetPasswordFormState> {
	// バリデーション
	const validatedFields = ResetPasswordFormSchema.safeParse({
		password: formData.get("password"),
		confirmPassword: formData.get("confirmPassword"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { password } = validatedFields.data;

	try {
		// パスワードを更新
		await updatePassword(password);
	} catch (error) {
		const errorMessage =
			error instanceof Error
				? error.message
				: "パスワードの更新に失敗しました。";
		return {
			errors: {
				_form: [errorMessage],
			},
		};
	}

	// キャッシュの再検証とダッシュボードへの遷移
	revalidatePath("/", "layout");
	redirect("/dashboard");
}
