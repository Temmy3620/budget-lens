"use client";

import { useEffect, useState } from "react";
import { CategoryList } from "@/components/budgets/category-list";
import { BudgetForm } from "@/components/budgets/budget-form";
import { BudgetsSkeleton } from "@/components/budgets/page-skeleton";
import type { BudgetSetting } from "@/components/budgets/types";
import { getBudgets } from "@/lib/budgets";

export default function BudgetsClient() {
	// 初期の設定済みカテゴリと予算のリスト (ステートで管理)
	const [settings, setSettings] = useState<BudgetSetting[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// 編集中のステート
	const [editingSetting, setEditingSetting] = useState<BudgetSetting | null>(
		null,
	);

	useEffect(() => {
		async function loadBudgets() {
			try {
				const data = await getBudgets();
				setSettings(data);
			} catch (error) {
				console.error("Failed to load budgets:", error);
			} finally {
				setIsLoading(false);
			}
		}
		loadBudgets();
	}, []);

	// 予算の保存（追加または更新）
	const handleSave = (name: string, budget: number, color: string) => {
		if (editingSetting) {
			// 編集モード
			setSettings(
				settings.map((item) =>
					item.id === editingSetting.id
						? { ...item, name, budget, color }
						: item,
				),
			);
			setEditingSetting(null);
		} else {
			// 新規追加
			const newId = Date.now().toString();

			const newSetting: BudgetSetting = {
				id: newId,
				name,
				budget,
				color,
			};
			setSettings([...settings, newSetting]);
		}
	};

	// 編集モードの開始
	const startEdit = (setting: BudgetSetting) => {
		setEditingSetting(setting);
	};

	// カテゴリ設定の削除
	const handleDelete = (id: string) => {
		setSettings(settings.filter((item) => item.id !== id));
		// 編集中のカテゴリが削除された場合は編集フォームをリセット
		if (editingSetting?.id === id) {
			setEditingSetting(null);
		}
	};

	// 合計予算額
	const totalBudget = settings.reduce((sum, item) => sum + item.budget, 0);

	if (isLoading) {
		return <BudgetsSkeleton />;
	}

	return (
		<main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8 animate-fade-in">
			{/* ヘッダー */}
			<div className="border-b border-white/5 pb-6">
				<h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
					予算設定
				</h1>
				<p className="text-slate-400 mt-2 text-sm">
					管理したいカテゴリを自由に入力して追加し、それぞれの月間予算を設定します。
				</p>
			</div>

			{/* 上部サマリー */}
			<div className="rounded-2xl border border-white/5 bg-[#0a0f24]/50 p-6 backdrop-blur-md shadow-xl flex items-center justify-between">
				<div>
					<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
						設定済み予算の合計
					</span>
					<div className="text-3xl font-black text-white mt-2">
						¥{totalBudget.toLocaleString()}
					</div>
				</div>
				<div className="text-right">
					<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
						設定カテゴリ数
					</span>
					<div className="text-xl font-bold text-slate-300 mt-2">
						{settings.length} カテゴリ
					</div>
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-3">
				{/* 左側: カテゴリと予算一覧 */}
				<div className="lg:col-span-2 space-y-4">
					<h2 className="text-lg font-bold text-white mb-2">
						設定済みカテゴリ一覧
					</h2>

					<CategoryList
						settings={settings}
						onEdit={startEdit}
						onDelete={handleDelete}
					/>
				</div>

				{/* 右側: 追加・編集フォーム */}
				<BudgetForm
					key={editingSetting?.id || "new"}
					editingSetting={editingSetting}
					onSave={handleSave}
					onCancel={() => setEditingSetting(null)}
				/>
			</div>
		</main>
	);
}
