import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import bcrypt from "bcrypt"
import connectDB from "@/lib/db"
import User from "@/models/User"
import PasswordResetToken from "@/models/PasswordResetToken"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    await connectDB()

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json({
        success: true,
        message: "If an account exists, a password reset link has been sent",
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const tokenHash = await bcrypt.hash(resetToken, 10)

    // Delete any existing reset tokens for this user
    await PasswordResetToken.deleteMany({ userId: user._id })

    // Create new reset token (expires in 1 hour)
    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    })

    // Return reset token (in production, this would be sent via email)
    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`

    return NextResponse.json({
      success: true,
      message: "Password reset token generated. Use the link below:",
      resetUrl, // In production, remove this and send via email
    })
  } catch (error: any) {
    console.error("[Forgot Password API] Error:", error)
    return NextResponse.json(
      { error: "Failed to process request. Please try again." },
      { status: 500 }
    )
  }
}
