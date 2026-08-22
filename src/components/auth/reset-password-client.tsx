"use client";

import { useActionState } from "react";
import { KeyVisual } from "@/components/auth/key-visual";
import { PasswordInput } from "@/components/ui/password-input";
import type { ResetPasswordFormErrors } from "@/types/auth";
import type { FormState } from "@/types/form";

interface ResetPasswordClientProps {
	resetPasswordAction: (
		state: FormState<ResetPasswordFormErrors>,
		formData: FormData,
	) => Promise<FormState<ResetPasswordFormErrors>>;
}

export default function ResetPasswordClient({
	resetPasswordAction,
}: ResetPasswordClientProps) {
	const [state, runAction, isPending] = useActionState(
		resetPasswordAction,
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
				{/* 背景 of グラデーション光彩球 */}
				<div className="absolute top-[30%] right-[10%] -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />
				<div className="absolute bottom-[20%] right-[20%] -z-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-[90px] pointer-events-none" />

				<div className="w-full max-w-sm mx-auto space-y-8">
					<div className="space-y-2">
						<h1 className="text-2xl font-bold tracking-tight text-white">
							新しいパスワードの設定
						</h1>
						<p className="text-xs text-[#8c9fc2]/80 leading-relaxed">
							アカウントの新しいパスワードを入力してください。設定完了後、自動的にログインしてホームへ遷移します。
						</p>
					</div>

					<form action={runAction} className="space-y-6">
						{state?.errors?._form && (
							<div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
								{state.errors._form.map((err) => (
									<p key={err}>{err}</p>
								))}
							</div>
						)}

						<div className="space-y-5">
							{/* 新しいパスワード */}
							<PasswordInput
								id="password"
								name="password"
								label="新しいパスワード"
								autoComplete="new-password"
								required
								error={state?.errors?.password?.[0]}
							/>

							{/* 新しいパスワード (確認) */}
							<PasswordInput
								id="confirmPassword"
								name="confirmPassword"
								label="新しいパスワード（確認）"
								autoComplete="new-password"
								required
								error={state?.errors?.confirmPassword?.[0]}
							/>
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
										更新中...
									</span>
								) : (
									"パスワードを変更する"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
