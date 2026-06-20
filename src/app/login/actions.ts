"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LoginFormSchema, type FormState } from "./schemas";

/**
 * ログインアクション
 */
export async function login(
	state: FormState,
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
