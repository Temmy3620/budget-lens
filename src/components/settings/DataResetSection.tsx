"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { resetAllUserDataAction } from "@/app/(authenticated)/settings/actions";

export function DataResetSection() {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isResetting, setIsResetting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleReset = async () => {
		setIsResetting(true);
		setError(null);
		try {
			const res = await resetAllUserDataAction();
			if (!res.success) {
				setError(res.error || "データの初期化中にエラーが発生しました。");
				setIsResetting(false);
				setIsModalOpen(false);
			} else {
				router.replace("/onboarding");
			}
		} catch (err) {
			console.error("Reset data error:", err);
			setError("予期しないエラーが発生しました。");
			setIsResetting(false);
			setIsModalOpen(false);
		}
	};

	return (
		<>
			{/* 設定カード */}
			<div className="rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-6 md:p-8 backdrop-blur-md shadow-xl space-y-6">
				{/* データの初期化セクション */}
				<div className="space-y-4">
					<h2 className="text-md font-bold text-slate-200">データの初期化</h2>
					<p className="text-sm text-slate-400 leading-relaxed">
						アカウント（メールアドレス・パスワード）以外のすべての登録データ（設定した予算カテゴリ、すべての出費データ、および過去の履歴スナップショット）を一括で完全に削除し、初期状態に戻すことができます。
					</p>

					<div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 text-xs text-rose-400/90 leading-relaxed">
						<span className="font-semibold text-rose-400 block mb-1">
							⚠️ 警告:
						</span>
						この操作を実行すると、登録した家計簿データは完全に削除され、復元することはできません。
						実行後、自動的に予算の初期設定（オンボーディング）画面へとリダイレクトされます。
					</div>

					<button
						type="button"
						onClick={() => setIsModalOpen(true)}
						className="px-5 py-3 bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-rose-950/20"
					>
						<Trash2 className="w-4 h-4" />
						<span>データを初期化する</span>
					</button>

					{error && (
						<p className="text-xs text-rose-400 font-semibold mt-2">{error}</p>
					)}
				</div>
			</div>

			{/* カスタム確認モーダルダイアログ */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* 背景マスク */}
					<div
						className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
						onClick={() => !isResetting && setIsModalOpen(false)}
					/>

					{/* ダイアログ本体 */}
					<div className="relative w-full max-w-md bg-slate-950 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 z-10 animate-in fade-in zoom-in-95 duration-200">
						<div className="flex items-center gap-3 text-rose-400">
							<div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
								<AlertTriangle className="w-5 h-5" />
							</div>
							<h3 className="text-md font-bold text-slate-100">
								本当に初期化しますか？
							</h3>
						</div>

						<p className="text-xs text-slate-450 leading-relaxed">
							ユーザー情報以外のデータがすべて消えますがいいですか？
							これまでに登録された予算設定、出費履歴、過去の履歴スナップショットは永久に削除され、復元できません。
						</p>

						<div className="flex gap-3 pt-2">
							<button
								type="button"
								disabled={isResetting}
								onClick={() => setIsModalOpen(false)}
								className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-semibold text-slate-300 transition-all cursor-pointer disabled:opacity-50"
							>
								キャンセル
							</button>
							<button
								type="button"
								disabled={isResetting}
								onClick={handleReset}
								className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-red-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
							>
								{isResetting ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										<span>初期化中...</span>
									</>
								) : (
									<span>はい、初期化します</span>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
