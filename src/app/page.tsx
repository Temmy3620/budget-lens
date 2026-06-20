import { getCurrentUser } from "@/lib/dal";
import { logout } from "@/app/login/actions";

export default async function Home() {
	const user = await getCurrentUser();

	return (
		<div className="flex min-h-screen flex-col bg-slate-950 text-white font-sans">
			{/* ヘッダー */}
			<header className="flex h-16 items-center justify-between border-b border-slate-800 px-6 bg-slate-900/50 backdrop-blur">
				<div className="flex items-center gap-2">
					<span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
						Budget Lens
					</span>
				</div>
				<div className="flex items-center gap-4">
					<span className="text-sm text-slate-400">{user?.email}</span>
					<form action={logout}>
						<button
							type="submit"
							className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
						>
							ログアウト
						</button>
					</form>
				</div>
			</header>

			{/* メインコンテンツ */}
			<main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
				<div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8 shadow-xl backdrop-blur-xl">
					<h1 className="text-3xl font-extrabold tracking-tight">
						ようこそ Budget Lens へ
					</h1>
					<p className="mt-2 text-slate-400">
						あなたの家計状況を分析するダッシュボードです。Supabase Auth
						によるセキュアなログイン環境が構築されています。
					</p>
				</div>

				{/* 統計カードのサンプル */}
				<div className="grid gap-6 md:grid-cols-3">
					<div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
						<h3 className="text-sm font-medium text-slate-400">今月の収入</h3>
						<p className="mt-2 text-3xl font-bold text-violet-400">¥350,000</p>
					</div>
					<div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
						<h3 className="text-sm font-medium text-slate-400">今月の支出</h3>
						<p className="mt-2 text-3xl font-bold text-indigo-400">¥120,000</p>
					</div>
					<div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
						<h3 className="text-sm font-medium text-slate-400">現在の貯蓄</h3>
						<p className="mt-2 text-3xl font-bold text-emerald-400">¥230,000</p>
					</div>
				</div>
			</main>
		</div>
	);
}
