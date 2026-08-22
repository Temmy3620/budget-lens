import { z } from "zod";

// パスワード変更フォーム用バリデーションスキーマ
export const ResetPasswordFormSchema = z
	.object({
		password: z
			.string()
			.min(6, { message: "パスワードは6文字以上である必要があります。" })
			.trim(),
		confirmPassword: z
			.string()
			.min(6, { message: "パスワードは6文字以上である必要があります。" })
			.trim(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "パスワードが一致しません。",
		path: ["confirmPassword"],
	});
