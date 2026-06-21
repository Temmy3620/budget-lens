import { createClient } from "./client";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface User {
	id: string;
	name: string;
	email: string;
	createdAt: string;
}

// Supabase からユーザー一覧を取得
export async function getUsers(): Promise<User[]> {
	const supabase = createClient();
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

// 特定のIDのユーザーを取得
export async function getUserById(
	id: string,
	client?: SupabaseClient,
): Promise<User | null> {
	const supabase = client ?? createClient();
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", id)
		.maybeSingle();

	if (error) {
		throw error;
	}

	if (!data) {
		return null;
	}

	return {
		id: data.id,
		name: data.name ?? "新規ユーザー",
		email: data.email,
		createdAt: data.created_at,
	};
}
