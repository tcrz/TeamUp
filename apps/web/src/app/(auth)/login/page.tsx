"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginAction, type AuthFormState } from "../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(loginAction, {});
  const [next, setNext] = useState("/projects");

  /* Carry ?next= through, so a gated link returns you where you were headed. */
  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get("next");
    if (target?.startsWith("/")) setNext(target);
  }, []);

  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="display text-xl text-ink">Sign in</h1>
        <p className="text-base text-graphite">
          Your boards are where you left them.
        </p>
      </div>

      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />

        <Field label="Email">
          <Input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={Boolean(state.error)}
            required
          />
        </Field>

        <Field label="Password">
          <Input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={Boolean(state.error)}
            required
          />
        </Field>

        {state.error ? (
          <p role="alert" className="text-[14px] text-alert">
            {state.error}
          </p>
        ) : null}

        <Button type="submit" disabled={pending} className="mt-2 h-11 w-full text-[15px]">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-8 text-[14px] text-graphite">
        No account?{" "}
        <Link href="/register" className="font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-ink">
          Create one
        </Link>
      </p>
    </>
  );
}
