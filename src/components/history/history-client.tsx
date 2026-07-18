"use client";

import { useState } from "react";
import { MOCK_HISTORY_DATA } from "@/components/history/mock-data";
import { ValueSelector } from "@/components/ui/value-selector";
import { HistoryMonthCard } from "./history-month-card";

interface HistoryClientProps {
	user: {
		id: string;
		email: string;
	} | null;
}

export default function HistoryClient({ user }: HistoryClientProps) {
	// モックデータに含まれる年を抽出
	const availableYears = MOCK_HISTORY_DATA.map((d) => d.year).sort(
		(a, b) => b - a,
	);
	const [selectedYear, setSelectedYear] = useState<number>(
		availableYears[0] || 2026,
	);

	// 選択された年の履歴データを取得
	const yearData = MOCK_HISTORY_DATA.find((d) => d.year === selectedYear);

	// 前の年・次の年への切り替えハンドラー
	const handlePrevYear = () => {
		const currentIndex = availableYears.indexOf(selectedYear);
		if (currentIndex < availableYears.length - 1) {
			setSelectedYear(availableYears[currentIndex + 1]);
		}
	};

	const handleNextYear = () => {
		const currentIndex = availableYears.indexOf(selectedYear);
		if (currentIndex > 0) {
			setSelectedYear(availableYears[currentIndex - 1]);
		}
	};

	const isFirstYear = selectedYear === availableYears[0];
	const isLastYear = selectedYear === availableYears[availableYears.length - 1];

	return (
		<div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* ヘッダーセクション */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6 gap-4">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
						支出履歴
					</h1>
					<p className="text-slate-400 mt-2 text-sm">
						過去の月別予算と実際の支出を確認し、家計の振り返りを行います。
					</p>
				</div>

				{/* 年切り替えトグル */}
				<ValueSelector
					value={`${selectedYear}年`}
					onPrev={handlePrevYear}
					onNext={handleNextYear}
					isPrevDisabled={isLastYear}
					isNextDisabled={isFirstYear}
					ariaLabelPrev="前の年へ"
					ariaLabelNext="次の年へ"
					className="self-center sm:self-auto"
				/>
			</div>

			{/* 月別サマリーカードリスト */}
			{yearData && yearData.months.length > 0 ? (
				<div className="grid gap-6">
					{yearData.months
						.sort((a, b) => b.month - a.month) // 新しい月が上に来るようにソート
						.map((summary) => (
							<HistoryMonthCard
								key={summary.month}
								selectedYear={selectedYear}
								summary={summary}
							/>
						))}
				</div>
			) : (
				<div className="rounded-2xl border border-dashed border-white/5 bg-white/[0.01] p-16 text-center text-slate-500 backdrop-blur-sm">
					<div className="mb-4 flex justify-center text-slate-600">
						<svg
							className="w-12 h-12"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.5"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<p className="text-sm font-semibold">
						該当する年の履歴データが見つかりません。
					</p>
					<p className="text-xs text-slate-600 mt-2">
						他の年を選択してください。
					</p>
				</div>
			)}
		</div>
	);
}
