export function HistorySkeleton() {
	return (
		<main className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
			{/* ヘッダーセクションスケルトン */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6 gap-4">
				<div>
					<div className="h-9 w-40 bg-slate-800 rounded-lg" />
					<div className="h-4 w-96 bg-slate-800/60 rounded mt-2" />
				</div>
				<div className="h-10 w-44 bg-slate-800 rounded-xl self-center sm:self-auto" />
			</div>

			{/* 月別サマリーカードリストスケルトン */}
			<div className="space-y-6">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="rounded-2xl border border-white/5 bg-[#0a0f24]/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
					>
						{/* 左側: 月 & ステータス */}
						<div className="flex items-center gap-4">
							<div className="w-14 h-14 rounded-2xl bg-slate-800 shrink-0" />
							<div className="space-y-2">
								<div className="h-6 w-20 bg-slate-800 rounded-full" />
								<div className="h-3.5 w-12 bg-slate-800/40 rounded" />
							</div>
						</div>

						{/* 中央: 支出額 vs 予算 & 残額 */}
						<div className="grid grid-cols-2 gap-4 md:gap-8 flex-1 max-w-lg">
							<div className="space-y-2">
								<div className="h-4 w-16 bg-slate-800/60 rounded" />
								<div className="h-5 w-32 bg-slate-800 rounded" />
							</div>
							<div className="space-y-2">
								<div className="h-4 w-12 bg-slate-800/60 rounded" />
								<div className="h-5 w-24 bg-slate-800 rounded" />
							</div>
						</div>

						{/* 右側: 進捗バー & 矢印リンク */}
						<div className="flex items-center gap-6 min-w-full md:min-w-0 md:w-56 justify-between md:justify-end">
							<div className="flex-1 md:flex-initial md:w-40 space-y-2">
								<div className="flex justify-between">
									<div className="h-3 w-10 bg-slate-800/40 rounded" />
									<div className="h-3 w-8 bg-slate-800/40 rounded" />
								</div>
								<div className="h-2 bg-slate-800 rounded-full w-full" />
							</div>
							<div className="w-9 h-9 bg-slate-800/30 rounded-xl shrink-0" />
						</div>
					</div>
				))}
			</div>
		</main>
	);
}
