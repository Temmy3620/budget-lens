import { useEffect, useRef, useState } from "react";

interface DatePickerProps {
	value: string; // "YYYY-MM-DD"
	onChange: (value: string) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const datePickerRef = useRef<HTMLDivElement>(null);

	// カレンダー表示用の現在の年・月 (0-indexed)
	const [calendarYear, setCalendarYear] = useState(() => {
		const parts = value.split("-");
		return parts[0] ? Number(parts[0]) : new Date().getFullYear();
	});
	const [calendarMonth, setCalendarMonth] = useState(() => {
		const parts = value.split("-");
		return parts[1] ? Number(parts[1]) - 1 : new Date().getMonth();
	});

	// ポップオーバーの外側クリックを検知して閉じる
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				datePickerRef.current &&
				!datePickerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	// カレンダーグリッドの日付データを生成するヘルパー
	const getCalendarDays = () => {
		const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
		const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
		const prevMonthTotalDays = new Date(
			calendarYear,
			calendarMonth,
			0,
		).getDate();

		const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] =
			[];

		// 前月のパディング日
		for (let i = firstDay - 1; i >= 0; i--) {
			const dayNum = prevMonthTotalDays - i;
			const prevMonth = calendarMonth === 0 ? 11 : calendarMonth - 1;
			const prevYear = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
			days.push({
				dateStr: `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`,
				dayNum,
				isCurrentMonth: false,
			});
		}

		// 当月の日
		for (let i = 1; i <= totalDays; i++) {
			days.push({
				dateStr: `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
				dayNum: i,
				isCurrentMonth: true,
			});
		}

		// 翌月のパディング日 (42マスで固定)
		const remainingGridCells = 42 - days.length;
		for (let i = 1; i <= remainingGridCells; i++) {
			const nextMonth = calendarMonth === 11 ? 0 : calendarMonth + 1;
			const nextYear = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
			days.push({
				dateStr: `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
				dayNum: i,
				isCurrentMonth: false,
			});
		}

		return days;
	};

	const handlePrevMonth = () => {
		if (calendarMonth === 0) {
			setCalendarYear(calendarYear - 1);
			setCalendarMonth(11);
		} else {
			setCalendarMonth(calendarMonth - 1);
		}
	};

	const handleNextMonth = () => {
		if (calendarMonth === 11) {
			setCalendarYear(calendarYear + 1);
			setCalendarMonth(0);
		} else {
			setCalendarMonth(calendarMonth + 1);
		}
	};

	const handleSelectDate = (dateStr: string) => {
		onChange(dateStr);
		setIsOpen(false);
	};

	return (
		<div className="relative w-full" ref={datePickerRef}>
			<button
				type="button"
				onClick={() => {
					setIsOpen(!isOpen);
					const parts = value.split("-");
					if (parts[0] && parts[1]) {
						setCalendarYear(Number(parts[0]));
						setCalendarMonth(Number(parts[1]) - 1);
					}
				}}
				className="w-full flex items-center justify-between bg-[#030616]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-violet-500 hover:border-white/20 transition-colors shadow-inner cursor-pointer"
			>
				<span>
					{value ? value.replace(/-/g, " / ") : "日付を選択してください"}
				</span>
				<svg
					className="w-4 h-4 text-slate-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2.5"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			</button>

			{isOpen && (
				<div className="absolute left-0 right-0 mt-2 z-50 bg-[#0e1430]/98 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-fade-in">
					{/* カレンダーヘッダー */}
					<div className="flex items-center justify-between mb-4">
						<button
							type="button"
							onClick={handlePrevMonth}
							className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2.5"
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</button>
						<span className="text-sm font-bold text-white">
							{calendarYear}年 {calendarMonth + 1}月
						</span>
						<button
							type="button"
							onClick={handleNextMonth}
							className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2.5"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</div>

					{/* 曜日グリッド */}
					<div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500 mb-2">
						<span>日</span>
						<span>月</span>
						<span>火</span>
						<span>水</span>
						<span>木</span>
						<span>金</span>
						<span>土</span>
					</div>

					{/* 日付グリッド */}
					<div className="grid grid-cols-7 gap-1">
						{getCalendarDays().map((day) => {
							const isSelected = day.dateStr === value;
							return (
								<button
									key={day.dateStr}
									type="button"
									onClick={() => handleSelectDate(day.dateStr)}
									className={`h-8 w-full flex items-center justify-center text-xs font-semibold rounded-lg transition-all cursor-pointer ${
										isSelected
											? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-md shadow-violet-600/10"
											: day.isCurrentMonth
												? "text-slate-200 hover:bg-white/5 hover:text-white"
												: "text-slate-600 hover:bg-white/[0.02]"
									}`}
								>
									{day.dayNum}
								</button>
							);
						})}
					</div>

					{/* クイック選択フッター */}
					<div className="mt-3 pt-3 border-t border-white/5 flex justify-end">
						<button
							type="button"
							onClick={() => {
								const today = new Date();
								const y = today.getFullYear();
								const m = String(today.getMonth() + 1).padStart(2, "0");
								const d = String(today.getDate()).padStart(2, "0");
								handleSelectDate(`${y}-${m}-${d}`);
							}}
							className="text-[10px] font-bold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
						>
							今日を選択
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
