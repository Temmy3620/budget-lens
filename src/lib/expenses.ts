export interface Expense {
	id: string;
	budgetId: string; // 予算カテゴリID
	amount: number;
	date: string; // "YYYY-MM-DD"
	memo: string;
	createdAt: string;
}

const STORAGE_KEY = "budget_lens_expenses";

// 初期モックデータ（ダッシュボード等にマッチする内容）
const INITIAL_EXPENSES: Expense[] = [
	{
		id: "exp-1",
		budgetId: "food",
		amount: 4520,
		date: "2026-06-20",
		memo: "スーパーマーケットライフ",
		createdAt: new Date("2026-06-20T18:30:00Z").toISOString(),
	},
	{
		id: "exp-2",
		budgetId: "transport",
		amount: 3000,
		date: "2026-06-19",
		memo: "モバイルSuicaチャージ",
		createdAt: new Date("2026-06-19T08:00:00Z").toISOString(),
	},
	{
		id: "exp-3",
		budgetId: "entertainment",
		amount: 2000,
		date: "2026-06-18",
		memo: "映画チケット (新宿バルト9)",
		createdAt: new Date("2026-06-18T15:00:00Z").toISOString(),
	},
	{
		id: "exp-4",
		budgetId: "food",
		amount: 1200,
		date: "2026-06-15",
		memo: "カフェ・ドトール",
		createdAt: new Date("2026-06-15T10:00:00Z").toISOString(),
	},
	{
		id: "exp-5",
		budgetId: "others",
		amount: 1500,
		date: "2026-06-10",
		memo: "ドラッグストアで日用品",
		createdAt: new Date("2026-06-10T14:20:00Z").toISOString(),
	},
];

/**
 * LocalStorageから全出費データを取得します
 */
export async function getExpenses(): Promise<Expense[]> {
	if (typeof window === "undefined") {
		return INITIAL_EXPENSES;
	}

	const data = localStorage.getItem(STORAGE_KEY);
	if (!data) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EXPENSES));
		return [...INITIAL_EXPENSES];
	}

	try {
		return JSON.parse(data);
	} catch (e) {
		console.error("Failed to parse expenses from localStorage", e);
		return INITIAL_EXPENSES;
	}
}

/**
 * 出費データをLocalStorageに保存します
 */
export async function saveExpenses(expenses: Expense[]): Promise<void> {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

/**
 * 新しい出費を追加します
 */
export async function addExpense(
	expenseData: Omit<Expense, "id" | "createdAt">,
): Promise<Expense> {
	const expenses = await getExpenses();
	const newExpense: Expense = {
		...expenseData,
		id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
		createdAt: new Date().toISOString(),
	};
	expenses.unshift(newExpense); // 先頭に追加（最新順）
	await saveExpenses(expenses);
	return newExpense;
}

/**
 * 指定したIDの出費を削除します
 */
export async function deleteExpense(id: string): Promise<void> {
	const expenses = await getExpenses();
	const filtered = expenses.filter((item) => item.id !== id);
	await saveExpenses(filtered);
}
