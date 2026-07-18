import type { BudgetSetting } from "@/components/budgets/types";
import type { Expense } from "@/lib/supabase/expenses";

interface ExpenseHistoryListProps {
	expenses: Expense[];
	budgets: BudgetSetting[];
}

export function ExpenseHistoryList({
	expenses,
	budgets,
}: ExpenseHistoryListProps) {
	if (expenses.length === 0) {
		return (
			<div className="rounded-2xl border border-dashed border-white/5 bg-white/[0.01] p-12 text-center text-slate-500">
				<p className="text-sm font-semibold">この月の出費明細はありません。</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{expenses.map((expense) => {
				const category = budgets.find((b) => b.id === expense.budgetId);
				const fallbackColor = "from-slate-500 to-slate-400";
				const colorClass = category?.color || fallbackColor;

				return (
					<div
						key={expense.id}
						className="group relative rounded-xl border border-white/5 bg-[#0a0f24]/30 p-5 shadow-lg overflow-hidden flex flex-col justify-between"
					>
						{/* 各カードのカテゴリ用グラデーションエフェクト */}
						<div
							className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colorClass}`}
						/>

						<div>
							<div className="flex items-center justify-between mb-3">
								<span
									className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded bg-gradient-to-r ${colorClass} text-white shadow-sm`}
								>
									{category?.name || "未分類"}
								</span>
								<span className="text-xs text-slate-500 font-medium">
									{expense.date}
								</span>
							</div>

							{expense.memo && (
								<p className="text-sm text-slate-300 font-medium line-clamp-2 mb-3">
									{expense.memo}
								</p>
							)}
						</div>

						<div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
							<div className="text-lg font-black text-white">
								¥{expense.amount.toLocaleString()}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
