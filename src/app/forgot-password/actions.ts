"use server";

import { headers } from "next/headers";
import { sendPasswordResetEmail } from "@/lib/supabase/auth";
import type { ForgotPasswordFormState } from "@/types/auth";
import { ForgotPasswordFormSchema } from "./schemas";

/**
 * パスワード再設定メール送信アクション
 */
export async function sendResetEmail(
	_state: ForgotPasswordFormState,
	formData: FormData,
): Promise<ForgotPasswordFormState> {
	// バリデーション
	const validatedFields = ForgotPasswordFormSchema.safeParse({
		email: formData.get("email"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { email } = validatedFields.data;

	// リダイレクト先URLの構築 (開発環境のポート:3005 等に動的に対応)
	const headersList = await headers();
	const host = headersList.get("host");
	const protocol = host?.includes("localhost") ? "http" : "https";

	// auth/callback を経由して最終的に /reset-password にリダイレクトさせる
	const emailRedirectTo = `${protocol}://${host}/auth/callback?next=/reset-password`;

	try {
		await sendPasswordResetEmail(email, emailRedirectTo);
		return {
			success: true,
			message:
				"パスワード再設定用のメールを送信しました。メール内のリンクをクリックして設定を完了してください。",
		};
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "メールの送信に失敗しました。";
		return {
			errors: {
				_form: [errorMessage],
			},
		};
	}
}
