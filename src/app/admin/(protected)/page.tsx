import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/session";
import { logoutAction } from "./actions";

export default async function AdminPage() {
	const admin = await requireAdmin();

	return (
		<main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-50">
			<div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
				<div>
					<p className="text-sm text-zinc-400">Área administrativa</p>
					<h1 className="text-3xl font-semibold">Olá, {admin.name}</h1>
				</div>

				<form action={logoutAction}>
					<Button variant="outline" type="submit">
						Sair
					</Button>
				</form>
			</div>
		</main>
	);
}
