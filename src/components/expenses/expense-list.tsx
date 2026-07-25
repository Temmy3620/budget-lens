import { useState } from "react";
import type { BudgetSetting } from "@/components/budgets/types";
import type { Expense } from "@/lib/supabase/expenses";
import type { ReactNode } from "react";
import { ExpenseCard } from "./expense-card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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
	const [selectedBudgetId, setSelectedBudgetId] = useState<string>("all");

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

	// フィルター処理
	const filteredExpenses = expenses.filter((expense) => {
		if (selectedBudgetId === "all") return true;
		if (selectedBudgetId === "unclassified") {
			return expense.budgetId === "";
		}
		return expense.budgetId === selectedBudgetId;
	});

	// セレクトボックスの選択肢データ
	const selectItems = [
		{ label: "すべてのカテゴリ", value: "all" },
		...budgets.map((b) => ({ label: b.name, value: b.id })),
		{ label: "未分類", value: "unclassified" },
	];

	return (
		<div className="space-y-4">
			{/* フィルタープルダウン */}
			<div className="flex justify-end items-center gap-2">
				<span className="text-xs font-medium text-slate-400">
					カテゴリで絞り込み:
				</span>
				<Select
					value={selectedBudgetId}
					onValueChange={(val) => setSelectedBudgetId(val || "all")}
					items={selectItems}
				>
					<SelectTrigger className="w-[180px] bg-slate-900/60 border-white/10 text-slate-200 rounded-xl">
						<SelectValue placeholder="すべてのカテゴリ" />
					</SelectTrigger>
					<SelectContent className="bg-slate-950 border-white/10 text-slate-200">
						{selectItems.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{filteredExpenses.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-white/5 bg-white/[0.01] p-12 text-center text-slate-500">
					<div className="mb-4 flex justify-center text-slate-600">
						<svg
							className="w-12 h-12"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.5"
								d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
							/>
						</svg>
					</div>
					<p className="text-sm font-semibold">
						選択されたカテゴリの出費はありません。
					</p>
					<button
						type="button"
						onClick={() => setSelectedBudgetId("all")}
						className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 rounded-xl transition-all cursor-pointer"
					>
						フィルターをリセット
					</button>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filteredExpenses.map((expense) => (
						<ExpenseCard
							key={expense.id}
							expense={expense}
							budgets={budgets}
							onDelete={onDelete}
							onEdit={onEdit}
						/>
					))}
				</div>
			)}
		</div>
	);
}
