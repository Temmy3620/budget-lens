import type { BudgetSetting } from "@/components/budgets/types";
import type { Expense } from "@/lib/expenses";

interface ExpenseCardProps {
	expense: Expense;
	budgets: BudgetSetting[];
	onDelete: (id: string) => void;
	onEdit: (expense: Expense) => void;
}

export function ExpenseCard({
	expense,
	budgets,
	onDelete,
	onEdit,
}: ExpenseCardProps) {
	const category = budgets.find((b) => b.id === expense.budgetId);
	const fallbackColor = "from-slate-500 to-slate-400";
	const colorClass = category?.color || fallbackColor;

	return (
		<div className="group relative rounded-xl border border-white/5 bg-[#0a0f24]/30 hover:bg-[#0a0f24]/50 transition-all duration-300 p-5 shadow-lg overflow-hidden flex flex-col justify-between">
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
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={() => onEdit(expense)}
						className="p-1.5 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
						aria-label="編集"
					>
						<svg
							className="w-4.5 h-4.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
							/>
						</svg>
					</button>
					<button
						type="button"
						onClick={() => onDelete(expense.id)}
						className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
						aria-label="削除"
					>
						<svg
							className="w-4.5 h-4.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
