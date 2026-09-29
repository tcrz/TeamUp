"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Hero sign-up. Takes the email here and carries it to /register so the visitor
 * does not type it twice — the account is still created on the register page,
 * which owns validation and the API call.
 */
export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const query = email.trim() ? `?email=${encodeURIComponent(email.trim())}` : "";
    router.push(`/register${query}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="hero-email" className="sr-only">
          Work email
        </label>
        <input
          id="hero-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 min-w-0 rounded-sm border border-edge sm:flex-1 bg-surface px-4 text-[15px] text-ink outline-none placeholder:text-slate focus-visible:border-ink focus-visible:shadow-[inset_0_0_0_1px_var(--color-ink)]"
        />
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-sm bg-signal px-6 text-[15px] font-semibold text-ink transition-colors duration-150 hover:bg-signal-deep active:translate-y-px"
        >
          Create account
        </button>
      </div>
      <p className="text-[13px] text-slate">
        Free and open source. No credit card, no seat count.
      </p>
    </form>
  );
}
