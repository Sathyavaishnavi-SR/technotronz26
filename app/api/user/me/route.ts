import { NextResponse } from "next/server"
import { getAuthFromCookies } from "@/lib/auth"
import connectDB from "@/lib/db"
import User from "@/models/User"
import UserPayment from "@/models/UserPayment"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // FIX: cookies() is async in some Next.js setups, use await
    const cookieStore = await cookies()
    const auth = getAuthFromCookies(cookieStore)

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findById(auth.userId).select("-passwordHash")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch payment status (if you still need UserPayment)
    let paymentData = null
    const userPayment = await UserPayment.findOne({ userId: user._id })
    if (userPayment) {
      paymentData = {
        eventFeePaid: userPayment.eventFeePaid,
        eventFeeAmount: userPayment.eventFeeAmount,
        workshopsPaid: userPayment.workshopsPaid,
      }
    }

    // Use workshopPayments directly if it's already an object
    const workshopPayments =
      typeof user.workshopPayments === "object" && user.workshopPayments !== null
        ? user.workshopPayments
        : {}

    // Compose user data (NO duplicate keys)
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      tzId: user.tzId,
      collegeName: user.collegeName,
      mobileNumber: user.mobileNumber,
      yearOfStudy: user.yearOfStudy,
      department: user.department,
      registrationCompleted: user.registrationCompleted,
      eventsRegistered: user.eventsRegistered,
      role: user.role,
      workshopsRegistered: user.workshopsRegistered,
      workshopPayments,
      payment: paymentData,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}