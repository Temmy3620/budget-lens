"use client";

import type { ReactNode } from "react";

interface ValueSelectorProps {
	/**
	 * 中央に表示する値（文字列、数値、または任意の React ノード）
	 */
	value: ReactNode;
	/**
	 * 「前へ（左矢印）」ボタンを押した時のコールバック
	 */
	onPrev: () => void;
	/**
	 * 「次へ（右矢印）」ボタンを押した時のコールバック
	 */
	onNext: () => void;
	/**
	 * 「前へ」ボタンを無効化するかどうか
	 */
	isPrevDisabled?: boolean;
	/**
	 * 「次へ」ボタンを無効化するかどうか
	 */
	isNextDisabled?: boolean;
	/**
	 * 「前へ」ボタンの aria-label（アクセシビリティ用）
	 */
	ariaLabelPrev?: string;
	/**
	 * 「次へ」ボタンの aria-label（アクセシビリティ用）
	 */
	ariaLabelNext?: string;
	/**
	 * コンテナ全体の追加スタイルクラス
	 */
	className?: string;
}

export function ValueSelector({
	value,
	onPrev,
	onNext,
	isPrevDisabled = false,
	isNextDisabled = false,
	ariaLabelPrev = "前へ",
	ariaLabelNext = "次へ",
	className = "",
}: ValueSelectorProps) {
	return (
		<div
			className={`flex items-center justify-center bg-[#0a0f24]/60 border border-white/5 rounded-2xl p-1.5 backdrop-blur-md ${className}`}
		>
			<button
				type="button"
				onClick={onPrev}
				disabled={isPrevDisabled}
				className={`p-2.5 rounded-xl transition-all ${
					isPrevDisabled
						? "text-slate-600 cursor-not-allowed"
						: "text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer"
				}`}
				aria-label={ariaLabelPrev}
			>
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
						strokeWidth="2.5"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>

			<span className="text-lg font-black text-white px-6 min-w-32 text-center tracking-wider select-none">
				{value}
			</span>

			<button
				type="button"
				onClick={onNext}
				disabled={isNextDisabled}
				className={`p-2.5 rounded-xl transition-all ${
					isNextDisabled
						? "text-slate-600 cursor-not-allowed"
						: "text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer"
				}`}
				aria-label={ariaLabelNext}
			>
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
						strokeWidth="2.5"
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</button>
		</div>
	);
}
