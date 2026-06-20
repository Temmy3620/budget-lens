import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					for (const { name, value } of cookiesToSet) {
						request.cookies.set(name, value);
					}
					supabaseResponse = NextResponse.next({
						request,
					});
					for (const { name, value, options } of cookiesToSet) {
						supabaseResponse.cookies.set(name, value, options);
					}
				},
			},
		},
	);

	// 重要: getSession() ではなく getUser() を使用してください。
	// セキュリティ上のリスクを避けるため、サーバー側での有効性確認が必要です。
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const isLoginPage = request.nextUrl.pathname.startsWith("/login");
	const isAuthApi =
		request.nextUrl.pathname.startsWith("/api/auth") ||
		request.nextUrl.pathname.startsWith("/auth");

	// 未ログイン時にログイン画面や認証関連以外のページにアクセスした場合、ログインに転送
	if (!user && !isLoginPage && !isAuthApi) {
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}

	// ログイン済みのユーザーがログイン画面にアクセスした場合、ルートへ転送
	if (user && isLoginPage) {
		const url = request.nextUrl.clone();
		url.pathname = "/";
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}
