export function ExpensesSkeleton() {
	return (
		<main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8 animate-pulse">
			{/* ヘッダースケルトン */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6 gap-4">
				<div>
					<div className="h-9 w-40 bg-slate-800 rounded-lg" />
					<div className="h-4 w-96 bg-slate-800/60 rounded mt-2" />
				</div>
				<div className="h-10 w-28 bg-slate-800 rounded-2xl self-start sm:self-auto" />
			</div>

			{/* 上部サマリーカードスケルトン */}
			<div className="relative rounded-2xl border border-white/5 bg-[#0a0f24]/50 p-6 md:p-8 shadow-xl">
				<div className="grid gap-8 md:grid-cols-3 items-center">
					{/* 左側 (1/3): 総支出 */}
					<div className="md:col-span-1 flex flex-col justify-center space-y-4 md:border-r md:border-white/5 md:pr-8">
						<div>
							<div className="h-4 w-36 bg-slate-800 rounded" />
							<div className="h-12 w-48 bg-slate-800 rounded-lg mt-3" />
						</div>
						<div className="pt-3 border-t border-white/5">
							<div className="h-4 w-32 bg-slate-800/60 rounded" />
						</div>
					</div>

					{/* 右側 (2/3): カテゴリ別プログレスバー */}
					<div className="md:col-span-2 space-y-4">
						<div className="h-5 w-44 bg-slate-800 rounded" />
						<div className="space-y-4 pt-2">
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
				</div>
			</div>

			{/* 二段目: 当月の出費一覧 */}
			<div className="w-full space-y-4">
				<div className="flex items-center gap-2 mb-2">
					<div className="h-7 w-40 bg-slate-800 rounded" />
					<div className="h-5 w-24 bg-slate-800/60 rounded-full" />
				</div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{/* カード1 */}
					<div className="rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-5 space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 bg-slate-800 rounded-full" />
								<div className="h-4 w-16 bg-slate-800 rounded" />
							</div>
							<div className="flex gap-2">
								<div className="h-7 w-7 bg-slate-800/40 rounded-lg" />
								<div className="h-7 w-7 bg-slate-800/40 rounded-lg" />
							</div>
						</div>
						<div className="h-8 w-28 bg-slate-800 rounded" />
						<div className="space-y-2">
							<div className="h-4 w-20 bg-slate-800/60 rounded" />
							<div className="h-4 w-48 bg-slate-800/40 rounded" />
						</div>
					</div>
					{/* カード2 */}
					<div className="rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-5 space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 bg-slate-800 rounded-full" />
								<div className="h-4 w-12 bg-slate-800 rounded" />
							</div>
							<div className="flex gap-2">
								<div className="h-7 w-7 bg-slate-800/40 rounded-lg" />
								<div className="h-7 w-7 bg-slate-800/40 rounded-lg" />
							</div>
						</div>
						<div className="h-8 w-24 bg-slate-800 rounded" />
						<div className="space-y-2">
							<div className="h-4 w-20 bg-slate-800/60 rounded" />
							<div className="h-4 w-36 bg-slate-800/40 rounded" />
						</div>
					</div>
					{/* カード3 */}
					<div className="rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-5 space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 bg-slate-800 rounded-full" />
								<div className="h-4 w-20 bg-slate-800 rounded" />
							</div>
							<div className="flex gap-2">
								<div className="h-7 w-7 bg-slate-800/40 rounded-lg" />
								<div className="h-7 w-7 bg-slate-800/40 rounded-lg" />
							</div>
						</div>
						<div className="h-8 w-32 bg-slate-800 rounded" />
						<div className="space-y-2">
							<div className="h-4 w-20 bg-slate-800/60 rounded" />
							<div className="h-4 w-40 bg-slate-800/40 rounded" />
						</div>
					</div>
				</div>
			</div>

			{/* 三段目: 来月以降の予想出費一覧 */}
			<div className="w-full space-y-4 pt-4">
				<div className="flex items-center gap-2 mb-2">
					<div className="h-7 w-52 bg-slate-800 rounded" />
					<div className="h-5 w-16 bg-slate-800/60 rounded-full" />
				</div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{/* カード1 */}
					<div className="rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-5 space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 bg-slate-800 rounded-full" />
								<div className="h-4 w-16 bg-slate-800 rounded" />
							</div>
							<div className="flex gap-2">
								<div className="h-7 w-7 bg-slate-800/40 rounded-lg" />
								<div className="h-7 w-7 bg-slate-800/40 rounded-lg" />
							</div>
						</div>
						<div className="h-8 w-24 bg-slate-800 rounded" />
						<div className="space-y-2">
							<div className="h-4 w-20 bg-slate-800/60 rounded" />
							<div className="h-4 w-32 bg-slate-800/40 rounded" />
						</div>
					</div>
					{/* カード2 */}
					<div className="rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-5 space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 bg-slate-800 rounded-full" />
								<div className="h-4 w-24 bg-slate-800 rounded" />
							</div>
							<div className="flex gap-2">
								<div className="h-7 w-7 bg-slate-800/40 rounded-lg" />
								<div className="h-7 w-7 bg-slate-800/40 rounded-lg" />
							</div>
						</div>
						<div className="h-8 w-36 bg-slate-800 rounded" />
						<div className="space-y-2">
							<div className="h-4 w-20 bg-slate-800/60 rounded" />
							<div className="h-4 w-44 bg-slate-800/40 rounded" />
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
