import type { BudgetSetting } from "@/components/budgets/types";

const MOCK_BUDGETS: BudgetSetting[] = [
	{
		id: "food",
		name: "食費",
		budget: 80000,
		color: "from-orange-500 to-amber-400",
		memo: "スーパー、コンビニ、外食、カフェ代など",
	},
	{
		id: "rent",
		name: "住宅・光熱費",
		budget: 120000,
		color: "from-blue-500 to-indigo-400",
		memo: "家賃、電気・ガス・水道代、インターネット回線など",
	},
	{
		id: "transport",
		name: "交通費",
		budget: 20000,
		color: "from-cyan-500 to-teal-400",
		memo: "電車・バス運賃、タクシー、ガソリン代など",
	},
	{
		id: "entertainment",
		name: "娯楽・エンタメ",
		budget: 30000,
		color: "from-purple-500 to-pink-400",
		memo: "書籍、映画、ゲーム、旅行、趣味の支出など",
	},
	{
		id: "others",
		name: "その他・雑費",
		budget: 50000,
		color: "from-emerald-500 to-green-400",
		memo: "日用品、衣服、医療費、美容、その他の不定期な支出",
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
