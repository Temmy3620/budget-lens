import Link from "next/link";
import { KeyVisual } from "@/components/auth/key-visual";
import ResetPasswordClient from "@/components/auth/reset-password-client";
import { createClient } from "@/lib/supabase/server";
import { resetPassword } from "./actions";

export const metadata = {
	title: "パスワードの更新 - YariKuru",
	description: "新しいパスワードを設定します。",
};

export default async function ResetPasswordPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// セッション（ユーザー）が存在しない場合は、パスワード変更を許可しない
	if (!user) {
		return (
			<div className="relative flex min-h-screen flex-col md:flex-row bg-[#030616] text-white overflow-hidden">
				{/* 背景のグリッド線 */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

				<KeyVisual />

				<div className="w-full md:w-[460px] lg:w-[500px] flex flex-col justify-center px-8 py-16 md:px-12 bg-[#0a0f24]/30 backdrop-blur-xl relative">
					<div className="w-full max-w-sm mx-auto space-y-6">
						<div className="space-y-2">
							<h1 className="text-2xl font-bold tracking-tight text-white">
								無効なアクセス
							</h1>
							<p className="text-sm text-rose-400 leading-relaxed">
								パスワードの再設定セッションが無効、または期限切れです。
							</p>
							<p className="text-xs text-[#8c9fc2]/80 leading-relaxed">
								もう一度パスワード再設定メールの送信からやり直してください。
							</p>
						</div>
						<div>
							<Link
								href="/forgot-password"
								className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-[#00d2ff] to-[#0066ff] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:from-[#00e1ff] hover:to-[#0077ff] focus:outline-none focus:ring-2 focus:ring-[#00d2ff] transition-all duration-200 cursor-pointer text-center"
							>
								再設定メール送信画面へ
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return <ResetPasswordClient resetPasswordAction={resetPassword} />;
}
