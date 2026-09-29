"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerAction, type AuthFormState } from "../actions";

export default function RegisterPage() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(registerAction, {});
  const [email, setEmail] = useState("");

  /* The landing page's hero form carries the email here so it is typed once. */
  useEffect(() => {
    const carried = new URLSearchParams(window.location.search).get("email");
    if (carried) setEmail(carried);
  }, []);

  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="display text-xl text-ink">Create account</h1>
        <p className="text-base text-graphite">Then name a project and add the first issue.</p>
      </div>

      <form action={action} className="flex flex-col gap-4">
        <Field label="Name">
          <Input name="name" autoComplete="name" placeholder="Ada Lovelace" required />
        </Field>

        <Field label="Email">
          <Input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(state.error)}
            required
          />
        </Field>

        <Field label="Password">
          <Input
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            required
          />
        </Field>

        {state.error ? (
          <p role="alert" className="text-[14px] text-alert">
            {state.error}
          </p>
        ) : null}

        <Button type="submit" disabled={pending} className="mt-2 h-11 w-full text-[15px]">
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-8 text-[14px] text-graphite">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4 hover:decoration-ink">
          Sign in
        </Link>
      </p>
    </>
  );
}
