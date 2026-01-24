import { NextRequest, NextResponse } from "next/server"
import { getAuthFromRequest } from "@/lib/auth"
import connectDB from "@/lib/db"
import User from "@/models/User"
import UserPayment from "@/models/UserPayment"
import { z } from "zod"

const registerEventSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
})

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request)

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate request body
    const validationResult = registerEventSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.errors },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findById(auth.userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if registration is completed
    if (!user.registrationCompleted) {
      return NextResponse.json(
        { error: "Registration not completed" },
        { status: 400 }
      )
    }

    const { eventId } = validationResult.data

    // Check if already registered
    if (user.eventsRegistered.includes(eventId)) {
      return NextResponse.json(
        { error: "Already registered for this event" },
        { status: 400 }
      )
    }

    // Add event to registered list (payment can be done later)
    user.eventsRegistered.push(eventId)
    await user.save()

    return NextResponse.json({
      success: true,
      message: "Event registered successfully",
      eventsRegistered: user.eventsRegistered,
    })
  } catch (error) {
    console.error("Error registering for event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

