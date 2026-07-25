export function HistoryCardSkeleton() {
	return (
		<div className="grid gap-6">
			<div className="relative group block rounded-2xl border border-white/5 bg-[#0a0f24]/30 p-6 overflow-hidden animate-pulse">
				{/* カードサイズ自動計算 兼 スケルトン表示用のダミー要素 */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 opacity-30 pointer-events-none select-none">
					{/* 左側: 月 & ステータス */}
					<div className="flex items-center gap-4">
						<div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 font-black text-xl text-transparent shadow-inner">
							00月
						</div>
						<div>
							<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 border border-white/5 text-transparent">
								<span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
								予算内
							</span>
							<p className="text-transparent text-[10px] mt-1.5 uppercase font-semibold tracking-wider">
								Status
							</p>
						</div>
					</div>

					{/* 中央: 支出額 vs 予算 & 残額 */}
					<div className="grid grid-cols-2 gap-4 md:gap-8 flex-1 max-w-lg">
						<div>
							<span className="text-xs text-transparent font-semibold block mb-1">
								支出 / 予算
							</span>
							<div className="text-base font-bold text-transparent">
								¥00,000 / ¥00,000
							</div>
						</div>

						<div>
							<span className="text-xs text-transparent font-semibold block mb-1">
								残額
							</span>
							<div className="text-lg font-black text-transparent">
								+¥00,000
							</div>
						</div>
					</div>

					{/* 右側: 進捗バー & 矢印リンク */}
					<div className="flex items-center gap-6 min-w-full md:min-w-0 md:w-56 justify-between md:justify-end">
						<div className="flex-1 md:flex-initial md:w-40 space-y-2">
							<div className="flex items-center justify-between text-[10px] font-bold text-transparent">
								<span>消化率</span>
								<span>00%</span>
							</div>
							<div className="w-full h-2 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
								<div className="h-full rounded-full bg-slate-800 w-1/2" />
							</div>
						</div>

						<div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 text-transparent shrink-0">
							<div className="w-5 h-5" />
						</div>
					</div>
				</div>

				{/* 中央のローディングメッセージ */}
				<div className="absolute inset-0 flex items-center justify-center">
					<p className="text-sm font-semibold text-slate-200">
						データを読み込み中...
					</p>
				</div>
			</div>
		</div>
	);
}
