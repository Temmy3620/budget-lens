import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface DeleteButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	ariaLabel?: string;
	iconClassName?: string;
}

export function DeleteButton({
	onClick,
	className,
	ariaLabel = "削除",
	iconClassName,
	...props
}: DeleteButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer",
				className,
			)}
			aria-label={ariaLabel}
			{...props}
		>
			<svg
				className={cn("w-4 h-4", iconClassName)}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
				/>
			</svg>
		</button>
	);
}
