import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/navigation/footer";

export const metadata: Metadata = {
	title: "プライバシーポリシー | YariKuru",
	description:
		"YariKuru（ヤリクル）における個人情報の取り扱い方針を掲載しています。",
};

export default function PrivacyPage() {
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
							プライバシーポリシー
						</h1>
						<p className="text-xs text-slate-400">最終改定日: 2026年8月30日</p>
					</div>

					<div className="rounded-2xl border border-white/10 bg-[#080d28]/70 backdrop-blur-xl p-6 md:p-10 shadow-xl space-y-8 text-sm text-slate-300 leading-relaxed">
						<section className="space-y-3">
							<h2 className="text-base font-bold text-white border-b border-white/10 pb-2">
								1. 基本方針
							</h2>
							<p>
								YariKuru（以下「当サービス」といいます。）は、ユーザーのプライバシーを尊重し、個人情報の保護に関する法令を遵守するとともに、適正な取り扱いと保護に努めます。
							</p>
						</section>

						<section className="space-y-3">
							<h2 className="text-base font-bold text-white border-b border-white/10 pb-2">
								2. 収集する情報
							</h2>
							<p>
								当サービスでは、円滑な機能提供のために以下の情報を収集・取得する場合があります。
							</p>
							<ul className="list-disc pl-5 space-y-1.5 text-slate-400">
								<li>
									<strong className="text-slate-200">アカウント情報:</strong>{" "}
									メールアドレス、パスワード（暗号化して保存）、表示名
								</li>
								<li>
									<strong className="text-slate-200">
										サービス利用データ:
									</strong>{" "}
									ユーザーが登録した予算カテゴリ、支出履歴データ
								</li>
								<li>
									<strong className="text-slate-200">
										決済情報（外部決済代行）:
									</strong>{" "}
									決済処理は提携決済代行会社（Stripe）を通じて行われ、当サービスサーバー上に完全なクレジットカード番号を保持することはありません。
								</li>
								<li>
									<strong className="text-slate-200">
										アクセスログ・Cookie:
									</strong>{" "}
									ログインセッション維持のためのCookie情報、アクセス日時、IPアドレスなど
								</li>
							</ul>
						</section>

						<section className="space-y-3">
							<h2 className="text-base font-bold text-white border-b border-white/10 pb-2">
								3. 利用目的
							</h2>
							<p>収集した情報は、以下の目的のために利用されます。</p>
							<ul className="list-disc pl-5 space-y-1.5 text-slate-400">
								<li>当サービスの提供・認証・機能の実行</li>
								<li>有料プランの課金決済およびサブスクリプション管理</li>
								<li>重要なお知らせやサポート対応、お問い合わせへの回答</li>
								<li>サービスの改善、不具合の調査およびセキュリティ対策</li>
							</ul>
						</section>

						<section className="space-y-3">
							<h2 className="text-base font-bold text-white border-b border-white/10 pb-2">
								4. 外部委託・第三者提供
							</h2>
							<p>
								当サービスは、法令に基づく場合を除き、事前の同意なく個人情報を第三者に提供することはありません。ただし、サービス運営に必要な範囲で以下の外部サービスへ業務委託を行っています。
							</p>
							<ul className="list-disc pl-5 space-y-1.5 text-slate-400">
								<li>
									<strong className="text-slate-200">Supabase:</strong>{" "}
									データベース管理およびユーザー認証基盤
								</li>
								<li>
									<strong className="text-slate-200">Stripe:</strong>{" "}
									オンライン決済代行およびサブスクリプション処理
								</li>
							</ul>
						</section>

						<section className="space-y-3">
							<h2 className="text-base font-bold text-white border-b border-white/10 pb-2">
								5. 安全管理措置（セキュリティ）
							</h2>
							<p>
								当サービスは、ユーザーデータの保護のため、データベースの行レベルセキュリティ（RLS）による厳格なアクセス制御、通信経路の暗号化（SSL/TLS）、パスワードのハッシュ化など、適切な安全対策を講じています。
							</p>
						</section>

						<section className="space-y-3">
							<h2 className="text-base font-bold text-white border-b border-white/10 pb-2">
								6. 個人情報の開示・削除（退会）
							</h2>
							<p>
								ユーザーは、アプリ内の設定画面よりいつでも自身の登録情報の確認、変更、およびアカウントの完全削除（退会）を行うことができます。退会手続きに伴い、ユーザーに紐づく個人データは速やかに抹消されます。
							</p>
						</section>

						<section className="space-y-3">
							<h2 className="text-base font-bold text-white border-b border-white/10 pb-2">
								7. お問い合わせ窓口
							</h2>
							<p>
								プライバシーポリシーに関するご質問やご相談は、
								<Link
									href="/contact"
									className="text-violet-400 hover:text-violet-300 underline underline-offset-4 ml-1"
								>
									お問い合わせ窓口
								</Link>
								よりご連絡ください。
							</p>
						</section>
					</div>
				</div>
			</main>

			{/* フッター */}
			<Footer />
		</div>
	);
}
