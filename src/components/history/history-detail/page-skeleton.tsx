export function HistoryDetailSkeleton() {
	return (
		<div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
			{/* ヘッダー・戻るリンクスケルトン */}
			<div className="space-y-4">
				<div className="h-4 w-32 bg-slate-800 rounded" />

				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6 gap-4">
					<div>
						<div className="h-9 w-64 bg-slate-800 rounded-lg" />
						<div className="h-4 w-96 bg-slate-800/60 rounded mt-2" />
					</div>
					{/* 簡易ステータスカードスケルトン */}
					<div className="h-10 w-44 bg-slate-800 rounded-2xl" />
				</div>
			</div>

			{/* 分析セクションスケルトン */}
			<div className="grid gap-8 md:grid-cols-3">
				{/* 左側 (2/3): カテゴリ別の予算消化状況 */}
				<div className="md:col-span-2 space-y-6 rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-6 md:p-8">
					<div className="space-y-2">
						<div className="h-6 w-52 bg-slate-800 rounded" />
						<div className="h-3 w-64 bg-slate-800/40 rounded" />
					</div>

					<div className="space-y-4 pt-4">
						{/* カテゴリ1 */}
						<div className="space-y-2">
							<div className="flex justify-between">
								<div className="h-4 w-24 bg-slate-800 rounded" />
								<div className="h-4 w-32 bg-slate-800 rounded" />
							</div>
							<div className="h-2 bg-slate-800 rounded-full w-full" />
						</div>
						{/* カテゴリ2 */}
						<div className="space-y-2">
							<div className="flex justify-between">
								<div className="h-4 w-20 bg-slate-800 rounded" />
								<div className="h-4 w-28 bg-slate-800 rounded" />
							</div>
							<div className="h-2 bg-slate-800 rounded-full w-full" />
						</div>
						{/* カテゴリ3 */}
						<div className="space-y-2">
							<div className="flex justify-between">
								<div className="h-4 w-28 bg-slate-800 rounded" />
								<div className="h-4 w-36 bg-slate-800 rounded" />
							</div>
							<div className="h-2 bg-slate-800 rounded-full w-full" />
						</div>
					</div>
				</div>

				{/* 右側 (1/3): 円グラフ */}
				<div className="h-[320px] bg-[#0a0f24]/40 rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center space-y-6">
					<div className="w-40 h-40 rounded-full border-[12px] border-slate-800" />
					<div className="flex gap-4 w-full justify-center">
						<div className="h-4 w-12 bg-slate-800 rounded" />
						<div className="h-4 w-12 bg-slate-800 rounded" />
						<div className="h-4 w-12 bg-slate-800 rounded" />
					</div>
				</div>
			</div>

			{/* 下部: 当月の出費一覧 */}
			<div className="space-y-4">
				<div className="h-6 w-32 bg-slate-800 rounded" />
				<div className="space-y-3">
					<div className="h-16 bg-[#0a0f24]/30 border border-white/5 rounded-xl" />
					<div className="h-16 bg-[#0a0f24]/30 border border-white/5 rounded-xl" />
					<div className="h-16 bg-[#0a0f24]/30 border border-white/5 rounded-xl" />
				</div>
			</div>

			{/* ネクストアクションボタン */}
			<div className="pt-8 flex justify-center">
				<div className="h-14 w-80 bg-slate-800 rounded-2xl" />
			</div>
		</div>
	);
}
