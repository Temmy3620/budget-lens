import type { BudgetSetting } from "@/components/budgets/types";

const MOCK_BUDGETS: BudgetSetting[] = [
	{
		id: "food",
		name: "食費",
		budget: 80000,
		color: "from-orange-500 to-amber-400",
	},
	{
		id: "rent",
		name: "住宅・光熱費",
		budget: 120000,
		color: "from-blue-500 to-indigo-400",
	},
	{
		id: "transport",
		name: "交通費",
		budget: 20000,
		color: "from-cyan-500 to-teal-400",
	},
	{
		id: "entertainment",
		name: "娯楽・エンタメ",
		budget: 30000,
		color: "from-purple-500 to-pink-400",
	},
	{
		id: "others",
		name: "その他・雑費",
		budget: 50000,
		color: "from-emerald-500 to-green-400",
	},
];

/**
 * データベースから設定済み予算一覧を取得する非同期関数（現在はモックデータを返す）
 */
export async function getBudgets(): Promise<BudgetSetting[]> {
	// APIリクエストのネットワーク遅延をシミュレート
	await new Promise((resolve) => setTimeout(resolve, 100));
	return [...MOCK_BUDGETS];
}
