import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	// ログイン後の遷移先 (デフォルトはトップページ)
	const next = searchParams.get("next") ?? "/";

	if (code) {
		const supabase = await createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			return NextResponse.redirect(`${origin}${next}`);
		}
	}

	// 認証エラーが発生した場合はログイン画面にエラー表示用パラメータ付きでリダイレクト
	return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
