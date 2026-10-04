import { redirect } from "next/navigation";
import LandingPageClient from "@/components/landing-page-client";
import { createClient } from "@/lib/supabase/server";

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
