"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { FormState } from "@/types/form";
import type { LoginFormErrors, SignupFormErrors } from "@/types/auth";
import { KeyVisual } from "@/components/auth/key-visual";
import { SuccessMessage } from "@/components/auth/success-message";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";

interface LoginClientProps {
	loginAction: (
		state: FormState<LoginFormErrors>,
		formData: FormData,
	) => Promise<FormState<LoginFormErrors>>;
	signupAction: (
		state: FormState<SignupFormErrors>,
		formData: FormData,
	) => Promise<FormState<SignupFormErrors>>;
	initialMode?: "login" | "signup";
}

export default function LoginClient({
	loginAction,
	signupAction,
	initialMode = "login",
}: LoginClientProps) {
	const [mode, setMode] = useState<"login" | "signup">(initialMode);
	const [loginState, runLogin, loginPending] = useActionState(
		loginAction,
		undefined,
	);
	const [signupState, runSignup, signupPending] = useActionState(
		signupAction,
		undefined,
	);

	const isLogin = mode === "login";

	return (
		<div className="relative flex min-h-screen flex-col md:flex-row bg-[#030616] text-white overflow-hidden">
			{/* 背景のグリッド線 (方眼) */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

			{/* ================= 左カラム: イラスト＆ロゴエリア ================= */}
			<KeyVisual />

			{/* ================= 右カラム: ログインフォームエリア ================= */}
			<div className="w-full md:w-[460px] lg:w-[500px] flex flex-col justify-center px-8 py-16 md:px-12 bg-[#0a0f24]/30 backdrop-blur-xl relative">
				{/* LPへ戻るリンク */}
				<Link
					href="/"
					className="absolute top-6 left-8 text-xs font-semibold text-[#8c9fc2]/60 hover:text-white transition-colors duration-200 cursor-pointer"
				>
					← LPへ戻る
				</Link>

				{/* 背景のグラデーション光彩球 */}
				<div className="absolute top-[30%] right-[10%] -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />
				<div className="absolute bottom-[20%] right-[20%] -z-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-[90px] pointer-events-none" />

				{/* 右下のキラキラ星マーク */}
				<svg
					className="absolute bottom-12 right-12 text-[#ffd280]/40 animate-pulse pointer-events-none hidden md:block"
					width="36"
					height="36"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
				</svg>

				<div className="w-full max-w-sm mx-auto space-y-8">
					{/* タブヘッダー (Goldwin風レイアウト) */}
					<div className="flex border-b border-slate-800 text-center text-sm font-semibold tracking-wider">
						<button
							type="button"
							onClick={() => setMode("login")}
							className={`flex-1 pb-4 border-b-2 tracking-wider font-semibold transition-colors duration-200 cursor-pointer ${
								isLogin
									? "border-violet-500 text-white"
									: "border-transparent text-slate-500 hover:text-slate-300"
							}`}
						>
							ログイン
						</button>
						<button
							type="button"
							onClick={() => setMode("signup")}
							className={`flex-1 pb-4 border-b-2 tracking-wider font-semibold transition-colors duration-200 cursor-pointer ${
								!isLogin
									? "border-violet-500 text-white"
									: "border-transparent text-slate-500 hover:text-slate-300"
							}`}
						>
							会員登録
						</button>
					</div>

					{!isLogin && signupState?.success && signupState?.message ? (
						<SuccessMessage
							message={signupState.message}
							onBackToLogin={() => setMode("login")}
						/>
					) : isLogin ? (
						<LoginForm
							action={runLogin}
							pending={loginPending}
							state={loginState}
						/>
					) : (
						<SignupForm
							action={runSignup}
							pending={signupPending}
							state={signupState}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
