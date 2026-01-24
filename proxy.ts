import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJWTEdge } from "./lib/jwt-edge"

/**
 * Server-Side Proxy/Middleware for Authentication & Authorization
 * 
 * SECURITY: This runs on EVERY request before the page renders.
 * - Validates JWT token from cookies (using Edge-compatible jose library)
 * - Blocks unauthenticated access to protected routes
 * - Clears invalid/expired tokens
 * - Enforces registration completion
 * 
 * This is the ONLY security gate - client-side checks are for UX only.
 * 
 * Note: Uses verifyJWTEdge (jose) instead of verifyJWT (jsonwebtoken)
 * because this runs on Edge Runtime where Node.js crypto isn't available.
 */

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/about",
]

// API routes that don't require authentication
const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/session",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/payment/verify",
  "/api/payment/check-status",
]

// Routes that start with these prefixes are public
const PUBLIC_PREFIXES = [
  "/payment/",          // Payment pages (callback, success, failure)
  "/api/payment/",      // Payment API routes
  "/_next/",            // Next.js internals
  "/favicon",           // Favicon
]

function isPublicRoute(pathname: string): boolean {
  // Exact match for public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true
  }
  
  // Exact match for public API routes
  if (PUBLIC_API_ROUTES.includes(pathname)) {
    return true
  }
  
  // Prefix match
  if (PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return true
  }
  
  // Static files
  if (pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$/)) {
    return true
  }
  
  return false
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    console.log(`[Proxy Guard] ✓ Public route: ${pathname}`)
    return NextResponse.next()
  }
  
  // Get JWT token from cookies
  const token = request.cookies.get("auth_token")?.value
  
  // No token - clear any stale cookies and redirect to login
  if (!token) {
    console.log(`[Proxy Guard] ✗ No token, blocking: ${pathname}`)
    
    // Set callback URL for redirect after login
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    const response = NextResponse.redirect(loginUrl)
    
    // Clear any stale auth cookies
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
    
    return response
  }
  
  // Verify JWT token (async - uses jose for Edge compatibility)
  const payload = await verifyJWTEdge(token)
  
  // Invalid or expired token - clear cookie and redirect
  if (!payload) {
    console.log(`[Proxy Guard] ✗ Invalid/expired token, blocking: ${pathname}`)
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    const response = NextResponse.redirect(loginUrl)
    
    // Clear invalid token
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
    
    return response
  }
  
  // Token is valid - log access
  console.log(`[Proxy Guard] ✓ Authenticated: ${pathname}`, {
    userId: payload.userId?.substring(0, 8) + "...",
    email: payload.email,
    registrationCompleted: payload.registrationCompleted,
  })
  
  // Check if registration is required for this route
  const requiresRegistration = !pathname.startsWith("/register") && 
                                !pathname.startsWith("/api/user/complete-registration")
  
  // Redirect to register if registration not completed
  if (requiresRegistration && !payload.registrationCompleted) {
    console.log(`[Proxy Guard] ✗ Registration incomplete, redirect /register`)
    return NextResponse.redirect(new URL("/register", request.url))
  }
  
  // If already registered, redirect away from /register page
  if (pathname === "/register" && payload.registrationCompleted) {
    console.log(`[Proxy Guard] ✓ Already registered, redirect /events`)
    return NextResponse.redirect(new URL("/events", request.url))
  }
  
  // Access granted
  return NextResponse.next()
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
