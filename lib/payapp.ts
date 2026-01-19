// PayApp Payment Gateway Helper Functions
// All encryption/decryption happens SERVER-SIDE only

// Pricing constants
export const WORKSHOP_FEES: Record<string, number> = {
  "W-01": 500,
  "W-02": 750,
  "W-03": 1000,
}

// Category mapping for PayApp (as per API docs - Char(1))
export const PAYAPP_CATEGORIES: Record<string, string> = {
  "EVENT": "20",
  "W-01": "20",
  "W-02": "20",
  "W-03": "20",
}

// Provider codes (as per API docs)
export const PAYAPP_PROVIDERS = {
  TPSL: "1",
  PAYTM: "2",
}

// Get event fee based on email domain
export function getEventFee(email: string): number {
  return email.endsWith("@psgtech.ac.in") ? 1 : 200
}

// PayApp API endpoints (test environment)
const PAYAPP_ENCRYPT_URL = "https://cms.psgps.edu.in/payappapi_test/PayAppapi/EncryptionPayapp"
const PAYAPP_DECRYPT_URL = "https://cms.psgps.edu.in/payappapi_test/PayAppapi/DecryptionPayApp"
const PAYAPP_PAY_URL = "https://cms.psgps.edu.in/payappapi_test/PayAppapi/Pay"

interface PayAppPayload {
  reg_id: string      // Max 10 chars
  name: string        // Max 100 chars
  email: string       // Email address - FULL, do not truncate
  category: string    // Collection ID (single char)
  txn_id: string      // Max 15 chars
  amt: string         // Amount as string
  client_returnurl: string // Return URL - FULL, do not truncate
  provider: string    // "1" for TPSL, "2" for Paytm
}

interface DecryptedResponse {
  reg_id: string
  txn_id: string
  category: string
  txnstatus: string   // "1" for success, "0" for failure
  paycatg_id?: number
}

/**
 * Encrypt payment data using PayApp API
 * MUST be called server-side only
 */
