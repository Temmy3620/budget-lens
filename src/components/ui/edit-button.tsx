import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface EditButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	ariaLabel?: string;
	iconClassName?: string;
}

export function EditButton({
	onClick,
	className,
	ariaLabel = "編集",
	iconClassName,
	...props
}: EditButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"p-1.5 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all cursor-pointer",
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
					d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
				/>
			</svg>
		</button>
	);
}
