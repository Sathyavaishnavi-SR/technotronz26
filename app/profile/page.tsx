"use client"

import { useAuth } from "@/hooks/use-auth"
import { FloatingParticles } from "@/components/floating-particles"
import { Copy, CheckCircle, Shield, CreditCard, User } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

interface UserData {
  id: string
  name: string
  email: string
  tzId: string
  collegeName?: string
  mobileNumber?: string
  yearOfStudy?: string
  department?: string
  eventsRegistered: string[]
  payment?: {
    eventFeePaid: boolean
    eventFeeAmount: number
    workshopsPaid: string[]
  }
  workshopsRegistered: string[]
  workshopPayments: {
    [workshopId: string]: "PAID" | "NOT_PAID"
  }
}

export default function ProfilePage() {
  const { isLoggedIn, user: authUser, login, isLoading: authLoading } = useAuth()
  const [copied, setCopied] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      if (authLoading) {
        return // Wait for auth to resolve
      }
      if (isLoggedIn && authUser) {
        try {
          const response = await fetch("/api/user/me")
          if (response.ok) {
            const data = await response.json()
            setUserData(data)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [isLoggedIn, authUser, authLoading])

  const copyTzId = () => {
    if (userData?.tzId) {
      navigator.clipboard.writeText(userData.tzId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading || authLoading) {
    return (
      <main className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
        <FloatingParticles />
        <div className="text-red-500 font-mono">Loading...</div>
      </main>
    )
  }

  if (!isLoggedIn || !userData) {
    return (
      <main className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
        <FloatingParticles />
        <div className="relative z-20 text-center px-4">
          <h1 className="font-serif text-3xl sm:text-5xl text-red-600 tracking-[0.2em] mb-6 animate-flicker">
            ACCESS DENIED
          </h1>
          <p className="text-gray-400 mb-8">Identification required to access the laboratory database.</p>
          <button
            onClick={login}
            className="px-8 py-3 bg-transparent border border-red-600 text-red-500 font-mono tracking-wider hover:bg-red-600/20 transition-all duration-300"
          >
            SIGN IN
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      <FloatingParticles />

      {/* Atmospheric Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/10 to-black" />
      <div
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.03] animate-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-20 max-w-5xl mx-auto px-4 py-20 sm:py-28">
        {/* Header */}
        <div className="text-center mb-12 animate-content-fade-in">
          <h1 className="font-serif text-3xl sm:text-5xl text-red-600 tracking-widest mb-4 animate-flicker">
            SUBJECT PROFILE
          </h1>
          <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto animate-energy-beam" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section 1: User Info Card */}
          <div className="lg:col-span-1 space-y-6 animate-content-fade-in-delay" style={{ animationDelay: "0.2s" }}>
            <div
              className="relative bg-black/90 border border-red-800/40 p-6 sm:p-8 rounded-sm overflow-hidden"
              style={{ boxShadow: "0 0 30px rgba(127, 29, 29, 0.2)" }}
            >
              <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-red-600/40" />
              <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-red-600/40" />

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full border-2 border-red-600/30 flex items-center justify-center bg-red-950/20 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                  <User className="w-10 h-10 text-red-500" />
                </div>
                <div>
                  <h2 className="text-red-400 font-serif text-xl tracking-wide">{userData.name}</h2>
                  <p className="text-gray-500 text-sm font-mono mt-1">{userData.email}</p>
                </div>

                {userData.collegeName && (
                  <div className="w-full pt-2 border-t border-red-900/20">
                    <p className="text-gray-500 text-xs font-mono">{userData.collegeName}</p>
                    {userData.department && (
                      <p className="text-gray-600 text-[10px] font-mono mt-1">{userData.department}</p>
                    )}
                    {userData.yearOfStudy && (
                      <p className="text-gray-600 text-[10px] font-mono mt-1">{userData.yearOfStudy}</p>
                    )}
                    {userData.mobileNumber && (
                      <p className="text-gray-600 text-[10px] font-mono mt-1">{userData.mobileNumber}</p>
                    )}
                  </div>
                )}

                <div className="w-full pt-4 border-t border-red-900/30">
                  <p className="text-red-600 font-mono text-[10px] tracking-widest uppercase mb-2">Subject ID</p>
                  <div className="flex items-center justify-between bg-red-950/30 border border-red-900/40 px-3 py-2 rounded-sm group">
                    <span className="font-mono text-red-400 text-sm tracking-wider">{userData.tzId || "Pending"}</span>
                    {userData.tzId && (
                      <button onClick={copyTzId} className="text-red-500 hover:text-red-400 transition-colors">
                        {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 & 3: Details */}
          <div className="lg:col-span-2 space-y-6 animate-content-fade-in-delay" style={{ animationDelay: "0.4s" }}>
            {/* Events Status Card */}
            <div className="bg-black/90 border border-red-800/40 p-6 sm:p-8 rounded-sm">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-red-600" />
                <h2 className="text-red-500 font-serif text-xl tracking-wider uppercase">Events Status</h2>
              </div>

              <div
                className={`p-4 rounded-sm border ${userData.payment?.eventFeePaid ? "bg-green-950/10 border-green-900/40" : "bg-red-950/10 border-red-900/40"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Access Pass</span>
                  <div className="flex items-center gap-2">
                    {userData.payment?.eventFeePaid ? (
                      <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs font-mono rounded-full border border-green-600/40">
                        PAID
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-900/30 text-red-400 text-xs font-mono rounded-full border border-red-600/40">
                        NOT PAID
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-500 text-xs italic leading-relaxed mb-3">
                  One-time payment (₹{userData.payment?.eventFeeAmount || 200}) gives access to all 12 intercollegiate symposium events. Please visit the help desk
                  if status is pending after payment.
                </p>
                {!userData.payment?.eventFeePaid && (
                  <Link
                    href="/payment"
                    className="inline-block mt-2 px-4 py-2 bg-transparent border border-red-600 text-red-500 text-xs font-mono tracking-wider hover:bg-red-600/20 transition-all"
                  >
                    PROCEED TO EVENT PAYMENT
                  </Link>
                )}
              </div>
            </div>

            {/* Workshops Status Card */}
            <div className="bg-black/90 border border-red-800/40 p-6 sm:p-8 rounded-sm">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-red-600" />
                <h2 className="text-red-500 font-serif text-xl tracking-wider uppercase">Workshop Clearance</h2>
              </div>

              <div className="space-y-4">
                {["W-01", "W-02"].map((wid) => (
                  <div
                    key={wid}
                    className="flex items-center justify-between p-3 bg-red-950/10 border border-red-900/30 rounded-sm hover:border-red-600/40 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-red-400 font-mono text-sm tracking-widest">{wid}</span>
                      <span className="text-gray-500 text-[10px] uppercase">Advanced Workshop Session</span>
                      <span className="text-gray-400 text-xs font-mono mt-1">₹500</span>
                    </div>
                    <div>
                      {userData.workshopPayments?.[wid] === "PAID" ? (
                        <span className="text-green-500 text-xs font-bold font-mono tracking-tighter shadow-sm">
                          ✅ PAID
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs font-bold font-mono tracking-tighter">NOT PAID</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-4">
              <Link
                href="/events"
                className="text-red-500/60 hover:text-red-400 font-mono text-xs tracking-widest transition-colors uppercase"
              >
                ← Explore More Mysteries
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
