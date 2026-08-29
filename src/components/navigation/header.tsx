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

				<div className="flex items-center gap-2.5 select-none">
					<Image
						src="/icon_v6.png"
						alt="YariKuru Logo"
						width={40}
						height={40}
						className="w-10 h-10 object-contain"
					/>
					<Image
						src="/title_v2.png"
						alt="YariKuru"
						width={120}
						height={28}
						className="h-7 w-auto object-contain"
						priority
					/>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<span className="text-sm font-semibold bg-gradient-to-r from-[#00d2ff] via-[#3b82f6] to-[#a855f7] bg-clip-text text-transparent truncate max-w-[180px]">
					{userName || userEmail}
				</span>
			</div>
		</header>
	);
}
