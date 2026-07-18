import HistoryClient from "@/components/history/history-client";
import { getCurrentUser } from "@/lib/supabase/dal";

export const metadata = {
	title: "支出履歴 - Budget Lens",
	description: "過去の月別予算と実際の支出を確認し、家計の振り返りを行います。",
};

export default async function HistoryPage() {
	const user = await getCurrentUser();

	return <HistoryClient user={user} />;
}
