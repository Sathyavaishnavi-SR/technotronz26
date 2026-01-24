"use client"

import { FloatingParticles } from "@/components/floating-particles"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const txnId = searchParams.get("txn_id")
  const isMock = searchParams.get("mock") === "true"
  const workshopId = searchParams.get("workshopId")
  const type = searchParams.get("type")

  let whatsappLink = null;
  let whatsappText = null;
  if (type === "WORKSHOP" && workshopId === "w-01") {
    whatsappLink = "https://chat.whatsapp.com/CD7y8CvmlBsDnQalwELjJC";
    whatsappText = "Join the Workshop 1 WhatsApp Group";
  } else if (type === "WORKSHOP" && workshopId === "w-02") {
    whatsappLink = "https://chat.whatsapp.com/GByYRafVJTQ6ysn5Afw5fD";
    whatsappText = "Join the Workshop 2 WhatsApp Group";
  } else if (type === "EVENT" || (!type && !workshopId)) {
    whatsappLink = "https://chat.whatsapp.com/EErhbuvqcfgCsaWxYFyhVn";
    whatsappText = "Join the General Event WhatsApp Group";
  }

  return (
    <div className="relative z-20 max-w-lg mx-auto px-4 text-center">
      <div className="relative bg-black/90 border border-green-800/40 p-8 sm:p-12 rounded-sm overflow-hidden">
        <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-green-600/40" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-green-600/40" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-green-600/40" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-green-600/40" />

        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6 animate-pulse" />

        <h1 className="font-serif text-3xl sm:text-4xl text-green-500 tracking-widest mb-4">
          PAYMENT SUCCESSFUL
        </h1>

        {isMock && (
          <div className="p-2 bg-yellow-950/30 border border-yellow-900/50 mb-4">
            <p className="text-yellow-400 font-mono text-xs">
              ⚠️ TEST MODE - This is a simulated payment
            </p>
          </div>
        )}

        <p className="text-gray-400 mb-6">
          Your payment has been processed successfully. You now have access to your registered events/workshops.
        </p>

        {whatsappLink && (
          <div className="mb-6">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-green-600/10 border border-green-600 text-green-400 font-mono text-sm tracking-wider rounded hover:bg-green-600/20 hover:text-green-300 transition-all"
            >
              {whatsappText}
            </a>
            <p className="text-xs text-gray-400 mt-2">You must join the WhatsApp group for further updates.</p>
          </div>
        )}

        {txnId && (
          <div className="p-3 bg-green-950/20 border border-green-900/50 mb-6">
            <p className="text-green-400 font-mono text-sm">
              Transaction ID: {txnId}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/events"
            className="px-6 py-3 border border-green-900/50 text-green-500 font-mono text-sm tracking-wider hover:bg-green-600/10 transition-all"
          >
            VIEW EVENTS
          </Link>
          <Link
            href="/profile"
            className="px-6 py-3 border border-red-900/50 text-red-500 font-mono text-sm tracking-wider hover:bg-red-600/10 transition-all"
          >
            GO TO PROFILE
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      <FloatingParticles />

      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/10 to-black" />
      <div
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.03] animate-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <Suspense fallback={<div className="text-green-500 font-mono">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  )
}
