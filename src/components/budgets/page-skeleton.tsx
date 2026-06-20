export function BudgetsSkeleton() {
	return (
		<main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8 animate-pulse">
			{/* ヘッダースケルトン */}
			<div className="border-b border-white/5 pb-6">
				<div className="h-9 w-48 bg-slate-800 rounded-lg" />
				<div className="h-4 w-96 bg-slate-800 rounded mt-2" />
			</div>

			{/* サマリースケルトン */}
			<div className="rounded-2xl border border-white/5 bg-[#0a0f24]/50 p-6 h-24 flex justify-between items-center">
				<div className="space-y-2">
					<div className="h-4 w-32 bg-slate-800 rounded" />
					<div className="h-8 w-40 bg-slate-800 rounded" />
				</div>
				<div className="space-y-2 text-right flex flex-col items-end">
					<div className="h-4 w-28 bg-slate-800 rounded" />
					<div className="h-6 w-20 bg-slate-800 rounded" />
				</div>
			</div>

			<div className="grid gap-8 lg:grid-cols-3">
				{/* 左側リストスケルトン */}
				<div className="lg:col-span-2 space-y-4">
					<div className="h-6 w-44 bg-slate-800 rounded" />
					<div className="space-y-3">
						<div className="h-16 bg-[#0a0f24]/30 border border-white/5 rounded-xl" />
						<div className="h-16 bg-[#0a0f24]/30 border border-white/5 rounded-xl" />
						<div className="h-16 bg-[#0a0f24]/30 border border-white/5 rounded-xl" />
					</div>
				</div>

				{/* 右側フォームスケルトン */}
				<div className="h-[360px] bg-[#0a0f24]/40 rounded-2xl border border-white/5 p-6 space-y-6">
					<div className="h-6 w-32 bg-slate-800 rounded" />
					<div className="space-y-2">
						<div className="h-4 w-16 bg-slate-800 rounded" />
						<div className="h-10 bg-slate-900 border border-white/10 rounded-xl" />
					</div>
					<div className="space-y-2">
						<div className="h-4 w-24 bg-slate-800 rounded" />
						<div className="h-10 bg-slate-900 border border-white/10 rounded-xl" />
					</div>
					<div className="h-10 bg-slate-900 border border-white/10 rounded-xl" />
				</div>
			</div>
		</main>
	);
}
