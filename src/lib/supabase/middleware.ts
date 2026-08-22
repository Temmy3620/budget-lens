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
			cookieOptions: {
				maxAge: 60 * 60 * 24 * 365, // 1年
				path: "/",
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production",
			},
		},
	);

	// 重要: getSession() ではなく getUser() を使用してください。
	// セキュリティ上のリスクを避けるため、サーバー側での有効性確認が必要です。
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const isLoginPage = request.nextUrl.pathname.startsWith("/login");
	const isRootPage = request.nextUrl.pathname === "/";
	const isForgotPasswordPage =
		request.nextUrl.pathname.startsWith("/forgot-password");
	const isResetPasswordPage =
		request.nextUrl.pathname.startsWith("/reset-password");
	const isAuthApi =
		request.nextUrl.pathname.startsWith("/api/auth") ||
		request.nextUrl.pathname.startsWith("/auth");
	const isOnboardingPage = request.nextUrl.pathname.startsWith("/onboarding");

	// 未ログイン時にログイン画面、ルート(LP)、パスワード忘れた/リセット画面、認証関連以外のページにアクセスした場合
	if (
		!user &&
		!isLoginPage &&
		!isRootPage &&
		!isForgotPasswordPage &&
		!isResetPasswordPage &&
		!isAuthApi
	) {
		// APIリクエストの場合はリダイレクトせず、401エラーのJSONを返す
		if (request.nextUrl.pathname.startsWith("/api")) {
			return NextResponse.json(
				{ error: "認証されていません" },
				{ status: 401 },
			);
		}
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}

	// ログイン済みのユーザーがログイン画面にアクセスした場合、かつオンボーディング完了済みならダッシュボードへ転送
	// (未完了のユーザーはログアウトや再ログインを可能にするため、ログイン画面の表示を許可する)
	if (user && isLoginPage) {
		const isOnboarded = user.user_metadata?.onboarded === true;
		if (isOnboarded) {
			const url = request.nextUrl.clone();
			url.pathname = "/dashboard";
			return NextResponse.redirect(url);
		}
	}

	// オンボーディング状況に応じたリダイレクト制御
	if (user) {
		const isOnboarded = user.user_metadata?.onboarded === true;

		if (!isOnboarded) {
			// 未オンボーディングで、オンボーディング画面以外かつその他の公開ページ以外にアクセスした場合
			if (
				!isOnboardingPage &&
				!isLoginPage &&
				!isRootPage &&
				!isForgotPasswordPage &&
				!isResetPasswordPage &&
				!isAuthApi
			) {
				const url = request.nextUrl.clone();
				url.pathname = "/onboarding";
				return NextResponse.redirect(url);
			}
		} else {
			// オンボーディング完了済みなのにオンボーディング画面にアクセスした場合
			if (isOnboardingPage) {
				const url = request.nextUrl.clone();
				url.pathname = "/dashboard";
				return NextResponse.redirect(url);
			}
		}
	}

	return supabaseResponse;
}
