import type { BudgetSetting } from "@/components/budgets/types";
import {
	type Expense,
	addExpense,
	updateExpense,
} from "@/lib/supabase/expenses";
import { useEffect, useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";

interface ExpenseFormModalProps {
	onClose: () => void;
	budgets: BudgetSetting[];
	onSuccess: (saved: Expense) => void;
	expenseToEdit?: Expense;
	userId: string;
}

export function ExpenseFormModal({
	onClose,
	budgets,
	onSuccess,
	expenseToEdit,
	userId,
}: ExpenseFormModalProps) {
	const [selectedBudgetId, setSelectedBudgetId] = useState(
		expenseToEdit?.budgetId || budgets[0]?.id || "",
	);
	const [amount, setAmount] = useState<number | "">(
		expenseToEdit?.amount ?? "",
	);
	const [dateInput, setDateInput] = useState(() => {
		if (expenseToEdit?.date) return expenseToEdit.date;
		const now = new Date();
		const yyyy = now.getFullYear();
		const mm = String(now.getMonth() + 1).padStart(2, "0");
		const dd = String(now.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	});
	const [memo, setMemo] = useState(expenseToEdit?.memo || "");
	const [formError, setFormError] = useState("");

	// ESCキー押下でモーダルを閉じる
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	const handleSubmit = async (e: React.FormEvent) => {
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
			let saved: Expense;
			if (expenseToEdit) {
				saved = await updateExpense(expenseToEdit.id, {
					budgetId: selectedBudgetId,
					amount: Math.floor(Number(amount)),
					date: dateInput,
					memo: memo.trim(),
				});
			} else {
				saved = await addExpense(userId, {
					budgetId: selectedBudgetId,
					amount: Math.floor(Number(amount)),
					date: dateInput,
					memo: memo.trim(),
				});
			}

			onSuccess(saved);
			onClose();
		} catch (error) {
			console.error("Failed to save expense:", error);
			setFormError("保存に失敗しました。");
		}
	};

	const isEditMode = !!expenseToEdit;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
			{/* オーバーレイ背景マスク */}
			<div
				onClick={onClose}
				className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
			/>

			{/* モーダル本体 */}
			<div className="relative w-full max-w-md bg-[#0a0f24]/95 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl z-10 animate-scale-up">
				{/* 閉じるボタン */}
				<button
					type="button"
					onClick={onClose}
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
					{isEditMode ? "出費の編集" : "出費の追加"}
				</h3>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* エラー表示 */}
					{formError && (
						<div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
							{formError}
						</div>
					)}

					{/* カテゴリ選択 */}
					<div className="space-y-1.5">
						<label
							htmlFor="modal-budgetId"
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
								id="modal-budgetId"
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
							htmlFor="modal-amount"
							className="text-xs font-semibold text-slate-400"
						>
							金額 (円)
						</label>
						<div className="relative">
							<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">
								¥
							</span>
							<input
								id="modal-amount"
								type="number"
								value={amount}
								onChange={(e) =>
									setAmount(e.target.value === "" ? "" : Number(e.target.value))
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
							htmlFor="modal-date"
							className="text-xs font-semibold text-slate-400"
						>
							日付
						</label>
						<DatePicker value={dateInput} onChange={setDateInput} />
					</div>

					{/* メモ */}
					<div className="space-y-1.5">
						<label
							htmlFor="modal-memo"
							className="text-xs font-semibold text-slate-400"
						>
							用途 / 店舗名 (メモ)
						</label>
						<input
							id="modal-memo"
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
							onClick={onClose}
							className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm py-3 px-4 rounded-xl active:scale-[0.98] transition-all cursor-pointer"
						>
							キャンセル
						</button>
						<button
							type="submit"
							disabled={budgets.length === 0}
							className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-600 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-lg hover:shadow-violet-600/20 active:scale-[0.98] transition-all cursor-pointer"
						>
							{isEditMode ? "更新する" : "登録する"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
