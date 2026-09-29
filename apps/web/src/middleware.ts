import { auth } from "@/auth";

/**
 * Gate the application routes. Marketing and auth pages stay public.
 * `auth` returns a redirect to the configured sign-in page when there is no
 * session, so unauthenticated requests never reach the page component.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = pathname.startsWith("/projects");

  if (isProtected && !req.auth) {
    const signIn = new URL("/login", req.nextUrl.origin);
    signIn.searchParams.set("next", pathname);
    return Response.redirect(signIn);
  }

  // Someone already signed in has no use for the auth screens.
  if (req.auth && (pathname === "/login" || pathname === "/register")) {
    return Response.redirect(new URL("/projects", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/projects/:path*", "/login", "/register"],
};
