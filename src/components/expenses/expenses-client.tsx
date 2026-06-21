"use client";

import { useEffect, useState } from "react";
import type { BudgetSetting } from "@/components/budgets/types";
import { getBudgets } from "@/lib/budgets";
import {
	type Expense,
	addExpense,
	deleteExpense,
	getExpenses,
} from "@/lib/expenses";

export default function ExpensesClient() {
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [budgets, setBudgets] = useState<BudgetSetting[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// 表示対象の年月 (YYYY-MM 形式)
	const [currentMonth, setCurrentMonth] = useState("");

	// 実行時の「今月」 (YYYY-MM 形式)
	const [thisMonth, setThisMonth] = useState("");

	// モーダルの表示状態
	const [isModalOpen, setIsModalOpen] = useState(false);

	// フォーム入力用ステート
	const [selectedBudgetId, setSelectedBudgetId] = useState("");
	const [amount, setAmount] = useState<number | "">("");
	const [dateInput, setDateInput] = useState("");
	const [minDate, setMinDate] = useState("");
	const [maxDate, setMaxDate] = useState("");
	const [memo, setMemo] = useState("");
	const [formError, setFormError] = useState("");

	useEffect(() => {
		async function loadData() {
			const now = new Date();
			const yyyy = now.getFullYear();
			const mm = String(now.getMonth() + 1).padStart(2, "0");
			const dd = String(now.getDate()).padStart(2, "0");

			try {
				const [budgetsData, expensesData] = await Promise.all([
					getBudgets(),
					getExpenses(),
				]);
				setBudgets(budgetsData);
				setExpenses(expensesData);

				// 最初のカテゴリをデフォルト選択肢にする
				if (budgetsData.length > 0) {
					setSelectedBudgetId(budgetsData[0].id);
				}

				// 初期年月とフォーム日付をクライアントマウント時にセット
				setCurrentMonth(`${yyyy}-${mm}`);
				setThisMonth(`${yyyy}-${mm}`);
				setDateInput(`${yyyy}-${mm}-${dd}`);

				// 日付入力の制限をなくす（過去・未来を自由に選べるように空に設定）
				setMinDate("");
				setMaxDate("");
			} catch (error) {
				console.error("Failed to load data:", error);
			} finally {
				setIsLoading(false);
			}
		}
		loadData();
	}, []);

	// ESCキー押下でモーダルを閉じる
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setIsModalOpen(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

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

	// 新規出費の登録
	const handleAdd = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError("");

		if (!selectedBudgetId) {
			setFormError("カテゴリを選択してください。");
			return;
		}
		if (amount === "" || amount <= 0) {
			setFormError("金額は1円以上の整数を入力してください。");
			return;
		}
		if (!dateInput) {
			setFormError("日付を入力してください。");
			return;
		}

		try {
			const added = await addExpense({
				budgetId: selectedBudgetId,
				amount: Math.floor(Number(amount)),
				date: dateInput,
				memo: memo.trim(),
			});

			setExpenses([added, ...expenses]);

			// フォームの一部リセットとモーダル閉じる
			setAmount("");
			setMemo("");
			setIsModalOpen(false);
		} catch (error) {
			console.error("Failed to add expense:", error);
			setFormError("出費の追加に失敗しました。");
		}
	};

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
						onClick={() => setIsModalOpen(true)}
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

				{filteredExpenses.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-white/5 bg-white/[0.01] p-16 text-center text-slate-500">
						<svg
							className="w-12 h-12 mx-auto text-slate-600 mb-4"
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
						<p className="text-sm font-semibold">
							この月に入力された出費はありません。
						</p>
						<p className="text-xs text-slate-600 mt-2">
							右上の「出費の追加」ボタンから記録してみましょう。
						</p>
					</div>
				) : (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{filteredExpenses.map((expense) => {
							const category = budgets.find((b) => b.id === expense.budgetId);
							const fallbackColor = "from-slate-500 to-slate-400";
							const colorClass = category?.color || fallbackColor;

							return (
								<div
									key={expense.id}
									className="group relative rounded-xl border border-white/5 bg-[#0a0f24]/30 hover:bg-[#0a0f24]/50 transition-all duration-300 p-5 shadow-lg overflow-hidden flex flex-col justify-between"
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
										<button
											onClick={() => handleDelete(expense.id)}
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
							);
						})}
					</div>
				)}
			</div>

			{/* 来月以降の予想出費一覧 */}
			<div className="w-full space-y-4 pt-4">
				<h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
					<span>来月以降の予想出費一覧</span>
					<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/10">
						予定
					</span>
				</h2>

				{upcomingExpenses.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-white/5 bg-white/[0.01] p-12 text-center text-slate-500">
						<svg
							className="w-12 h-12 mx-auto text-slate-600 mb-4"
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
						<p className="text-sm font-semibold">
							来月以降に予定されている出費はありません。
						</p>
						<p className="text-xs text-slate-600 mt-2">
							未来の日付を指定して出費を追加すると、ここに表示されます。
						</p>
					</div>
				) : (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{upcomingExpenses.map((expense) => {
							const category = budgets.find((b) => b.id === expense.budgetId);
							const fallbackColor = "from-slate-500 to-slate-400";
							const colorClass = category?.color || fallbackColor;

							return (
								<div
									key={expense.id}
									className="group relative rounded-xl border border-white/5 bg-[#0a0f24]/30 hover:bg-[#0a0f24]/50 transition-all duration-300 p-5 shadow-lg overflow-hidden flex flex-col justify-between"
								>
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
										<button
											onClick={() => handleDelete(expense.id)}
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
							);
						})}
					</div>
				)}
			</div>

			{/* 出費追加モーダル */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
					{/* オーバーレイ背景マスク */}
					<div
						onClick={() => setIsModalOpen(false)}
						className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
					/>

					{/* モーダル本体 */}
					<div className="relative w-full max-w-md bg-[#0a0f24]/95 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl z-10 animate-scale-up">
						{/* 閉じるボタン */}
						<button
							onClick={() => setIsModalOpen(false)}
							className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
							aria-label="閉じる"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>

						<h3 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
							出費の追加
						</h3>

						<form onSubmit={handleAdd} className="space-y-4">
							{/* エラー表示 */}
							{formError && (
								<div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
									{formError}
								</div>
							)}

							{/* カテゴリ選択 */}
							<div className="space-y-1.5">
								<label
									htmlFor="budgetId"
									className="text-xs font-semibold text-slate-400"
								>
									予算カテゴリ
								</label>
								{budgets.length === 0 ? (
									<div className="text-xs text-slate-500 bg-white/5 rounded-xl p-3 border border-white/5">
										カテゴリが設定されていません。先に「予算管理」画面からカテゴリを登録してください。
									</div>
								) : (
									<select
										id="budgetId"
										value={selectedBudgetId}
										onChange={(e) => setSelectedBudgetId(e.target.value)}
										className="w-full bg-[#030616]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors shadow-inner"
									>
										{budgets.map((b) => (
											<option key={b.id} value={b.id}>
												{b.name}
											</option>
										))}
									</select>
								)}
							</div>

							{/* 金額入力 */}
							<div className="space-y-1.5">
								<label
									htmlFor="amount"
									className="text-xs font-semibold text-slate-400"
								>
									金額 (円)
								</label>
								<div className="relative">
									<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">
										¥
									</span>
									<input
										id="amount"
										type="number"
										value={amount}
										onChange={(e) =>
											setAmount(
												e.target.value === "" ? "" : Number(e.target.value),
											)
										}
										placeholder="1000"
										className="w-full bg-[#030616]/80 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors shadow-inner"
										min="1"
									/>
								</div>
							</div>

							{/* 日付入力 */}
							<div className="space-y-1.5">
								<label
									htmlFor="date"
									className="text-xs font-semibold text-slate-400"
								>
									日付
								</label>
								<input
									id="date"
									type="date"
									value={dateInput}
									min={minDate}
									max={maxDate}
									onChange={(e) => setDateInput(e.target.value)}
									className="w-full bg-[#030616]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors shadow-inner"
								/>
							</div>

							{/* メモ */}
							<div className="space-y-1.5">
								<label
									htmlFor="memo"
									className="text-xs font-semibold text-slate-400"
								>
									用途 / 店舗名 (メモ)
								</label>
								<input
									id="memo"
									type="text"
									value={memo}
									onChange={(e) => setMemo(e.target.value)}
									placeholder="スーパーライフ、カフェなど"
									className="w-full bg-[#030616]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-violet-500 transition-colors shadow-inner"
								/>
							</div>

							<div className="flex gap-3 mt-6 pt-2">
								<button
									type="button"
									onClick={() => setIsModalOpen(false)}
									className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm py-3 px-4 rounded-xl active:scale-[0.98] transition-all cursor-pointer"
								>
									キャンセル
								</button>
								<button
									type="submit"
									disabled={budgets.length === 0}
									className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-600 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-lg hover:shadow-violet-600/20 active:scale-[0.98] transition-all cursor-pointer"
								>
									登録する
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</main>
	);
}
