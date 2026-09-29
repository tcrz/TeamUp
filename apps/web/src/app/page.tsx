import Link from "next/link";
import { Logo } from "@/components/marketing/logo";
import { HeroBoard } from "@/components/landing/hero-board";
import { SignupForm } from "@/components/landing/signup-form";
import { cn } from "@/lib/cn";

/*
 * Straight from PRODUCT.md's positioning: the scope is the product. Each entry
 * names something a visitor's current tracker makes them set up, and says what
 * TeamUp does instead. Nothing here implies a feature that is not built.
 */
const LEFT_OUT = [
  {
    thing: "Workflow builder",
    instead:
      "Every issue is Todo, In progress, or Done. There is no state machine to design before your team can file its first issue.",
  },
  {
    thing: "Permission matrix",
    instead:
      "No roles, no schemes, no admin console. A project belongs to whoever made it.",
  },
  {
    thing: "Story points and velocity charts",
    instead:
      "An issue is done or it isn't. Nothing to estimate in planning and nothing to report upward afterwards.",
  },
  {
    thing: "Per-seat pricing",
    instead:
      "TeamUp is free and open source. Host it yourself, and the bill doesn't grow with the team.",
  },
];

/* Every call to action navigates, so they are links styled as buttons. */
const button =
  "inline-flex items-center justify-center rounded-sm font-semibold transition-colors duration-150 active:translate-y-px";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-field text-graphite">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-6">
        <Link href="/" className="rounded-sm">
          <Logo />
        </Link>
        <nav aria-label="Account" className="ml-auto flex items-center gap-5">
          <Link href="/login" className="text-[14px] font-semibold text-graphite hover:text-ink">
            Sign in
          </Link>
          {/* Outline, not yellow: the hero form owns the one signal button in view. */}
          <Link
            href="/register"
            className={cn(button, "h-9 border border-ink px-3.5 text-[14px] text-ink hover:bg-ink hover:text-surface")}
          >
            Create account
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero — the workflow, stated as the headline, then shown running. */}
        <section className="mx-auto w-full max-w-6xl px-6 pt-14 pb-20 lg:pt-20 lg:pb-28">
          <h1 className="display text-mark text-ink">
            <span className="block">Todo.</span>
            <span className="block">In progress.</span>
            <span className="block">Done.</span>
          </h1>

          <div className="mt-10 grid items-end gap-8 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
            <p className="max-w-[46ch] text-md text-graphite text-pretty">
              That&rsquo;s the whole workflow. TeamUp gives a small team projects,
              issues, and a board to move them across — and nothing to configure
              before the first issue goes on it.
            </p>
            <SignupForm />
          </div>

          <HeroBoard className="mt-14 lg:mt-20" />
        </section>

        {/* What's left out — the positioning, as a list you can check against your current tool. */}
        <section aria-labelledby="left-out" className="bg-surface">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[5fr_7fr] lg:gap-16 lg:py-28">
            <div>
              <h2 id="left-out" className="display max-w-[14ch] text-xl text-ink text-balance">
                What TeamUp leaves out, on purpose.
              </h2>
              <p className="mt-4 max-w-[40ch] text-base text-graphite">
                Most trackers have a setup phase before anyone files an issue.
                These are the parts that phase is made of.
              </p>
            </div>

            <dl className="border-t-2 border-ink">
              {LEFT_OUT.map((item) => (
                <div
                  key={item.thing}
                  className="grid gap-2 border-b border-rule py-6 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-8"
                >
                  <dt className="text-md font-semibold text-ink">{item.thing}</dt>
                  <dd className="max-w-[52ch] text-base text-graphite">{item.instead}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Closing call to action: the setup, stated in full. */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
          <h2 className="display max-w-[20ch] text-xl text-ink text-balance">
            Make an account, name a project, add an issue.
          </h2>
          <p className="mt-3 text-md text-graphite">That&rsquo;s the setup.</p>
          <Link
            href="/register"
            className={cn(button, "mt-8 h-12 bg-signal px-6 text-[15px] text-ink hover:bg-signal-deep")}
          >
            Create account
          </Link>
        </section>
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <Logo />
            <p className="text-[13px] text-slate">Free and open source. Host it yourself.</p>
          </div>
          <Link href="/login" className="text-[13px] font-semibold text-graphite hover:text-ink">
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  );
}
