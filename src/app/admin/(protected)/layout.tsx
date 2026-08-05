import { requireAdmin } from "@/lib/auth/session";

export default async function ProtectedAdminLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	await requireAdmin();

	return children;
}
