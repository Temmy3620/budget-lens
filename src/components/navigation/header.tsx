"use client";

import Image from "next/image";

interface HeaderProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	userEmail?: string;
	userName?: string;
}

export default function Header({
	isOpen,
	setIsOpen,
	userEmail,
	userName,
}: HeaderProps) {
	return (
		<header className="flex h-16 items-center justify-between border-b border-white/5 px-6 bg-[#0a0f24]/50 backdrop-blur-md sticky top-0 z-40">
			<div className="flex items-center gap-4">
				{/* ハンバーガーメニューボタン */}
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none transition-colors cursor-pointer"
					aria-label="メニューを開閉"
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						{isOpen ? (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						) : (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						)}
					</svg>
				</button>

				<div className="flex items-center gap-2 select-none">
					<Image
						src="/icon_v4.png"
						alt="Budget Lens Logo"
						width={100}
						height={100}
						className="w-6 h-6 object-contain"
					/>
					<span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent tracking-wide">
						Budget Lens
					</span>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<span className="text-sm font-semibold bg-gradient-to-r from-[#ffe8bd] to-[#ffd280] bg-clip-text text-transparent truncate max-w-[180px]">
					{userName || userEmail}
				</span>
			</div>
		</header>
	);
}
