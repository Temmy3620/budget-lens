import BudgetsClient from "@/components/budgets/budgets-client";

export const metadata = {
	title: "予算設定 - Budget Lens",
	description:
		"管理したいカテゴリを自由に入力して追加し、それぞれの月間予算を設定します。",
};

export default function BudgetsPage() {
	return <BudgetsClient />;
}
