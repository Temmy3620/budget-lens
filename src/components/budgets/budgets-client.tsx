"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { CategoryList } from "@/components/budgets/category-list";
import { BudgetForm } from "@/components/budgets/budget-form";
import type { BudgetSetting } from "@/components/budgets/types";
import {
	addBudgetAction,
	updateBudgetAction,
	deleteBudgetAction,
} from "@/app/(authenticated)/budgets/actions";

interface BudgetsClientProps {
	initialSettings: BudgetSetting[];
	userId: string;
}

export default function BudgetsClient({
	initialSettings,
	userId,
}: BudgetsClientProps) {
	// 初期の設定済みカテゴリと予算のリスト (ステートで管理)
	const [settings, setSettings] = useState<BudgetSetting[]>(initialSettings);

	// 編集中のステート
	const [editingSetting, setEditingSetting] = useState<BudgetSetting | null>(
		null,
	);

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

	// 予算の保存（追加または更新）
	const handleSave = async (
		name: string,
		budget: number,
		color: string,
		memo: string,
	) => {
		if (!userId) return;
		try {
			if (editingSetting) {
				// 編集モード
				setLoadingMessage("設定を保存中...");
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
				setLoadingMessage(null);
				showToast("設定を保存しました");
			} else {
				// 新規追加
				setLoadingMessage("カテゴリを登録中...");
				const added = await addBudgetAction(userId, {
					name,
					budget,
					color,
					memo,
				});
				setSettings([...settings, added]);
				setLoadingMessage(null);
				showToast("カテゴリを登録しました");
			}
		} catch (error) {
			console.error("Failed to save budget:", error);
			setLoadingMessage(null);
			alert("予算の保存に失敗しました。");
			throw error;
		}
	};

	// 編集モードの開始
	const startEdit = (setting: BudgetSetting) => {
		setEditingSetting(setting);
	};

	// カテゴリ設定の削除
	const handleDelete = async (id: string) => {
		if (!confirm("このカテゴリを削除しますか？")) return;

		try {
			setLoadingMessage("カテゴリを削除中...");
			const result = await deleteBudgetAction(id);
			setLoadingMessage(null);
			if (result.success) {
				setSettings(settings.filter((item) => item.id !== id));
				// 編集中のカテゴリが削除された場合は編集フォームをリセット
				if (editingSetting?.id === id) {
					setEditingSetting(null);
				}
				showToast("削除完了しました");
			} else {
				alert(result.error || "カテゴリの削除に失敗しました。");
			}
		} catch (error) {
			console.error("Failed to delete budget:", error);
			setLoadingMessage(null);
			alert("カテゴリの削除中にエラーが発生しました。");
		}
	};

	// 合計予算額
	const totalBudget = settings.reduce((sum, item) => sum + item.budget, 0);

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

			{/* 処理中ローディングオーバーレイ（登録・保存・削除） */}
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
