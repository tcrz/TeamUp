import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";
import { projects } from "@/lib/api";
import { AppSidebar } from "@/components/app/app-sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // A failed refresh leaves a session that cannot call the API; start over.
  if (!session?.user || session.error) redirect("/login");

  // The sidebar lists projects on every app screen, so it is fetched here once.
  const list = await projects.list().catch(() => []);

  return (
    <div className="flex h-dvh overflow-hidden bg-field">
      <AppSidebar
        projects={list}
        user={{
          name: session.user.name ?? "You",
          email: session.user.email ?? "",
        }}
        signOut={
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              aria-label="Sign out"
              title="Sign out"
              className="rounded-sm p-1.5 text-slate transition-colors hover:bg-field hover:text-ink"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        }
      />

      <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
