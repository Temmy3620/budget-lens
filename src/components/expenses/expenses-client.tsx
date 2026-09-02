"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { BudgetSetting } from "@/components/budgets/types";
import {
	type Expense,
	addExpense,
	updateExpense,
	deleteExpense,
	calculateCategorySpent,
} from "@/lib/supabase/expenses";
import { ExpenseFormModal } from "./expense-form-modal";
import { ExpenseList } from "./expense-list";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CategoryBudgetProgressList } from "@/components/ui/category-budget-progress";

interface ExpensesClientProps {
	initialBudgets: BudgetSetting[];
	initialExpenses: Expense[];
}

export default function ExpensesClient({
	initialBudgets,
	initialExpenses,
}: ExpensesClientProps) {
	const { user } = useCurrentUser();
	const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
	const [budgets] = useState<BudgetSetting[]>(initialBudgets);

	// ローディング状態（追加・編集・削除時）
	const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

	// 自動で消えるトースト通知ステート
	const [toastMessage, setToastMessage] = useState<string | null>(null);

	const showToast = (message: string) => {
		setToastMessage(message);
		setTimeout(() => {
			setToastMessage((prev) => (prev === message ? null : prev));
		}, 2000);
	};

	// 表示対象の年月 (YYYY-MM 形式)
	const [currentMonth] = useState(() => {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
	});

	// 実行時の「今月」 (YYYY-MM 形式)
	const [thisMonth] = useState(() => {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
	});

	// モーダルの表示状態
	const [isModalOpen, setIsModalOpen] = useState(false);

	// 編集中の出費データ
	const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

	// 表示対象月(YYYY-MM)に合致する出費のみを抽出（作成日時の若い順＝古い順でソート）
	const filteredExpenses = expenses
		.filter((expense) => expense.date.startsWith(currentMonth))
		.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

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
	const categorySpentMap = calculateCategorySpent(filteredExpenses);

	// 設定済み予算の合計
	const totalBudget = budgets.reduce((sum, item) => sum + item.budget, 0);

	// 出費の削除
	const handleDelete = async (id: string) => {
		if (!confirm("この出費レコードを削除しますか？")) return;
		try {
			setLoadingMessage("出費を削除中...");
			await deleteExpense(id);
			setExpenses((prev) => prev.filter((item) => item.id !== id));
			setLoadingMessage(null);
			showToast("削除完了しました");
		} catch (error) {
			console.error("Failed to delete expense:", error);
			setLoadingMessage(null);
			alert("出費の削除に失敗しました。");
		}
	};

	// 出費の編集開始
	const handleEdit = (expense: Expense) => {
		setExpenseToEdit(expense);
		setIsModalOpen(true);
	};

	// 新規登録または編集の保存処理
	const handleSaveExpense = async (data: {
		budgetId: string;
		amount: number;
		date: string;
		memo: string;
	}) => {
		if (!user?.id) return;
		const isEdit = !!expenseToEdit;
		setLoadingMessage(isEdit ? "出費を更新中..." : "出費を記録中...");
		handleCloseModal();

		try {
			let saved: Expense;
			if (expenseToEdit) {
				saved = await updateExpense(expenseToEdit.id, data);
				setExpenses((prev) =>
					prev.map((item) => (item.id === saved.id ? saved : item)),
				);
				setLoadingMessage(null);
				showToast("出費を更新しました");
			} else {
				saved = await addExpense(user.id, data);
				setExpenses((prev) => [saved, ...prev]);
				setLoadingMessage(null);
				showToast("出費を記録しました");
			}
		} catch (error) {
			console.error("Failed to save expense:", error);
			setLoadingMessage(null);
			alert("出費の保存に失敗しました。");
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
						支出管理
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
						<CategoryBudgetProgressList
							budgets={budgets}
							categorySpentMap={categorySpentMap}
						/>
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

			{/* 出費追加・編集モーダル */}
			{isModalOpen && (
				<ExpenseFormModal
					onClose={handleCloseModal}
					budgets={budgets}
					onSave={handleSaveExpense}
					expenseToEdit={expenseToEdit || undefined}
				/>
			)}

			{/* 処理中ローディングオーバーレイ（記録・更新・削除） */}
			<AnimatePresence>
				{loadingMessage && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-950/90 border border-white/10 shadow-2xl"
						>
							<Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
							<p className="text-sm font-semibold text-slate-200 tracking-wide">
								{loadingMessage}
							</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* 自動で消えるトースト通知（ヘッダー直下の中央にふわっと表示・消去） */}
			<AnimatePresence>
				{toastMessage && (
					<motion.div
						initial={{ opacity: 0, y: -20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -15, scale: 0.95 }}
						transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
						className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-900/95 border border-emerald-500/30 text-white shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-xl max-w-[90vw] whitespace-nowrap"
					>
						<div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
							<CheckCircle2 className="w-4 h-4 text-emerald-400" />
						</div>
						<span className="text-sm font-semibold text-slate-100">
							{toastMessage}
						</span>
					</motion.div>
				)}
			</AnimatePresence>
		</main>
	);
}
