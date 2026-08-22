import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/dal";

export async function POST(req: Request) {
	try {
		// 1. 認証セッションの検証
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json(
				{ error: "認証されていません。" },
				{ status: 401 },
			);
		}

		const supabaseAdmin = createServiceRoleClient();

		// 2. StripeサブスクリプションIDの取得
		const { data: dbUser, error: dbUserError } = await supabaseAdmin
			.from("users")
			.select("stripe_subscription_id")
			.eq("id", user.id)
			.maybeSingle();

		if (dbUserError) {
			console.error("Failed to query user profile details:", dbUserError);
		}

		// 3. Stripeサブスクリプションの即時解約
		if (dbUser?.stripe_subscription_id) {
			try {
				await stripe.subscriptions.cancel(dbUser.stripe_subscription_id);
				console.log(
					`Stripe subscription ${dbUser.stripe_subscription_id} canceled successfully for user ${user.id}`,
				);
			} catch (stripeErr) {
				// すでに解約済み等の理由でStripe APIがエラーを返した場合でも、
				// アカウント削除自体は完了できるよう、エラーを許容して続行します。
				console.error(
					"Stripe subscription cancellation failed during account deletion:",
					stripeErr,
				);
			}
		}

		// 4. Supabase Auth からのユーザーの物理削除
		// データベース側のON DELETE CASCADE制約により、Authのユーザーを消すことで、
		// public.users, budgets, expenses, budget_historiesが連動して全消去されます。
		const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
			user.id,
		);

		if (deleteError) {
			console.error("Failed to delete auth user:", deleteError);
			return NextResponse.json(
				{
					error: `アカウントの削除に失敗しました: ${deleteError.message}`,
				},
				{ status: 500 },
			);
		}

		// 5. クッキーセッションのクリア (ログアウト処理)
		const supabase = await createClient();
		await supabase.auth.signOut();

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error during account deletion process:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "退会処理中に予期しないエラーが発生しました。",
			},
			{ status: 500 },
		);
	}
}
