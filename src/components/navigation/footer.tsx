import Image from "next/image";
import Link from "next/link";

interface FooterProps {
	className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
	return (
		<footer
			className={`border-t border-white/5 bg-[#02040d] py-12 relative z-10 text-slate-400 text-xs ${className}`}
		>
			<div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
				{/* ロゴ */}
				<div className="flex items-center gap-2">
					<Link
						href="/"
						className="flex items-center gap-2 hover:opacity-80 transition-opacity"
					>
						<Image
							src="/icon_v6.png"
							alt="YariKuru Icon"
							width={28}
							height={28}
							className="w-7 h-7 rounded-md object-contain shadow-[0_0_10px_rgba(124,58,237,0.2)]"
						/>
						<Image
							src="/title_v2.png"
							alt="YariKuru"
							width={90}
							height={20}
							className="h-4.5 w-auto object-contain opacity-80"
						/>
					</Link>
				</div>

				{/* リンク群 */}
				<nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
					<Link
						href="/legal"
						className="hover:text-slate-200 transition-colors"
					>
						特定商取引法に基づく表記
					</Link>
					<Link
						href="/terms"
						className="hover:text-slate-200 transition-colors"
					>
						利用規約
					</Link>
					<Link
						href="/privacy"
						className="hover:text-slate-200 transition-colors"
					>
						プライバシーポリシー
					</Link>
					<Link
						href="/contact"
						className="hover:text-slate-200 transition-colors"
					>
						問い合わせ窓口
					</Link>
				</nav>

				{/* コピーライト */}
				<div className="text-slate-500">
					© {new Date().getFullYear()} YariKuru. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
