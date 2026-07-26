import type { BudgetSetting } from "@/components/budgets/types";
import { DeleteButton } from "@/components/ui/delete-button";
import { EditButton } from "@/components/ui/edit-button";
import type { Expense } from "@/lib/supabase/expenses";

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
					<EditButton
						onClick={() => onEdit(expense)}
						iconClassName="w-4.5 h-4.5"
					/>
					<DeleteButton
						onClick={() => onDelete(expense.id)}
						iconClassName="w-4.5 h-4.5"
					/>
				</div>
			</div>
		</div>
	);
}
