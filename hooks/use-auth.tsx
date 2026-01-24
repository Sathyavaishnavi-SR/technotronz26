"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState, useCallback } from "react"

interface User {
  id: string
  name: string
  email: string
  tzId: string
  registrationCompleted: boolean
  eventsRegistered: string[]
  workshopsRegistered: string[]
  payment?: {
    eventFeePaid: boolean
    eventFeeAmount: number
    workshopsPaid: string[]
  }
}

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  isLoading: boolean
  isInitialized: boolean  // New: true after first session check completes
  login: () => void
  logout: () => void
  refetch: () => Promise<void>
}

/**
 * Authentication Hook
 * 
 * IMPORTANT: This hook is for CLIENT-SIDE UX only.
 * Server-side middleware.ts handles actual security.
 * 
 * - isLoading: true while checking session
 * - isInitialized: true after first check (even if failed)
 * - user: null until authenticated
 * 
 * UI should NOT render authenticated content until isInitialized && user
 */
export function useAuth(): AuthContextType {
  const router = useRouter()
  const pathname = usePathname()
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true)
      console.log("[useAuth] Fetching session...")
      // Add timestamp to prevent any browser/proxy caching
      const response = await fetch(`/api/auth/session?t=${Date.now()}`, {
        credentials: "include",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      })
      
      console.log("[useAuth] Session response status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log("[useAuth] Session data:", data)
        if (data.user) {
          setUserData(data.user)
          console.log("[useAuth] User set:", data.user.email)
        } else {
          setUserData(null)
          console.log("[useAuth] No user in response")
        }
      } else {
        setUserData(null)
        console.log("[useAuth] Response not ok")
      }
    } catch (error) {
      console.error("[useAuth] Error fetching session:", error)
      setUserData(null)
    } finally {
      setLoading(false)
      setInitialized(true)
      console.log("[useAuth] Initialized, loading complete")
    }
  }, [])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  const login = useCallback(() => {
    const callbackUrl = pathname !== "/login" ? pathname : "/events"
    router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
    // After navigation, refetch session to update UI
    setTimeout(() => {
      fetchUserData()
    }, 300)
  }, [router, pathname, fetchUserData])

  const logout = useCallback(async () => {
    try {
      // Clear local state immediately for instant UI feedback
      setUserData(null)
      
      // Call logout API
      await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: "include",
      })
      
      // Force reload to clear any cached state and trigger middleware
      window.location.href = "/login"
    } catch (error) {
      console.error("[useAuth] Logout error:", error)
      // Even on error, force redirect to login
      window.location.href = "/login"
    }
  }, [])

  return {
    isLoggedIn: !!userData,
    user: userData,
    isLoading: loading,
    isInitialized: initialized,
    login,
    logout,
    refetch: fetchUserData,
  }
}
