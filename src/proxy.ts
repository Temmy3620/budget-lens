import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
	return await updateSession(request);
}

export const config = {
	matcher: [
		/*
		 * 次のパス以外のすべてのリクエストパスにマッチさせます:
		 * - _next/static (静的ファイル)
		 * - _next/image (画像最適化ファイル)
		 * - favicon.ico (ファビコンファイル)
		 * - 画像やSVGなどのアセットファイル (拡張子)
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
