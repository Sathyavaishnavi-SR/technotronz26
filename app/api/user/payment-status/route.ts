import { NextRequest, NextResponse } from "next/server"
import { getAuthFromRequest } from "@/lib/auth"
import connectDB from "@/lib/db"
import User from "@/models/User"
import UserPayment from "@/models/UserPayment"

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request)

    if (!auth || !auth.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findById(auth.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate event fee based on email domain
    const isPSGStudent = auth.email.endsWith("@psgtech.ac.in")
    const eventFeeAmount = isPSGStudent ? 1 : 200

    // Find or create UserPayment document using findOneAndUpdate with upsert
    // This guarantees: no null userId, no duplicate inserts, one record per user
    const userPayment = await UserPayment.findOneAndUpdate(
      { userId: auth.userId },
      { 
        $setOnInsert: { 
          email: auth.email,
          eventFeePaid: false,
          eventFeeAmount,
          workshopsPaid: [],
        } 
      },
      { upsert: true, new: true }
    )

    return NextResponse.json({
      eventFeePaid: userPayment.eventFeePaid,
      eventFeeAmount: userPayment.eventFeeAmount,
      workshopsPaid: userPayment.workshopsPaid,
    })
  } catch (error) {
    console.error("Error fetching payment status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}





