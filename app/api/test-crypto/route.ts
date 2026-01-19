import { NextResponse } from "next/server"
import { encryptPayApp, generateTxnId, generateRegId } from "@/lib/payapp"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const startTime = Date.now()
    console.log("[Test] Testing PayApp Encryption (Payment URL Generation)")
    
    // Prepare Sample Data
    const payload = {
      reg_id: generateRegId(),
      name: "Debug Test User",
      email: "debug@example.com",
      category: "20",
      txn_id: generateTxnId(),
      amt: "100",
      client_returnurl: "http://localhost:3000/payment/confirm",
      provider: "2"
    }

    // Encrypt - this generates the PayApp payment URL
    const paymentUrl = await encryptPayApp(payload)
    
    // Verify it's a valid PayApp URL
    const isValidUrl = paymentUrl.startsWith("https://cms.psgps.edu.in/payappapi_test/")
    
    return NextResponse.json({
        success: isValidUrl,
        duration: `${Date.now() - startTime}ms`,
        test_info: {
            original_payload: payload,
            generated_payment_url: paymentUrl.substring(0, 100) + "...",
            full_url_length: paymentUrl.length,
            ready_for_redirect: isValidUrl,
            note: "This URL is for redirecting users to PayApp payment page. Decryption only works on data received FROM PayApp after payment completion."
        }
    })

  } catch (error: any) {
    return NextResponse.json({
        success: false,
        error: error.message,
        stack: error.stack
    }, { status: 500 })
  }
}
