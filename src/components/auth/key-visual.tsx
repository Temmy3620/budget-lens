import Image from "next/image";

export function KeyVisual() {
	return (
		<div className="flex-1 relative min-h-[360px] md:min-h-screen bg-[#05081c]/30 border-b md:border-b-0 md:border-r border-white/5 flex items-center justify-center p-8 md:p-12 lg:p-16">
			{/* キービジュアル画像を中央に少し小さく、額縁のように浮かせて配置 */}
			<div className="relative w-full max-h-full aspect-[4/3] overflow-hidden">
				<Image
					src="/keyvisual_v4.png"
					alt="YariKuru Key Visual"
					fill
					priority
					sizes="(max-width: 768px) 100vw, 50vw"
					className="object-cover"
				/>
				{/* 四辺の境界線をふわっと背景に溶け込ませるインセットシャドウ */}
				<div className="absolute inset-0 shadow-[inset_0_0_40px_16px_#030616] pointer-events-none" />
			</div>
		</div>
	);
}
