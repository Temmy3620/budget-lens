"use client";

import { AlertTriangle } from "lucide-react";
import { DeleteAccountButton } from "@/components/DeleteAccountButton";

export function AccountDeletionSection() {
	return (
		<div className="rounded-2xl border border-rose-500/20 bg-rose-950/5 p-6 md:p-8 backdrop-blur-md shadow-xl space-y-6">
			<div className="space-y-4">
				<h2 className="text-md font-bold text-rose-400 flex items-center gap-2">
					<AlertTriangle className="w-5 h-5 text-rose-400" />
					アカウントの削除（退会）
				</h2>
				<p className="text-sm text-slate-400 leading-relaxed">
					サービスから完全に退会し、アカウント情報を削除します。
					退会すると、これまでに登録された予算や出費データ、過去履歴データはすべて消去され、**Stripeの月額サブスクリプション（無料体験中を含む）も即時に解約処理**され、以降の請求は発生しなくなります。
				</p>

				<div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 text-xs text-rose-400/90 leading-relaxed">
					<span className="font-semibold text-rose-400 block mb-1">
						⚠️ 警告:
					</span>
					この操作は取り消せません。退会後はすぐにログインできなくなり、一切のデータが永久に削除されます。
				</div>

				<DeleteAccountButton />
			</div>
		</div>
	);
}
