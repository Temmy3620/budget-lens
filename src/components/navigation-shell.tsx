"use client";

import { useState } from "react";
import Header from "./navigation/header";
import Sidebar from "./navigation/sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";

interface NavigationShellProps {
	children: React.ReactNode;
	userEmail?: string;
}

export default function NavigationShell({
	children,
	userEmail,
}: NavigationShellProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { user } = useCurrentUser();
	const userName = user?.name ?? "";

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
