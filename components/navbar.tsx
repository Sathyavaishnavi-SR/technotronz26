"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { ProfileDropdown } from "./profile-dropdown"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

/**
 * Navbar Component
 * 
 * SECURITY: Profile icon only renders when:
 * - Session check is complete (isInitialized)
 * - User is authenticated (user exists)
 * - Not on auth pages (/login, /register, /forgot-password)
 */
export function Navbar() {
  const { isLoggedIn, isLoading, isInitialized, user, login, refetch } = useAuth()
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  
  // Auth pages where we should never show profile
  const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password"].some(
    page => pathname.startsWith(page)
  )

  // Debug logging
  console.log("[Navbar] State:", { isLoggedIn, isLoading, isInitialized, hasUser: !!user, pathname })

  // Force a session refetch in the navbar whenever the route changes,
  // ensuring the profile icon appears immediately after login redirect.
  useEffect(() => {
    refetch()
  }, [pathname, refetch])

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side - Navigation links (hidden on home page) */}
        {!isHomePage ? (
          <div className="hidden sm:flex items-center gap-6 font-mono text-xs tracking-widest">
            <Link
              href="/"
              className={`hover:text-red-500 transition-colors ${pathname === "/" ? "text-red-600" : "text-gray-400"}`}
            >
              HOME
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  href="/events"
                  className={`hover:text-red-500 transition-colors ${pathname?.startsWith("/events") ? "text-red-600" : "text-gray-400"}`}
                >
                  EVENTS
                </Link>
                <Link
                  href="/about"
                  className={`hover:text-red-500 transition-colors ${pathname === "/about" ? "text-red-600" : "text-gray-400"}`}
                >
                  ABOUT
                </Link>
              </>
            )}
          </div>
        ) : (
          <div />
        )}

        {/* Right side - Profile or Sign In */}
        <div className="flex items-center gap-6">
          {/* Show loading indicator while checking auth */}
          {isLoading && !isInitialized && (
            <div className="w-10 h-10 rounded-full border-2 border-gray-600 animate-pulse" />
          )}
          
          {/* Show auth UI after initialization, never on auth pages */}
          {isInitialized && !isAuthPage && (
            <>
              {isLoggedIn && user ? (
                <ProfileDropdown />
              ) : (
                <button
                  onClick={login}
                  className="px-4 py-1.5 border border-red-600/50 text-red-500 text-[10px] sm:text-xs font-mono tracking-widest hover:bg-red-600/10 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
                >
                  SIGN IN
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
