import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	// 開発環境でビルドエラーを防ぐため、存在しない場合は仮の文字を入れつつ、コンソールで警告を出します
	console.warn(
		"Warning: Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are not defined.",
	);
}

export const supabase = createClient(
	supabaseUrl || "https://your-project.supabase.co",
	supabaseAnonKey || "your-anon-key",
);
