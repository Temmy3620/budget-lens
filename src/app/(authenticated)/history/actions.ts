"use server";

import { getYearlyHistoryList } from "@/lib/supabase/history";
import type { MonthlyHistorySummary } from "@/components/history/types";

/**
 * 指定された年の履歴データを取得する Server Action
 */
export async function getYearlyHistoryAction(
	year: number,
): Promise<MonthlyHistorySummary[]> {
	return await getYearlyHistoryList(year);
}
