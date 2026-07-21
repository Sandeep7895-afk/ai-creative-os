import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password", "/auth/callback"]

/**
 * Refreshes the Supabase session on every request and gates access to
 * dashboard routes. Admin-only routes are additionally checked against
 * the user's role, read from the `profiles` table.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isPublicRoute = PUBLIC_ROUTES.some((route) => path.startsWith(route))

  if (!user && !isPublicRoute) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("next", path)
    return NextResponse.redirect(redirectUrl)
  }

  if (user && path.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  if (user && isPublicRoute && !path.startsWith("/auth/callback")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}
