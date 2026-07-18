import HistoryDetailClient from "@/components/history/history-detail/history-detail-client";
import { getHistoryData } from "@/lib/supabase/history";

interface HistoryDetailParams {
	params: Promise<{
		year: string;
		month: string;
	}>;
}

export async function generateMetadata({ params }: HistoryDetailParams) {
	const { year, month } = await params;
	return {
		title: `${year}年${month}月の振り返り - Budget Lens`,
		description: `${year}年${month}月の予算設定に対する消化状況と出費明細を分析します。`,
	};
}

export default async function HistoryDetailPage({
	params,
}: HistoryDetailParams) {
	const { year, month } = await params;
	const yearNum = Number.parseInt(year, 10);
	const monthNum = Number.parseInt(month, 10);

	const historyData = await getHistoryData(yearNum, monthNum);

	return (
		<HistoryDetailClient
			year={yearNum}
			month={monthNum}
			initialData={historyData}
		/>
	);
}
