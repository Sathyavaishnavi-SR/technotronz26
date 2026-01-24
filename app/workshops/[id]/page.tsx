"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { FloatingParticles } from "@/components/floating-particles"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"

// Workshop data mapping
const workshopData: Record<
  string,
  {
    title: string
    description: string[]
    rounds: { name: string; description: string }[]
    mode?: string
    dateTime: string
    rules: string[]
    coordinators: { name: string; phone: string }[]
    fileCode: string
  }
> = {
  "w-01": {
    title: "LoRa Based IoT Application Development",
    description: [
      "This workshop provides participants with a solid introduction to Internet of Things (IoT) technology through a blend of conceptual learning and hands-on experience. It covers embedded systems, microcontrollers, sensors, and key communication protocols used in real-world IoT applications. Participants will work with platforms such as Arduino and thingZkit Mini, along with wireless technologies like LoRa and LoRaWAN. The workshop also introduces cloud integration and data visualization for complete IoT solutions. By the end, participants will gain practical skills to work with modern hardware, collaborate ethically in teams or individually, and design innovative IoT solutions tailored to industry and client needs."
    ],
    rounds: [],
    mode: "Offline",
    dateTime: "07/02/2026 | 9:00 am - 5:00 pm",
    rules: [
      "Participation : Individual",
      "Entry fee : Rs.500 (Same for PSG Tech and non-PSG Tech; no general fee required if attending only the workshop)",
    ],
    coordinators: [
      { name: "Murali", phone: "+91 93426 28687" },
      { name: "Prahalya", phone: "+91 93451 32434" },
    ],
    fileCode: "FILE W-01",
  },
  "w-02": {
    title: "ModelCraft with MATLAB - Simulink for Industrial Applications",
    description: [
      "This workshop introduces Model-Based Development using MATLAB and Simulink for industrial applications, offering a systematic approach to designing, simulating, and validating complex systems. Participants will learn how mathematical models form the foundation of system development, enabling early testing, analysis, and optimization before hardware implementation. The workshop covers building dynamic models, performance evaluation, and automatic code generation for real-time and embedded systems. Industry-focused examples from control systems, automotive engineering, power electronics, and automation are explored. Through guided demonstrations and hands-on exercises, participants will understand how model-based design improves accuracy, reduces development time, and enhances reliability, preparing them for modern, industry-standard engineering workflows."
    ],
    rounds: [],
    mode: "Offline",
    dateTime: "07/02/2026 | 9:00 am - 5:00 pm",
    rules: [
      "Participation : Individual",
      "Entry fee : Rs.500 (Same for PSG Tech and non-PSG Tech; no general fee required if attending only the workshop)",
      
    ],
    coordinators: [
      { name: "Pavithran S Y", phone: "+91 93456 93986" },
      { name: "Nishanth", phone: "+91 73058 54418" },
    ],
    fileCode: "FILE W-02",
  },
}

// Default workshop for unknown IDs
const defaultWorkshop = {
  title: "CLASSIFIED WORKSHOP",
  description: [
    "This workshop file has been sealed by Hawkins National Laboratory.",
    "The contents remain classified until further notice from the Department.",
    "Unauthorized access will result in immediate termination of clearance.",
  ],
  rounds: [
    { name: "Round 1", description: "Information Redacted" },
    { name: "Round 2", description: "Information Redacted" },
  ],
  mode: "Offline",
  dateTime: "Date & Time TBD",
  rules: ["Clearance Level 4 required", "Non-disclosure agreement mandatory", "Await further instructions"],
  coordinators: [{ name: "Agent [REDACTED]", phone: "CLASSIFIED" }],
  fileCode: "FILE W-XX",
}

