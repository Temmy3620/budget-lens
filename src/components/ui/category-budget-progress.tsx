"use client";

import type { BudgetSetting } from "@/components/budgets/types";

interface CategoryBudgetProgressListProps {
	/**
	 * 予算設定の一覧
	 */
	budgets: BudgetSetting[];
	/**
	 * カテゴリIDをキー、支出額を値とするマップオブジェクト
	 */
	categorySpentMap: Record<string, number>;
}

export function CategoryBudgetProgressList({
	budgets,
	categorySpentMap,
}: CategoryBudgetProgressListProps) {
	if (budgets.length === 0) {
		return (
			<p className="text-xs text-slate-500">カテゴリが設定されていません。</p>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2">
			{budgets.map((category) => {
				const spent = categorySpentMap[category.id] || 0;
				const percentage =
					category.budget > 0
						? Math.min((spent / category.budget) * 100, 100)
						: 0;
				const isOver = spent > category.budget;

				return (
					<div key={category.id} className="space-y-1.5">
						<div className="flex items-center justify-between text-xs">
							<span className="font-semibold text-slate-300">
								{category.name}
							</span>
							<span className="text-slate-400">
								<span
									className={`font-bold ${isOver ? "text-rose-500" : "text-slate-200"}`}
								>
									¥{spent.toLocaleString()}
								</span>{" "}
								/ ¥{category.budget.toLocaleString()}
							</span>
						</div>
						<div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
							<div
								className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r
									 ${category.color || "from-slate-500 to-slate-400"}`}
								style={{ width: `${percentage}%` }}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
}
