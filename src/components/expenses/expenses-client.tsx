"use client";

import { useEffect, useState } from "react";
import type { BudgetSetting } from "@/components/budgets/types";
import { getBudgets } from "@/lib/supabase/budgets";
import { type Expense, deleteExpense, getExpenses } from "@/lib/supabase/expenses";
import { ExpenseFormModal } from "./expense-form-modal";
import { ExpenseList } from "./expense-list";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function ExpensesClient() {
	const { user, isLoading: isUserLoading } = useCurrentUser();
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [budgets, setBudgets] = useState<BudgetSetting[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// 表示対象の年月 (YYYY-MM 形式)
	const [currentMonth, setCurrentMonth] = useState("");

	// 実行時の「今月」 (YYYY-MM 形式)
	const [thisMonth, setThisMonth] = useState("");

	// モーダルの表示状態
	const [isModalOpen, setIsModalOpen] = useState(false);

	// 編集中の出費データ
	const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

	useEffect(() => {
		async function loadData() {
			if (!user) return;
			const now = new Date();
			const yyyy = now.getFullYear();
			const mm = String(now.getMonth() + 1).padStart(2, "0");

			try {
				const [budgetsData, expensesData] = await Promise.all([
					getBudgets(user.id),
					getExpenses(user.id),
				]);
				setBudgets(budgetsData);
				setExpenses(expensesData);

				// 初期年月をクライアントマウント時にセット
				setCurrentMonth(`${yyyy}-${mm}`);
				setThisMonth(`${yyyy}-${mm}`);
			} catch (error) {
				console.error("Failed to load data:", error);
			} finally {
				setIsLoading(false);
			}
		}
		if (!isUserLoading) {
			if (user) {
				loadData();
			} else {
				setIsLoading(false);
			}
		}
	}, [user, isUserLoading]);

	if (isLoading) {
		return (
			<main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8 animate-pulse">
				<div className="h-10 bg-white/5 rounded-xl w-48 mb-4" />
				<div className="h-24 bg-white/5 rounded-2xl w-full" />
				<div className="h-96 bg-white/5 rounded-2xl w-full" />
			</main>
		);
	}

	// 表示対象月(YYYY-MM)に合致する出費のみを抽出
	const filteredExpenses = expenses.filter((expense) =>
		expense.date.startsWith(currentMonth),
	);

	// 来月以降の予想出費（実際の今月より未来のデータ）を抽出
	const upcomingExpenses = expenses
		.filter((expense) => {
			const expenseMonth = expense.date.slice(0, 7);
			return expenseMonth > thisMonth;
		})
		.sort((a, b) => a.date.localeCompare(b.date));

	// 当月の総支出額
	const totalSpent = filteredExpenses.reduce(
		(sum, item) => sum + item.amount,
		0,
	);

	// カテゴリごとの総支出を計算
	const categorySpentMap = filteredExpenses.reduce(
		(acc, curr) => {
			acc[curr.budgetId] = (acc[curr.budgetId] || 0) + curr.amount;
			return acc;
		},
		{} as Record<string, number>,
	);

	// 設定済み予算の合計
	const totalBudget = budgets.reduce((sum, item) => sum + item.budget, 0);

	// 出費の削除
	const handleDelete = async (id: string) => {
		if (!confirm("この出費レコードを削除しますか？")) return;
		try {
			await deleteExpense(id);
			setExpenses(expenses.filter((item) => item.id !== id));
		} catch (error) {
			console.error("Failed to delete expense:", error);
		}
	};

	// 出費の編集開始
	const handleEdit = (expense: Expense) => {
		setExpenseToEdit(expense);
		setIsModalOpen(true);
	};

	// 新規登録または編集完了時の処理
	const handleSaveSuccess = (savedExpense: Expense) => {
		const isEdit = expenses.some((item) => item.id === savedExpense.id);
		if (isEdit) {
			setExpenses(
				expenses.map((item) =>
					item.id === savedExpense.id ? savedExpense : item,
				),
			);
		} else {
			setExpenses([savedExpense, ...expenses]);
		}
	};

	// モーダルを閉じる
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setExpenseToEdit(null);
	};

	// 年月の見やすい日本語表記
	const getDisplayMonth = () => {
		const [year, month] = currentMonth.split("-");
		return `${year}年 ${Number(month)}月`;
	};

	return (
		<main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8 animate-fade-in relative z-10">
			{/* ヘッダー */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6 gap-4">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
						出費管理
					</h1>
					<p className="text-slate-400 mt-2 text-sm">
						日々の出費を記録し、設定した予算カテゴリごとの残り予算をチェックします。
					</p>
				</div>

				<div className="flex items-center gap-3 self-start sm:self-auto">
					{/* 出費追加ボタン */}
					<button
						type="button"
						onClick={() => {
							setExpenseToEdit(null);
							setIsModalOpen(true);
						}}
						className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm px-4 py-2.5 rounded-2xl shadow-lg hover:shadow-violet-600/20 active:scale-[0.98] transition-all cursor-pointer"
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2.5"
								d="M12 4v16m8-8H4"
							/>
						</svg>
						<span>出費の追加</span>
					</button>
				</div>
			</div>

			{/* 上部エリア：1つのカードに集約 */}
			<div className="relative rounded-2xl border border-white/5 bg-[#0a0f24]/50 p-6 md:p-8 backdrop-blur-md shadow-xl overflow-hidden">
				<div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />

				<div className="grid gap-8 md:grid-cols-3 items-center">
					{/* 左側 (1/3): 今月の総支出サマリー */}
					<div className="md:col-span-1 flex flex-col justify-center space-y-4 md:border-r md:border-white/5 md:pr-8">
						<div>
							<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
								今月の総支出 ({getDisplayMonth()})
							</span>
							<div className="text-4xl md:text-5xl font-black text-white tracking-tight mt-2">
								¥{totalSpent.toLocaleString()}
							</div>
						</div>
						<div className="text-xs text-slate-400 pt-3 border-t border-white/5">
							全予算の合計額: ¥{totalBudget.toLocaleString()}
						</div>
					</div>

					{/* 右側 (2/3): カテゴリ別の予算消化状況 */}
					<div className="md:col-span-2 space-y-4">
						<h3 className="text-sm font-bold text-white mb-2">
							カテゴリ別の予算消化状況
						</h3>
						{budgets.length > 0 ? (
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
													<span className="font-bold text-slate-200">
														¥{spent.toLocaleString()}
													</span>{" "}
													/ ¥{category.budget.toLocaleString()}
												</span>
											</div>
											<div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
												<div
													className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
														isOver
															? "from-rose-500 to-pink-500"
															: category.color || "from-slate-500 to-slate-400"
													}`}
													style={{ width: `${percentage}%` }}
												/>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<p className="text-xs text-slate-500">
								カテゴリが設定されていません。
							</p>
						)}
					</div>
				</div>
			</div>

			{/* 二段目: 一覧 */}
			<div className="w-full space-y-4">
				<h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
					<span>当月の出費一覧</span>
					<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
						{getDisplayMonth()}
					</span>
				</h2>

				<ExpenseList
					expenses={filteredExpenses}
					budgets={budgets}
					onDelete={handleDelete}
					onEdit={handleEdit}
					emptyIcon={
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
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h-2M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					}
					emptyTitle="この月に入力された出費はありません。"
					emptySubtitle="右上の「出費の追加」ボタンから記録してみましょう。"
				/>
			</div>

			{/* 来月以降の予想出費一覧 */}
			<div className="w-full space-y-4 pt-4">
				<h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
					<span>来月以降の予想出費一覧</span>
					<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/10">
						予定
					</span>
				</h2>

				<ExpenseList
					expenses={upcomingExpenses}
					budgets={budgets}
					onDelete={handleDelete}
					onEdit={handleEdit}
					emptyIcon={
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
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					}
					emptyTitle="来月以降に予定されている出費はありません。"
					emptySubtitle="未来の日付を指定して出費を追加すると、ここに表示されます。"
				/>
			</div>

			{/* 出費追加モーダル */}
			{isModalOpen && (
				<ExpenseFormModal
					onClose={handleCloseModal}
					budgets={budgets}
					onSuccess={handleSaveSuccess}
					expenseToEdit={expenseToEdit || undefined}
					userId={user?.id || ""}
				/>
			)}
		</main>
	);
}
