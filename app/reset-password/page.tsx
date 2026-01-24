"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FloatingParticles } from "@/components/floating-particles"

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    const tokenParam = searchParams.get("token")
    if (emailParam) setEmail(emailParam)
    if (tokenParam) setToken(tokenParam)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setMessage(data.message)
        setTimeout(() => router.push("/login"), 3000)
      } else {
        setMessage(data.error || "Failed to reset password")
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!email || !token) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0000] to-[#1a0505]" />
        <FloatingParticles />
        <div
          className="pointer-events-none fixed inset-0 z-30"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 70%, rgba(0, 0, 0, 0.8) 100%)",
          }}
        />
        
        <div className="relative z-20 w-full max-w-md px-4">
          <div
            className="relative bg-black/60 backdrop-blur-md border border-red-900/30 rounded-lg p-8 text-center"
            style={{
              boxShadow: "0 0 30px rgba(127, 29, 29, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.5)",
            }}
          >
            <h1
              className="font-serif text-2xl font-bold text-red-600 tracking-widest mb-4"
              style={{
                textShadow: "0 0 10px rgba(220, 38, 38, 0.8), 0 0 20px rgba(220, 38, 38, 0.6)",
              }}
            >
              INVALID LINK
            </h1>
            <p className="text-red-200/60 mb-6 text-sm">
              This password reset link is invalid or has expired.
            </p>
            <button
              onClick={() => router.push("/forgot-password")}
              className="px-6 py-3 bg-gradient-to-r from-red-900 via-red-700 to-red-900 border border-red-600/50 rounded text-red-100 font-bold tracking-[0.15em] uppercase text-sm hover:from-red-800 hover:via-red-600 hover:to-red-800 transition-all"
              style={{
                boxShadow: "0 0 20px rgba(220, 38, 38, 0.3)",
                textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
              }}
            >
              Request New Link
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      {/* Base dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0000] to-[#1a0505]" />

      {/* Fog Layers */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 animate-fog-slow"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 20% 80%, rgba(127, 29, 29, 0.3) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 animate-fog-mid"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 80% 20%, rgba(153, 27, 27, 0.25) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* VHS Grain Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] animate-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scanline Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.3) 2px, rgba(0, 0, 0, 0.3) 4px)",
        }}
      />

      <FloatingParticles />

      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-30"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 70%, rgba(0, 0, 0, 0.8) 100%)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-md px-4">
        {/* Title */}
        <div className="text-center mb-8">
          <h1
            className="font-serif text-3xl sm:text-4xl font-bold text-red-600 tracking-widest animate-flicker"
            style={{
              textShadow:
                "0 0 10px rgba(220, 38, 38, 0.8), 0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(220, 38, 38, 0.4)",
            }}
          >
            RESET
          </h1>
          <p className="mt-3 text-xs sm:text-sm tracking-[0.3em] text-red-200/70 uppercase">
            Enter your new password
          </p>
          
          <div className="flex items-center justify-center mt-4">
            <div className="relative h-0.5 w-32 sm:w-48 overflow-hidden rounded-full">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-energy-beam"
                style={{
                  boxShadow: "0 0 20px rgba(220, 38, 38, 0.8), 0 0 40px rgba(220, 38, 38, 0.4)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div
          className="relative bg-black/60 backdrop-blur-md border border-red-900/30 rounded-lg p-6 sm:p-8"
          style={{
            boxShadow: "0 0 30px rgba(127, 29, 29, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="absolute inset-0 rounded-lg border border-red-600/20 animate-border-pulse pointer-events-none" />

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs tracking-[0.2em] text-red-200/80 uppercase mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-black/50 border border-red-900/40 rounded text-red-100 placeholder-red-900/50 focus:outline-none focus:border-red-600/60 focus:ring-1 focus:ring-red-600/30 transition-all text-sm"
                  placeholder="••••••••"
                  style={{
                    boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.3)",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs tracking-[0.2em] text-red-200/80 uppercase mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-black/50 border border-red-900/40 rounded text-red-100 placeholder-red-900/50 focus:outline-none focus:border-red-600/60 focus:ring-1 focus:ring-red-600/30 transition-all text-sm"
                  placeholder="••••••••"
                  style={{
                    boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.3)",
                  }}
                />
              </div>

              {message && (
                <div
                  className={`p-3 rounded border text-sm text-center ${
                    success
                      ? "bg-green-950/30 border-green-800/30 text-green-300"
                      : "bg-red-950/50 border-red-800/50 text-red-300"
                  }`}
                  style={{ textShadow: success ? "0 0 10px rgba(34, 197, 94, 0.5)" : "0 0 10px rgba(220, 38, 38, 0.5)" }}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-900 via-red-700 to-red-900 border border-red-600/50 rounded text-red-100 font-bold tracking-[0.2em] uppercase text-sm hover:from-red-800 hover:via-red-600 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                style={{
                  boxShadow: "0 0 20px rgba(220, 38, 38, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                }}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div
                className="p-4 rounded bg-green-950/30 border border-green-800/30 text-green-300 text-sm"
                style={{ textShadow: "0 0 10px rgba(34, 197, 94, 0.5)" }}
              >
                {message}
              </div>
              <p className="text-red-200/60 text-xs tracking-wide animate-pulse">
                Redirecting to login page...
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <FloatingParticles />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/20 to-black" />
        <div className="relative z-20 text-red-500 font-mono">Loading...</div>
      </main>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
