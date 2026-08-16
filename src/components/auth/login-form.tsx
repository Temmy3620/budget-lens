import type { FormState } from "@/types/form";
import type { LoginFormErrors } from "@/types/auth";
import { PasswordInput } from "@/components/ui/password-input";

interface LoginFormProps {
	action: (payload: FormData) => void;
	pending: boolean;
	state: FormState<LoginFormErrors>;
}

export function LoginForm({ action, pending, state }: LoginFormProps) {
	return (
		<form action={action} className="space-y-6">
			{state?.errors?._form && (
				<div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
					{state.errors._form.map((err) => (
						<p key={err}>{err}</p>
					))}
				</div>
			)}

			<div className="space-y-5">
				{/* メールアドレス入力 */}
				<div>
					<label
						htmlFor="email-address"
						className="block text-xs font-semibold text-[#8c9fc2] mb-2 tracking-wide"
					>
						メールアドレス
					</label>
					<input
						id="email-address"
						name="email"
						type="email"
						autoComplete="email"
						required
						className="relative block w-full rounded-lg border border-[#31395c] bg-gradient-to-r from-[#131835] to-[#1a183d] px-4 py-3 text-white placeholder-slate-600 focus:z-10 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 sm:text-sm transition-colors duration-200"
						placeholder="入力"
					/>
					{state?.errors?.email && (
						<p className="mt-1.5 text-xs text-rose-400">
							{state.errors.email[0]}
						</p>
					)}
				</div>

				{/* パスワード入力 */}
				<PasswordInput
					id="password"
					name="password"
					autoComplete="current-password"
					required
					error={state?.errors?.password?.[0]}
				/>
			</div>

			<div>
				<button
					type="submit"
					disabled={pending}
					className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-[#00d2ff] to-[#0066ff] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,210,255,0.35)] hover:from-[#00e1ff] hover:to-[#0077ff] focus:outline-none focus:ring-2 focus:ring-[#00d2ff] focus:ring-offset-2 focus:ring-offset-[#030616] disabled:opacity-50 transition-all duration-200 cursor-pointer"
				>
					{pending ? (
						<span className="flex items-center gap-2">
							<svg
								className="h-4 w-4 animate-spin text-white"
								fill="none"
								viewBox="0 0 24 24"
								aria-label="読み込み中"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							処理中...
						</span>
					) : (
						"ログインする"
					)}
				</button>
			</div>
		</form>
	);
}
