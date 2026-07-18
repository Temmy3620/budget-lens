import type { BudgetSetting } from "@/components/budgets/types";
import type { Expense } from "@/lib/supabase/expenses";

export interface MonthlyHistorySummary {
	month: number; // 1 〜 12
	totalBudget: number;
	totalSpent: number;
	budgets: BudgetSetting[];
	expenses: Expense[];
}

export interface YearHistory {
	year: number;
	months: MonthlyHistorySummary[];
}

export const MOCK_HISTORY_DATA: YearHistory[] = [
	{
		year: 2026,
		months: [
			{
				month: 7,
				totalBudget: 180000,
				totalSpent: 156000, // 予算内
				budgets: [
					{
						id: "b1",
						name: "食費",
						budget: 60000,
						color: "from-blue-500 to-indigo-400",
					},
					{
						id: "b2",
						name: "住居・光熱費",
						budget: 80000,
						color: "from-purple-500 to-pink-400",
					},
					{
						id: "b3",
						name: "交際費",
						budget: 25000,
						color: "from-orange-500 to-amber-400",
					},
					{
						id: "b4",
						name: "雑費",
						budget: 15000,
						color: "from-emerald-500 to-green-400",
					},
				],
				expenses: [
					{
						id: "e201",
						budgetId: "b1",
						amount: 48000,
						date: "2026-07-02",
						memo: "食材スーパー購入分",
						createdAt: "2026-07-02T12:00:00Z",
					},
					{
						id: "e202",
						budgetId: "b2",
						amount: 78000,
						date: "2026-07-25",
						memo: "家賃・水道代",
						createdAt: "2026-07-25T10:00:00Z",
					},
					{
						id: "e203",
						budgetId: "b3",
						amount: 20000,
						date: "2026-07-15",
						memo: "同僚とのディナー",
						createdAt: "2026-07-15T19:00:00Z",
					},
					{
						id: "e204",
						budgetId: "b4",
						amount: 10000,
						date: "2026-07-28",
						memo: "雑貨・消耗品",
						createdAt: "2026-07-28T15:00:00Z",
					},
				],
			},
			{
				month: 6,
				totalBudget: 150000,
				totalSpent: 162000, // 超過
				budgets: [
					{
						id: "b1",
						name: "食費",
						budget: 50000,
						color: "from-blue-500 to-indigo-400",
					},
					{
						id: "b2",
						name: "住居・光熱費",
						budget: 70000,
						color: "from-purple-500 to-pink-400",
					},
					{
						id: "b3",
						name: "交際費",
						budget: 20000,
						color: "from-orange-500 to-amber-400",
					},
					{
						id: "b4",
						name: "雑費",
						budget: 10000,
						color: "from-emerald-500 to-green-400",
					},
				],
				expenses: [
					{
						id: "e101",
						budgetId: "b1",
						amount: 46000,
						date: "2026-06-05",
						memo: "スーパーまとめ買い",
						createdAt: "2026-06-05T12:00:00Z",
					},
					{
						id: "e102",
						budgetId: "b2",
						amount: 72000,
						date: "2026-06-25",
						memo: "家賃および電気代超過分",
						createdAt: "2026-06-25T10:00:00Z",
					},
					{
						id: "e103",
						budgetId: "b3",
						amount: 28000,
						date: "2026-06-18",
						memo: "友人の結婚お祝い＆食事会",
						createdAt: "2026-06-18T19:00:00Z",
					},
					{
						id: "e104",
						budgetId: "b4",
						amount: 16000,
						date: "2026-06-20",
						memo: "夏物衣服の購入",
						createdAt: "2026-06-20T15:00:00Z",
					},
				],
			},
			{
				month: 5,
				totalBudget: 150000,
				totalSpent: 145000, // 予算内
				budgets: [
					{
						id: "b1",
						name: "食費",
						budget: 50000,
						color: "from-blue-500 to-indigo-400",
					},
					{
						id: "b2",
						name: "住居・光熱費",
						budget: 70000,
						color: "from-purple-500 to-pink-400",
					},
					{
						id: "b3",
						name: "交際費",
						budget: 20000,
						color: "from-orange-500 to-amber-400",
					},
					{
						id: "b4",
						name: "雑費",
						budget: 10000,
						color: "from-emerald-500 to-green-400",
					},
				],
				expenses: [
					{
						id: "e01",
						budgetId: "b1",
						amount: 43000,
						date: "2026-05-10",
						memo: "食費",
						createdAt: "2026-05-10T12:00:00Z",
					},
					{
						id: "e02",
						budgetId: "b2",
						amount: 69000,
						date: "2026-05-25",
						memo: "家賃・光熱費",
						createdAt: "2026-05-25T10:00:00Z",
					},
					{
						id: "e03",
						budgetId: "b3",
						amount: 18000,
						date: "2026-05-04",
						memo: "GWのレジャー・食事",
						createdAt: "2026-05-04T19:00:00Z",
					},
					{
						id: "e04",
						budgetId: "b4",
						amount: 15000,
						date: "2026-05-18",
						memo: "日用品と書籍",
						createdAt: "2026-05-18T15:00:00Z",
					},
				],
			},
		],
	},
	{
		year: 2025,
		months: [
			{
				month: 12,
				totalBudget: 180000,
				totalSpent: 195000, // 超過
				budgets: [
					{
						id: "b1",
						name: "食費",
						budget: 60000,
						color: "from-blue-500 to-indigo-400",
					},
					{
						id: "b2",
						name: "住居・光熱費",
						budget: 70000,
						color: "from-purple-500 to-pink-400",
					},
					{
						id: "b3",
						name: "交際費",
						budget: 40000,
						color: "from-orange-500 to-amber-400",
					},
					{
						id: "b4",
						name: "雑費",
						budget: 10000,
						color: "from-emerald-500 to-green-400",
					},
				],
				expenses: [
					{
						id: "e1201",
						budgetId: "b1",
						amount: 55000,
						date: "2025-12-24",
						memo: "クリスマス料理買い出し",
						createdAt: "2025-12-24T12:00:00Z",
					},
					{
						id: "e1202",
						budgetId: "b2",
						amount: 70000,
						date: "2025-12-25",
						memo: "家賃等",
						createdAt: "2025-12-25T10:00:00Z",
					},
					{
						id: "e1203",
						budgetId: "b3",
						amount: 62000,
						date: "2025-12-31",
						memo: "忘年会・帰省関連費用の超過",
						createdAt: "2025-12-31T19:00:00Z",
					},
					{
						id: "e1204",
						budgetId: "b4",
						amount: 8000,
						date: "2025-12-28",
						memo: "大掃除用具等",
						createdAt: "2025-12-28T15:00:00Z",
					},
				],
			},
		],
	},
];