export async function encryptPayApp(data: PayAppPayload): Promise<string> {
  const clientId = process.env.PAYAPP_CLIENT_ID
  const clientSecret = process.env.PAYAPP_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("PayApp credentials not configured")
  }

  console.log("[PayApp] Encrypting payload:")
  console.log("  reg_id:", data.reg_id)
  console.log("  name:", data.name)
  console.log("  email:", data.email)
  console.log("  category:", data.category)
  console.log("  txn_id:", data.txn_id)
  console.log("  amt:", data.amt)
  console.log("  client_returnurl:", data.client_returnurl)
  console.log("  provider:", data.provider)

  // Build request body - DO NOT TRUNCATE email or client_returnurl
  // API doc String(15) is likely display format, not input limit
  // Example in docs shows full email: "raja@gmail.com"
  const requestBody = {
    reg_id: String(data.reg_id).substring(0, 10),
    name: String(data.name).substring(0, 100),
    email: String(data.email),  // FULL EMAIL - required for valid format
    category: String(data.category),
    txn_id: String(data.txn_id).substring(0, 15),
    amt: String(data.amt),
    client_returnurl: String(data.client_returnurl),  // FULL URL
    provider: String(data.provider),
  }

  console.log("[PayApp] Request body:", JSON.stringify(requestBody, null, 2))
  console.log("[PayApp] Headers:")
  console.log("  Content-Type: application/json")
  console.log("  APIClient_ID:", clientId ? `${clientId.substring(0, 20)}...` : "MISSING")
  console.log("  APIClient_secret:", clientSecret ? `${clientSecret.substring(0, 20)}...` : "MISSING")

  const response = await fetch(PAYAPP_ENCRYPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "APIClient_ID": clientId,
      "APIClient_secret": clientSecret,
    },
    body: JSON.stringify(requestBody),
    redirect: "manual", // CRITICAL: Don't follow redirects, we need the Location header
  })

  // CRITICAL: Check for redirect Location header first
  // PayApp encryption API returns a 302 redirect with the full payment URL
  const location = response.headers.get("location")
  
  if (location) {
    console.log("[PayApp] ✓ Got redirect Location header:", location.substring(0, 100) + "...")
    return location // Return the full payment URL directly
  }

  // Fallback: Get raw response text
  const responseText = await response.text()
  
  // CRITICAL: Trim whitespace and check for HTML (error response)
  const trimmed = responseText.trim()
  
  console.log("[PayApp] Response status:", response.status)
  console.log("[PayApp] Response length:", trimmed.length)
  console.log("[PayApp] Response preview:", trimmed.substring(0, 100))

  // Check if response is HTML - might contain encrypted data in form action
  if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html") || trimmed.includes("<html")) {
    console.log("[PayApp] Received HTML response - attempting to extract encrypted data")
    
    // Log more of the HTML for debugging
    console.log("[PayApp] HTML content (first 500 chars):", trimmed.substring(0, 500))
    
    // Check for error alerts
    if (trimmed.includes("alert('Invalid requested values')")) {
      console.error("[PayApp] ERROR: API returned 'Invalid requested values'")
      console.error("[PayApp] This means the API rejected the payload format")
      throw new Error("PayApp API rejected the request: Invalid requested values")
    }
    
    if (trimmed.includes("duplicate order id") || trimmed.includes("duplicate transaction")) {
      console.error("[PayApp] ERROR: Duplicate transaction ID detected")
      console.error("[PayApp] The txn_id has already been used in a previous transaction")
      throw new Error("DUPLICATE_TXN_ID")
    }
    
    // Try to extract encrypted data from form action
    const actionMatch = trimmed.match(/action="[^"]*\?payment=([^"]+)"/i)
    if (actionMatch && actionMatch[1]) {
      const encryptedData = decodeURIComponent(actionMatch[1])
      console.log("[PayApp] ✓ Extracted encrypted data from HTML form, length:", encryptedData.length)
      return encryptedData
    }
    
    // Try another pattern - data parameter in URL
    const dataMatch = trimmed.match(/\?data=([^"&\s]+)/i)
    if (dataMatch && dataMatch[1]) {
      const encryptedData = decodeURIComponent(dataMatch[1])
      console.log("[PayApp] ✓ Extracted encrypted data from URL param, length:", encryptedData.length)
      return encryptedData
    }
    
    console.error("[PayApp] ERROR: Could not extract encrypted data from HTML")
    throw new Error("PayApp returned HTML but no encrypted data found")
  }

  // Check if response looks like an encrypted string (should be alphanumeric/base64-ish)
  if (trimmed.length < 50) {
    console.error("[PayApp] ERROR: Response too short to be encrypted data:", trimmed)
    throw new Error(`PayApp returned unexpected response: ${trimmed}`)
  }

  if (!response.ok) {
    console.error("[PayApp] Encryption error:", response.status, trimmed)
    throw new Error(`PayApp encryption failed: ${response.status}`)
  }

  console.log("[PayApp] ✓ Encrypted string received, length:", trimmed.length)
  return trimmed
}

/**
 * Decrypt payment response using PayApp API
 * MUST be called server-side only
 */
export async function decryptPayApp(encryptedString: string): Promise<DecryptedResponse> {
  const clientId = process.env.PAYAPP_CLIENT_ID
  const clientSecret = process.env.PAYAPP_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("PayApp credentials not configured")
  }

  console.log("[PayApp] Decrypting response, length:", encryptedString.length)
  console.log("[PayApp] Encrypted string (first 100):", encryptedString.substring(0, 100))

  const response = await fetch(PAYAPP_DECRYPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "APIClient_ID": clientId,
      "APIClient_secret": clientSecret,
    },
    body: JSON.stringify({
      Decryptstring: encryptedString,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("[PayApp] Decryption error:", response.status, errorText)
    throw new Error(`PayApp decryption failed: ${response.status}`)
  }

  const responseText = await response.text()
  console.log("[PayApp] Decryption raw response:", responseText)

  // PayApp decryption returns a string like: "reg_id&category&txn_id&status"
  // Parse it into structured data
  try {
    // Try JSON first (some APIs return JSON)
    const decryptedJson = JSON.parse(responseText)
    console.log("[PayApp] Decrypted JSON:", decryptedJson)
    
    return {
      reg_id: decryptedJson.reg_id || "",
      txn_id: decryptedJson.txn_id || "",
      category: decryptedJson.category || "",
      txnstatus: decryptedJson.txnstatus || decryptedJson.status || "0",
      paycatg_id: decryptedJson.paycatg_id ? parseInt(decryptedJson.paycatg_id) : undefined,
    }
  } catch {
    // Not JSON, parse as delimited string: "reg_id&category&txn_id&status"
    const parts = responseText.split("&")
    console.log("[PayApp] Decrypted string parts:", parts)
    
    return {
      reg_id: parts[0] || "",
      txn_id: parts[2] || "",
      category: parts[1] || "",
      txnstatus: parts[3] || "0",
    }
  }
}

/**
 * Build PayApp redirect URL with encrypted payload
 */
export function getPayAppRedirectUrl(encryptedPayload: string): string {
  return `${PAYAPP_PAY_URL}?data=${encodeURIComponent(encryptedPayload)}`
}

/**
 * Generate unique transaction ID (max 15 chars as per API)
 */
export function generateTxnId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `TXN${timestamp}${random}`.substring(0, 15)
}

/**
 * Generate unique registration ID (max 10 chars as per API)
 */
export function generateRegId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  return `TZ${timestamp}`.substring(0, 10)
}