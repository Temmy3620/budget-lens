import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PublicHeader() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const returnHref = user ? "/dashboard" : "/";
	const returnText = user ? "ダッシュボードに戻る" : "トップページに戻る";

	return (
		<header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5 bg-[#0a0f24]/50">
			<div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
				<Link
					href={returnHref}
					className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
				>
					<Image
						src="/icon_v6.png"
						alt="YariKuru Logo"
						width={36}
						height={36}
						className="w-9 h-9 object-contain"
					/>
					<Image
						src="/title_v2.png"
						alt="YariKuru"
						width={110}
						height={26}
						className="h-6 w-auto object-contain"
						priority
					/>
				</Link>
				<Link
					href={returnHref}
					className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
				>
					<ArrowLeft className="h-4 w-4" />
					{returnText}
				</Link>
			</div>
		</header>
	);
}
