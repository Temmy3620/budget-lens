"use client";

import type { BudgetSetting } from "@/components/budgets/types";
import type { Expense } from "@/lib/supabase/expenses";

interface CategorySpentChartProps {
	budgets: BudgetSetting[];
	thisMonthExpenses: Expense[];
}

const getGradientColors = (colorStr: string) => {
	const parts = colorStr.split(" ");
	const fromPart =
		parts.find((p) => p.startsWith("from-"))?.replace("from-", "") ||
		"gray-500";
	const toPart =
		parts.find((p) => p.startsWith("to-"))?.replace("to-", "") || "slate-400";

	return {
		from: `var(--color-${fromPart})`,
		to: `var(--color-${toPart})`,
	};
};

export function CategorySpentChart({
	budgets,
	thisMonthExpenses,
}: CategorySpentChartProps) {
	// 全支出額
	const totalSpent = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

	// カテゴリ別の支出割合を集計
	const categorySpentMap = thisMonthExpenses.reduce(
		(acc, curr) => {
			const bId = curr.budgetId || "unclassified";
			acc[bId] = (acc[bId] || 0) + curr.amount;
			return acc;
		},
		{} as Record<string, number>,
	);

	// グラフ用データの構築
	const chartData = Object.entries(categorySpentMap)
		.map(([bId, spent]) => {
			const budget = budgets.find((b) => b.id === bId);
			return {
				id: bId,
				name: budget?.name || "未分類",
				color: budget?.color || "from-slate-500 to-slate-400",
				spent,
			};
		})
		.sort((a, b) => b.spent - a.spent);

	// 各項目のパーセンテージと累積を計算 (Immutably)
	const chartSegments = chartData.map((item, index) => {
		const percentage = totalSpent > 0 ? (item.spent / totalSpent) * 100 : 0;
		const offset = 377 - (377 * percentage) / 100;
		const previousSpentSum = chartData
			.slice(0, index)
			.reduce((sum, curr) => sum + curr.spent, 0);
		const rotation = totalSpent > 0 ? (previousSpentSum / totalSpent) * 360 : 0;

		return {
			...item,
			percentage,
			offset,
			rotation,
		};
	});

	return (
		<div className="rounded-2xl border border-white/5 bg-[#0a0f24]/40 p-6 md:p-8 backdrop-blur-md shadow-xl flex flex-col justify-between">
			<div>
				<h2 className="text-xl font-bold text-white mb-2">
					カテゴリ別支出割合
				</h2>
				<p className="text-xs text-slate-500 mb-6">今月の支出の内訳</p>

				{chartSegments.length > 0 ? (
					<>
						{/* 簡素なドーナツグラフ（SVG） */}
						<div className="flex justify-center my-6 relative">
							<svg
								className="w-40 h-40 transform -rotate-90"
								role="img"
								aria-label="カテゴリ別支出割合の円グラフ"
							>
								{/* 背景の円 */}
								<circle
									cx="80"
									cy="80"
									r="60"
									fill="transparent"
									stroke="#1e293b"
									strokeWidth="16"
								/>
								{/* 動的なセグメント */}
								{chartSegments.map((segment) => (
									<circle
										key={segment.id}
										cx="80"
										cy="80"
										r="60"
										fill="transparent"
										stroke={`url(#grad-${segment.id})`}
										strokeWidth="16"
										strokeDasharray="377"
										strokeDashoffset={segment.offset}
										style={{
											transform: `rotate(${segment.rotation}deg)`,
											transformOrigin: "80px 80px",
										}}
										strokeLinecap="round"
									/>
								))}

								<defs>
									{chartSegments.map((segment) => {
										const colors = getGradientColors(segment.color);
										return (
											<linearGradient
												key={segment.id}
												id={`grad-${segment.id}`}
												x1="0%"
												y1="0%"
												x2="100%"
												y2="100%"
											>
												<stop offset="0%" stopColor={colors.from} />
												<stop offset="100%" stopColor={colors.to} />
											</linearGradient>
										);
									})}
								</defs>
							</svg>

							<div className="absolute inset-0 flex flex-col items-center justify-center p-4">
								<span className="text-lg font-black text-white truncate max-w-full">
									¥{totalSpent.toLocaleString()}
								</span>
								<span className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">
									Total Spent
								</span>
							</div>
						</div>

						{/* レジェンド */}
						<div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-6">
							{chartSegments.map((segment) => {
								const colors = getGradientColors(segment.color);
								return (
									<div
										key={segment.id}
										className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
									>
										<span
											className="w-2.5 h-2.5 rounded-full shrink-0"
											style={{ backgroundColor: colors.from }}
										/>
										<span className="truncate max-w-[70px]">
											{segment.name}
										</span>
										<span className="text-white font-bold shrink-0">
											{segment.percentage.toFixed(0)}%
										</span>
									</div>
								);
							})}
						</div>
					</>
				) : (
					<div className="py-20 text-center text-slate-500 text-sm">
						今月の支出がありません。
					</div>
				)}
			</div>
		</div>
	);
}
