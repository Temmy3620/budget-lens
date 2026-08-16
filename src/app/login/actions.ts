"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { type FormState, LoginFormSchema, SignUpFormSchema } from "./schemas";

/**
 * ログインアクション
 */
export async function login(
	_state: FormState,
	formData: FormData,
): Promise<FormState> {
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
	const supabase = await createClient();

	// Supabaseでのサインイン実行
	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return {
			errors: {
				_form: [error.message],
			},
		};
	}

	// キャッシュの再検証とルートへの遷移
	revalidatePath("/", "layout");
	redirect("/");
}

/**
 * ログアウトアクション
 */
export async function logout() {
	const supabase = await createClient();
	await supabase.auth.signOut();
	revalidatePath("/", "layout");
	redirect("/login");
}

/**
 * 新規登録アクション
 */
export async function signup(
	_state: FormState,
	formData: FormData,
): Promise<FormState> {
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
	const supabase = await createClient();

	// リダイレクト先URLの構築 (開発環境のポート:3005 等に動的に対応)
	const headersList = await headers();
	const host = headersList.get("host");
	const protocol = host?.includes("localhost") ? "http" : "https";
	const emailRedirectTo = `${protocol}://${host}/auth/callback`;

	// Supabaseでのサインアップ実行
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				name,
			},
			emailRedirectTo,
		},
	});

	if (error) {
		return {
			errors: {
				_form: [error.message],
			},
		};
	}

	// 自動ログインできた（セッションが確立した）場合はトップページへ遷移
	if (data.session) {
		revalidatePath("/", "layout");
		redirect("/");
	} else {
		// メール確認が必要な場合
		return {
			success: true,
			message:
				"確認メールを送信しました。メール内のリンクをクリックして登録を完了させてください。",
		};
	}
}