export default function WorkshopDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { isLoggedIn, login, isLoading: authLoading } = useAuth()
  const workshop = workshopData[id] || defaultWorkshop
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isPaying, setIsPaying] = useState(false)

  useEffect(() => {
    async function fetchUserData() {
      if (authLoading) {
        return // Wait for auth to resolve
      }
      if (isLoggedIn) {
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
  }, [isLoggedIn, authLoading])

  const workshopId = id.toUpperCase()
  const isRegistered = userData?.workshopsRegistered?.includes(workshopId) || false
  const paymentStatus = userData?.workshopPayments?.[workshopId] || "NOT_PAID"
  const isPaid = paymentStatus === "PAID"

  const handlePayment = async () => {
    setIsPaying(true)
    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "WORKSHOP", workshopId }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Failed to initiate payment")
        setIsPaying(false)
        return
      }

      // Redirect to PayApp hosted payment page (or mock success page)
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
        return
      }

      alert("Payment initialization failed. Please try again.")
      setIsPaying(false)
    } catch (error) {
      console.error("Payment error:", error)
      alert("An error occurred. Please try again.")
      setIsPaying(false)
    }
  }

  const handleRegister = async () => {
    setIsRegistering(true)
    try {
      const response = await fetch("/api/user/register-workshop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workshopId }),
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.error || "Registration failed")
        setIsRegistering(false)
        return
      }

      // Refresh user data
      const userResponse = await fetch("/api/user/me")
      if (userResponse.ok) {
        const data = await userResponse.json()
        setUserData(data)
      }

      // After registration, redirect to payment
      router.push(`/payment?message=Workshop+registered!+Please+complete+payment.`)
    } catch (error) {
      console.error("Error registering for workshop:", error)
      alert("An error occurred while registering")
      setIsRegistering(false)
    }
  }

  if (loading || authLoading) {
    return (
      <main className="relative min-h-screen bg-black flex items-center justify-center p-4">
        <FloatingParticles />
        <div className="text-red-500 font-mono">Loading...</div>
      </main>
    )
  }

  if (!isLoggedIn) {
    return (
      <main className="relative min-h-screen bg-black flex items-center justify-center p-4">
        <FloatingParticles />
        <div className="relative z-10 text-center space-y-8 max-w-md">
          <h1 className="font-serif text-3xl sm:text-4xl text-red-600 tracking-widest animate-flicker">
            CLASSIFIED BRIEFING
          </h1>
          <div className="bg-red-950/20 border border-red-900/50 p-8 backdrop-blur-sm">
            <p className="text-gray-400 mb-8 font-mono text-sm">
              Clearance Level 2 required to view workshop particulars. Please authenticate.
            </p>
            <button
              onClick={login}
              className="w-full py-4 border-2 border-red-600 text-red-500 font-mono tracking-widest hover:bg-red-600/20 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            >
              SIGN IN
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background image with slow zoom */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-bg-zoom"
        style={{
          backgroundImage: `url('/images/image.png')`,
        }}
      />

      {/* Dark red overlay for text contrast */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-transparent to-red-950/40" />

      {/* VHS grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-40 opacity-[0.06] animate-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-40 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, transparent 30%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <div className="text-center mb-8 sm:mb-12 animate-content-fade-in">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-red-600 tracking-[0.1em] sm:tracking-[0.15em] mb-4 sm:mb-6 animate-flicker drop-shadow-[0_0_40px_rgba(220,38,38,0.9)]">
              {workshop.title}
            </h1>

            {/* Pulsing neon divider */}
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              <div className="h-[2px] w-16 sm:w-24 bg-gradient-to-r from-transparent via-red-600 to-red-600 animate-energy-beam" />
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-600 animate-pulse-glow shadow-[0_0_15px_rgba(220,38,38,1)]" />
              <div className="h-[2px] w-16 sm:w-24 bg-gradient-to-l from-transparent via-red-600 to-transparent animate-energy-beam-delay" />
            </div>
          </div>

          {/* Classified Dossier Card */}
          <div
            className="relative bg-black/90 border border-red-800/60 p-6 sm:p-8 lg:p-10 overflow-hidden animate-card-fade-in"
            style={{
              boxShadow: "0 0 40px rgba(220, 38, 38, 0.3), inset 0 0 60px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Scanline animation inside card */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/20 to-transparent h-[200%] animate-scanline-scroll" />
            </div>

            {/* Distressed texture overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Corner marks */}
            <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-red-600/70" />
            <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-red-600/70" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-red-600/70" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-red-600/70" />

            {/* File code label */}
            <div
              className="absolute top-4 right-4 px-3 py-1 font-mono text-[10px] sm:text-xs tracking-widest text-red-400/90"
              style={{
                textShadow: "0 0 8px rgba(220, 38, 38, 0.8)",
                animation: "labelFlicker 4s infinite",
              }}
            >
              {workshop.fileCode}
            </div>

            {/* Content sections */}
            <div className="relative z-10 space-y-6 sm:space-y-8">
              {/* Description */}
              <section
                className="animate-section-fade-in opacity-0"
                style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
              >
                <h2 className="text-red-500 font-serif text-lg sm:text-xl tracking-wider mb-3 flex items-center gap-2 group">
                  <span
                    className="group-hover:animate-glitch-1"
                    style={{ textShadow: "0 0 10px rgba(220, 38, 38, 0.6)" }}
                  >
                    WORKSHOP DESCRIPTION
                  </span>
                </h2>
                <div className="space-y-3 text-gray-300 text-sm sm:text-base leading-relaxed">
                  {workshop.description.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </section>

              {/* Number of Rounds section removed as per requirements */}

              {/* Mode */}
              <section
                className="animate-section-fade-in opacity-0"
                style={{ animationDelay: "0.75s", animationFillMode: "forwards" }}
              >
                <h2 className="text-red-500 font-serif text-lg sm:text-xl tracking-wider mb-3 flex items-center gap-2 group">
                  <span
                    className="group-hover:animate-glitch-1"
                    style={{ textShadow: "0 0 10px rgba(220, 38, 38, 0.6)" }}
                  >
                    MODE
                  </span>
                </h2>
                <p className="text-gray-300 text-sm sm:text-base font-mono">{workshop.mode || "Offline"}</p>
              </section>

              {/* Date & Time */}
              <section
                className="animate-section-fade-in opacity-0"
                style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
              >
                <h2 className="text-red-500 font-serif text-lg sm:text-xl tracking-wider mb-3 flex items-center gap-2 group">
                  <span
                    className="group-hover:animate-glitch-1"
                    style={{ textShadow: "0 0 10px rgba(220, 38, 38, 0.6)" }}
                  >
                    DATE & TIME
                  </span>
                </h2>
                <p className="text-gray-300 text-sm sm:text-base font-mono">{workshop.dateTime}</p>
              </section>
{/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />

              {/* Entry Fee */}
              <section
                className="animate-section-fade-in opacity-0"
                style={{ animationDelay: "0.95s", animationFillMode: "forwards" }}
              >
                <h2 className="text-red-500 font-serif text-lg sm:text-xl tracking-wider mb-3 flex items-center gap-2 group">
                  <span
                    className="group-hover:animate-glitch-1"
                    style={{ textShadow: "0 0 10px rgba(220, 38, 38, 0.6)" }}
                  >
                    ENTRY FEE
                  </span>
                </h2>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 font-mono text-xs mt-1">◉</span>
                    <div>
                      <span className="text-red-400 font-medium">Non-PSG Tech:</span>
                      <span className="text-gray-400 ml-2 text-sm">Rs. 500</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-600 font-mono text-xs mt-1">◉</span>
                    <div>
                      <span className="text-red-400 font-medium">PSG Tech:</span>
                      <span className="text-gray-400 ml-2 text-sm">Rs. 500</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Rules */}
              <section
                className="animate-section-fade-in opacity-0"
                style={{ animationDelay: "1.05s", animationFillMode: "forwards" }}
              >
                <h2 className="text-red-500 font-serif text-lg sm:text-xl tracking-wider mb-3 flex items-center gap-2 group">
                  <span
                    className="group-hover:animate-glitch-1"
                    style={{ textShadow: "0 0 10px rgba(220, 38, 38, 0.6)" }}
                  >
                    RULES
                  </span>
                </h2>
                <ul className="space-y-2">
                  {workshop.rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-400 text-sm sm:text-base">
                      <span className="text-red-600 font-mono text-xs mt-1">▸</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Coordinators */}
              <section
                className="animate-section-fade-in opacity-0"
                style={{ animationDelay: "1.3s", animationFillMode: "forwards" }}
              >
                <h2 className="text-red-500 font-serif text-lg sm:text-xl tracking-wider mb-3 flex items-center gap-2 group">
                  <span
                    className="group-hover:animate-glitch-1"
                    style={{ textShadow: "0 0 10px rgba(220, 38, 38, 0.6)" }}
                  >
                    COORDINATORS
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {workshop.coordinators.map((coord, i) => (
                    <div
                      key={i}
                      className="bg-red-950/20 border border-red-900/30 p-3 rounded-sm hover:border-red-600/50 transition-colors"
                    >
                      <p className="text-red-400 font-medium text-sm">{coord.name}</p>
                      <p className="text-gray-500 font-mono text-xs mt-1">{coord.phone}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Payment Status */}
              {isLoggedIn && (
                <div
                  className="pt-4 sm:pt-6 animate-section-fade-in opacity-0"
                  style={{ animationDelay: "1.3s", animationFillMode: "forwards" }}
                >
                  <div className="bg-red-950/20 border border-red-900/40 p-4 rounded-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-sm font-mono">Payment Status</span>
                      <span
                        className={`text-xs font-mono px-3 py-1 rounded-full ${
                          isPaid
                            ? "bg-green-900/30 text-green-400 border border-green-600/40"
                            : "bg-red-900/30 text-red-400 border border-red-600/40"
                        }`}
                      >
                        {isPaid ? "PAID" : "NOT PAID"}
                      </span>
                    </div>
                    {isRegistered && (
                      <p className="text-green-400 text-xs font-mono mt-2">✓ Registered for this workshop</p>
                    )}
                  </div>
                </div>
              )}

              {/* Register Now Button */}
              <div
                className="pt-4 sm:pt-6 text-center animate-section-fade-in opacity-0"
                style={{ animationDelay: "1.4s", animationFillMode: "forwards" }}
              >
                {isRegistered && isPaid ? (
                  // Fully registered and paid
                  <div className="relative inline-block px-8 sm:px-12 py-3 sm:py-4 bg-green-950/20 border-2 border-green-600 text-green-400 text-sm sm:text-base font-mono tracking-widest">
                    ✓ REGISTERED & PAID
                  </div>
                ) : isRegistered && !isPaid ? (
                  // Registered but payment pending
                  <button
                    onClick={handlePayment}
                    disabled={isPaying}
                    className="relative inline-block px-8 sm:px-12 py-3 sm:py-4 bg-transparent border-2 border-yellow-600 text-yellow-500 text-sm sm:text-base font-mono tracking-widest overflow-hidden transition-all duration-300 hover:bg-yellow-600/20 hover:text-yellow-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] group animate-pulse-glow-subtle disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      boxShadow: "0 0 20px rgba(234, 179, 8, 0.4), inset 0 0 20px rgba(234, 179, 8, 0.1)",
                    }}
                  >
                    <span className="relative z-10 group-hover:animate-glitch-1">
                      {isPaying ? "PROCESSING..." : "PAY NOW"}
                    </span>
                    <div className="absolute inset-0 bg-yellow-600/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-sm" />
                  </button>
                ) : (
                  // Not registered yet
                  <button
                    onClick={handleRegister}
                    disabled={isRegistering}
                    className="relative inline-block px-8 sm:px-12 py-3 sm:py-4 bg-transparent border-2 border-red-600 text-red-500 text-sm sm:text-base font-mono tracking-widest overflow-hidden transition-all duration-300 hover:bg-red-600/20 hover:text-red-400 hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] group animate-pulse-glow-subtle disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      boxShadow: "0 0 20px rgba(220, 38, 38, 0.4), inset 0 0 20px rgba(220, 38, 38, 0.1)",
                    }}
                  >
                    <span className="relative z-10 group-hover:animate-glitch-1">
                      {isRegistering ? "REGISTERING..." : "REGISTER NOW"}
                    </span>
                    {/* Ripple effect on hover */}
                    <div className="absolute inset-0 bg-red-600/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-sm" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
