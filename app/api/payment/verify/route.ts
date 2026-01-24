import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Payment from "@/models/Payment"
import User from "@/models/User"
import UserPayment from "@/models/UserPayment"
import { decryptPayApp } from "@/lib/payapp"

// Handle verification - supports both POST and GET
async function handleVerification(encryptedString: string | null) {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000"

  if (!encryptedString) {
    console.error("Payment verify: No encrypted data received")
    return NextResponse.redirect(`${baseUrl}/payment/failure?reason=no_data`)
  }

  try {
    await connectDB()

    // Decrypt response from PayApp (SERVER-SIDE)
    const decrypted = await decryptPayApp(encryptedString)
    console.log("Payment decrypted response:", JSON.stringify(decrypted))

    if (!decrypted.txn_id) {
      console.error("Payment verify: No txn_id in decrypted response")
      return NextResponse.redirect(`${baseUrl}/payment/failure?reason=invalid_response`)
    }

    // Find payment record
    const payment = await Payment.findOne({ txn_id: decrypted.txn_id })

    if (!payment) {
      console.error("Payment verify: Transaction not found:", decrypted.txn_id)
      return NextResponse.redirect(`${baseUrl}/payment/failure?reason=txn_not_found`)
    }

    // Prevent double-processing
    if (payment.status === "SUCCESS") {
      console.log("Payment already processed successfully:", payment.txn_id)
      return NextResponse.redirect(`${baseUrl}/payment/success?txn_id=${payment.txn_id}`)
    }

    // Debug: Log the exact txnstatus value and type
    console.log("Payment verify - txnstatus value:", decrypted.txnstatus)
    console.log("Payment verify - txnstatus type:", typeof decrypted.txnstatus)
    console.log("Payment verify - txnstatus === '1':", decrypted.txnstatus === "1")
    console.log("Payment verify - txnstatus == 1:", decrypted.txnstatus == "1")

    // Check if payment was successful (txnstatus "1" = success)
    if (decrypted.txnstatus === "1") {
      // Update payment status
      payment.status = "SUCCESS"
      await payment.save()

      // Get user ID from payment record
      const userId = payment.authUserId

      // Update user payment record
      if (payment.type === "EVENT") {
        await UserPayment.findOneAndUpdate(
          { userId: userId },
          {
            $set: {
              eventFeePaid: true,
              eventFeeAmount: payment.amount,
            },
          },
          { upsert: true }
        )
        console.log("Event payment updated for user:", userId)
      } else if (payment.type === "WORKSHOP" && payment.workshopId) {
        await UserPayment.findOneAndUpdate(
          { userId: userId },
          {
            $addToSet: { workshopsPaid: payment.workshopId },
          },
          { upsert: true }
        )

        // Also update User model for backward compatibility
        await User.findByIdAndUpdate(userId, {
          $set: { [`workshopPayments.${payment.workshopId}`]: "PAID" },
        })
        console.log("Workshop payment updated for user:", userId, "workshop:", payment.workshopId)
      }

      return NextResponse.redirect(`${baseUrl}/payment/success?txn_id=${payment.txn_id}`)
    }

    // Payment failed
    payment.status = "FAILED"
    await payment.save()
    console.log("Payment failed for txn:", payment.txn_id)

    return NextResponse.redirect(`${baseUrl}/payment/failure?txn_id=${payment.txn_id}`)

  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.redirect(`${baseUrl}/payment/failure?reason=error`)
  }
}

// POST handler - for direct API calls (optional)
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || ""
    let encrypted: string | null = null

    if (contentType.includes("application/json")) {
      const body = await request.json()
      encrypted = body.data || body.dycryptstring
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData()
      encrypted = (formData.get("data") || formData.get("dycryptstring")) as string
    } else {
      // Try to parse as JSON anyway
      try {
        const body = await request.json()
        encrypted = body.data || body.dycryptstring
      } catch {
        const text = await request.text()
        // Check if it's URL encoded
        const params = new URLSearchParams(text)
        encrypted = params.get("data") || params.get("dycryptstring")
      }
    }

    return handleVerification(encrypted)
  } catch (error) {
    console.error("POST handler error:", error)
    const baseUrl = process.env.BASE_URL || "http://localhost:3000"
    return NextResponse.redirect(`${baseUrl}/payment/failure?reason=parse_error`)
  }
}

// GET handler - for PayApp callback (PayApp sends ?data=encrypted)
export async function GET(request: NextRequest) {
  // PayApp sends encrypted data as ?data=encrypted
  const encrypted = request.nextUrl.searchParams.get("data") || request.nextUrl.searchParams.get("dycryptstring")
  console.log("[Payment Verify GET] Received encrypted data, length:", encrypted?.length || 0)
  return handleVerification(encrypted)
}
