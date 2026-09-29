"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api";

export type AuthFormState = { error?: string };

/** Signs in through Auth.js, which calls the API and stores the tokens. */
export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/projects");

  if (!email || !password) return { error: "Enter your email and password." };

  try {
    await signIn("credentials", { email, password, redirectTo: next });
    return {};
  } catch (error) {
    // NEXT_REDIRECT is how a successful signIn navigates; let it through.
    if (error instanceof AuthError) return { error: "Those details did not match an account." };
    throw error;
  }
}

/** Creates the account, then signs straight in so nobody logs in twice. */
export async function registerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) return { error: "Fill in every field to continue." };

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    return { error: body?.message ?? "Could not create the account." };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/projects" });
    return {};
  } catch (error) {
    if (error instanceof AuthError) return { error: "Account created. Sign in to continue." };
    throw error;
  }
}
