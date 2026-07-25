import { type NextRequest, NextResponse } from 'next/server'

// Route protection for /dashboard, /profile, /settings, /my-learning and the
// login/register redirect-if-authenticated behaviour is enforced client-side
// (see components/auth/RequireAuth.tsx + components/providers/AuthProvider.tsx),
// not here.
//
// Why: the access token lives only in memory (Zustand), never in a cookie, by
// design (see security architecture notes). The refresh token IS a cookie,
// but it's set by the API origin (e.g. api.bytherix.com) with
// Path=/api/v1/auth, scoped to that origin — the browser never attaches it to
// requests to the web origin, so this edge function has no reliable signal to
// verify here. A previous version of this file checked for a cookie named
// "accessToken" that the API never actually sets, which caused every visit to
// a protected route to redirect to /login regardless of session state.
//
// If session state ever needs to be readable at the edge (e.g. for
// prerendering personalised content), the fix is to set the refresh cookie's
// Domain to the shared parent domain (`.bytherix.com`) or proxy /api/* through
// the same origin as the web app — not to reintroduce a cookie the API never
// issues.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function proxy(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}