import Stripe from "stripe";

// Next.jsのビルド時（環境変数が存在しない）でもクラッシュしないよう、ダミーキーをフォールバックとして使用します
const stripeSecretKey =
	process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key_for_build";

export const stripe = new Stripe(stripeSecretKey, {
	typescript: true,
} as any);
