import LoginClient from "@/components/auth/login-client";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { login, signup } from "./actions";

export const metadata = {
	title: "ログイン - Budget Lens",
	description:
		"ログインまたは新規会員登録を行い、予算と出費の管理を始めましょう。",
};

interface PageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// すでにログイン済みの場合はトップページへリダイレクト
	if (user) {
		redirect("/");
	}

	const resolvedSearchParams = await searchParams;
	const initialMode =
		resolvedSearchParams.mode === "signup" ? "signup" : "login";

	return (
		<LoginClient
			loginAction={login}
			signupAction={signup}
			initialMode={initialMode}
		/>
	);
}
