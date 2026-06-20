"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { navItems } from "@/config/navigation";

interface SidebarProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	userEmail?: string;
}

export default function Sidebar({
	isOpen,
	setIsOpen,
	userEmail,
}: SidebarProps) {
	const pathname = usePathname();

	return (
		<div
			className={`fixed inset-0 z-50 flex ${
				isOpen ? "pointer-events-auto" : "pointer-events-none"
			}`}
		>
			{/* オーバーレイ背景マスク */}
			<div
				onClick={() => setIsOpen(false)}
				className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
					isOpen ? "opacity-100" : "opacity-0"
				}`}
			/>

			{/* サイドバー本体 */}
			<aside
				className={`relative w-80 max-w-[calc(100vw-3rem)] h-full bg-[#0a0f24]/95 border-r border-white/5 flex flex-col p-6 shadow-2xl backdrop-blur-xl transform transition-transform duration-300 ease-out z-50 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between mb-8">
					<span className="text-xl font-bold bg-gradient-to-r from-[#ffe8bd] to-[#ffd280] bg-clip-text text-transparent">
						Menu
					</span>
					<button
						onClick={() => setIsOpen(false)}
						className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
						aria-label="メニューを閉じる"
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
								strokeWidth="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<nav className="flex-1 space-y-2">
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setIsOpen(false)}
								className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
									isActive
										? "bg-gradient-to-r from-violet-600/20 to-indigo-600/10 border border-violet-500/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]"
										: "text-slate-400 hover:text-white hover:bg-white/5"
								}`}
							>
								<span
									className={isActive ? "text-violet-400" : "text-slate-400"}
								>
									{item.icon}
								</span>
								<span className="text-sm font-semibold">{item.name}</span>
							</Link>
						);
					})}
				</nav>

				{/* 下部ユーザープロフィール */}
				<div className="pt-6 border-t border-white/5">
					<div className="flex flex-col gap-1">
						<span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
							ログイン中
						</span>
						<span className="text-sm text-slate-300 font-medium truncate">
							{userEmail}
						</span>
					</div>
				</div>
			</aside>
		</div>
	);
}
