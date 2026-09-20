import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/url";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");
	const token_hash = searchParams.get("token_hash");
	const type = searchParams.get("type") as EmailOtpType | null;

	// ログイン後の遷移先 (デフォルトはトップページ、パスワード再設定の場合は /reset-password)
	let next = searchParams.get("next");
	if (!next) {
		next = type === "recovery" ? "/reset-password" : "/";
	}

	const baseUrl = await getBaseUrl(request);
	const supabase = await createClient();

	// 1. token_hash 方式（メール招待・確認リンク・パスワード再設定用）
	// ブラウザの事前Cookieに依存しないため、招待メールや別端末からのアクセスでも確実にログイン可能
	if (token_hash && type) {
		const { error } = await supabase.auth.verifyOtp({
			type,
			token_hash,
		});

		if (!error) {
			const destination = next.startsWith("/") ? next : `/${next}`;
			return NextResponse.redirect(`${baseUrl}${destination}`);
		}

		console.error("Auth callback verifyOtp failed:", {
			message: error.message,
			status: error.status,
		});
	}

	// 2. PKCE code 方式（通常の同一ブラウザでのサインアップ・OAuth等）
	if (code) {
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
