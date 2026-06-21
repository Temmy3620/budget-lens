import { NextResponse } from "next/server";
import { getUsers } from "@/lib/supabase/users";

// GET /api/user - ユーザー一覧の取得
export async function GET() {
	try {
		const users = await getUsers();
		return NextResponse.json(users);
	} catch (error) {
		return NextResponse.json(
			{ error: "ユーザー一覧の取得に失敗しました" },
			{ status: 500 },
		);
	}
}
