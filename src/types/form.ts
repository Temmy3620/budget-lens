/**
 * Next.jsのuseActionState (または useFormState) で使用される
 * 共通のフォーム状態 (FormState) 型の定義。
 * ジェネリクス `<T>` を指定することで、特定の入力フィールドに対応するエラーの型を安全に宣言できます。
 */
export type FormState<T = Record<string, string[] | undefined>> =
	| {
			errors?: T & {
				_form?: string[];
			};
			message?: string;
			success?: boolean;
	  }
	| undefined;
