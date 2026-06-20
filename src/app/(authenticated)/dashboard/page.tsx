import { getCurrentUser } from "@/lib/dal";

export default async function DashboardPage() {
	const user = await getCurrentUser();

	return (
		<main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
			{/* ウェルカムセクション */}
			<div className="relative rounded-3xl border border-white/5 bg-gradient-to-br from-[#0c1435]/60 to-[#05091e]/80 p-8 md:p-10 overflow-hidden shadow-2xl backdrop-blur-xl">
				<div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
				<div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

				<div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
					<div>
						<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
							おかえりなさい
						</h1>
						<p className="mt-2 text-slate-400 max-w-xl text-sm md:text-base leading-relaxed">
							Budget Lens
							はあなたの収支をリアルタイムで追跡し、スマートな予算管理をサポートします。今月の財務ステータスを確認しましょう。
						</p>
					</div>
					<div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 self-start md:self-auto backdrop-blur-md">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
							{user?.email ? user.email.slice(0, 2).toUpperCase() : "U"}
						</div>
						<div>
							<div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
								Account
							</div>
							<div className="text-sm font-semibold text-slate-200 truncate max-w-[180px]">
								{user?.email}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* クイック統計 */}
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{/* カード1: 総予算残高 */}
				<div className="group relative rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-6 backdrop-blur-md hover:border-violet-500/20 transition-all duration-300 shadow-xl overflow-hidden">
					<div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-violet-500/5 blur-2xl group-hover:bg-violet-500/10 transition-all duration-300" />
					<div className="flex items-center justify-between mb-4">
						<span className="text-sm font-medium text-slate-400">
							今月の残り予算
						</span>
						<div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>
					<div className="text-3xl font-extrabold text-white tracking-tight">
						¥230,000
					</div>
					<div className="mt-2 flex items-center gap-2 text-xs">
						<span className="text-emerald-400 font-semibold">65.7%</span>
						<span className="text-slate-500">全体予算の内、未消化</span>
					</div>
					{/* プログレスバー */}
					<div className="mt-4 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
							style={{ width: "65.7%" }}
						/>
					</div>
				</div>

				{/* カード2: 総支出 */}
				<div className="group relative rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-6 backdrop-blur-md hover:border-pink-500/20 transition-all duration-300 shadow-xl overflow-hidden">
					<div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-pink-500/5 blur-2xl group-hover:bg-pink-500/10 transition-all duration-300" />
					<div className="flex items-center justify-between mb-4">
						<span className="text-sm font-medium text-slate-400">
							今月の総支出
						</span>
						<div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
					</div>
					<div className="text-3xl font-extrabold text-white tracking-tight">
						¥120,000
					</div>
					<div className="mt-2 flex items-center gap-2 text-xs">
						<span className="text-pink-400 font-semibold">+12.3%</span>
						<span className="text-slate-500">先月の同日比</span>
					</div>
					{/* プログレスバー */}
					<div className="mt-4 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
							style={{ width: "34.3%" }}
						/>
					</div>
				</div>

				{/* カード3: 今月の収入 */}
				<div className="group relative rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-6 backdrop-blur-md hover:border-emerald-500/20 transition-all duration-300 shadow-xl overflow-hidden">
					<div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-all duration-300" />
					<div className="flex items-center justify-between mb-4">
						<span className="text-sm font-medium text-slate-400">
							今月の手取り収入
						</span>
						<div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 4v16m8-8H4"
								/>
							</svg>
						</div>
					</div>
					<div className="text-3xl font-extrabold text-white tracking-tight">
						¥350,000
					</div>
					<div className="mt-2 flex items-center gap-2 text-xs">
						<span className="text-slate-400 font-semibold">
							固定給: ¥320,000
						</span>
						<span className="text-slate-500">/ 副収入: ¥30,000</span>
					</div>
					<div className="mt-4 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
							style={{ width: "100%" }}
						/>
					</div>
				</div>
			</div>

			{/* 二段目のグリッド */}
			<div className="grid gap-8 lg:grid-cols-3">
				{/* 最近の支出履歴 (2カラム幅) */}
				<div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-6 md:p-8 backdrop-blur-md shadow-xl flex flex-col justify-between">
					<div>
						<div className="flex items-center justify-between mb-6">
							<div>
								<h2 className="text-xl font-bold text-white">最近の支出履歴</h2>
								<p className="text-xs text-slate-500 mt-1">
									直近数日間の支出レコード
								</p>
							</div>
							<button className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors bg-violet-500/10 hover:bg-violet-500/20 px-3 py-1.5 rounded-lg cursor-pointer">
								すべて見る
							</button>
						</div>

						<div className="divide-y divide-white/5">
							{/* 取引1 */}
							<div className="py-3.5 flex items-center justify-between group">
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-sm">
										食費
									</div>
									<div>
										<div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
											スーパーマーケットライフ
										</div>
										<div className="text-xs text-slate-500 mt-0.5">
											2026/06/20
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-sm font-bold text-slate-200">
										-¥4,520
									</div>
									<span className="inline-block text-[10px] px-2 py-0.5 mt-1 rounded bg-slate-800 text-slate-400">
										食費
									</span>
								</div>
							</div>

							{/* 取引2 */}
							<div className="py-3.5 flex items-center justify-between group">
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
										交通
									</div>
									<div>
										<div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
											モバイルSuicaチャージ
										</div>
										<div className="text-xs text-slate-500 mt-0.5">
											2026/06/19
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-sm font-bold text-slate-200">
										-¥3,000
									</div>
									<span className="inline-block text-[10px] px-2 py-0.5 mt-1 rounded bg-slate-800 text-slate-400">
										交通費
									</span>
								</div>
							</div>

							{/* 取引3 */}
							<div className="py-3.5 flex items-center justify-between group">
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">
										娯楽
									</div>
									<div>
										<div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
											映画チケット (新宿バルト9)
										</div>
										<div className="text-xs text-slate-500 mt-0.5">
											2026/06/18
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-sm font-bold text-slate-200">
										-¥2,000
									</div>
									<span className="inline-block text-[10px] px-2 py-0.5 mt-1 rounded bg-slate-800 text-slate-400">
										エンタメ
									</span>
								</div>
							</div>

							{/* 取引4 */}
							<div className="py-3.5 flex items-center justify-between group">
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold text-sm">
										衣服
									</div>
									<div>
										<div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
											ユニクロ オンラインストア
										</div>
										<div className="text-xs text-slate-500 mt-0.5">
											2026/06/15
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-sm font-bold text-slate-200">
										-¥7,980
									</div>
									<span className="inline-block text-[10px] px-2 py-0.5 mt-1 rounded bg-slate-800 text-slate-400">
										衣服・美容
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* カテゴリ別支出割合 (1カラム幅) */}
				<div className="rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-6 md:p-8 backdrop-blur-md shadow-xl flex flex-col justify-between">
					<div>
						<h2 className="text-xl font-bold text-white mb-2">
							カテゴリ別支出割合
						</h2>
						<p className="text-xs text-slate-500 mb-6">今月の支出の内訳</p>

						{/* 簡素なドーナツグラフ（SVG） */}
						<div className="flex justify-center my-6 relative">
							<svg className="w-40 h-40 transform -rotate-90">
								{/* 背景の円 */}
								<circle
									cx="80"
									cy="80"
									r="60"
									fill="transparent"
									stroke="#1e293b"
									strokeWidth="16"
								/>
								{/* 食費: 50% (dasharray 377の50% = 188.5, offset 0) */}
								<circle
									cx="80"
									cy="80"
									r="60"
									fill="transparent"
									stroke="url(#gradient-orange)"
									strokeWidth="16"
									strokeDasharray="377"
									strokeDashoffset="188.5"
									strokeLinecap="round"
								/>
								{/* 衣服: 30% (dasharray 377の30% = 113.1, offset 188.5) */}
								<circle
									cx="80"
									cy="80"
									r="60"
									fill="transparent"
									stroke="url(#gradient-pink)"
									strokeWidth="16"
									strokeDasharray="377"
									strokeDashoffset="113.1"
									style={{
										transform: "rotate(180deg)",
										transformOrigin: "80px 80px",
									}}
									strokeLinecap="round"
								/>
								{/* その他: 20% (dasharray 377の20% = 75.4, offset 301.6) */}
								<circle
									cx="80"
									cy="80"
									r="60"
									fill="transparent"
									stroke="url(#gradient-blue)"
									strokeWidth="16"
									strokeDasharray="377"
									strokeDashoffset="75.4"
									style={{
										transform: "rotate(288deg)",
										transformOrigin: "80px 80px",
									}}
									strokeLinecap="round"
								/>

								<defs>
									<linearGradient
										id="gradient-orange"
										x1="0%"
										y1="0%"
										x2="100%"
										y2="100%"
									>
										<stop offset="0%" stopColor="#f97316" />
										<stop offset="100%" stopColor="#fdba74" />
									</linearGradient>
									<linearGradient
										id="gradient-pink"
										x1="0%"
										y1="0%"
										x2="100%"
										y2="100%"
									>
										<stop offset="0%" stopColor="#ec4899" />
										<stop offset="100%" stopColor="#fbcfe8" />
									</linearGradient>
									<linearGradient
										id="gradient-blue"
										x1="0%"
										y1="0%"
										x2="100%"
										y2="100%"
									>
										<stop offset="0%" stopColor="#3b82f6" />
										<stop offset="100%" stopColor="#93c5fd" />
									</linearGradient>
								</defs>
							</svg>

							<div className="absolute inset-0 flex flex-col items-center justify-center">
								<span className="text-2xl font-black text-white">¥120k</span>
								<span className="text-[10px] text-slate-500 font-semibold uppercase">
									Total Spent
								</span>
							</div>
						</div>

						{/* レジェンド */}
						<div className="grid grid-cols-3 gap-2 mt-6">
							<div className="text-center">
								<div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-300">
									<span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
									食費
								</div>
								<div className="text-sm font-bold text-white mt-1">50%</div>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-300">
									<span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
									衣服
								</div>
								<div className="text-sm font-bold text-white mt-1">30%</div>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-300">
									<span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
									その他
								</div>
								<div className="text-sm font-bold text-white mt-1">20%</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
