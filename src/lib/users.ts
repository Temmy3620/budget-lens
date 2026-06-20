import { supabase } from "./supabase";

export interface User {
	id: string;
	name: string;
	email: string;
	createdAt: string;
}

// Supabase からユーザー一覧を取得
export async function getUsers(): Promise<User[]> {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.order("created_at", { ascending: true });

	if (error) {
		throw error;
	}

	return (data || []).map((user) => ({
		id: user.id,
		name: user.name,
		email: user.email,
		createdAt: user.created_at,
	}));
}