"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
	const [state, action, pending] = useActionState(login, undefined);

	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
			{/* 洗練された背景の光彩グラデーション */}
			<div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
			<div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

			<div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl">
				<div className="text-center">
					<h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
						Budget Lens にログイン
					</h2>
					<p className="mt-2 text-sm text-slate-400">
						家計データを安全に管理・分析しましょう
					</p>
				</div>

				<form action={action} className="mt-8 space-y-6">
					{state?.errors?._form && (
						<div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
							{state.errors._form.map((err, i) => (
								<p key={i}>{err}</p>
							))}
						</div>
					)}

					<div className="space-y-4 rounded-md shadow-sm">
						<div>
							<label htmlFor="email-address" className="sr-only">
								メールアドレス
							</label>
							<input
								id="email-address"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="relative block w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:z-10 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm transition-colors duration-200"
								placeholder="メールアドレス"
							/>
							{state?.errors?.email && (
								<p className="mt-1 text-xs text-rose-400">
									{state.errors.email[0]}
								</p>
							)}
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								パスワード
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								className="relative block w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:z-10 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm transition-colors duration-200"
								placeholder="パスワード"
							/>
							{state?.errors?.password && (
								<p className="mt-1 text-xs text-rose-400">
									{state.errors.password[0]}
								</p>
							)}
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={pending}
							className="group relative flex w-full justify-center rounded-lg bg-violet-600 px-4 py-3 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 transition-all duration-200"
						>
							{pending ? (
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
									処理中...
								</span>
							) : (
								"ログイン"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
