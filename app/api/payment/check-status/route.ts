import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Payment from "@/models/Payment"

export const dynamic = 'force-dynamic'

/**
 * Manual payment verification endpoint
 * When user returns from PayApp, they can enter their transaction ID to check status
 */
export async function GET(request: NextRequest) {
  try {
    const txn_id = request.nextUrl.searchParams.get("txn_id")
    
    if (!txn_id) {
      return NextResponse.json({
        error: "Transaction ID required. Use ?txn_id=..."
      }, { status: 400 })
    }

    await connectDB()
    
    const payment = await Payment.findOne({ txn_id })
    
    if (!payment) {
      return NextResponse.json({
        found: false,
        message: "Transaction not found"
      }, { status: 404 })
    }

    return NextResponse.json({
      found: true,
      txn_id: payment.txn_id,
      reg_id: payment.reg_id,
      status: payment.status,
      amount: payment.amount,
      type: payment.type,
      email: payment.email,
      created: payment.createdAt
    })

  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 })
  }
}
