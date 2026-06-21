import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * セッションを検証し、認証されていない場合はログイン画面へリダイレクトします。
 * Reactの cache APIにより、同一レンダリングパス内で複数回呼ばれてもSupabaseへの問い合わせは1回のみになります。
 */
export const verifySession = cache(async () => {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		redirect("/login");
	}

	return { isAuth: true, userId: user.id, email: user.email };
});

/**
 * 現在ログインしているユーザーの最小限の情報を安全に返却します。
 * 未ログイン時は null を返し、例外は発生させません（リダイレクトもしません）。
 */
export const getCurrentUser = cache(async () => {
	const supabase = await createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		return null;
	}

	// Just In Time (JIT) 同期: public.users にプロフィールレコードがない場合は作成します
	try {
		const { data: profile } = await supabase
			.from("users")
			.select("id")
			.eq("id", user.id)
			.maybeSingle();

		if (!profile) {
			await supabase.from("users").insert({
				id: user.id,
				email: user.email ?? "",
				name: user.user_metadata?.name ?? "新規ユーザー",
			});
		}
	} catch (err) {
		console.error("Failed to synchronize user profile in JIT logic:", err);
	}

	// DTO パターン: パスワードやメタデータなどの不要な情報を除外し、安全なデータのみを返す
	return {
		id: user.id,
		email: user.email ?? "",
	};
});
