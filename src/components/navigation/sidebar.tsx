"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { logout } from "@/app/login/actions";
import { navItems } from "@/config/navigation";

interface SidebarProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	userEmail?: string;
	userName?: string;
}

export default function Sidebar({
	isOpen,
	setIsOpen,
	userEmail,
	userName,
}: SidebarProps) {
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	const handleLogout = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		startTransition(async () => {
			await logout();
		});
	};

	return (
		<>
			{isPending && (
				<div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05070f]/90 backdrop-blur-md">
					{/* 微妙な背景グラデーション光彩 */}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-64 w-64 rounded-full bg-violet-600/10 blur-[80px] pointer-events-none animate-pulse" />

					<div className="flex flex-col items-center gap-4 text-center">
						<div className="relative flex items-center justify-center">
							<div className="w-12 h-12 rounded-full border-2 border-slate-800 border-t-violet-500 border-r-indigo-500 border-b-cyan-500 animate-spin" />
							<div className="absolute">
								<Loader2 className="h-5 w-5 text-indigo-400 animate-spin [animation-duration:3s]" />
							</div>
						</div>

						<div className="space-y-1.5 mt-2">
							<p className="text-sm font-semibold tracking-widest bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent animate-pulse">
								LOGOUT
							</p>
							<p className="text-xs text-slate-450 tracking-wider">
								ログアウトしています...
							</p>
						</div>
					</div>
				</div>
			)}
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
						<span className="text-xl font-bold bg-gradient-to-r from-[#00d2ff] via-[#3b82f6] to-[#a855f7] bg-clip-text text-transparent">
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
					<div className="pt-6 border-t border-white/5 flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
								ログイン中
							</span>
							{userName && (
								<span className="text-sm font-semibold bg-gradient-to-r from-[#00d2ff] via-[#3b82f6] to-[#a855f7] bg-clip-text text-transparent truncate">
									{userName}
								</span>
							)}
							<span className="text-xs text-slate-400 font-medium truncate">
								{userEmail}
							</span>
						</div>
						<form onSubmit={handleLogout}>
							<button
								type="submit"
								disabled={isPending}
								className="w-full rounded-lg bg-slate-900 border border-white/5 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-center disabled:opacity-50"
							>
								ログアウト
							</button>
						</form>
					</div>
				</aside>
			</div>
		</>
	);
}
