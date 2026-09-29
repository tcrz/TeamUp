import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api";

type LoginData = {
  user: { id: number; name: string; email: string };
  accessToken: string;
  refreshToken: string;
};

/**
 * Reads `exp` out of a JWT without verifying it. Safe here because the token
 * came straight from our own API over a server-to-server call — this only
 * decides when to refresh, never whether to trust.
 */
function expiryOf(accessToken: string): number {
  try {
    const [, payload] = accessToken.split(".");
    const { exp } = JSON.parse(Buffer.from(payload!, "base64url").toString());
    return typeof exp === "number" ? exp * 1000 : 0;
  } catch {
    return 0;
  }
}

/**
 * Exchanges the stored refresh token for a new pair.
 *
 * The API rotates on every call and enforces single use, so a refresh token is
 * spent the moment this runs. Two server requests that refresh at the same
 * instant would race, and the loser is signed out. Refreshing five minutes
 * early makes that window small rather than closing it; a shared lock would be
 * the real fix if it ever bites.
 */
async function refreshTokens(refreshToken: string) {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { data: { accessToken: string; refreshToken: string } | null };
  return body.data ?? null;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          cache: "no-store",
        });
        if (!res.ok) return null;

        const body = (await res.json()) as { data: LoginData | null };
        const data = body.data;
        if (!data) return null;

        return {
          id: String(data.user.id),
          name: data.user.name,
          email: data.user.email,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Sign-in: store the API's tokens in the encrypted session cookie.
      if (user) {
        const u = user as typeof user & { accessToken: string; refreshToken: string };
        return {
          ...token,
          accessToken: u.accessToken,
          refreshToken: u.refreshToken,
          expiresAt: expiryOf(u.accessToken),
        };
      }

      const expiresAt = typeof token.expiresAt === "number" ? token.expiresAt : 0;
      if (Date.now() < expiresAt - 5 * 60 * 1000) return token;

      const refreshed =
        typeof token.refreshToken === "string" ? await refreshTokens(token.refreshToken) : null;

      if (!refreshed) {
        // Force a fresh sign-in rather than carrying a session that cannot call the API.
        return { ...token, accessToken: undefined, refreshToken: undefined, error: "RefreshFailed" };
      }

      return {
        ...token,
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
        expiresAt: expiryOf(refreshed.accessToken),
        error: undefined,
      };
    },

    /**
     * The access token is exposed here so server code can read it with `auth()`.
     *
     * Note this object is also what `/api/auth/session` returns, so the access
     * token is readable by browser JavaScript. The refresh token is deliberately
     * NOT included: a leak is then capped at one 6-hour access token rather than
     * a rotating 7-day chain.
     */
    async session({ session, token }) {
      if (session.user) session.user.id = token.sub ?? "";
      session.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
      session.error = typeof token.error === "string" ? token.error : undefined;
      return session;
    },
  },
});
