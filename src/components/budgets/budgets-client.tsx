"use client";

import { useEffect, useState } from "react";
import { CategoryList } from "@/components/budgets/category-list";
import { BudgetForm } from "@/components/budgets/budget-form";
import { BudgetsSkeleton } from "@/components/budgets/page-skeleton";
import type { BudgetSetting } from "@/components/budgets/types";
import { getBudgets } from "@/lib/supabase/budgets";
import {
	addBudgetAction,
	updateBudgetAction,
	deleteBudgetAction,
} from "@/app/(authenticated)/budgets/actions";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function BudgetsClient() {
	const { user, isLoading: isUserLoading } = useCurrentUser();
	// 初期の設定済みカテゴリと予算のリスト (ステートで管理)
	const [settings, setSettings] = useState<BudgetSetting[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// 編集中のステート
	const [editingSetting, setEditingSetting] = useState<BudgetSetting | null>(
		null,
	);

	useEffect(() => {
		async function loadBudgets() {
			if (!user) return;
			try {
				const data = await getBudgets(user.id);
				setSettings(data);
			} catch (error) {
				console.error("Failed to load budgets:", error);
			} finally {
				setIsLoading(false);
			}
		}
		if (!isUserLoading) {
			if (user) {
				loadBudgets();
			} else {
				setTimeout(() => setIsLoading(false), 0);
			}
		}
	}, [user, isUserLoading]);

	// 予算の保存（追加または更新）
	const handleSave = async (
		name: string,
		budget: number,
		color: string,
		memo: string,
	) => {
		if (!user) return;
		try {
			if (editingSetting) {
				// 編集モード
				const updated = await updateBudgetAction(editingSetting.id, {
					name,
					budget,
					color,
					memo,
				});
				setSettings(
					settings.map((item) =>
						item.id === editingSetting.id ? updated : item,
					),
				);
				setEditingSetting(null);
			} else {
				// 新規追加
				const added = await addBudgetAction(user.id, {
					name,
					budget,
					color,
					memo,
				});
				setSettings([...settings, added]);
			}
		} catch (error) {
			console.error("Failed to save budget:", error);
			alert("予算の保存に失敗しました。");
		}
	};

	// 編集モードの開始
	const startEdit = (setting: BudgetSetting) => {
		setEditingSetting(setting);
	};

	// カテゴリ設定の削除
	const handleDelete = async (id: string) => {
		if (!confirm("このカテゴリを削除しますか？")) return;

		const result = await deleteBudgetAction(id);
		if (result.success) {
			setSettings(settings.filter((item) => item.id !== id));
			// 編集中のカテゴリが削除された場合は編集フォームをリセット
			if (editingSetting?.id === id) {
				setEditingSetting(null);
			}
		} else {
			alert(result.error || "カテゴリの削除に失敗しました。");
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
