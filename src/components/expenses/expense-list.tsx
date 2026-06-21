import type { BudgetSetting } from "@/components/budgets/types";
import type { Expense } from "@/lib/supabase/expenses";
import type { ReactNode } from "react";
import { ExpenseCard } from "./expense-card";

interface ExpenseListProps {
	expenses: Expense[];
	budgets: BudgetSetting[];
	onDelete: (id: string) => void;
	onEdit: (expense: Expense) => void;
	emptyIcon: ReactNode;
	emptyTitle: string;
	emptySubtitle: string;
}

export function ExpenseList({
	expenses,
	budgets,
	onDelete,
	onEdit,
	emptyIcon,
	emptyTitle,
	emptySubtitle,
}: ExpenseListProps) {
	if (expenses.length === 0) {
		return (
			<div className="rounded-2xl border border-dashed border-white/5 bg-white/[0.01] p-12 text-center text-slate-500">
				<div className="mb-4 flex justify-center text-slate-600">
					{emptyIcon}
				</div>
				<p className="text-sm font-semibold">{emptyTitle}</p>
				<p className="text-xs text-slate-600 mt-2">{emptySubtitle}</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{expenses.map((expense) => (
				<ExpenseCard
					key={expense.id}
					expense={expense}
					budgets={budgets}
					onDelete={onDelete}
					onEdit={onEdit}
				/>
			))}
		</div>
	);
}
