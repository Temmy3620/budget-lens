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
	const isApi = request.nextUrl.pathname.startsWith("/api");
	const isWebhookApi = request.nextUrl.pathname.startsWith(
		"/api/stripe/webhook",
	);
	const isOnboardingPage = request.nextUrl.pathname.startsWith("/onboarding");
	const isSubscribePage = request.nextUrl.pathname.startsWith("/subscribe");
	const isPublicInfoPage =
		request.nextUrl.pathname.startsWith("/terms") ||
		request.nextUrl.pathname.startsWith("/privacy") ||
		request.nextUrl.pathname.startsWith("/legal") ||
		request.nextUrl.pathname.startsWith("/contact");

	// 未ログイン時にログイン画面、ルート(LP)、パスワード忘れた/リセット画面、認証関連、公開情報ページ以外のページにアクセスした場合
	if (
		!user &&
		!isLoginPage &&
		!isRootPage &&
		!isForgotPasswordPage &&
		!isResetPasswordPage &&
		!isAuthApi &&
		!isWebhookApi &&
		!isPublicInfoPage
	) {
		// APIリクエストの場合はリダイレクトせず、401エラーのJSONを返す
		if (isApi) {
			return NextResponse.json(
				{ error: "認証されていません" },
				{ status: 401 },
			);
		}
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}

	// ログイン済みのユーザーに対する制御
	if (user) {
		// データベース(public.users)から最新のサブスクステータスを直接取得（クッキーのキャッシュタイムラグを防ぐため）
		const { data: dbUser } = await supabase
			.from("users")
			.select("subscription_status")
			.eq("id", user.id)
			.maybeSingle();

		const subscriptionStatus = dbUser?.subscription_status || "free";
		const hasActiveSub =
			subscriptionStatus === "trialing" || subscriptionStatus === "active";
		const isOnboarded = user.user_metadata?.onboarded === true;

		// ログイン済みユーザーがログイン画面にアクセスした場合、すべて完了しているならダッシュボードへ
		if (isLoginPage && hasActiveSub && isOnboarded) {
			const url = request.nextUrl.clone();
			url.pathname = "/dashboard";
			return NextResponse.redirect(url);
		}

		// 1. サブスクリプション状態に応じたリダイレクト制御
		if (!hasActiveSub) {
			// 未購読で、購読案内画面以外かつその他の公開ページやAPI以外にアクセスした場合
			if (
				!isSubscribePage &&
				!isLoginPage &&
				!isRootPage &&
				!isForgotPasswordPage &&
				!isResetPasswordPage &&
				!isApi &&
				!isAuthApi &&
				!isPublicInfoPage
			) {
				const url = request.nextUrl.clone();
				url.pathname = "/subscribe";
				return NextResponse.redirect(url);
			}
		} else {
			// 購読済みだが /subscribe 画面にアクセスした場合、/dashboard または /onboarding へ転送
			if (isSubscribePage) {
				const url = request.nextUrl.clone();
				url.pathname = isOnboarded ? "/dashboard" : "/onboarding";
				return NextResponse.redirect(url);
			}

			// 2. オンボーディング状況に応じたリダイレクト制御 (購読済みの場合のみ有効)
			if (!isOnboarded) {
				// 未オンボーディングで、オンボーディング画面以外かつその他の公開ページやAPI以外にアクセスした場合
				if (
					!isOnboardingPage &&
					!isLoginPage &&
					!isRootPage &&
					!isForgotPasswordPage &&
					!isResetPasswordPage &&
					!isApi &&
					!isAuthApi &&
					!isPublicInfoPage
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
	}

	return supabaseResponse;
}
