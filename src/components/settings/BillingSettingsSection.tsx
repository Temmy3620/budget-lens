"use client";

import { useState } from "react";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";

export function BillingSettingsSection() {
	const [isPortalLoading, setIsPortalLoading] = useState(false);
	const [portalError, setPortalError] = useState<string | null>(null);

	const handleOpenPortal = async () => {
		setIsPortalLoading(true);
		setPortalError(null);
		try {
			const res = await fetch("/api/stripe/portal", {
				method: "POST",
			});
			const data = await res.json();
			if (!res.ok || !data.url) {
				setPortalError(
					data.error || "カスタマーポータルの起動に失敗しました。",
				);
				setIsPortalLoading(false);
				return;
			}
			// Stripe Customer Portal へリダイレクト
			window.location.href = data.url;
		} catch (err) {
			console.error("Portal open error:", err);
			setPortalError("通信エラーが発生しました。もう一度お試しください。");
			setIsPortalLoading(false);
		}
	};

	return (
		<div className="rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-6 md:p-8 backdrop-blur-md shadow-xl space-y-4">
			<div className="flex items-center gap-3">
				<div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
					<CreditCard className="w-4 h-4 text-indigo-400" />
				</div>
				<h2 className="text-md font-bold text-slate-200">
					お支払い・カード情報の管理
				</h2>
			</div>
			<p className="text-sm text-slate-400 leading-relaxed">
				登録中のクレジットカード情報の確認・変更や、過去の請求履歴・領収書の確認は、Stripeの安全なカスタマーポータルから行うことができます。
			</p>

			<div className="pt-2">
				<button
					type="button"
					onClick={handleOpenPortal}
					disabled={isPortalLoading}
					className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isPortalLoading ? (
						<>
							<Loader2 className="w-4 h-4 animate-spin" />
							<span>ポータルを開いています...</span>
						</>
					) : (
						<>
							<CreditCard className="w-4 h-4" />
							<span>カード情報・請求情報を管理する</span>
							<ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
						</>
					)}
				</button>

				{portalError && (
					<p className="text-xs text-rose-400 font-semibold mt-3">
						{portalError}
					</p>
				)}
			</div>
		</div>
	);
}
