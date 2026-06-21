import { verifySession } from "@/lib/supabase/dal";
import NavigationShell from "@/components/navigation-shell";

export default async function AuthenticatedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await verifySession();

	return (
		<NavigationShell userEmail={session.email}>{children}</NavigationShell>
	);
}
