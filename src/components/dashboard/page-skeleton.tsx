export function DashboardSkeleton() {
	return (
		<main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8 animate-pulse">
			{/* ウェルカムセクションのプレースホルダー */}
			<div className="h-48 bg-white/5 rounded-3xl w-full" />
			{/* クイック統計のプレースホルダー */}
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<div className="h-32 bg-white/5 rounded-2xl w-full" />
				<div className="h-32 bg-white/5 rounded-2xl w-full" />
				<div className="h-32 bg-white/5 rounded-2xl w-full" />
			</div>
			{/* 二段目のグリッドのプレースホルダー */}
			<div className="grid gap-8 lg:grid-cols-3">
				<div className="lg:col-span-2 h-96 bg-white/5 rounded-2xl w-full" />
				<div className="h-96 bg-white/5 rounded-2xl w-full" />
			</div>
		</main>
	);
}
