"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { LoginFormSchema, SignUpFormSchema } from "./schemas";
import type { LoginFormState, SignUpFormState } from "@/types/auth";
import {
	loginWithEmailAndPassword,
	signUpWithEmailAndPassword,
	signOutUser,
} from "@/lib/supabase/auth";

/**
 * ログインアクション
 */
export async function login(
	_state: LoginFormState,
	formData: FormData,
): Promise<LoginFormState> {
	// バリデーション
	const validatedFields = LoginFormSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { email, password } = validatedFields.data;

	try {
		// 認証処理をデータアクセス層経由で実行
		await loginWithEmailAndPassword(email, password);
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "ログインに失敗しました。";
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

/**
 * ログアウトアクション
 */
export async function logout() {
	try {
		await signOutUser();
	} catch (error) {
		console.error("Logout error:", error);
	}
	revalidatePath("/", "layout");
	redirect("/login");
}

/**
 * 新規登録アクション
 */
export async function signup(
	_state: SignUpFormState,
	formData: FormData,
): Promise<SignUpFormState> {
	// バリデーション
	const validatedFields = SignUpFormSchema.safeParse({
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { name, email, password } = validatedFields.data;

	// リダイレクト先URLの構築 (開発環境のポート:3005 等に動的に対応)
	const headersList = await headers();
	const host = headersList.get("host");
	const protocol = host?.includes("localhost") ? "http" : "https";
	const emailRedirectTo = `${protocol}://${host}/auth/callback`;

	try {
		// 認証処理をデータアクセス層経由で実行
		const data = await signUpWithEmailAndPassword(
			email,
			password,
			name,
			emailRedirectTo,
		);

		// 自動ログインできた（セッションが確立した）場合はダッシュボードへ遷移
		if (data.session) {
			revalidatePath("/", "layout");
			redirect("/dashboard");
		} else {
			// メール確認が必要な場合
			return {
				success: true,
				message:
					"確認メールを送信しました。メール内のリンクをクリックして登録を完了させてください。",
			};
		}
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "新規登録に失敗しました。";
		return {
			errors: {
				_form: [errorMessage],
			},
		};
	}
}
