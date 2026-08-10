"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login, signup } from "./actions";

export default function LoginPage() {
	const [mode, setMode] = useState<"login" | "signup">("login");
	const [showPassword, setShowPassword] = useState(false);
	const [loginState, loginAction, loginPending] = useActionState(
		login,
		undefined,
	);
	const [signupState, signupAction, signupPending] = useActionState(
		signup,
		undefined,
	);

	const isLogin = mode === "login";
	const activeAction = isLogin ? loginAction : signupAction;
	const activePending = isLogin ? loginPending : signupPending;
	const activeState = isLogin ? loginState : signupState;

	return (
		<div className="relative flex min-h-screen flex-col md:flex-row bg-[#030616] text-white overflow-hidden">
			{/* 背景のグリッド線 (方眼) */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

			{/* ================= 左カラム: イラスト＆ロゴエリア ================= */}
			<div className="flex-1 relative min-h-[360px] md:min-h-screen bg-[#05081c]/30 border-b md:border-b-0 md:border-r border-white/5 flex items-center justify-center p-8 md:p-12 lg:p-16">
				{/* キービジュアル画像を中央に少し小さく、額縁のように浮かせて配置 */}
				<div className="relative w-full max-h-full aspect-[4/3] overflow-hidden">
					<Image
						src="/keyvisual_v3.png"
						alt="Budget Lens Key Visual"
						fill
						priority
						sizes="(max-width: 768px) 100vw, 50vw"
						className="object-cover"
					/>
					{/* 四辺の境界線をふわっと背景に溶け込ませるインセットシャドウ */}
					<div className="absolute inset-0 shadow-[inset_0_0_40px_16px_#030616] pointer-events-none" />
				</div>
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
						<div className="space-y-6">
							<div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-400 leading-relaxed">
								<p className="font-semibold mb-2">登録手続きのご案内</p>
								<p>{signupState.message}</p>
							</div>
							<button
								type="button"
								onClick={() => {
									setMode("login");
								}}
								className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-[#00d2ff] to-[#0066ff] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:from-[#00e1ff] hover:to-[#0077ff] focus:outline-none focus:ring-2 focus:ring-[#00d2ff] focus:ring-offset-2 focus:ring-offset-[#030616] transition-all duration-200 cursor-pointer"
							>
								ログイン画面へ
							</button>
						</div>
					) : (
						<form action={activeAction} className="space-y-6">
							{activeState?.errors?._form && (
								<div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
									{activeState.errors._form.map((err) => (
										<p key={err}>{err}</p>
									))}
								</div>
							)}

							<div className="space-y-5">
								{/* 新規登録時の名前入力 */}
								{!isLogin && (
									<div>
										<label
											htmlFor="name"
											className="block text-xs font-semibold text-[#8c9fc2] mb-2 tracking-wide"
										>
											名前（表示名）
										</label>
										<input
											id="name"
											name="name"
											type="text"
											required
											className="relative block w-full rounded-lg border border-[#31395c] bg-gradient-to-r from-[#131835] to-[#1a183d] px-4 py-3 text-white placeholder-slate-600 focus:z-10 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 sm:text-sm transition-colors duration-200"
											placeholder="入力"
										/>
										{signupState?.errors?.name && (
											<p className="mt-1.5 text-xs text-rose-400">
												{signupState.errors.name[0]}
											</p>
										)}
									</div>
								)}

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
									{activeState?.errors?.email && (
										<p className="mt-1.5 text-xs text-rose-400">
											{activeState.errors.email[0]}
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
									<div className="relative">
										<input
											id="password"
											name="password"
											type={showPassword ? "text" : "password"}
											autoComplete={
												isLogin ? "current-password" : "new-password"
											}
											required
											className="relative block w-full rounded-lg border border-[#31395c] bg-gradient-to-r from-[#131835] to-[#1a183d] pl-4 pr-12 py-3 text-white placeholder-slate-600 focus:z-10 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 sm:text-sm transition-colors duration-200"
											placeholder="入力"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-slate-400 hover:text-white transition-colors duration-150 cursor-pointer flex items-center justify-center p-1"
											aria-label={
												showPassword
													? "パスワードを非表示にする"
													: "パスワードを表示する"
											}
										>
											{showPassword ? (
												<EyeOff className="h-5 w-5" />
											) : (
												<Eye className="h-5 w-5" />
											)}
										</button>
									</div>
									{activeState?.errors?.password && (
										<p className="mt-1.5 text-xs text-rose-400">
											{activeState.errors.password[0]}
										</p>
									)}
								</div>
							</div>
							<div>
								{/* 鮮やかなシアンブルーのグラデーションボタン */}
								<button
									type="submit"
									disabled={activePending}
									className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-[#00d2ff] to-[#0066ff] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:from-[#00e1ff] hover:to-[#0077ff] focus:outline-none focus:ring-2 focus:ring-[#00d2ff] focus:ring-offset-2 focus:ring-offset-[#030616] disabled:opacity-50 transition-all duration-200 cursor-pointer"
								>
									{activePending ? (
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
									) : isLogin ? (
										"ログインする"
									) : (
										"登録する"
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
