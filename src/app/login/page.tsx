"use client";

import { useActionState } from "react";
import Image from "next/image";
import { login } from "./actions";

export default function LoginPage() {
	const [state, action, pending] = useActionState(login, undefined);

	return (
		<div className="relative flex min-h-screen flex-col md:flex-row bg-[#030616] text-white overflow-hidden">
			{/* 背景のグリッド線 (方眼) */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

			{/* ================= 左カラム: イラスト＆ロゴエリア ================= */}
			<div className="flex-1 relative min-h-[360px] md:min-h-screen bg-[#05081c]/30 border-b md:border-b-0 md:border-r border-white/5">
				{/* 左半分全面にキービジュアル画像を広げて表示 */}
				<Image
					src="/keyvisual.png"
					alt="Budget Lens Key Visual"
					fill
					priority
					className="object-cover"
				/>
			</div>

			{/* ================= 右カラム: ログインフォームエリア ================= */}
			<div className="w-full md:w-[460px] lg:w-[500px] flex flex-col justify-center px-8 py-16 md:px-12 bg-[#0a0f24]/30 backdrop-blur-xl relative">
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
						<div className="flex-1 pb-4 border-b-2 border-violet-500 text-white">
							ログイン
						</div>
						<div className="flex-1 pb-4 text-slate-500 cursor-not-allowed select-none">
							会員登録
						</div>
					</div>

					<form action={action} className="space-y-6">
						{state?.errors?._form && (
							<div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
								{state.errors._form.map((err, i) => (
									<p key={i}>{err}</p>
								))}
							</div>
						)}

						<div className="space-y-5">
							{/* メールアドレス入力 */}
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
									placeholder="入力"
								/>
								{state?.errors?.email && (
									<p className="mt-1.5 text-xs text-rose-400">
										{state.errors.email[0]}
									</p>
								)}
							</div>

							{/* パスワード入力 */}
							<div>
								<label
									htmlFor="password"
									className="block text-xs font-semibold text-[#8c9fc2] mb-2 tracking-wide"
								>
									パスワード
								</label>
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="relative block w-full rounded-lg border border-[#31395c] bg-gradient-to-r from-[#131835] to-[#1a183d] px-4 py-3 text-white placeholder-slate-600 focus:z-10 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 sm:text-sm transition-colors duration-200"
									placeholder="入力"
								/>
								{state?.errors?.password && (
									<p className="mt-1.5 text-xs text-rose-400">
										{state.errors.password[0]}
									</p>
								)}
							</div>
						</div>
						<div>
							{/* 鮮やかなシアンブルーのグラデーションボタン */}
							<button
								type="submit"
								disabled={pending}
								className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-[#00d2ff] to-[#0066ff] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:from-[#00e1ff] hover:to-[#0077ff] focus:outline-none focus:ring-2 focus:ring-[#00d2ff] focus:ring-offset-2 focus:ring-offset-[#030616] disabled:opacity-50 transition-all duration-200 cursor-pointer"
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
									"ログインする"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
