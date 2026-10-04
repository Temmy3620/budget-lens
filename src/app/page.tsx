import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LandingPageClient from "@/components/landing-page-client";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "YariKuru（ヤリクル）| やりくり予算に特化したシンプルな予算管理アプリ",
	description:
		"YariKuru（ヤリクル）は、固定費を除外した「自分でコントロールできるやりくり予算」だけに集中できる予算管理アプリです。直感的な円グラフと過去のスナップショット機能で、日々のやりくりをスマートにサポートします。",
	keywords: [
		"YariKuru",
		"ヤリクル",
		"やりくり",
		"予算管理アプリ",
		"家計簿アプリ",
	],
	openGraph: {
		title:
			"YariKuru（ヤリクル）| やりくり予算に特化したシンプルな予算管理アプリ",
		description:
			"固定費のノイズを排除し、「今月あといくら使えるか」に特化。過去のやりくり設定も正確に振り返れます。",
		url: "https://yarikuru.com",
		siteName: "YariKuru",
		locale: "ja_JP",
		type: "website",
	},
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
