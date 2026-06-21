"use client";

import type { BudgetSetting } from "./types";

interface CategoryListProps {
	settings: BudgetSetting[];
	onEdit: (setting: BudgetSetting) => void;
	onDelete: (id: string) => void;
}

export function CategoryList({
	settings,
	onEdit,
	onDelete,
}: CategoryListProps) {
	if (settings.length === 0) {
		return (
			<div className="text-center py-12 border border-dashed border-white/10 rounded-2xl text-slate-500">
				設定されている予算カテゴリはありません。右のフォームから追加してください。
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{settings.map((item) => (
				<div
					key={item.id}
					className="group flex items-center justify-between p-4 rounded-xl border border-white/5 bg-[#0a0f24]/30 backdrop-blur-sm hover:border-white/10 transition-all duration-200"
				>
					<div className="flex items-center gap-4 min-w-0 flex-1">
						<span
							className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color} shrink-0`}
						/>
						<div className="min-w-0 flex-1">
							<span className="font-semibold text-slate-200 block truncate">
								{item.name}
							</span>
							{item.memo && (
								<p
									className="text-xs text-slate-400 mt-1 font-normal truncate"
									title={item.memo}
								>
									{item.memo}
								</p>
							)}
						</div>
					</div>

					<div className="flex items-center gap-6 shrink-0">
						<div className="text-right shrink-0">
							<span className="text-lg font-bold text-white block">
								¥{item.budget.toLocaleString()}
							</span>
							<span className="text-[10px] font-medium text-slate-500 block mt-0.5">
								月間予算上限
							</span>
						</div>
						<div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
							<button
								type="button"
								onClick={() => onEdit(item)}
								className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
								aria-label={`${item.name}の予算を編集`}
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
										strokeWidth="2"
										d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
									/>
								</svg>
							</button>
							<button
								type="button"
								onClick={() => onDelete(item.id)}
								className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
								aria-label={`${item.name}の予算を削除`}
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
										strokeWidth="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
