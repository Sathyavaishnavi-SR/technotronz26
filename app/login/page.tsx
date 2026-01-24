"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FloatingParticles } from "@/components/floating-particles"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login"
      const body = isRegister
        ? { email, password, name }
        : { email, password }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.user?.registrationCompleted) {
          router.replace("/events")
        } else {
          router.replace("/register")
        }
      } else {
        setMessage(data.error || "Authentication failed")
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
        <div
          className="absolute inset-0 animate-fog-drift"
          style={{
            background: "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(127, 29, 29, 0.35) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* VHS Grain Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] animate-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
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

      {/* Floating Particles */}
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
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-red-600 tracking-widest animate-flicker"
            style={{
              textShadow:
                "0 0 10px rgba(220, 38, 38, 0.8), 0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(220, 38, 38, 0.4)",
            }}
          >
            {isRegister ? "JOIN US" : "ENTER"}
          </h1>
          <p className="mt-3 text-xs sm:text-sm tracking-[0.3em] text-red-200/70 uppercase">
            {isRegister ? "Create your account" : "Sign in to continue"}
          </p>
          
          {/* Glowing Divider */}
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
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-lg border border-red-600/20 animate-border-pulse pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="block text-xs tracking-[0.2em] text-red-200/80 uppercase mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-red-900/40 rounded text-red-100 placeholder-red-900/50 focus:outline-none focus:border-red-600/60 focus:ring-1 focus:ring-red-600/30 transition-all text-sm"
                  placeholder="Your full name"
                  style={{
                    boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.3)",
                  }}
                />
              </div>
            )}

            <div>
              <label className="block text-xs tracking-[0.2em] text-red-200/80 uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/50 border border-red-900/40 rounded text-red-100 placeholder-red-900/50 focus:outline-none focus:border-red-600/60 focus:ring-1 focus:ring-red-600/30 transition-all text-sm"
                placeholder="you@example.com"
                style={{
                  boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.3)",
                }}
              />
            </div>

            <div>
              <label className="block text-xs tracking-[0.2em] text-red-200/80 uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                className="p-3 rounded bg-red-950/50 border border-red-800/50 text-red-300 text-sm text-center"
                style={{
                  textShadow: "0 0 10px rgba(220, 38, 38, 0.5)",
                }}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-900 via-red-700 to-red-900 border border-red-600/50 rounded text-red-100 font-bold tracking-[0.2em] uppercase text-sm hover:from-red-800 hover:via-red-600 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 animate-flicker"
              style={{
                boxShadow: "0 0 20px rgba(220, 38, 38, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
              }}
            >
              {isLoading ? "Loading..." : isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Toggle Register/Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister)
                setMessage("")
              }}
              className="text-red-400/80 hover:text-red-300 text-xs tracking-[0.15em] uppercase transition-colors"
              style={{
                textShadow: "0 0 10px rgba(220, 38, 38, 0.3)",
              }}
            >
              {isRegister
                ? "Already have an account? Sign in"
                : "Don't have an account? Register"}
            </button>
          </div>

          {!isRegister && (
            <div className="mt-3 text-center">
              <button
                onClick={() => router.push("/forgot-password")}
                className="text-red-500/60 hover:text-red-400 text-xs tracking-[0.1em] uppercase transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-red-200/50 hover:text-red-200/80 text-xs tracking-[0.15em] uppercase transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </main>
  )
}
