import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

/**
 * Test endpoint to manually decrypt a PayApp encrypted string
 * Usage: /api/test-decrypt?data=<ENCRYPTED_STRING>
 */
export async function GET(request: NextRequest) {
  try {
    const encryptedData = request.nextUrl.searchParams.get("data") || 
                         request.nextUrl.searchParams.get("Register") ||
                         request.nextUrl.searchParams.get("register")
    
    if (!encryptedData) {
      return NextResponse.json({
        success: false,
        error: "No encrypted data provided. Use ?data=... or ?Register=..."
      }, { status: 400 })
    }

    // URL is already decoded by nextUrl.searchParams.get()
    console.log("[Test Decrypt] Received encrypted data, length:", encryptedData.length)
    console.log("[Test Decrypt] Encrypted string:", encryptedData)

    const clientId = process.env.PAYAPP_CLIENT_ID
    const clientSecret = process.env.PAYAPP_CLIENT_SECRET
    const PAYAPP_DECRYPT_URL = "https://cms.psgps.edu.in/payappapi_test/PayAppapi/DecryptionPayApp"

    const response = await fetch(PAYAPP_DECRYPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "APIClient_ID": clientId!,
        "APIClient_secret": clientSecret!,
      },
      body: JSON.stringify({
        Decryptstring: encryptedData,
      }),
    })

    const rawResponse = await response.text()
    console.log("[Test Decrypt] Status:", response.status)
    console.log("[Test Decrypt] Raw response:", rawResponse)

    let parsed: any
    try {
      parsed = JSON.parse(rawResponse)
    } catch {
      // If not JSON, try to parse as delimited string
      if (rawResponse.includes("&")) {
        const parts = rawResponse.replace(/"/g, "").split("&")
        parsed = {
          format: "delimited_string",
          reg_id: parts[0] || null,
          category: parts[1] || null,
          txn_id: parts[2] || null,
          txnstatus: parts[3] || null,
        }
      } else {
        parsed = { raw_string: rawResponse }
      }
    }

    return NextResponse.json({
      success: response.ok,
      encrypted_string: encryptedData,
      encrypted_length: encryptedData.length,
      decrypt_status: response.status,
      raw_response: rawResponse,
      parsed_response: parsed,
      note: rawResponse.includes("Index was outside") 
        ? "❌ Encrypted string is invalid or expired. Make a new payment to get a fresh encrypted string."
        : "✅ Decryption successful"
    })

  } catch (error: any) {
    console.error("[Test Decrypt] Error:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
