"use client";

import { useState } from "react";
import { COLOR_VARIANTS } from "./types";
import type { BudgetSetting } from "./types";

interface BudgetFormProps {
	editingSetting: BudgetSetting | null;
	onSave: (name: string, budget: number, color: string, memo: string) => void;
	onCancel: () => void;
}

export function BudgetForm({
	editingSetting,
	onSave,
	onCancel,
}: BudgetFormProps) {
	const [categoryName, setCategoryName] = useState(editingSetting?.name || "");
	const [budgetAmount, setBudgetAmount] = useState(
		editingSetting?.budget.toString() || "",
	);
	const [color, setColor] = useState(
		editingSetting?.color || COLOR_VARIANTS[0].value,
	);
	const [memo, setMemo] = useState(editingSetting?.memo || "");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const amount = Number.parseInt(budgetAmount, 10);
		if (Number.isNaN(amount) || amount <= 0 || !categoryName.trim()) return;

		onSave(categoryName.trim(), amount, color, memo.trim());
		// 新規追加の場合はフォームをリセットする
		if (!editingSetting) {
			setCategoryName("");
			setBudgetAmount("");
			setColor(COLOR_VARIANTS[0].value);
			setMemo("");
		}
	};

	return (
		<div className="rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-6 backdrop-blur-md shadow-xl h-fit">
			<h2 className="text-lg font-bold text-white mb-4">
				{editingSetting ? "予算の編集" : "カテゴリ予算の設定"}
			</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				{/* カテゴリ名入力 */}
				<div className="space-y-2">
					<span className="text-xs font-semibold text-slate-400">
						カテゴリ名
					</span>
					<input
						type="text"
						required
						placeholder="例: 食費、家賃、趣味、旅費など"
						value={categoryName}
						onChange={(e) => setCategoryName(e.target.value)}
						className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder:text-slate-600"
					/>
				</div>

				{/* 予算額入力 */}
				<div className="space-y-2">
					<span className="text-xs font-semibold text-slate-400">
						月間予算額 (円)
					</span>
					<input
						type="number"
						required
						placeholder="例: 50000"
						value={budgetAmount}
						onChange={(e) => setBudgetAmount(e.target.value)}
						className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder:text-slate-600"
					/>
				</div>

				{/* テーマカラー選択 */}
				<div className="space-y-2">
					<span className="text-xs font-semibold text-slate-400">
						テーマカラー
					</span>
					<div className="flex gap-3 items-center">
						<span
							className={`w-6 h-6 rounded-full bg-gradient-to-r ${color} shrink-0`}
						/>
						<select
							value={color}
							onChange={(e) => setColor(e.target.value)}
							className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
						>
							{COLOR_VARIANTS.map((variant) => (
								<option key={variant.value} value={variant.value}>
									{variant.label}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* メモ入力 */}
				<div className="space-y-2">
					<span className="text-xs font-semibold text-slate-400">
						メモ（含まれる支出の例など）
					</span>
					<textarea
						placeholder="例: スーパー、外食、カフェ代など"
						value={memo}
						onChange={(e) => setMemo(e.target.value)}
						className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder:text-slate-600 h-20 resize-none"
					/>
				</div>

				{/* アクションボタン */}
				<div className="pt-2 flex gap-2">
					{editingSetting && (
						<button
							type="button"
							onClick={onCancel}
							className="flex-1 rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
						>
							キャンセル
						</button>
					)}
					<button
						type="submit"
						className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300 cursor-pointer"
					>
						{editingSetting ? "設定を保存" : "予算を設定する"}
					</button>
				</div>
			</form>
		</div>
	);
}
