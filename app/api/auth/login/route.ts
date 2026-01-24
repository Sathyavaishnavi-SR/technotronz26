import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import connectDB from "@/lib/db"
import User from "@/models/User"
import { signJWT } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    await connectDB()

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Create JWT
    const token = signJWT({
      userId: user._id.toString(),
      email: user.email,
      registrationCompleted: user.registrationCompleted,
    })

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        tzId: user.tzId,
        registrationCompleted: user.registrationCompleted,
      },
    })

    // CRITICAL: TRUE SESSION COOKIE - NO maxAge, NO expires
    // Cookie will be deleted when browser closes
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // NO maxAge - makes it a session cookie
      // NO expires - makes it a session cookie
    })

    // Clear any leftover NextAuth cookies
    response.cookies.delete("next-auth.session-token")
    response.cookies.delete("__Secure-next-auth.session-token")
    response.cookies.delete("next-auth.callback-url")
    response.cookies.delete("next-auth.csrf-token")

    console.log("[Login] ✓ Session cookie set (no expiry - browser session only)")

    return response
  } catch (error: any) {
    console.error("[Login API] Error:", error)
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    )
  }
}
