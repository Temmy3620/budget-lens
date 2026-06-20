export interface BudgetSetting {
	id: string;
	name: string;
	budget: number;
	color: string;
}

export interface ColorVariant {
	value: string;
	label: string;
}

export const COLOR_VARIANTS: ColorVariant[] = [
	{ value: "from-orange-500 to-amber-400", label: "オレンジ" },
	{ value: "from-blue-500 to-indigo-400", label: "ブルー" },
	{ value: "from-cyan-500 to-teal-400", label: "シアン" },
	{ value: "from-purple-500 to-pink-400", label: "パープル" },
	{ value: "from-emerald-500 to-green-400", label: "エメラルド" },
];
