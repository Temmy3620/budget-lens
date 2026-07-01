"use client";

import type { BudgetSetting } from "@/components/budgets/types";
import type { Expense } from "@/lib/supabase/expenses";

interface DashboardStatsProps {
	budgets: BudgetSetting[];
	thisMonthExpenses: Expense[];
	lastMonthExpenses: Expense[];
}

export function DashboardStats({
	budgets,
	thisMonthExpenses,
	lastMonthExpenses,
}: DashboardStatsProps) {
	// 総予算
	const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
	// 今月の総支出
	const totalSpent = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
	// 残り予算
	const remainingBudget = totalBudget - totalSpent;

	// 残り予算のパーセンテージ (全体予算の内、未消化)
	const remainingPercentage =
		totalBudget > 0
			? Math.max(0, Math.min(100, (remainingBudget / totalBudget) * 100))
			: 0;

	// 総支出の予算に対する割合 (消化率)
	const spentPercentage =
		totalBudget > 0
			? Math.max(0, Math.min(100, (totalSpent / totalBudget) * 100))
			: 0;

	// 先月比の計算
	const lastMonthSpent = lastMonthExpenses.reduce(
		(sum, e) => sum + e.amount,
		0,
	);
	let comparisonText = "";
	let comparisonClass = "text-slate-500";
	if (lastMonthSpent > 0) {
		const diffPercent = ((totalSpent - lastMonthSpent) / lastMonthSpent) * 100;
		const sign = diffPercent >= 0 ? "+" : "";
		comparisonText = `${sign}${diffPercent.toFixed(1)}%`;
		comparisonClass =
			diffPercent >= 0
				? "text-pink-400 font-semibold"
				: "text-emerald-400 font-semibold";
	} else {
		comparisonText = "前月データなし";
	}

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{/* カード1: 総予算残高 */}
			<div className="group relative rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-6 backdrop-blur-md hover:border-violet-500/20 transition-all duration-300 shadow-xl overflow-hidden">
				<div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-violet-500/5 blur-2xl group-hover:bg-violet-500/10 transition-all duration-300" />
				<div className="flex items-center justify-between mb-4">
					<span className="text-sm font-medium text-slate-400">
						今月の残り予算
					</span>
					<div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
							role="img"
							aria-label="残り予算アイコン"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
				</div>
				<div className="text-3xl font-extrabold text-white tracking-tight">
					¥{remainingBudget.toLocaleString()}
				</div>
				<div className="mt-2 flex items-center gap-2 text-xs">
					<span className="text-emerald-400 font-semibold">
						{remainingPercentage.toFixed(1)}%
					</span>
					<span className="text-slate-500">全体予算の内、未消化</span>
				</div>
				{/* プログレスバー */}
				<div className="mt-4 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
					<div
						className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
						style={{ width: `${remainingPercentage}%` }}
					/>
				</div>
			</div>

			{/* カード2: 総支出 */}
			<div className="group relative rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-6 backdrop-blur-md hover:border-pink-500/20 transition-all duration-300 shadow-xl overflow-hidden">
				<div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-pink-500/5 blur-2xl group-hover:bg-pink-500/10 transition-all duration-300" />
				<div className="flex items-center justify-between mb-4">
					<span className="text-sm font-medium text-slate-400">
						今月の総支出
					</span>
					<div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
							role="img"
							aria-label="総支出アイコン"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
					</div>
				</div>
				<div className="text-3xl font-extrabold text-white tracking-tight">
					¥{totalSpent.toLocaleString()}
				</div>
				<div className="mt-2 flex items-center gap-2 text-xs">
					<span className={comparisonClass}>{comparisonText}</span>
					<span className="text-slate-500">先月の総支出比</span>
				</div>
				{/* プログレスバー */}
				<div className="mt-4 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
					<div
						className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
						style={{ width: `${spentPercentage}%` }}
					/>
				</div>
			</div>

			{/* カード3: 今月の収入 */}
			<div className="group relative rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-6 backdrop-blur-md hover:border-emerald-500/20 transition-all duration-300 shadow-xl overflow-hidden">
				<div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-all duration-300" />
				<div className="flex items-center justify-between mb-4">
					<span className="text-sm font-medium text-slate-400">
						今月の手取り収入
					</span>
					<div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
							role="img"
							aria-label="手取り収入アイコン"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
					</div>
				</div>
				<div className="text-3xl font-extrabold text-white tracking-tight">
					¥350,000
				</div>
				<div className="mt-2 flex items-center gap-2 text-xs">
					<span className="text-slate-400 font-semibold">固定給: ¥320,000</span>
					<span className="text-slate-500">/ 副収入: ¥30,000</span>
				</div>
				<div className="mt-4 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
					<div
						className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
						style={{ width: "100%" }}
					/>
				</div>
			</div>
		</div>
	);
}
