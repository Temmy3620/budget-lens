import { z } from "zod";

// パスワード再設定メール送信フォーム用バリデーションスキーマ
export const ForgotPasswordFormSchema = z.object({
	email: z
		.string()
		.email({ message: "有効なメールアドレスを入力してください。" })
		.trim(),
});
