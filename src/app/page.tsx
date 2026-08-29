import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LandingPageClient from "@/components/landing-page-client";

export const metadata = {
	title: "YariKuru | 予算の「やりくり」だけに焦点をあてる、新しい家計簿",
	description:
		"面倒な口座連携や計算は不要。コントロールできる予算枠（やりくり予算）を決め、その中だけで楽しく暮らすための美しい予算管理アプリ。",
};

export default async function LandingPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// すでにログイン済みの場合はダッシュボードへ高速リダイレクト
	if (user) {
		redirect("/dashboard");
	}

	return <LandingPageClient />;
}
