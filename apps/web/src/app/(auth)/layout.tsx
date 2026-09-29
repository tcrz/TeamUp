import Link from "next/link";
import { Logo } from "@/components/marketing/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <main className="flex flex-col bg-surface px-6 py-8 sm:px-12">
        <Link href="/" className="w-fit rounded-sm">
          <Logo />
        </Link>
        <div className="flex flex-1 items-center py-12">
          <div className="w-full max-w-95">{children}</div>
        </div>
        <p className="text-[13px] text-slate">Free and open source. Host it yourself.</p>
      </main>

      {/*
        The workflow, set as a wall sign. It is the same line as the landing
        page headline, so the product is recognisable from its type alone.
        Hidden on small screens, where it would only push the form down.
      */}
      <aside aria-hidden className="hidden flex-col justify-end bg-field px-12 pb-14 lg:flex">
        <p className="display text-[clamp(2.5rem,4.6vw,4.25rem)] leading-[0.94] text-ink">
          <span className="block">Todo.</span>
          <span className="block">In progress.</span>
          <span className="block">Done.</span>
        </p>
      </aside>
    </div>
  );
}
