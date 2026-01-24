"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface EventDetailsClientProps {
  eventId: string;
  isRegistered: boolean;
  event: {
    title: string;
    mode?: string;
    description: string[];
    rounds?: { name: string; description: string }[];
    venue?: string;
    requirements?: string[];
    EntryFee: string;
    dateTime: string;
    rules: string[];
    coordinators: { name: string; phone: string }[];
    domains?: string[];
    generalInstructions?: string[];
  };
}

const EventDetailsClient: React.FC<EventDetailsClientProps> = ({ eventId, event, isRegistered: initialIsRegistered }) => {
    const isWorkshop = eventId.startsWith("workshop-");
  const router = useRouter()
  const { toast } = useToast()
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered)
  const [isPaying, setIsPaying] = useState(false)
  const [showPayNow, setShowPayNow] = useState(false)

  const handleRegister = async () => {
    setIsRegistering(true)
    try {
      const response = await fetch("/api/user/register-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: result.error || "Unable to register for this event",
        })
        return
      }

      // Update local state and refresh page
      setIsRegistered(true)
      // Show Pay Now button for events (workshops handle payment elsewhere)
      if (!isWorkshop) setShowPayNow(true)
      router.refresh()
      toast({
        variant: "success",
        title: "Registration Successful!",
        description: "You have been registered for this event.",
      })
    } catch (error) {
      console.error("Error registering for event:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while registering. Please try again.",
      })
    } finally {
      setIsRegistering(false)
    }
  };

  const handlePayment = async () => {
    setIsPaying(true)
    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "EVENT" }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({ variant: "destructive", title: "Payment Error", description: data.error || "Failed to initiate payment" })
        setIsPaying(false)
        return
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
        return
      }

      toast({ variant: "destructive", title: "Payment Error", description: "Payment initialization failed. Please try again." })
      setIsPaying(false)
    } catch (error) {
      console.error("Payment error:", error)
      toast({ variant: "destructive", title: "Error", description: "An error occurred. Please try again." })
      setIsPaying(false)
    }
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
              {event.title}
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

            {/* Classified label */}
            <div className="absolute -top-1 left-4 sm:left-6 bg-red-900/90 text-red-300 text-[10px] sm:text-xs px-3 py-1 font-mono tracking-widest">
              CLASSIFIED
            </div>

            {/* Content sections */}
            <div className="space-y-6 sm:space-y-8 mt-4">
              {/* Event/Workshop Description */}
              <section
                className="animate-content-fade-in opacity-0"
                style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
              >
                <h3 className="font-serif text-lg sm:text-xl text-red-500 tracking-wider mb-3 animate-flicker hover:animate-glitch-1 transition-all cursor-default">
                  {isWorkshop ? 'WORKSHOP DESCRIPTION' : 'EVENT DESCRIPTION'}
                </h3>
                <div className="space-y-2">
                  {event.description.map((para, i) => (
                    <p key={i} className="text-gray-400 text-sm sm:text-base leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </section>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />

              {/* Number of Rounds (hide for workshops) */}
              {!isWorkshop && event.rounds && event.rounds.length > 0 && (
                <section
                  className="animate-content-fade-in opacity-0"
                  style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
                >
                  <h3 className="font-serif text-lg sm:text-xl text-red-500 tracking-wider mb-3 animate-flicker hover:animate-glitch-1 transition-all cursor-default">
                    NUMBER OF ROUNDS
                  </h3>
                  <ul className="space-y-2">
                    {event.rounds.map((round, i) => (
                      <li
                        key={i}
                        className="text-gray-400 text-sm sm:text-base flex items-start gap-2 animate-list-item-fade opacity-0"
                        style={{ animationDelay: `${0.4 + i * 0.1}s`, animationFillMode: "forwards" }}
                      >
                        <span className="text-red-600 mt-1">▸</span>
                        <span>
                          <span className="text-red-400">{round.name}:</span> {round.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Domains Section */}
              {!isWorkshop && event.domains && event.domains.length > 0 && (
                <section
                  className="animate-content-fade-in opacity-0"
                  style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
                >
                  <h3 className="font-serif text-lg sm:text-xl text-red-500 tracking-wider mb-3 animate-flicker hover:animate-glitch-1 transition-all cursor-default">
                    DOMAINS
                  </h3>
                  <ul className="space-y-2">
                    {event.domains.map((domain, i) => (
                      <li
                        key={i}
                        className="text-gray-400 text-sm sm:text-base flex items-start gap-2 animate-list-item-fade opacity-0"
                        style={{ animationDelay: `${0.45 + i * 0.08}s`, animationFillMode: "forwards" }}
                      >
                        <span className="text-red-600 mt-1">•</span>
                        <span>{domain}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />

              {/* Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <section
                  className="animate-content-fade-in opacity-0"
                  style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
                >
                  <h3 className="font-serif text-lg sm:text-xl text-red-500 tracking-wider mb-3 animate-flicker hover:animate-glitch-1 transition-all cursor-default">
                    MODE
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base flex items-center gap-2">
                    <span className="text-red-600">◉</span>
                    {event.mode || "Offline"}
                  </p>
                </section>

                <section
                  className="animate-content-fade-in opacity-0"
                  style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
                >
                  <h3 className="font-serif text-lg sm:text-xl text-red-500 tracking-wider mb-3 animate-flicker hover:animate-glitch-1 transition-all cursor-default">
                    DATE & TIME
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base flex items-center gap-2">
                    <span className="text-red-600">◉</span>
                    {event.dateTime}
                  </p>
                </section>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />
{/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />

              {/* Entry Fee */}
              <section
                className="animate-content-fade-in opacity-0"
                style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
              >
                <h3 className="font-serif text-lg sm:text-xl text-red-500 tracking-wider mb-3 animate-flicker hover:animate-glitch-1 transition-all cursor-default">
                  ENTRY FEE
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm sm:text-base flex items-start gap-2">
                    <span className="text-red-600 mt-1">◉</span>
                    <span>{isWorkshop ? "Rs.500" : event.EntryFee}</span>
                  </p>
                </div>
              </section>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />

              {/* Event Requirements */}
              {event.requirements && event.requirements.length > 0 && (
                <>
                  <section
                    className="animate-content-fade-in opacity-0"
                    style={{ animationDelay: "0.62s", animationFillMode: "forwards" }}
                  >
                    <h3 className="font-serif text-lg sm:text-xl text-red-500 tracking-wider mb-3 animate-flicker hover:animate-glitch-1 transition-all cursor-default">
                      EVENT REQUIREMENTS
                    </h3>
                    <ul className="space-y-2">
                      {event.requirements.map((req, i) => (
                        <li
                          key={i}
                          className="text-gray-400 text-sm sm:text-base flex items-start gap-2 animate-list-item-fade opacity-0"
                          style={{ animationDelay: `${0.65 + i * 0.08}s`, animationFillMode: "forwards" }}
                        >
                          <span className="text-red-600 mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />
                </>
              )}
              {/* Rules & Guidelines */}
              <section
                className="animate-content-fade-in opacity-0"
                style={{ animationDelay: "0.65s", animationFillMode: "forwards" }}
              >
                <h3 className="font-serif text-lg sm:text-xl text-red-500 tracking-wider mb-3 animate-flicker hover:animate-glitch-1 transition-all cursor-default">
                  RULES & GUIDELINES
                </h3>
                <ul className="space-y-2">
                  {event.rules.map((rule, i) => (
                    <li
                      key={i}
                      className="text-gray-400 text-sm sm:text-base flex items-start gap-2 animate-list-item-fade opacity-0"
                      style={{ animationDelay: `${0.7 + i * 0.08}s`, animationFillMode: "forwards" }}
                    >
                      <span className="text-red-600 mt-1">⬡</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-red-800/50 to-transparent" />

              {/* Event Coordinators */}
              <section
                className="animate-content-fade-in opacity-0"
                style={{ animationDelay: "0.85s", animationFillMode: "forwards" }}
              >
                <h3 className="font-serif text-lg sm:text-xl text-red-500 tracking-wider mb-3 animate-flicker hover:animate-glitch-1 transition-all cursor-default">
                  EVENT COORDINATORS
                </h3>
                <ul className="space-y-2">
                  {event.coordinators.map((coord, i) => (
                    <li
                      key={i}
                      className="text-gray-400 text-sm sm:text-base flex items-center gap-2 animate-list-item-fade opacity-0"
                      style={{ animationDelay: `${0.9 + i * 0.1}s`, animationFillMode: "forwards" }}
                    >
                      <span className="text-red-600">☎</span>
                      <span>
                        <span className="text-red-400">{coord.name}</span> — {coord.phone}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Register / Pay Now Button */}
              <div
                className="pt-4 sm:pt-6 text-center animate-content-fade-in opacity-0"
                style={{ animationDelay: "1s", animationFillMode: "forwards" }}
              >
                {/* If this is a workshop use existing flow (handled elsewhere) */}
                {isWorkshop ? (
                  <button
                    onClick={handleRegister}
                    disabled={isRegistering || isRegistered}
                    className={`group relative inline-flex items-center justify-center px-8 sm:px-12 py-3 sm:py-4 bg-transparent border-2 font-serif text-base sm:text-lg tracking-[0.15em] overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isRegistered 
                        ? 'border-green-600 text-green-500' 
                        : 'border-red-600 text-red-500 hover:text-red-300 hover:border-red-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.7)] animate-border-pulse'
                    }`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="absolute w-2 h-2 bg-red-600/50 rounded-full opacity-0 group-hover:animate-portal-ripple" />
                    </span>
                    <span className={`absolute inset-0 transition-all duration-300 ${
                      isRegistered ? 'bg-green-600/10' : 'bg-red-600/0 group-hover:bg-red-600/20'
                    }`} />
                    <span className="relative z-10 group-hover:animate-button-glitch">
                      {isRegistering ? "REGISTERING..." : isRegistered ? "✓ REGISTERED" : "REGISTER NOW →"}
                    </span>
                  </button>
                ) : (
                  // For events: when registered show PAY NOW; otherwise show register button
                  showPayNow && isRegistered ? (
                    <button
                      onClick={handlePayment}
                      disabled={isPaying}
                      className="relative inline-block px-8 sm:px-12 py-3 sm:py-4 bg-transparent border-2 border-yellow-600 text-yellow-500 text-sm sm:text-base font-mono tracking-widest overflow-hidden transition-all duration-300 hover:bg-yellow-600/20 hover:text-yellow-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] group animate-pulse-glow-subtle disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ boxShadow: "0 0 20px rgba(234, 179, 8, 0.4), inset 0 0 20px rgba(234, 179, 8, 0.1)" }}
                    >
                      <span className="relative z-10 group-hover:animate-glitch-1">
                        {isPaying ? "PROCESSING..." : "PAY NOW"}
                      </span>
                      <div className="absolute inset-0 bg-yellow-600/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-sm" />
                    </button>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={isRegistering || isRegistered}
                      className={`group relative inline-flex items-center justify-center px-8 sm:px-12 py-3 sm:py-4 bg-transparent border-2 font-serif text-base sm:text-lg tracking-[0.15em] overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isRegistered 
                          ? 'border-green-600 text-green-500' 
                          : 'border-red-600 text-red-500 hover:text-red-300 hover:border-red-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.7)] animate-border-pulse'
                      }`}
                    >
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="absolute w-2 h-2 bg-red-600/50 rounded-full opacity-0 group-hover:animate-portal-ripple" />
                      </span>
                      <span className={`absolute inset-0 transition-all duration-300 ${
                        isRegistered ? 'bg-green-600/10' : 'bg-red-600/0 group-hover:bg-red-600/20'
                      }`} />
                      <span className="relative z-10 group-hover:animate-button-glitch">
                        {isRegistering ? "REGISTERING..." : isRegistered ? "✓ REGISTERED" : "REGISTER NOW →"}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
};

export default EventDetailsClient;


