import LoginClient from "@/components/auth/login-client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { login, signup } from "./actions";

export const metadata = {
	title: "ログイン - Budget Lens",
	description:
		"ログインまたは新規会員登録を行い、予算と出費の管理を始めましょう。",
};

export default async function LoginPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// すでにログイン済みの場合はトップページへリダイレクト
	if (user) {
		redirect("/");
	}

	return <LoginClient loginAction={login} signupAction={signup} />;
}

