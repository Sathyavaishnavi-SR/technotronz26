import { NextRequest, NextResponse } from "next/server"

/**
 * Logout API Route
 * 
 * Clears ALL auth cookies including leftover NextAuth cookies
 * to prevent silent re-authentication from old sessions.
 */

function clearAllAuthCookies(response: NextResponse) {
  // Clear custom JWT cookie
  response.cookies.set({
    name: "auth_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  })
  
  // Clear ALL NextAuth cookies (may still exist from old sessions)
  const nextAuthCookies = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.callback-url",
    "next-auth.csrf-token",
    "__Secure-next-auth.callback-url",
    "__Host-next-auth.csrf-token",
  ]
  
  nextAuthCookies.forEach(name => {
    response.cookies.set({
      name,
      value: "",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    })
  })
  
  // Prevent caching
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
  response.headers.set("Pragma", "no-cache")
  response.headers.set("Expires", "0")
}

export async function POST(request: NextRequest) {
  console.log("[Logout] Processing logout request")
  
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  })

  clearAllAuthCookies(response)
  console.log("[Logout] ✓ All auth cookies cleared")

  return response
}

export async function GET(request: NextRequest) {
  console.log("[Logout] Processing GET logout request")
  
  const response = NextResponse.redirect(new URL("/login", request.url))
  clearAllAuthCookies(response)
  console.log("[Logout] ✓ All auth cookies cleared, redirecting to /login")

  return response
}
