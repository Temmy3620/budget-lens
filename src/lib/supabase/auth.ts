import { createClient } from "@/lib/supabase/server";

/**
 * メールアドレスとパスワードでログインする
 */
export async function loginWithEmailAndPassword(
	email: string,
	password: string,
) {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

/**
 * 新規ユーザー登録（サインアップ）を行う
 */
export async function signUpWithEmailAndPassword(
	email: string,
	password: string,
	name: string,
	emailRedirectTo?: string,
) {
	const supabase = await createClient();
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
		throw new Error(error.message);
	}

	return data;
}

/**
 * ログアウト（サインアウト）を行う
 */
export async function signOutUser() {
	const supabase = await createClient();
	const { error } = await supabase.auth.signOut();
	if (error) {
		throw new Error(error.message);
	}
}
