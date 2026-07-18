"use client";

import Link from "next/link";
import type { MonthlyHistorySummary } from "@/components/history/mock-data";

interface HistoryMonthCardProps {
	selectedYear: number;
	summary: MonthlyHistorySummary;
}

export function HistoryMonthCard({
	selectedYear,
	summary,
}: HistoryMonthCardProps) {
	const isOver = summary.totalSpent > summary.totalBudget;
	const diff = summary.totalBudget - summary.totalSpent;
	const percentage =
		summary.totalBudget > 0
			? Math.min((summary.totalSpent / summary.totalBudget) * 100, 100)
			: 0;

	return (
		<Link
			href={`/history/${selectedYear}/${summary.month}`}
			className="group relative block rounded-2xl border border-white/5 bg-[#0a0f24]/30 hover:bg-[#0a0f24]/50 hover:border-violet-500/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.08)] transition-all duration-300 p-6 overflow-hidden transform hover:scale-[1.005]"
		>
			{/* ホバー時のアクセントボーダー */}
			<div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-transparent via-violet-500/0 to-transparent group-hover:via-violet-500/40 transition-all duration-500" />

			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				{/* 左側: 月 & ステータス */}
				<div className="flex items-center gap-4">
					<div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 font-black text-xl text-white group-hover:text-violet-300 transition-colors shadow-inner">
						{summary.month}月
					</div>
					<div>
						{isOver ? (
							<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400">
								<span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
								予算超過
							</span>
						) : (
							<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
								<span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
								予算内
							</span>
						)}
						<p className="text-slate-500 text-[10px] mt-1.5 uppercase font-semibold tracking-wider">
							Status
						</p>
					</div>
				</div>

				{/* 中央: 支出額 vs 予算 & 残額 */}
				<div className="grid grid-cols-2 gap-4 md:gap-8 flex-1 max-w-lg">
					<div>
						<span className="text-xs text-slate-500 font-semibold block mb-1">
							支出 / 予算
						</span>
						<div className="text-base font-bold text-slate-300">
							<span className={isOver ? "text-rose-400" : "text-slate-200"}>
								¥{summary.totalSpent.toLocaleString()}
							</span>
							<span className="text-slate-500 font-medium text-xs px-1">/</span>
							<span className="text-slate-400 font-medium">
								¥{summary.totalBudget.toLocaleString()}
							</span>
						</div>
					</div>

					<div>
						<span className="text-xs text-slate-500 font-semibold block mb-1">
							{isOver ? "超過額" : "残額"}
						</span>
						<div
							className={`text-lg font-black ${isOver ? "text-rose-400" : "text-emerald-400"
								}`}
						>
							{isOver ? "-" : "+"}¥{Math.abs(diff).toLocaleString()}
						</div>
					</div>
				</div>

				{/* 右側: 進捗バー & 矢印リンク */}
				<div className="flex items-center gap-6 min-w-full md:min-w-0 md:w-56 justify-between md:justify-end">
					<div className="flex-1 md:flex-initial md:w-40 space-y-2">
						<div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
							<span>消化率</span>
							<span className={isOver ? "text-rose-400" : "text-emerald-400"}>
								{((summary.totalSpent / summary.totalBudget) * 100).toFixed(0)}%
							</span>
						</div>
						<div className="w-full h-2 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
							<div
								className={`h-full rounded-full transition-all duration-500 ${isOver
									? "bg-gradient-to-r from-rose-500 to-pink-500"
									: "bg-gradient-to-r from-violet-500 to-indigo-500"
									}`}
								style={{ width: `${percentage}%` }}
							/>
						</div>
					</div>

					<div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 group-hover:text-white group-hover:bg-violet-600/10 group-hover:border-violet-500/20 transition-all shrink-0">
						<svg
							className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2.5"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</div>
			</div>
		</Link>
	);
}
