"use client";

import { DeleteButton } from "@/components/ui/delete-button";
import { EditButton } from "@/components/ui/edit-button";
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
							<EditButton
								onClick={() => onEdit(item)}
								className="p-2 text-slate-400 hover:text-white hover:bg-white/5"
								ariaLabel={`${item.name}の予算を編集`}
								iconClassName="w-4 h-4"
							/>
							<DeleteButton
								onClick={() => onDelete(item.id)}
								className="p-2 text-rose-500 hover:bg-rose-500/10"
								ariaLabel={`${item.name}の予算を削除`}
								iconClassName="w-4 h-4"
							/>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
