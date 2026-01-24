import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || ""
const JWT_EXPIRES_IN = "30d"

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables")
}

export interface JWTPayload {
  userId: string
  email: string
  registrationCompleted: boolean
}

/**
 * Sign a JWT token (Node.js runtime only)
 * Used by API routes for login/registration
 */
export function signJWT(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

/**
 * Verify a JWT token (Node.js runtime)
 * Used by API routes
 */
export function verifyJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}
