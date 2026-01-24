/**
 * Edge-compatible JWT verification using jose library
 * Used by proxy.ts (middleware) which runs on Edge Runtime
 * 
 * Note: We use jose instead of jsonwebtoken because jsonwebtoken
 * uses Node.js crypto APIs that don't work in Edge Runtime.
 */
import * as jose from "jose"

export interface JWTPayload {
  userId: string
  email: string
  registrationCompleted: boolean
}

/**
 * Verify JWT token in Edge Runtime
 * Returns the payload if valid, null if invalid/expired
 */
export async function verifyJWTEdge(token: string): Promise<JWTPayload | null> {
  const secret = process.env.JWT_SECRET
  
  if (!secret) {
    console.error("[JWT Edge] JWT_SECRET is not defined")
    return null
  }
  
  try {
    // Convert secret to Uint8Array for jose
    const secretKey = new TextEncoder().encode(secret)
    
    // Verify the token
    const { payload } = await jose.jwtVerify(token, secretKey)
    
    // Validate required fields
    if (!payload.userId || !payload.email) {
      console.error("[JWT Edge] Missing required fields in token")
      return null
    }
    
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      registrationCompleted: payload.registrationCompleted as boolean ?? false,
    }
  } catch (error) {
    // Token is invalid or expired
    if (error instanceof jose.errors.JWTExpired) {
      console.log("[JWT Edge] Token expired")
    } else if (error instanceof jose.errors.JWTInvalid) {
      console.log("[JWT Edge] Token invalid")
    } else {
      console.error("[JWT Edge] Verification error:", error)
    }
    return null
  }
}
