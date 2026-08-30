import {
	ArrowLeft,
	ExternalLink,
	HelpCircle,
	MessageSquare,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/navigation/footer";

export const metadata: Metadata = {
	title: "お問い合わせ窓口 | YariKuru",
	description:
		"YariKuru（ヤリクル）に関するお問い合わせ窓口・サポート案内です。",
};

const GOOGLE_FORM_URL =
	"https://docs.google.com/forms/d/e/1FAIpQLSddWB6Qe6CWjND-7peEeaNeBNGhPXpTiaJq6uOvrevytnFv0Q/viewform?usp=publish-editor";

export default function ContactPage() {
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
							お問い合わせ窓口
						</h1>
						<p className="text-sm text-slate-400">
							YariKuru（ヤリクル）のご利用に関するご質問、不具合のご報告、ご要望などを受け付けております。
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						{/* Googleフォームでのお問い合わせカード */}
						<div className="rounded-2xl border border-white/10 bg-[#080d28]/70 backdrop-blur-xl p-6 md:p-8 shadow-xl space-y-6">
							<div className="space-y-4">
								<div className="h-12 w-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
									<MessageSquare className="h-6 w-6" />
								</div>
								<div className="space-y-2">
									<h2 className="text-lg font-bold text-white">
										お問い合わせフォーム
									</h2>
									<p className="text-xs text-slate-400 leading-relaxed">
										専用のGoogleフォームよりお問い合わせを受け付けております。以下のボタンよりフォームを開き、必要事項をご入力ください。
									</p>
								</div>
							</div>

							<div className="space-y-4 pt-1">
								<a
									href={GOOGLE_FORM_URL}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 cursor-pointer"
								>
									<span>お問い合わせフォームを開く</span>
									<ExternalLink className="h-4 w-4" />
								</a>

								<div className="text-[11px] text-slate-400 space-y-1">
									<p>※ 通常 2〜3 営業日以内にご返信いたします。</p>
									<p>
										※ 内容によってはお答えにお時間をいただく場合がございます。
									</p>
								</div>
							</div>
						</div>

						{/* よくある質問・事前確認 */}
						<div className="rounded-2xl border border-white/10 bg-[#080d28]/70 backdrop-blur-xl p-6 md:p-8 shadow-xl space-y-6">
							<div className="space-y-4">
								<div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
									<HelpCircle className="h-6 w-6" />
								</div>
								<div className="space-y-2">
									<h2 className="text-lg font-bold text-white">
										お問い合わせ前の確認事項
									</h2>
									<p className="text-xs text-slate-400 leading-relaxed">
										解約やパスワード再設定などは、アプリ内から直接お手続きいただけます。
									</p>
								</div>
							</div>

							<div className="space-y-3 text-xs text-slate-300">
								<div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
									<strong className="text-white block mb-1">
										パスワードをお忘れの場合
									</strong>
									<p className="text-slate-400">
										ログイン画面の「パスワードをお忘れですか？」より再設定メールをお送りいただけます。
									</p>
								</div>

								<div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
									<strong className="text-white block mb-1">
										解約・退会を行いたい場合
									</strong>
									<p className="text-slate-400">
										ログイン後、画面下部のアカウント設定メニューよりいつでも退会・サブスク解約が可能です。
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* 運営について */}
					<div className="rounded-2xl border border-white/5 bg-[#05081c]/50 p-6 flex items-center gap-4 text-xs text-slate-400">
						<MessageSquare className="h-5 w-5 text-slate-500 shrink-0" />
						<p>
							いただいたご意見・ご要望は、今後のサービス改善の参考とさせていただきます。温かいフィードバックを心よりお待ちしております。
						</p>
					</div>
				</div>
			</main>

			{/* フッター */}
			<Footer />
		</div>
	);
}
