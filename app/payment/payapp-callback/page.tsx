"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { FloatingParticles } from "@/components/floating-particles"
import { Loader2 } from "lucide-react"

function PayAppCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState("Processing PayApp response...")

  useEffect(() => {
    const processPayAppCallback = async () => {
      try {
        // PayApp redirects to their page with Register parameter
        // Extract encrypted data from URL
        const encryptedData = searchParams.get("Register") || searchParams.get("register") || searchParams.get("data")
        
        if (!encryptedData) {
          console.error("[PayApp Callback] No encrypted data found")
          console.log("[PayApp Callback] Available params:", Array.from(searchParams.entries()))
          router.push("/payment/failure?reason=no_data")
          return
        }

        console.log("[PayApp Callback] Encrypted data received, length:", encryptedData.length)
        setStatus("Verifying payment with server...")

        // Forward to our verify API
        const response = await fetch(`/api/payment/verify?data=${encodeURIComponent(encryptedData)}`, {
          method: "GET",
        })

        if (response.redirected) {
          window.location.href = response.url
        } else if (response.ok) {
          const data = await response.json()
          if (data.redirectUrl) {
            window.location.href = data.redirectUrl
          } else {
            router.push("/payment/success")
          }
        } else {
          console.error("[PayApp Callback] Verification failed:", response.status)
          router.push("/payment/failure?reason=verification_failed")
        }
      } catch (error) {
        console.error("[PayApp Callback] Error:", error)
        setStatus("Error processing payment...")
        setTimeout(() => {
          router.push("/payment/failure?reason=error")
        }, 2000)
      }
    }

    processPayAppCallback()
  }, [searchParams, router])

  return (
    <div className="relative z-20 max-w-lg mx-auto px-4 text-center">
      <div className="relative bg-black/90 border border-cyan-800/40 p-8 sm:p-12 rounded-sm overflow-hidden">
        <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-cyan-600/40" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-cyan-600/40" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-cyan-600/40" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-cyan-600/40" />

        <Loader2 className="w-16 h-16 text-cyan-500 mx-auto mb-6 animate-spin" />

        <h1 className="font-serif text-3xl sm:text-4xl text-cyan-500 tracking-widest mb-4">
          PROCESSING PAYMENT
        </h1>

        <p className="text-gray-400 mb-6 font-mono text-sm">
          {status}
        </p>

        <div className="flex items-center justify-center gap-2 text-cyan-400/60 text-xs font-mono">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse delay-150" />
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse delay-300" />
        </div>
      </div>
    </div>
  )
}

export default function PayAppCallbackPage() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      <FloatingParticles />

      <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-950/10 to-black" />
      <div
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.03] animate-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <PayAppCallbackContent />
    </main>
  )
}
