import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserById } from "@/lib/supabase/users";

export async function GET() {
	try {
		const supabase = await createClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json(
				{ error: "認証されていません" },
				{ status: 401 },
			);
		}

		const dbUser = await getUserById(user.id, supabase);
		if (!dbUser) {
			return NextResponse.json(
				{ error: "ユーザープロファイルが見つかりません" },
				{ status: 404 },
			);
		}

		return NextResponse.json(dbUser);
	} catch (error) {
		console.error("Failed to fetch current user profile:", error);
		return NextResponse.json(
			{ error: "ユーザー情報の取得に失敗しました" },
			{ status: 500 },
		);
	}
}
