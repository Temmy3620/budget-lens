import { createClient } from "./server";
import { getCurrentUser } from "./dal";
import type { MonthlyHistorySummary } from "@/components/history/types";
import type { BudgetSetting } from "@/components/budgets/types";
import type { Expense } from "./expenses";

interface SnapshotCategory {
	id: string;
	name: string;
	budget?: number;
	amount?: number;
	color: string;
	memo?: string;
}

/**
 * 指定された年月の履歴データ（予算スナップショットと実支出データ）を取得する
 * @param year 対象の年
 * @param month 対象の月 (1-12)
 */
export async function getHistoryData(
	year: number,
	month: number,
): Promise<MonthlyHistorySummary | null> {
	// 日本時間 (JST) での現在年・月を取得し、未来の月（今月以降）は振り返り対象外にする
	const nowJST = new Date(
		new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
	);
	const currentYear = nowJST.getFullYear();
	const currentMonth = nowJST.getMonth() + 1; // 1-12

	if (year > currentYear || (year === currentYear && month >= currentMonth)) {
		return null;
	}

	const user = await getCurrentUser();
	if (!user) {
		return null;
	}

	const supabase = await createClient();

	// 1. 指定された年・月の「月末日の23:59:59」(JST)のタイムスタンプを算出
	const lastDay = new Date(year, month, 0).getDate();
	const pad = (num: number) => String(num).padStart(2, "0");
	const jstString = `${year}-${pad(month)}-${pad(lastDay)}T23:59:59+09:00`;
	const endTimestamp = new Date(jstString).toISOString();

	// 2. その日時以前に保存された budget_histories の中から、指定ユーザーの最新の1件を取得
	const { data: historyData, error: historyError } = await supabase
		.from("budget_histories")
		.select("*")
		.eq("user_id", user.id)
		.lte("created_at", endTimestamp)
		.order("created_at", { ascending: false })
		.limit(1)
		.maybeSingle();

	if (historyError) {
		console.error("Failed to fetch budget history snapshot:", historyError);
		throw historyError;
	}

	// 履歴データ（予算スナップショット）が存在しない場合は null を返す
	if (!historyData) {
		return null;
	}

	// 3. 指定された年・月内に発生した expenses（出費）を取得
	const startDate = `${year}-${pad(month)}-01`;
	const endDate = `${year}-${pad(month)}-${pad(lastDay)}`;

	const { data: expensesData, error: expensesError } = await supabase
		.from("expenses")
		.select("*")
		.eq("user_id", user.id)
		.gte("date", startDate)
		.lte("date", endDate)
		.order("date", { ascending: false })
		.order("created_at", { ascending: false });

	if (expensesError) {
		console.error("Failed to fetch expenses for history:", expensesError);
		throw expensesError;
	}

	// JSONスナップショットの復元 (amount / budget の両方に対応)
	const snapshotList =
		(historyData.categories_snapshot as unknown as SnapshotCategory[]) || [];
	const budgets: BudgetSetting[] = snapshotList.map((b) => ({
		id: b.id,
		name: b.name,
		budget: b.budget ?? b.amount ?? 0,
		color: b.color,
		memo: b.memo || undefined,
	}));

	// 出費データをフロントエンド用モデルにマッピング
	const expenses: Expense[] = (expensesData || []).map((row) => ({
		id: row.id,
		budgetId: row.budget_id || "",
		amount: row.amount,
		date: row.date,
		memo: row.memo || "",
		createdAt: row.created_at,
	}));

	// 実際の支出合計の計算
	const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

	return {
		month,
		totalBudget: historyData.total_amount,
		totalSpent,
		budgets,
		expenses,
	};
}

/**
 * 指定された年の各月（1〜12月）の履歴サマリーを取得する
 * @param year 対象の年
 */
export async function getYearlyHistoryList(
	year: number,
): Promise<MonthlyHistorySummary[]> {
	const user = await getCurrentUser();
	if (!user) {
		return [];
	}

	const supabase = await createClient();
	const pad = (num: number) => String(num).padStart(2, "0");

	const summaries: MonthlyHistorySummary[] = [];

	// 日本時間 (JST) での現在年・月を取得し、未来の月（今月以降）を振り返り対象外にする
	const nowJST = new Date(
		new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
	);
	const currentYear = nowJST.getFullYear();
	const currentMonth = nowJST.getMonth() + 1; // 1-12

	// 1月〜12月をループ
	for (let month = 1; month <= 12; month++) {
		// 未来の月（今年かつ現在月以降、または来年以降）はスキップ
		if (year > currentYear || (year === currentYear && month >= currentMonth)) {
			continue;
		}

		const lastDay = new Date(year, month, 0).getDate();
		const jstString = `${year}-${pad(month)}-${pad(lastDay)}T23:59:59+09:00`;
		const endTimestamp = new Date(jstString).toISOString();

		// 月末時点での最新の予算履歴スナップショットを取得
		const { data: historyData, error: historyError } = await supabase
			.from("budget_histories")
			.select("total_amount, categories_snapshot")
			.eq("user_id", user.id)
			.lte("created_at", endTimestamp)
			.order("created_at", { ascending: false })
			.limit(1)
			.maybeSingle();

		if (historyError) {
			console.error(
				`Failed to fetch budget history for month ${month}:`,
				historyError,
			);
			continue;
		}

		// スナップショットが無い月は、データ未作成としてスキップする
		if (!historyData) {
			continue;
		}

		// その月内の出費額を取得して合計
		const startDate = `${year}-${pad(month)}-01`;
		const endDate = `${year}-${pad(month)}-${pad(lastDay)}`;
		const { data: expensesData, error: expensesError } = await supabase
			.from("expenses")
			.select("amount")
			.eq("user_id", user.id)
			.gte("date", startDate)
			.lte("date", endDate);

		if (expensesError) {
			console.error(
				`Failed to fetch expenses for month ${month}:`,
				expensesError,
			);
			continue;
		}

		const totalSpent = (expensesData || []).reduce(
			(sum, e) => sum + e.amount,
			0,
		);

		// スナップショットのカテゴリ復元
		const snapshotList =
			(historyData.categories_snapshot as unknown as SnapshotCategory[]) || [];
		const budgets: BudgetSetting[] = snapshotList.map((b) => ({
			id: b.id,
			name: b.name,
			budget: b.budget ?? b.amount ?? 0,
			color: b.color,
			memo: b.memo || undefined,
		}));

		summaries.push({
			month,
			totalBudget: historyData.total_amount,
			totalSpent,
			budgets,
			expenses: [], // 一覧では出費一覧配列の中身自体は不要なため空配列
		});
	}

	return summaries;
}

/**
 * ログインユーザーの履歴データが存在する年の一覧を取得する（降順）
 */
export async function getAvailableYears(): Promise<number[]> {
	const user = await getCurrentUser();
	if (!user) {
		return [new Date().getFullYear()];
	}

	const supabase = await createClient();

	const { data, error } = await supabase
		.from("budget_histories")
		.select("created_at")
		.eq("user_id", user.id);

	if (error || !data || data.length === 0) {
		return [new Date().getFullYear()];
	}

	const nowJST = new Date(
		new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
	);
	const currentYear = nowJST.getFullYear();

	const years = data
		.map((item) => new Date(item.created_at).getFullYear())
		.filter((y) => y <= currentYear);
	const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a);

	return uniqueYears;
}
