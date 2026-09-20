import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/url";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");
	// ログイン後の遷移先 (デフォルトはトップページ)
	const next = searchParams.get("next") ?? "/";
	const baseUrl = await getBaseUrl(request);

	if (code) {
		const supabase = await createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			const destination = next.startsWith("/") ? next : `/${next}`;
			return NextResponse.redirect(`${baseUrl}${destination}`);
		}
		console.error("Auth callback exchange failed:", {
			message: error.message,
			status: error.status,
		});
	}

	// 認証エラーが発生した場合はログイン画面にエラー表示用パラメータ付きでリダイレクト
	return NextResponse.redirect(`${baseUrl}/login?error=auth_callback_failed`);
}
