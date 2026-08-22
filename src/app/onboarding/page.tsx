"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Wallet,
	Check,
	Plus,
	Trash2,
	Coins,
	AlertCircle,
	ArrowRight,
	ArrowLeft,
	Loader2,
	LogOut,
} from "lucide-react";
import { COLOR_VARIANTS } from "@/components/budgets/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { logout } from "@/app/login/actions";
import { completeOnboardingAction } from "./actions";

interface OnboardingCategory {
	name: string;
	budget: number;
	color: string;
	memo: string;
	enabled: boolean;
	isPreset: boolean;
}

const PRESET_CATEGORIES: OnboardingCategory[] = [
	{
		name: "食費",
		budget: 50000,
		color: "from-red-500 to-rose-400",
		memo: "スーパー、外食、コンビニ、カフェなど",
		enabled: true,
		isPreset: true,
	},
	{
		name: "日用品",
		budget: 10000,
		color: "from-emerald-500 to-green-400",
		memo: "ドラッグストア、消耗品、雑貨など",
		enabled: true,
		isPreset: true,
	},
	{
		name: "家賃・光熱費",
		budget: 80000,
		color: "from-yellow-500 to-amber-500",
		memo: "家賃、電気、ガス、水道、ネット代など",
		enabled: true,
		isPreset: true,
	},
	{
		name: "娯楽・交際費",
		budget: 20000,
		color: "from-purple-500 to-pink-400",
		memo: "趣味、映画、旅行、飲み会、プレゼントなど",
		enabled: true,
		isPreset: true,
	},
	{
		name: "交通費",
		budget: 10000,
		color: "from-blue-500 to-indigo-400",
		memo: "電車、バス、タクシー、ガソリン代など",
		enabled: true,
		isPreset: true,
	},
];

