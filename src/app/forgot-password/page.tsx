import { redirect } from "next/navigation";
import ForgotPasswordClient from "@/components/auth/forgot-password-client";
import { createClient } from "@/lib/supabase/server";
import { sendResetEmail } from "./actions";

export const metadata = {
	title: "パスワード再設定 - YariKuru",
	description: "パスワードを忘れた場合の再設定手続きを行います。",
};

export default async function ForgotPasswordPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// すでにログイン済みの場合はダッシュボードへリダイレクト
	if (user) {
		redirect("/dashboard");
	}

	return <ForgotPasswordClient sendResetEmailAction={sendResetEmail} />;
}
