"use client";

import Link from "next/link";
import { MOCK_HISTORY_DATA } from "@/components/history/mock-data";
import { CategorySpentChart } from "@/components/ui/category-spent-chart";
import { ExpenseHistoryList } from "./expense-history-list";
import { CategoryBudgetProgressList } from "@/components/ui/category-budget-progress";
import { calculateCategorySpent } from "@/lib/supabase/expenses";

interface HistoryDetailClientProps {
	user: {
		id: string;
		email: string;
	} | null;
	year: number;
	month: number;
}

export default function HistoryDetailClient({
	user,
	year,
	month,
}: HistoryDetailClientProps) {
	// モックデータから該当する年・月のデータを検索
	const yearData = MOCK_HISTORY_DATA.find((d) => d.year === year);
	const monthlyData = yearData?.months.find((m) => m.month === month);

	if (!monthlyData) {
		return (
			<div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
				<div className="text-slate-600">
					<svg
						className="w-16 h-16 mx-auto"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.5"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<h2 className="text-xl font-bold text-white">データが見つかりません</h2>
				<p className="text-slate-400 text-sm">
					指定された年月（{year}年{month}月）の履歴データは存在しません。
				</p>
				<Link
					href="/history"
					className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 transition-colors shadow-lg cursor-pointer"
				>
					履歴一覧に戻る
				</Link>
			</div>
		);
	}

	const { totalBudget, totalSpent, budgets, expenses } = monthlyData;
	const isOver = totalSpent > totalBudget;
	const remaining = totalBudget - totalSpent;

	// 各カテゴリごとの実支出額を集計するマップ
	const categorySpentMap = calculateCategorySpent(expenses);

	return (
		<div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* ヘッダー・戻るリンク */}
			<div className="space-y-4">
				<Link
					href="/history"
					className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group cursor-pointer"
				>
					<svg
						className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2.5"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					履歴一覧に戻る
				</Link>

				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6 gap-4">
					<div>
						<h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
							{year}年{month}月の振り返り
						</h1>
						<p className="text-slate-400 mt-2 text-sm">
							当時の予算設定に対する消化状況と出費明細を分析します。
						</p>
					</div>

					{/* 簡易ステータスカード */}
					<div className="flex items-center gap-3">
						{isOver ? (
							<div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold px-4 py-2 rounded-2xl text-sm flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
								予算超過: ¥{Math.abs(remaining).toLocaleString()}
							</div>
						) : (
							<div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-4 py-2 rounded-2xl text-sm flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-emerald-500" />
								予算残り: ¥{remaining.toLocaleString()}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* 分析セクション（プログレスバー ＆ 円グラフ） */}
			<div className="grid gap-8 md:grid-cols-3">
				{/* 左側 (2/3): カテゴリ別の予算消化状況 */}
				<div className="md:col-span-2 space-y-4 rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-6 md:p-8 backdrop-blur-md shadow-xl flex flex-col justify-between">
					<div>
						<h2 className="text-xl font-bold text-white mb-2">
							カテゴリ別の予算消化状況
						</h2>
						<p className="text-xs text-slate-500 mb-6">
							各カテゴリの予算枠と実際の支出額の進捗率
						</p>

						<CategoryBudgetProgressList
							budgets={budgets}
							categorySpentMap={categorySpentMap}
						/>
					</div>
				</div>

				{/* 右側 (1/3): カテゴリ別支出割合（円グラフ） */}
				<CategorySpentChart budgets={budgets} thisMonthExpenses={expenses} />
			</div>

			{/* 下部: 当月の出費一覧 */}
			<div className="space-y-4">
				<h2 className="text-xl font-bold text-white">出費明細一覧</h2>
				<ExpenseHistoryList expenses={expenses} budgets={budgets} />
			</div>

			{/* 来月の予算調整へのネクストアクション */}
			<div className="pt-8 flex justify-center">
				<Link
					href="/budgets"
					className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-8 py-4 transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:scale-[1.02] cursor-pointer text-center"
				>
					この振り返りをもとに、来月の予算を調整する
					<svg
						className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2.5"
							d="M13 5l7 7-7 7M5 5l7 7-7 7"
						/>
					</svg>
				</Link>
			</div>
		</div>
	);
}
