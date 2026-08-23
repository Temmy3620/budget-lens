import { Loader2 } from "lucide-react";

export default function Loading() {
	return (
		<div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-6 relative">
			{/* 微妙な背景グラデーション光彩 */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-64 w-64 rounded-full bg-violet-600/10 blur-[80px] pointer-events-none animate-pulse" />

			<div className="flex flex-col items-center gap-4 text-center">
				{/* プレミアムなグラデーションローディングスピナー */}
				<div className="relative flex items-center justify-center">
					{/* 外側のグラデーションリング */}
					<div className="w-12 h-12 rounded-full border-2 border-slate-800 border-t-violet-500 border-r-indigo-500 border-b-cyan-500 animate-spin" />
					{/* 内側のアイコン */}
					<div className="absolute">
						<Loader2 className="h-5 w-5 text-indigo-400 animate-spin [animation-duration:3s]" />
					</div>
				</div>

				<div className="space-y-1.5 mt-2">
					<p className="text-sm font-semibold tracking-widest bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent animate-pulse">
						LOADING
					</p>
					<p className="text-xs text-slate-500 tracking-wider">
						履歴データを読み込んでいます...
					</p>
				</div>
			</div>
		</div>
	);
}
