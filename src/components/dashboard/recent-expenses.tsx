"use client";

import type { BudgetSetting } from "@/components/budgets/types";
import type { Expense } from "@/lib/supabase/expenses";

interface RecentExpensesProps {
	budgets: BudgetSetting[];
	thisMonthExpenses: Expense[];
}

export function RecentExpenses({
	budgets,
	thisMonthExpenses,
}: RecentExpensesProps) {
	const recentExpenses = [...thisMonthExpenses]
		.sort((a, b) => b.date.localeCompare(a.date))
		.slice(0, 4);

	const getCategoryInfo = (budgetId: string) => {
		const category = budgets.find((b) => b.id === budgetId);
		return {
			name: category?.name || "未分類",
			color: category?.color || "from-slate-500 to-slate-400",
		};
	};

	return (
		<div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-6 md:p-8 backdrop-blur-md shadow-xl flex flex-col justify-between">
			<div>
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-xl font-bold text-white">最近の支出履歴</h2>
						<p className="text-xs text-slate-500 mt-1">
							直近数日間の支出レコード
						</p>
					</div>
					<a
						href="/expenses"
						className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors bg-violet-500/10 hover:bg-violet-500/20 px-3 py-1.5 rounded-lg cursor-pointer"
					>
						すべて見る
					</a>
				</div>

				{recentExpenses.length > 0 ? (
					<div className="divide-y divide-white/5">
						{recentExpenses.map((expense) => {
							const categoryInfo = getCategoryInfo(expense.budgetId);
							return (
								<div
									key={expense.id}
									className="py-3.5 flex items-center justify-between group"
								>
									<div className="flex items-center gap-4">
										<div
											className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${categoryInfo.color} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md`}
										>
											{categoryInfo.name.slice(0, 2)}
										</div>
										<div>
											<div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
												{expense.memo || categoryInfo.name}
											</div>
											<div className="text-xs text-slate-500 mt-0.5">
												{expense.date.replace(/-/g, "/")}
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="text-sm font-bold text-slate-200">
											-¥{expense.amount.toLocaleString()}
										</div>
										<span className="inline-block text-[10px] px-2 py-0.5 mt-1 rounded bg-slate-800 text-slate-400">
											{categoryInfo.name}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<div className="py-12 text-center text-slate-500 text-sm">
						支出履歴がありません。
					</div>
				)}
			</div>
		</div>
	);
}
