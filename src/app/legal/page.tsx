import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/navigation/footer";

export const metadata: Metadata = {
	title: "特定商取引法に基づく表記 | YariKuru",
	description: "YariKuruの特定商取引法に基づく表記を掲載しています。",
};

export default function LegalPage() {
	const legalItems = [
		{
			label: "サービス名",
			value: "YariKuru（ヤリクル）",
		},
		{
			label: "事業者名",
			value: "（準備中 / 運営者名または屋号）",
		},
		{
			label: "代表者 / 運営責任者",
			value: "（準備中 / 運営責任者名）",
		},
		{
			label: "所在地",
			value: "（準備中 / 請求があったら遅滞なく開示いたします）",
		},
		{
			label: "連絡先",
			value:
				"お問い合わせ窓口ページ（/contact）の専用お問い合わせフォームよりお問い合わせください。",
		},
		{
			label: "販売価格（利用料金）",
			value: "スタンダードプラン: 月額 150円（税込）※初回90日間無料",
		},
		{
			label: "対価以外に必要な費用",
			value: "インターネット接続料金、通信料金等はお客様のご負担となります。",
		},
		{
			label: "支払方法",
			value: "クレジットカード決済（Stripe）",
		},
		{
			label: "支払時期",
			value:
				"無料トライアル期間（90日間）終了時に初回決済が行われ、以降は毎月同日に自動更新・決済されます。",
		},
		{
			label: "役務の提供時期",
			value: "ユーザー登録およびプラン登録完了後、即時にご利用いただけます。",
		},
		{
			label: "解約・退会条件",
			value:
				"アプリ内のアカウント設定画面よりいつでも解約・退会が可能です。次回更新日の前日までに解約手続きを行っていただくことで、次回以降の請求は発生いたしません。なお、途中解約による日割りでの返金は承っておりません。",
		},
		{
			label: "動作環境",
			value:
				"Google Chrome, Safari, Mozilla Firefox, Microsoft Edge の最新版（PC/スマートフォン対応）",
		},
	];

	return (
		<div className="min-h-screen bg-[#030616] text-[#e2e8f0] flex flex-col font-sans selection:bg-violet-500/30">
			{/* ヘッダー */}
			<header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5 bg-[#0a0f24]/50">
				<div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
					<Link
						href="/"
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
						href="/"
						className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						トップページに戻る
					</Link>
				</div>
			</header>

			{/* メインコンテンツ */}
			<main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-16">
				<div className="space-y-8">
					<div className="space-y-2">
						<h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
							特定商取引法に基づく表記
						</h1>
						<p className="text-xs text-slate-400">最終改定日: 2026年8月30日</p>
					</div>

					<div className="rounded-2xl border border-white/10 bg-[#080d28]/70 backdrop-blur-xl overflow-hidden shadow-xl">
						<div className="divide-y divide-white/5">
							{legalItems.map((item) => (
								<div
									key={item.label}
									className="grid grid-cols-1 md:grid-cols-3 p-5 md:p-6 gap-2 md:gap-4 hover:bg-white/[0.01] transition-colors"
								>
									<dt className="text-sm font-semibold text-slate-300">
										{item.label}
									</dt>
									<dd className="text-sm text-slate-400 md:col-span-2 leading-relaxed">
										{item.value}
									</dd>
								</div>
							))}
						</div>
					</div>
				</div>
			</main>

			{/* フッター */}
			<Footer />
		</div>
	);
}