export default function OnboardingPage() {
	const router = useRouter();
	const [step, setStep] = useState<1 | 2>(1);
	const [categories, setCategories] =
		useState<OnboardingCategory[]>(PRESET_CATEGORIES);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// カスタムカテゴリ追加用のフォーム状態
	const [customName, setCustomName] = useState("");
	const [customBudget, setCustomBudget] = useState("");
	const [customColor, setCustomColor] = useState(COLOR_VARIANTS[2].value); // デフォルト: ブルー
	const [customMemo, setCustomMemo] = useState("");

	// 合計予算の計算 (有効なもののみ)
	const totalBudget = categories
		.filter((c) => c.enabled)
		.reduce((sum, c) => sum + c.budget, 0);

	// プリセット・カスタム値の変更ハンドラ
	const handleBudgetChange = (index: number, value: string) => {
		const parsed = Number.parseInt(value, 10);
		const budgetVal = Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;

		setCategories((prev) =>
			prev.map((c, i) => (i === index ? { ...c, budget: budgetVal } : c)),
		);
	};

	const handleToggleEnable = (index: number) => {
		setCategories((prev) =>
			prev.map((c, i) => (i === index ? { ...c, enabled: !c.enabled } : c)),
		);
	};

	// カスタムカテゴリの追加
	const handleAddCustomCategory = (e: React.FormEvent) => {
		e.preventDefault();
		if (!customName.trim()) {
			setError("カテゴリ名を入力してください。");
			return;
		}

		const budgetVal = Number.parseInt(customBudget, 10);
		if (Number.isNaN(budgetVal) || budgetVal <= 0) {
			setError("予算額は1円以上の有効な数値を入力してください。");
			return;
		}

		// 同名重複チェック
		if (
			categories.some(
				(c) => c.name.toLowerCase() === customName.trim().toLowerCase(),
			)
		) {
			setError("同じ名前のカテゴリが既に存在します。");
			return;
		}

		const newCategory: OnboardingCategory = {
			name: customName.trim(),
			budget: budgetVal,
			color: customColor,
			memo: customMemo.trim(),
			enabled: true,
			isPreset: false,
		};

		setCategories((prev) => [...prev, newCategory]);
		setError(null);

		// フォームリセット
		setCustomName("");
		setCustomBudget("");
		setCustomMemo("");
	};

	// カスタムカテゴリの削除
	const handleRemoveCategory = (index: number) => {
		setCategories((prev) => prev.filter((_, i) => i !== index));
	};

	// スキップ処理の実行 (予算を設定せずに完了)
	const handleSkip = async () => {
		setIsSubmitting(true);
		setError(null);

		try {
			const res = await completeOnboardingAction([]);
			if (!res.success) {
				setError(res.error || "スキップ処理中にエラーが発生しました。");
				setIsSubmitting(false);
			} else {
				router.replace("/dashboard");
			}
		} catch (err) {
			setError("予期しないエラーが発生しました。");
			setIsSubmitting(false);
		}
	};

	// 完了処理の実行
	const handleComplete = async () => {
		setIsSubmitting(true);
		setError(null);

		const activeBudgets = categories
			.filter((c) => c.enabled)
			.map((c) => ({
				name: c.name,
				budget: c.budget,
				color: c.color,
				memo: c.memo || undefined,
			}));

		try {
			const res = await completeOnboardingAction(activeBudgets);
			if (!res.success) {
				setError(res.error || "設定の保存中にエラーが発生しました。");
				setIsSubmitting(false);
			} else {
				router.replace("/dashboard");
			}
		} catch (err) {
			setError("予期しないエラーが発生しました。");
			setIsSubmitting(false);
		}
	};

	return (
		<main className="min-h-screen bg-[#060814] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
			{/* 装飾用の背景グラデーション効果 */}
			<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

			<div className="w-full max-w-4xl bg-slate-950/60 border border-white/5 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl z-10">
				{/* ヘッダー・ロゴ */}
				<div className="flex flex-col items-center text-center mb-8 relative">
					{/* 右上にログアウトボタンを配置 */}
					<form action={logout} className="absolute right-0 top-0">
						<button
							type="submit"
							className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] md:text-xs text-slate-400 hover:text-white transition-all cursor-pointer font-semibold"
						>
							<LogOut className="w-3.5 h-3.5" />
							<span>ログアウト</span>
						</button>
					</form>

					<div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 mb-4 animate-pulse">
						<Wallet className="w-7 h-7 text-white" />
					</div>
					<h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
						Budget Lens
					</h1>
					<p className="text-xs md:text-sm text-slate-400 mt-1">
						スマートな予算管理で、暮らしをシンプルに
					</p>
				</div>

				{/* ステップ1: ウェルカム画面 */}
				{step === 1 && (
					<div className="space-y-6 max-w-xl mx-auto text-center py-4">
						<div className="space-y-3">
							<h2 className="text-xl font-bold text-slate-200">
								ご利用ありがとうございます！
							</h2>
							<p className="text-slate-400 text-sm leading-relaxed">
								まずは毎月の目標予算をカテゴリごとに設定しましょう。
								<br />
								プリセットの金額を調整するか、ご自身のライフスタイルに合わせて自由に追加・削除ができます。
								<br />
								初期設定は、ダッシュボードからいつでも変更可能です。
							</p>
						</div>

						<div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left text-xs md:text-sm text-slate-400 space-y-2">
							<div className="flex gap-2 items-center text-slate-300 font-semibold mb-1">
								<Coins className="w-4 h-4 text-violet-400" />
								<span>予算を設定するメリット</span>
							</div>
							<p>・ 毎月の出費の使いすぎをカテゴリ単位で可視化できます</p>
							<p>
								・ 振り返り機能で、過去の月ごとの予算消化をいつでも確認できます
							</p>
						</div>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto max-w-md">
							<button
								type="button"
								onClick={() => setStep(2)}
								className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-sm font-semibold text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
							>
								<span>予算を設定してみる</span>
								<ArrowRight className="w-4 h-4" />
							</button>
							<button
								type="button"
								onClick={handleSkip}
								disabled={isSubmitting}
								className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-sm font-semibold text-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
							>
								{isSubmitting ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<span>スキップして始める</span>
								)}
							</button>
						</div>
					</div>
				)}

				{/* ステップ2: 予算の初期設定 */}
				{step === 2 && (
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
						{/* 左側: 予算カテゴリの編集リスト */}
						<div className="lg:col-span-7 space-y-4">
							<div className="flex justify-between items-center">
								<h2 className="text-lg font-bold text-slate-200">
									1. 予算カテゴリと金額の調整
								</h2>
								<span className="text-xs text-slate-400">
									選択中: {categories.filter((c) => c.enabled).length}個
								</span>
							</div>

							<div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
								{categories.map((c, index) => (
									<div
										key={c.name}
										className={`p-4 rounded-2xl border transition-all duration-300 flex items-start justify-between gap-4 ${
											c.enabled
												? "bg-slate-900/60 border-white/10"
												: "bg-slate-950/20 border-white/5 opacity-50"
										}`}
									>
										{/* 有効・無効のトグル (チェックマーク) */}
										<button
											type="button"
											onClick={() => handleToggleEnable(index)}
											className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer mt-1 shrink-0 ${
												c.enabled
													? "bg-violet-600 border-violet-500 text-white"
													: "border-white/20 hover:border-white/40"
											}`}
										>
											{c.enabled && <Check className="w-3.5 h-3.5" />}
										</button>

										<div className="flex-1 space-y-1">
											<div className="flex items-center gap-2">
												<span
													className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${c.color} shrink-0`}
												/>
												<span className="text-sm font-bold text-slate-200">
													{c.name}
												</span>
											</div>
											{c.memo && (
												<p className="text-xs text-slate-500">{c.memo}</p>
											)}
										</div>

										<div className="flex items-center gap-2">
											<input
												type="number"
												value={c.budget}
												disabled={!c.enabled}
												onChange={(e) =>
													handleBudgetChange(index, e.target.value)
												}
												className="w-24 rounded-lg bg-slate-950 border border-white/10 px-2 py-1.5 text-right text-sm text-slate-200 focus:outline-none focus:border-violet-500 disabled:opacity-50 transition-colors"
											/>
											<span className="text-xs text-slate-400">円</span>

											{!c.isPreset && (
												<button
													type="button"
													onClick={() => handleRemoveCategory(index)}
													className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
													title="削除"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											)}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* 右側: カスタムカテゴリ追加 & 合計表示 */}
						<div className="lg:col-span-5 flex flex-col justify-between gap-6">
							{/* カスタム追加フォーム */}
							<div className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl space-y-4">
								<h3 className="text-sm font-bold text-slate-300">
									独自のカテゴリを追加
								</h3>
								<form onSubmit={handleAddCustomCategory} className="space-y-3">
									<div className="space-y-1">
										<span className="text-[10px] font-semibold text-slate-500">
											カテゴリ名
										</span>
										<input
											type="text"
											placeholder="例: サブスク、自己投資など"
											value={customName}
											onChange={(e) => setCustomName(e.target.value)}
											className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-violet-500 transition-colors"
										/>
									</div>

									<div className="grid grid-cols-2 gap-3">
										<div className="space-y-1">
											<span className="text-[10px] font-semibold text-slate-500">
												月間予算額 (円)
											</span>
											<input
												type="number"
												placeholder="10000"
												value={customBudget}
												onChange={(e) => setCustomBudget(e.target.value)}
												className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-violet-500 transition-colors"
											/>
										</div>

										<div className="space-y-1">
											<span className="text-[10px] font-semibold text-slate-500">
												カラー
											</span>
											<Select
												value={customColor}
												onValueChange={(val) =>
													setCustomColor(val || COLOR_VARIANTS[2].value)
												}
												items={COLOR_VARIANTS}
											>
												<SelectTrigger className="w-full rounded-xl bg-slate-950 border border-white/10 text-slate-200 text-xs py-2 px-3 focus:outline-none transition-all cursor-pointer">
													<SelectValue placeholder="選択" />
												</SelectTrigger>
												<SelectContent className="bg-slate-950 border-white/10 text-slate-200 text-xs">
													{COLOR_VARIANTS.map((v) => (
														<SelectItem key={v.value} value={v.value}>
															{v.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>

									<div className="space-y-1">
										<span className="text-[10px] font-semibold text-slate-500">
											メモ (省略可)
										</span>
										<input
											type="text"
											placeholder="例: Netflix、本、セミナーなど"
											value={customMemo}
											onChange={(e) => setCustomMemo(e.target.value)}
											className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-violet-500 transition-colors"
										/>
									</div>

									<button
										type="submit"
										className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
									>
										<Plus className="w-3.5 h-3.5" />
										<span>カテゴリを追加</span>
									</button>
								</form>
							</div>

							{/* 合計予算・進むボタン */}
							<div className="space-y-4">
								<div className="bg-[#0a0f24]/60 border border-violet-500/10 p-5 rounded-2xl flex flex-col justify-center items-center shadow-lg shadow-violet-950/10 text-center">
									<span className="text-xs text-slate-400 font-semibold mb-1">
										毎月の合計目標予算
									</span>
									<span className="text-3xl font-extrabold text-white tracking-tight">
										¥{totalBudget.toLocaleString()}
									</span>
								</div>

								{error && (
									<div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex gap-2 items-center">
										<AlertCircle className="w-4 h-4 shrink-0" />
										<span>{error}</span>
									</div>
								)}

								<div className="flex flex-col gap-2">
									<div className="flex gap-3">
										<button
											type="button"
											onClick={() => setStep(1)}
											disabled={isSubmitting}
											className="px-4 py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
										>
											<ArrowLeft className="w-4 h-4" />
											<span>戻る</span>
										</button>
										<button
											type="button"
											onClick={handleComplete}
											disabled={isSubmitting}
											className="flex-1 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
										>
											{isSubmitting ? (
												<>
													<Loader2 className="w-4 h-4 animate-spin" />
													<span>設定を保存中...</span>
												</>
											) : (
												<>
													<span>この設定で始める</span>
													<ArrowRight className="w-4 h-4" />
												</>
											)}
										</button>
									</div>
									<button
										type="button"
										onClick={handleSkip}
										disabled={isSubmitting}
										className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-300 hover:underline transition-all cursor-pointer text-center mt-1"
									>
										予算を設定せずにスキップする（あとからダッシュボードで設定できます）
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
