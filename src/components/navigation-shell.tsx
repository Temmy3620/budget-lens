"use client";

import { useEffect, useState } from "react";
import Header from "./navigation/header";
import Sidebar from "./navigation/sidebar";
import { fetchCurrentUser } from "@/lib/users-client";

interface NavigationShellProps {
	children: React.ReactNode;
	userEmail?: string;
}

export default function NavigationShell({
	children,
	userEmail,
}: NavigationShellProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [userName, setUserName] = useState<string>("");

	useEffect(() => {
		async function loadUser() {
			const user = await fetchCurrentUser();
			if (user?.name) {
				setUserName(user.name);
			}
		}
		loadUser();
	}, []);

	return (
		<div className="min-h-screen bg-[#030616] text-white flex flex-col">
			<Header
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				userEmail={userEmail}
				userName={userName}
			/>
			<Sidebar
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				userEmail={userEmail}
				userName={userName}
			/>

			{/* メインコンテンツエリア */}
			<div className="flex-1 flex flex-col relative z-0">{children}</div>
		</div>
	);
}
