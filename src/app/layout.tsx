import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://yarikuru.com"),
	title: "YariKuru（ヤリクル）| やりくり予算に特化したシンプルな予算管理アプリ",
	description:
		"YariKuru（ヤリクル）は、固定費を除外した「自分でコントロールできるやりくり予算」だけに集中できる予算管理アプリです。直感的な円グラフと過去のスナップショット機能で、日々のやりくりをスマートにサポートします。",
	keywords: [
		"YariKuru",
		"ヤリクル",
		"やりくり",
		"予算管理アプリ",
		"家計簿アプリ",
	],
	openGraph: {
		title:
			"YariKuru（ヤリクル）| やりくり予算に特化したシンプルな予算管理アプリ",
		description:
			"固定費のノイズを排除し、「今月あといくら使えるか」に特化。過去のやりくり設定も正確に振り返れます。",
		url: "https://yarikuru.com",
		siteName: "YariKuru",
		locale: "ja_JP",
		type: "website",
	},
	icons: {
		icon: "/icon_v6.png",
		apple: "/icon_v6.png",
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: "black",
		title: "YariKuru",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="ja"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col bg-[#030616] text-white selection:bg-violet-500/30">
				{children}
			</body>
			<GoogleAnalytics gaId="G-MDXKGWHGWV" />
		</html>
	);
}
