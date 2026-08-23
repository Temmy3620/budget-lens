"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

export function PasswordInput({
	label = "パスワード",
	error,
	className,
	id = "password",
	...props
}: PasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div>
			{label && (
				<label
					htmlFor={id}
					className="block text-xs font-semibold text-[#8c9fc2] mb-2 tracking-wide"
				>
					{label}
				</label>
			)}
			<div className="relative">
				<input
					id={id}
					type={showPassword ? "text" : "password"}
					className={`relative block w-full rounded-lg border border-[#31395c] bg-gradient-to-r from-[#131835] to-[#1a183d] pl-4 pr-12 py-3 text-white placeholder-slate-600 focus:z-10 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 sm:text-sm transition-colors duration-200 ${
						className || ""
					}`}
					placeholder={props.placeholder || "入力"}
					{...props}
				/>
				<button
					type="button"
					disabled={props.disabled}
					onClick={() => setShowPassword(!showPassword)}
					className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-slate-400 hover:text-white transition-colors duration-150 cursor-pointer flex items-center justify-center p-1 disabled:opacity-50 disabled:cursor-not-allowed"
					aria-label={
						showPassword ? "パスワードを非表示にする" : "パスワードを表示する"
					}
				>
					{showPassword ? (
						<EyeOff className="h-5 w-5" />
					) : (
						<Eye className="h-5 w-5" />
					)}
				</button>
			</div>
			{error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
		</div>
	);
}
