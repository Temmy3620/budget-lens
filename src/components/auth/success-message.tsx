interface SuccessMessageProps {
	message: string;
	onBackToLogin: () => void;
}

export function SuccessMessage({
	message,
	onBackToLogin,
}: SuccessMessageProps) {
	return (
		<div className="space-y-6">
			<div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-400 leading-relaxed">
				<p className="font-semibold mb-2">登録手続きのご案内</p>
				<p>{message}</p>
			</div>
			<button
				type="button"
				onClick={onBackToLogin}
				className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-[#00d2ff] to-[#0066ff] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:from-[#00e1ff] hover:to-[#0077ff] focus:outline-none focus:ring-2 focus:ring-[#00d2ff] focus:ring-offset-2 focus:ring-offset-[#030616] transition-all duration-200 cursor-pointer"
			>
				ログイン画面へ
			</button>
		</div>
	);
}
