import type { Metadata } from "next";
import Footer from "@/components/navigation/footer";
import PublicHeader from "@/components/navigation/public-header";

export const metadata: Metadata = {
	title: "利用規約 | YariKuru",
	description: "YariKuru（ヤリクル）のサービス利用規約を掲載しています。",
};

export default function TermsPage() {
	return (
		<div className="min-h-screen bg-[#030616] text-[#e2e8f0] flex flex-col font-sans selection:bg-violet-500/30">
			<PublicHeader />

			{/* メインコンテンツ */}
			<main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-16">
				<div className="space-y-8">
					<div className="space-y-2">
						<h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
							利用規約 (Terms of Use)
						</h1>
						<p className="text-xs text-slate-400">最終改定日: 2026年8月30日</p>
					</div>

					<div className="rounded-2xl border border-white/10 bg-[#080d28]/70 backdrop-blur-xl p-6 md:p-10 shadow-xl space-y-8 text-sm text-slate-300 leading-relaxed">
						<section className="space-y-3">
							<h2 className="text-base font-bold text-white border-b border-white/10 pb-2">
								第1条（総則および適用）
							</h2>
							<p>
								本利用規約（以下「本規約」といいます。）は、YariKuru（以下「当サービス」といいます。）の利用条件を定めるものです。利用者の皆様（以下「ユーザー」といいます。）は、本規約に同意した上で当サービスをご利用いただきます。
							</p>
						</section>

						<section className="space-y-3">
							<h2 className="text-base font-bold text-white border-b border-white/10 pb-2">
								第2条（利用登録・アカウント管理）
							</h2>
							<ul className="list-disc pl-5 space-y-1.5 text-slate-400">
								<li>
									ユーザーは、当サービスの定めに従い正確な情報を登録してアカウントを作成するものとします。
								</li>
								<li>
									ユーザーは自己の責任においてメールアドレスおよびパスワードを管理するものとし、第三者への譲渡・貸与等は禁止します。
								</li>
								<li>
									パスワードの漏洩等により生じた損害について、当サービス運営者は故意または重大な過失がある場合を除き責任を負いません。
								</li>
							</ul>
						</section>

						<section className="space-y-3">
							<h2 className="text-base font-bold text-white border-b border-white/10 pb-2">
								第3条（利用料金および支払方法）
							</h2>
							<ul className="list-disc pl-5 space-y-1.5 text-slate-400">
								<li>
									当サービスの有料プランの利用料金は、料金ページまたは特定商取引法に基づく表記に記載の通りとします。
								</li>
								<li>
									無料トライアル期間が終了すると、登録された支払方法にて自動的に月額料金の決済が行われます。
								</li>
								<li>
									支払方法は、当サービスが指定するクレジットカード決済（Stripe経由）等によるものとします。
								</li>
								<li>
									ユーザーが期間途中に解約手続きを行った場合でも、日割り返金等は行われません。
								</li>
							</ul>
						</section>

						<section className="space-y-3">
							<h2 className="text-base font-bold text-white border-b border-white/10 pb-2">
								第4条（禁止事項）
							</h2>
							<p>ユーザーは、以下の行為を行ってはなりません。</p>
							<ul className="list-disc pl-5 space-y-1.5 text-slate-400">
								<li>法令または公序良俗に反する行為</li>
								<li>
									不正アクセス、サーバーへの過度な負荷をかける行為、当サービスの運営を妨害する行為
								</li>
								<li>他者のアカウントの不正利用やなりすまし行為</li>
								<li>
									リバースエンジニアリング、スクレイピング、逆コンパイル等の行為
								</li>
								<li>その他、当サービスが不適切と合理的に判断する行為</li>
							</ul>
						</section>

						<section className="space-y-3">
							<h2 className="text-base font-bold text-white border-b border-white/10 pb-2">
								第5条（免責事項および非保証）
							</h2>
							<ul className="list-disc pl-5 space-y-1.5 text-slate-400">
								<li>
									当サービスは、機能の正確性、有用性、特定目的への適合性について明示的・黙示的を問わずいかなる保証も行いません。
								</li>
								<li>
									システムの保守、天災、通信障害等のやむを得ない理由により、予告なくサービスが一時停止または中断されることがあります。
								</li>
								<li>
									当サービス運営者は、当サービスの利用に関してユーザーに生じた損害について、故意または重大な過失がある場合を除き、過去1ヶ月間にユーザーが支払った利用料金を上限として賠償責任を負うものとします。
								</li>
							</ul>
						</section>

						<section className="space-y-3">
							<h2 className="text-base font-bold text-white border-b border-white/10 pb-2">
								第6条（利用停止および退会）
							</h2>
							<p>
								ユーザーは、当サービスのアカウント設定画面よりいつでも退会（アカウント削除）することができます。退会時にはユーザーデータおよびサブスクリプションが適切に終了処理されます。
							</p>
						</section>

						<section className="space-y-3">
							<h2 className="text-base font-bold text-white border-b border-white/10 pb-2">
								第7条（規約の改定および準拠法）
							</h2>
							<ul className="list-disc pl-5 space-y-1.5 text-slate-400">
								<li>
									当サービスは、必要と判断した場合には本規約を変更できるものとします。重大な変更がある場合はサイト上等で告知します。
								</li>
								<li>本規約の解釈および適用は日本法に準拠するものとします。</li>
							</ul>
						</section>
					</div>
				</div>
			</main>

			{/* フッター */}
			<Footer />
		</div>
	);
}
