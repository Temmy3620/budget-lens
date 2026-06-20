import DashboardClient from "@/components/dashboard/dashboard-client";
import { getCurrentUser } from "@/lib/dal";

export const metadata = {
	title: "ダッシュボード - Budget Lens",
	description:
		"今月の残り予算や最近の支出履歴、カテゴリ別支出割合を確認できます。",
};

export default async function DashboardPage() {
	const user = await getCurrentUser();

	return <DashboardClient user={user} />;
}
