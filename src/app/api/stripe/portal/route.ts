import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/supabase/dal";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function POST(req: Request) {
	try {
		// 1. セッション・ユーザーの認証
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json(
				{ error: "認証されていません。" },
				{ status: 401 },
			);
		}

		if (user.isAdmin) {
			return NextResponse.json(
				{
					error:
						"管理者アカウントのため、Stripeカスタマーポータルはご利用いただけません。",
				},
				{ status: 400 },
			);
		}

		// 2. データベースからユーザーの Stripe Customer ID を取得
		const supabaseAdmin = createServiceRoleClient();
		const { data: dbUser, error: dbUserError } = await supabaseAdmin
			.from("users")
			.select("stripe_customer_id")
			.eq("id", user.id)
			.maybeSingle();

		if (dbUserError) {
			console.error("Failed to query user stripe customer id:", dbUserError);
			return NextResponse.json(
				{ error: "ユーザー情報の取得に失敗しました。" },
				{ status: 500 },
			);
		}

		if (!dbUser?.stripe_customer_id) {
			return NextResponse.json(
				{
					error:
						"Stripeの顧客情報が見つかりません。サブスクリプションのご登録をご確認ください。",
				},
				{ status: 400 },
			);
		}

		// 3. リターンURLの構築 (設定画面に戻す)
		const origin =
			req.headers.get("origin") ||
			process.env.NEXT_PUBLIC_APP_URL ||
			"http://localhost:3005";
		const returnUrl = `${origin}/settings`;

		// 4. Stripe Customer Portal セッションの作成
		const portalSession = await stripe.billingPortal.sessions.create({
			customer: dbUser.stripe_customer_id,
			return_url: returnUrl,
		});

		if (!portalSession.url) {
			throw new Error("Stripe Customer PortalのURL生成に失敗しました。");
		}

		return NextResponse.json({ url: portalSession.url });
	} catch (error) {
		console.error("Error creating stripe customer portal session:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "カスタマーポータルの起動中に予期しないエラーが発生しました。",
			},
			{ status: 500 },
		);
	}
}
