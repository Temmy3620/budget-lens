import { z } from "zod";

// フォーム入力バリデーションスキーマ
export const LoginFormSchema = z.object({
	email: z
		.string()
		.email({ message: "有効なメールアドレスを入力してください。" })
		.trim(),
	password: z
		.string()
		.min(6, { message: "パスワードは6文字以上である必要があります。" })
		.trim(),
});

export type FormState =
	| {
			errors?: {
				email?: string[];
				password?: string[];
				_form?: string[];
			};
			message?: string;
			success?: boolean;
	  }
	| undefined;
