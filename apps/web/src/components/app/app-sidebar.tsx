"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/marketing/logo";
import type { Project } from "@/lib/api";

/**
 * Persistent workspace navigation. It holds only what exists: the projects and
 * you. Nothing here is a placeholder for a feature that has not been built.
 *
 * The active project is marked by a black bar at the left edge, the way a
 * platform sign marks where you are standing, rather than by a tinted fill.
 */
export function AppSidebar({
  projects,
  user,
  signOut,
}: {
  projects: Project[];
  user: { name: string; email: string };
  signOut: React.ReactNode;
}) {
  const pathname = usePathname();
  const onIndex = pathname === "/projects";

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-field-deep">
      <div className="px-5 pt-5 pb-6">
        <Link href="/projects" className="inline-block rounded-sm">
          <Logo />
        </Link>
      </div>

      <nav aria-label="Projects" className="flex min-h-0 flex-1 flex-col">
        <Link
          href="/projects"
          aria-current={onIndex ? "page" : undefined}
          className={cn(
            "relative flex items-baseline justify-between px-5 py-1.5 text-[14px] font-semibold transition-colors",
            onIndex ? "text-ink" : "text-graphite hover:text-ink",
          )}
        >
          {onIndex ? <ActiveBar /> : null}
          All projects
          <span className="keyline text-[12px] text-slate">{projects.length}</span>
        </Link>

        <ul className="mt-1 flex min-h-0 flex-1 flex-col overflow-y-auto pb-4">
          {projects.length === 0 ? (
            <li className="px-5 py-1.5 text-[13px] text-slate">Nothing here yet.</li>
          ) : (
            projects.map((project) => {
              const href = `/projects/${project.id}`;
              const active = pathname === href;
              return (
                <li key={project.id}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative block px-5 py-1.5 text-[14px] transition-colors",
                      active
                        ? "bg-surface font-semibold text-ink"
                        : "text-graphite hover:bg-field hover:text-ink",
                    )}
                  >
                    {active ? <ActiveBar /> : null}
                    <span className="block truncate">{project.name}</span>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      </nav>

      <div className="flex items-center gap-3 border-t border-rule px-5 py-4">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[13px] font-semibold text-ink">{user.name}</span>
          <span className="truncate text-[12px] text-slate">{user.email}</span>
        </div>
        {signOut}
      </div>
    </aside>
  );
}

function ActiveBar() {
  return <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-ink" />;
}
