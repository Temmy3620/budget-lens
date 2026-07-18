import HistoryClient from "@/components/history/history-client";
import {
	getAvailableYears,
	getYearlyHistoryList,
} from "@/lib/supabase/history";

export const metadata = {
	title: "支出履歴 - Budget Lens",
	description: "過去の月別予算と実際の支出を確認し、家計の振り返りを行います。",
};

export default async function HistoryPage() {
	// 履歴データが存在する年の一覧を取得
	const availableYears = await getAvailableYears();
	const defaultYear = availableYears[0] || new Date().getFullYear();

	// 初期表示する年（最新の年）の履歴データを取得
	const initialHistoryList = await getYearlyHistoryList(defaultYear);

	return (
		<HistoryClient
			availableYears={availableYears}
			initialHistoryList={initialHistoryList}
			defaultYear={defaultYear}
		/>
	);
}
