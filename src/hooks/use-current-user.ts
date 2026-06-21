"use client";

import { useEffect, useState } from "react";
import type { User } from "@/lib/supabase/users";

export function useCurrentUser() {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let isMounted = true;

		async function fetchUser() {
			try {
				const response = await fetch("/api/user/me");
				if (!response.ok) {
					// 401 Unauthorized などの場合はログインしていないとみなす
					if (isMounted) {
						setUser(null);
					}
					return;
				}
				const data = await response.json();
				if (isMounted) {
					setUser(data);
				}
			} catch (err) {
				console.error("Failed to fetch current user:", err);
				if (isMounted) {
					setError(err as Error);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		fetchUser();

		return () => {
			isMounted = false;
		};
	}, []);

	return { user, isLoading, error };
}
