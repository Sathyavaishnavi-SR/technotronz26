import { NextRequest, NextResponse } from "next/server"
import { getAuthFromRequest } from "@/lib/auth"
import connectDB from "@/lib/db"
import User from "@/models/User"
import Payment from "@/models/Payment"
import UserPayment from "@/models/UserPayment"
import {
  encryptPayApp,
  getEventFee,
  WORKSHOP_FEES,
  PAYAPP_CATEGORIES,
  generateTxnId,
  generateRegId,
} from "@/lib/payapp"

// Check if mock mode is enabled (for testing without PayApp UI)
const isMockMode = process.env.PAYMENT_MODE === "mock"

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const auth = getAuthFromRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get user details
    const user = await User.findById(auth.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()
    const { type, workshopId } = body as { type: "EVENT" | "WORKSHOP"; workshopId?: string }

    // Validate request
    if (!type || (type !== "EVENT" && type !== "WORKSHOP")) {
      return NextResponse.json({ error: "Invalid payment type" }, { status: 400 })
    }

    if (type === "WORKSHOP" && !workshopId) {
      return NextResponse.json({ error: "Workshop ID required" }, { status: 400 })
    }

    if (type === "WORKSHOP" && !WORKSHOP_FEES[workshopId!]) {
      return NextResponse.json({ error: "Invalid workshop ID" }, { status: 400 })
    }

    // Check if already paid (prevent duplicate payments)
    const userPayment = await UserPayment.findOne({ userId: user._id })
    
    if (type === "EVENT" && userPayment?.eventFeePaid) {
      return NextResponse.json({ error: "Event fee already paid" }, { status: 400 })
    }

    if (type === "WORKSHOP" && userPayment?.workshopsPaid?.includes(workshopId!)) {
      return NextResponse.json({ error: "Workshop already paid" }, { status: 400 })
    }

    // Delete any old pending payments to avoid duplicate transaction IDs
    // PayApp requires unique txn_id for each payment attempt
    await Payment.deleteMany({
      authUserId: auth.userId,
      type,
      workshopId: type === "WORKSHOP" ? workshopId : undefined,
      status: "PENDING",
    })

    // Calculate amount (SERVER-SIDE - never trust frontend)
    const amount = type === "EVENT" 
      ? getEventFee(user.email) 
      : WORKSHOP_FEES[workshopId!]

    // Generate unique IDs
    const txn_id = generateTxnId()
    const reg_id = generateRegId()

    // Create pending payment record
    await Payment.create({
      authUserId: auth.userId,
      email: user.email,
      type,
      workshopId: type === "WORKSHOP" ? workshopId : undefined,
      amount,
      txn_id,
      reg_id,
      status: "PENDING",
      provider: "2",
    })

    // MOCK MODE: Skip PayApp and simulate successful payment
    // Use this for testing when PayApp UI is not available
    if (isMockMode) {
      console.log("[Payment] MOCK MODE - Simulating successful payment")
      
      // Update payment status to SUCCESS
      await Payment.updateOne(
        { txn_id },
        { status: "SUCCESS" }
      )

      // Update UserPayment record
      if (type === "EVENT") {
        await UserPayment.findOneAndUpdate(
          { userId: user._id },
          { 
            $set: { eventFeePaid: true, eventFeeAmount: amount },
            $setOnInsert: { email: user.email, workshopsPaid: [] }
          },
          { upsert: true }
        )
      } else {
        await UserPayment.findOneAndUpdate(
          { userId: user._id },
          { 
            $addToSet: { workshopsPaid: workshopId },
            $setOnInsert: { email: user.email, eventFeePaid: false, eventFeeAmount: getEventFee(user.email) }
          },
          { upsert: true }
        )

        // Also update the User model's workshopPayments map
        await User.findByIdAndUpdate(user._id, {
          $set: { [`workshopPayments.${workshopId}`]: "PAID" }
        })
      }

      // Return mock success redirect
      return NextResponse.json({
        mock: true,
        success: true,
        redirectUrl: `/payment/success?txn_id=${txn_id}&mock=true`,
        txn_id,
      })
    }

    // LIVE MODE: Proceed with PayApp encryption

    // Get base URL for callback
    const baseUrl = process.env.BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"
    
    // CRITICAL: Ensure callback URL is absolute and properly formatted
    // PayApp needs to redirect here after payment with encrypted result
    const callbackUrl = `${baseUrl}/payment/payapp-callback`
    
    console.log("[Payment] Setting callback URL:", callbackUrl)
    console.log("[Payment] BASE_URL from env:", process.env.BASE_URL)

    // Prepare PayApp payload
    const payload = {
      reg_id,
      name: user.name || "Participant",
      email: user.email,
      category: type === "EVENT" ? PAYAPP_CATEGORIES.EVENT : PAYAPP_CATEGORIES[workshopId!],
      txn_id,
      amt: amount.toString(),
      client_returnurl: callbackUrl,
      provider: "2",
    }

    console.log("[Payment] Full payload being sent to PayApp:", JSON.stringify(payload, null, 2))

    // Encrypt payload using PayApp API
    const encryptedOrUrl = await encryptPayApp(payload)

    // The encryption API may return:
    // 1. A full redirect URL (from Location header) - use directly
    // 2. Just encrypted data - build URL manually
    let payAppUrl: string
    
    if (encryptedOrUrl.startsWith("http")) {
      // Already a full URL from Location header
      payAppUrl = encryptedOrUrl
      console.log("[Payment] Using redirect URL from PayApp:", payAppUrl.substring(0, 100) + "...")
    } else {
      // Just encrypted data, build URL manually
      payAppUrl = `https://cms.psgps.edu.in/payappapi_test/PayAppapi/Pay?data=${encodeURIComponent(encryptedOrUrl)}`
      console.log("[Payment] Built PayApp URL with encrypted data:", payAppUrl.substring(0, 100) + "...")
    }

    // Return redirect URL for browser navigation
    return NextResponse.json({
      redirectUrl: payAppUrl,
      txn_id,
    })

  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    )
  }
}
