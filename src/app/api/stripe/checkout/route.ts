import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/supabase/dal";

export async function POST(req: Request) {
	try {
		// セキュリティ: クライアントからの値を鵜呑みにせず、サーバーサイドセッションから現在ログイン中のユーザーを取得・検証
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json(
				{ error: "認証されていません" },
				{ status: 401 },
			);
		}

		if (!process.env.STRIPE_PRICE_ID) {
			console.error("STRIPE_PRICE_ID is not configured in env");
			return NextResponse.json(
				{ error: "Stripe Price ID が設定されていません。" },
				{ status: 500 },
			);
		}

		// Stripe Checkout Sessionの作成
		const session = await stripe.checkout.sessions.create({
			mode: "subscription",
			customer_email: user.email,
			client_reference_id: user.id, // 内部のユーザーIDをStripeへ紐付け
			line_items: [
				{
					price: process.env.STRIPE_PRICE_ID,
					quantity: 1,
				},
			],
			subscription_data: {
				trial_period_days: 90, // 90日間無料トライアルを設定
			},
			success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe`, // 購読案内ページに戻す
		});

		if (!session.url) {
			throw new Error("Stripe CheckoutセッションURLの生成に失敗しました。");
		}

		return NextResponse.json({ url: session.url });
	} catch (error) {
		console.error("Error creating stripe checkout session:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "予期しないエラーが発生しました。",
			},
			{ status: 500 },
		);
	}
}
