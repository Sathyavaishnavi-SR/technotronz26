"use client"

import { FloatingParticles } from "@/components/floating-particles"
import Link from "next/link"
import { CreditCard, AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

const WORKSHOP_PRICES: Record<string, number> = {
  "W-01": 500,
  "W-02": 750,
}

const WORKSHOP_IDS = ["W-01", "W-02"]

function PaymentContent() {
  const { user, isLoading: authLoading, isLoggedIn } = useAuth()
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState<string | null>(null)
  const message = searchParams.get("message")

  useEffect(() => {
    async function fetchPaymentStatus() {
      if (!authLoading && isLoggedIn && user?.email) {
        try {
          const response = await fetch("/api/user/payment-status")
          if (response.ok) {
            const data = await response.json()
            setPaymentStatus(data)
          } else {
            const userEmail = user.email
            const isPSGStudent = userEmail.endsWith("@psgtech.ac.in")
            setPaymentStatus({
              eventFeePaid: false,
              eventFeeAmount: isPSGStudent ? 1 : 200,
              workshopsPaid: [],
            })
          }
        } catch (error) {
          console.error("Error fetching payment status:", error)
        } finally {
          setLoading(false)
        }
      } else if (!authLoading && !isLoggedIn) {
        setLoading(false)
      }
    }
    fetchPaymentStatus()
  }, [authLoading, isLoggedIn, user])

  const handlePayment = async (type: "EVENT" | "WORKSHOP", workshopId?: string) => {
    const paymentKey = type === "EVENT" ? "EVENT" : workshopId!
    setProcessingPayment(paymentKey)

    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, workshopId }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Failed to initiate payment")
        setProcessingPayment(null)
        return
      }

      // Redirect to PayApp hosted payment page (or mock success page)
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
        return
      }

      alert("Payment initialization failed. Please try again.")
      setProcessingPayment(null)
    } catch (error) {
      console.error("Payment error:", error)
      alert("An error occurred. Please try again.")
      setProcessingPayment(null)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="relative z-20 flex items-center justify-center min-h-screen">
        <div className="text-red-500 font-mono">Loading...</div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="relative z-20 flex items-center justify-center min-h-screen">
        <div className="text-center px-4">
          <h1 className="font-serif text-3xl sm:text-5xl text-red-600 tracking-[0.2em] mb-6 animate-flicker">
            ACCESS DENIED
          </h1>
          <p className="text-gray-400 mb-8">Please sign in to access the payment portal.</p>
          <Link
            href="/login"
            className="px-8 py-3 border border-red-600 text-red-500 font-mono tracking-wider hover:bg-red-600/20 transition-all"
          >
            SIGN IN
          </Link>
        </div>
      </div>
    )
  }

  const eventFeeAmount = paymentStatus?.eventFeeAmount || 200
  const eventFeePaid = paymentStatus?.eventFeePaid || false
  const workshopsPaid = paymentStatus?.workshopsPaid || []

  return (
    <div className="relative z-20 max-w-3xl mx-auto px-4 py-20 sm:py-28">
      {/* Header */}
      <div className="text-center mb-12 animate-content-fade-in">
        <h1 className="font-serif text-3xl sm:text-5xl text-red-600 tracking-widest mb-4 animate-flicker">
          PAYMENT PORTAL
        </h1>
        <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto animate-energy-beam" />
      </div>

      {/* Payment Card */}
      <div className="relative bg-black/90 border border-red-800/40 p-6 sm:p-8 rounded-sm overflow-hidden animate-content-fade-in-delay">
        <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-red-600/40" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-red-600/40" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-red-600/40" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-red-600/40" />

        <div className="space-y-6">
          {/* Info Alert */}
          <div className="flex items-start gap-4 p-4 bg-red-950/20 border border-red-900/50">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-mono text-sm font-semibold mb-1">
                SECURE PAYMENT GATEWAY
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Payments are processed securely through the college payment system. You will be redirected to complete your payment.
              </p>
            </div>
          </div>

          {/* Message from redirect */}
          {message && (
            <div className="p-4 bg-yellow-950/20 border border-yellow-900/50 text-yellow-400 text-sm font-mono">
              {message}
            </div>
          )}

          {/* Payment Section Header */}
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-red-600" />
            <h2 className="text-red-500 font-serif text-xl tracking-wider uppercase">
              Select Payment
            </h2>
          </div>

          {/* Event Fee */}
          <div className="p-4 bg-red-950/10 border border-red-900/30">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-red-400 font-mono text-sm font-semibold mb-1">
                  Events Access Pass
                </p>
                <p className="text-gray-400 text-xs mb-2">
                  One-time payment grants access to all 12 intercollegiate symposium events.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {eventFeePaid ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-mono text-sm">
                Amount: <span className="text-red-400 font-bold">₹{eventFeeAmount}</span>
              </span>
              {eventFeePaid ? (
                <span className="font-mono text-xs px-3 py-1.5 bg-green-950/30 text-green-400 border border-green-900/50">
                  PAID ✓
                </span>
              ) : (
                <button
                  onClick={() => handlePayment("EVENT")}
                  disabled={processingPayment === "EVENT"}
                  className="font-mono text-xs px-4 py-2 bg-red-600 text-white border border-red-500 hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {processingPayment === "EVENT" ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    "PAY NOW"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Workshops */}
          <div className="p-4 bg-red-950/10 border border-red-900/30">
            <p className="text-red-400 font-mono text-sm font-semibold mb-2">
              Workshop Registration
            </p>
            <p className="text-gray-400 text-xs mb-4">
              Pay separately for each workshop you want to attend.
            </p>
            <div className="space-y-3">
              {WORKSHOP_IDS.map((workshopId) => {
                const isPaid = workshopsPaid.includes(workshopId)
                const price = WORKSHOP_PRICES[workshopId]
                const isProcessing = processingPayment === workshopId
                
                return (
                  <div
                    key={workshopId}
                    className="flex items-center justify-between p-3 bg-black/30 border border-red-900/20"
                  >
                    <div className="flex items-center gap-3">
                      {isPaid ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-gray-300 font-mono text-sm">{workshopId}</span>
                      <span className="text-gray-500 font-mono text-xs">₹{price}</span>
                    </div>
                    {isPaid ? (
                      <span className="font-mono text-[10px] px-2 py-1 bg-green-950/30 text-green-400 border border-green-900/50">
                        PAID ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePayment("WORKSHOP", workshopId)}
                        disabled={isProcessing}
                        className="font-mono text-[10px] px-3 py-1.5 bg-red-600 text-white border border-red-500 hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            PROCESSING
                          </>
                        ) : (
                          "PAY NOW"
                        )}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Security Note */}
          <div className="p-4 bg-black/50 border border-red-900/30">
            <p className="text-gray-500 text-xs font-mono">
              🔒 All payments are processed securely. You will be redirected to the college payment gateway.
            </p>
          </div>

          {/* Back Button */}
          <div className="pt-4">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-6 py-3 border border-red-900/50 text-red-500 font-mono text-sm tracking-wider hover:bg-red-600/10 transition-all"
            >
              BACK TO PROFILE
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      <FloatingParticles />

      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/10 to-black" />
      <div
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.03] animate-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <Suspense fallback={
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <div className="text-red-500 font-mono">Loading...</div>
        </div>
      }>
        <PaymentContent />
      </Suspense>
    </main>
  )
}

