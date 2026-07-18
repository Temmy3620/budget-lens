"use client";

import { useEffect, useState } from "react";
import type { BudgetSetting } from "@/components/budgets/types";
import { getBudgets } from "@/lib/supabase/budgets";
import { type Expense, getExpenses } from "@/lib/supabase/expenses";
import { CategorySpentChart } from "@/components/ui/category-spent-chart";
import { DashboardStats } from "./dashboard-stats";
import { RecentExpenses } from "./recent-expenses";

interface DashboardClientProps {
	user: {
		id: string;
		email: string;
	} | null;
}

export default function DashboardClient({ user }: DashboardClientProps) {
	const [budgets, setBudgets] = useState<BudgetSetting[]>([]);
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadData() {
			if (!user) return;
			try {
				const [budgetsData, expensesData] = await Promise.all([
					getBudgets(user.id),
					getExpenses(user.id),
				]);
				setBudgets(budgetsData);
				setExpenses(expensesData);
			} catch (error) {
				console.error("Failed to load dashboard data:", error);
			} finally {
				setIsLoading(false);
			}
		}
		loadData();
	}, [user]);

	if (isLoading) {
		return (
			<main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8 animate-pulse">
				{/* ウェルカムセクションのプレースホルダー */}
				<div className="h-48 bg-white/5 rounded-3xl w-full" />
				{/* クイック統計のプレースホルダー */}
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					<div className="h-32 bg-white/5 rounded-2xl w-full" />
					<div className="h-32 bg-white/5 rounded-2xl w-full" />
					<div className="h-32 bg-white/5 rounded-2xl w-full" />
				</div>
				{/* 二段目のグリッドのプレースホルダー */}
				<div className="grid gap-8 lg:grid-cols-3">
					<div className="lg:col-span-2 h-96 bg-white/5 rounded-2xl w-full" />
					<div className="h-96 bg-white/5 rounded-2xl w-full" />
				</div>
			</main>
		);
	}

	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonthNum = now.getMonth() + 1;
	const currentMonthStr = `${currentYear}-${String(currentMonthNum).padStart(2, "0")}`;

	// 先月
	const lastMonthYear = currentMonthNum === 1 ? currentYear - 1 : currentYear;
	const lastMonthNum = currentMonthNum === 1 ? 12 : currentMonthNum - 1;
	const lastMonthStr = `${lastMonthYear}-${String(lastMonthNum).padStart(2, "0")}`;

	// 当月の出費
	const thisMonthExpenses = expenses.filter((e) =>
		e.date.startsWith(currentMonthStr),
	);
	// 先月の出費
	const lastMonthExpenses = expenses.filter((e) =>
		e.date.startsWith(lastMonthStr),
	);

	return (
		<main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
			{/* ウェルカムセクション */}
			<div className="relative rounded-3xl border border-white/5 bg-gradient-to-br from-[#0c1435]/60 to-[#05091e]/80 p-8 md:p-10 overflow-hidden shadow-2xl backdrop-blur-xl">
				<div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
				<div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

				<div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
					<div>
						<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
							おかえりなさい
						</h1>
						<p className="mt-2 text-slate-400 max-w-xl text-sm md:text-base leading-relaxed">
							Budget Lens
							はあなたの収支をリアルタイムで追跡し、スマートな予算管理をサポートします。今月の財務ステータスを確認しましょう。
						</p>
					</div>
					<div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 self-start md:self-auto backdrop-blur-md">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
							{user?.email ? user.email.slice(0, 2).toUpperCase() : "U"}
						</div>
						<div>
							<div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
								Account
							</div>
							<div className="text-sm font-semibold text-slate-200 truncate max-w-[180px]">
								{user?.email}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* クイック統計 */}
			<DashboardStats
				budgets={budgets}
				thisMonthExpenses={thisMonthExpenses}
				lastMonthExpenses={lastMonthExpenses}
			/>

			{/* 二段目のグリッド */}
			<div className="grid gap-8 lg:grid-cols-3">
				{/* 最近の支出履歴 (2カラム幅) */}
				<RecentExpenses
					budgets={budgets}
					thisMonthExpenses={thisMonthExpenses}
				/>

				{/* カテゴリ別支出割合 (1カラム幅) */}
				<CategorySpentChart
					budgets={budgets}
					thisMonthExpenses={thisMonthExpenses}
				/>
			</div>
		</main>
	);
}
