"use client";

import Link from "next/link";
import { useActionState } from "react";
import { KeyVisual } from "@/components/auth/key-visual";
import { SuccessMessage } from "@/components/auth/success-message";
import type { ForgotPasswordFormErrors } from "@/types/auth";
import type { FormState } from "@/types/form";

interface ForgotPasswordClientProps {
	sendResetEmailAction: (
		state: FormState<ForgotPasswordFormErrors>,
		formData: FormData,
	) => Promise<FormState<ForgotPasswordFormErrors>>;
}

export default function ForgotPasswordClient({
	sendResetEmailAction,
}: ForgotPasswordClientProps) {
	const [state, runAction, isPending] = useActionState(
		sendResetEmailAction,
		undefined,
	);

	return (
		<div className="relative flex min-h-screen flex-col md:flex-row bg-[#030616] text-white overflow-hidden">
			{/* 背景のグリッド線 (方眼) */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

			{/* ================= 左カラム: イラスト＆ロゴエリア ================= */}
			<KeyVisual />

			{/* ================= 右カラム: フォームエリア ================= */}
			<div className="w-full md:w-[460px] lg:w-[500px] flex flex-col justify-center px-8 py-16 md:px-12 bg-[#0a0f24]/30 backdrop-blur-xl relative">
				{/* ログインへ戻るリンク */}
				<Link
					href="/login"
					className="absolute top-6 left-8 text-xs font-semibold text-[#8c9fc2]/60 hover:text-white transition-colors duration-200 cursor-pointer"
				>
					← ログイン画面へ戻る
				</Link>

				{/* 背景のグラデーション光彩球 */}
				<div className="absolute top-[30%] right-[10%] -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />
				<div className="absolute bottom-[20%] right-[20%] -z-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-[90px] pointer-events-none" />

				<div className="w-full max-w-sm mx-auto space-y-8">
					<div className="space-y-2">
						<h1 className="text-2xl font-bold tracking-tight text-white">
							パスワードの再設定
						</h1>
						<p className="text-xs text-[#8c9fc2]/80 leading-relaxed">
							ご登録のメールアドレスを入力してください。パスワード再設定用のメールをお送りします。
						</p>
					</div>

					{state?.success && state?.message ? (
						<SuccessMessage
							message={state.message}
							onBackToLogin={() => {
								window.location.href = "/login";
							}}
						/>
					) : (
						<form action={runAction} className="space-y-6">
							{state?.errors?._form && (
								<div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
									{state.errors._form.map((err) => (
										<p key={err}>{err}</p>
									))}
								</div>
							)}

							<div className="space-y-5">
								<div>
									<label
										htmlFor="email-address"
										className="block text-xs font-semibold text-[#8c9fc2] mb-2 tracking-wide"
									>
										メールアドレス
									</label>
									<input
										id="email-address"
										name="email"
										type="email"
										autoComplete="email"
										required
										className="relative block w-full rounded-lg border border-[#31395c] bg-gradient-to-r from-[#131835] to-[#1a183d] px-4 py-3 text-white placeholder-slate-600 focus:z-10 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 sm:text-sm transition-colors duration-200"
										placeholder="example@email.com"
									/>
									{state?.errors?.email && (
										<p className="mt-1.5 text-xs text-rose-400">
											{state.errors.email[0]}
										</p>
									)}
								</div>
							</div>

							<div>
								<button
									type="submit"
									disabled={isPending}
									className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-[#00d2ff] to-[#0066ff] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:from-[#00e1ff] hover:to-[#0077ff] focus:outline-none focus:ring-2 focus:ring-[#00d2ff] focus:ring-offset-2 focus:ring-offset-[#030616] disabled:opacity-50 transition-all duration-200 cursor-pointer"
								>
									{isPending ? (
										<span className="flex items-center gap-2">
											<svg
												className="h-4 w-4 animate-spin text-white"
												fill="none"
												viewBox="0 0 24 24"
												aria-label="読み込み中"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												/>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												/>
											</svg>
											送信中...
										</span>
									) : (
										"再設定メールを送信する"
									)}
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
