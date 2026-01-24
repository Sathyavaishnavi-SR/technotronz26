import { NextRequest, NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { cookies } from "next/headers"

// Force dynamic rendering - NEVER cache this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * Session API - READ ONLY
 * 
 * CRITICAL RULES:
 * - ❌ DO NOT refresh token
 * - ❌ DO NOT reissue cookie  
 * - ❌ DO NOT extend lifetime
 * - ✅ Only READ existing cookie and return user data
 * - ✅ Return { user: null } if no valid auth
 */
export async function GET(request: NextRequest) {
  // Prevent caching of session response
  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "Pragma": "no-cache",
  }

  try {
    const cookieStore = await cookies()
    
    // Check if auth_token cookie exists
    const authToken = cookieStore.get("auth_token")
    if (!authToken?.value) {
      return NextResponse.json({ user: null }, { status: 200, headers })
    }
    
    const auth = getAuthFromCookies(cookieStore)

    if (!auth) {
      return NextResponse.json({ user: null }, { status: 200, headers })
    }

    await connectDB()

    const user = await User.findById(auth.userId).select("-passwordHash")
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200, headers })
    }

    // DO NOT set any cookies here - read only!
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        tzId: user.tzId,
        registrationCompleted: user.registrationCompleted,
        role: user.role,
        eventsRegistered: user.eventsRegistered || [],
        workshopsRegistered: user.workshopsRegistered || [],
      },
    }, { headers })
  } catch (error) {
    console.error("[Session API] Error:", error)
    return NextResponse.json({ user: null }, { status: 200, headers })
  }
}
