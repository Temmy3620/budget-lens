import type { ComponentProps } from "react";

export function Button({ children, ...props }: ComponentProps<"button">) {
	return (
		<button
			type="button"
			className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
			{...props}
		>
			{children}
		</button>
	);
}
