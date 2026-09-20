"use client";

import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteAccountButtonProps {
	isAdmin?: boolean;
}

export function DeleteAccountButton({
	isAdmin = false,
}: DeleteAccountButtonProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleDeleteAccount = async () => {
		setIsDeleting(true);
		setError(null);

		try {
			const response = await fetch("/api/user/delete-account", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "退会処理に失敗しました。");
			}

			// 退会成功。セッションクッキーが破棄されているので、LP (トップページ) へ完全遷移
			window.location.href = "/";
		} catch (err) {
			console.error("Account deletion error:", err);
			setError(
				err instanceof Error ? err.message : "予期しないエラーが発生しました。",
			);
			setIsDeleting(false);
			setIsModalOpen(false);
		}
	};

	return (
		<div className="space-y-3">
			<button
				type="button"
				onClick={() => setIsModalOpen(true)}
				className="px-5 py-3 bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-rose-950/20"
			>
				<Trash2 className="w-4 h-4" />
				<span>アカウントを削除（退会）する</span>
			</button>

			{error && (
				<p className="text-xs text-rose-400 font-semibold mt-2 bg-rose-500/5 border border-rose-500/10 p-2.5 rounded-lg">
					{error}
				</p>
			)}

			{/* 退会確認カスタムモーダル */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* 背景マスク */}
					<div
						className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
						onClick={() => !isDeleting && setIsModalOpen(false)}
					/>

					{/* モーダルダイアログ */}
					<div className="relative w-full max-w-md bg-slate-950 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 z-10 animate-in fade-in zoom-in-95 duration-200">
						<div className="flex items-center gap-3 text-rose-400">
							<div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
								<AlertTriangle className="w-5 h-5" />
							</div>
							<h3 className="text-md font-bold text-slate-100">
								本当に退会しますか？
							</h3>
						</div>

						<p className="text-xs text-slate-450 leading-relaxed">
							{isAdmin ? (
								<>
									退会するとアカウントが削除され、登録していたやりくりデータ（予算、出費）や履歴は復元できません。管理者アカウントのため、Stripeの決済解約等の手続きは発生しません。
								</>
							) : (
								<>
									退会するとアカウントが完全に削除され、登録していたやりくりデータ（予算、出費）や履歴は復元できません。
									また、**Stripeの月額サブスクリプションも即時に解約**され、今後の課金は一切発生しなくなります。
								</>
							)}
						</p>

						<div className="flex gap-3 pt-2">
							<button
								type="button"
								disabled={isDeleting}
								onClick={() => setIsModalOpen(false)}
								className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-semibold text-slate-300 transition-all cursor-pointer disabled:opacity-50"
							>
								キャンセル
							</button>
							<button
								type="button"
								disabled={isDeleting}
								onClick={handleDeleteAccount}
								className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-red-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
							>
								{isDeleting ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										<span>退会処理中...</span>
									</>
								) : (
									<span>はい、退会します</span>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
