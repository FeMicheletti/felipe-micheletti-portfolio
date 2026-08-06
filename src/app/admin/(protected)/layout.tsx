import { requireAdmin } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function ProtectedAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const admin = await requireAdmin();
	return (
		<AdminShell admin={admin}>
			{children}
		</AdminShell>
	);
}