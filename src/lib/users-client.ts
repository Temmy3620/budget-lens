import type { User } from "./supabase/users";

// クライアントサイドから現在のログインユーザーのプロファイルを取得する
export async function fetchCurrentUser(): Promise<User | null> {
	try {
		const response = await fetch("/api/user/me");
		if (!response.ok) {
			return null;
		}
		return await response.json();
	} catch (error) {
		console.error("Failed to fetch current user:", error);
		return null;
	}
}
