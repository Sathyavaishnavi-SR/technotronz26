"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Copy, LogOut, User, Check, Clock, Calendar, Wrench, CreditCard } from "lucide-react"

interface UserDetails {
  eventsRegistered: string[]
  workshopsRegistered: string[]
  workshopPayments: Record<string, string>
  payment?: {
    eventFeePaid: boolean
    eventFeeAmount: number
    workshopsPaid: string[]
  }
}

export function ProfileDropdown() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch user details when dropdown opens
  useEffect(() => {
    if (isOpen && user && !userDetails) {
      setLoadingDetails(true)
      fetch("/api/user/me")
        .then(res => res.json())
        .then(data => {
          setUserDetails({
            eventsRegistered: data.eventsRegistered || [],
            workshopsRegistered: data.workshopsRegistered || [],
            workshopPayments: data.workshopPayments || {},
            payment: data.payment,
          })
        })
        .catch(err => console.error("Error fetching user details:", err))
        .finally(() => setLoadingDetails(false))
    }
  }, [isOpen, user, userDetails])

  if (!user) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(user.tzId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const eventFeePaid = userDetails?.payment?.eventFeePaid || false
  const eventsRegistered = userDetails?.eventsRegistered || []
  const workshopsRegistered = (userDetails?.workshopsRegistered || []).filter(w => w !== "W-03" && w !== "w-03");
  const workshopPayments = userDetails?.workshopPayments || {}
  const workshopsPaidArray = userDetails?.payment?.workshopsPaid || []

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-red-600 bg-black/90 overflow-hidden hover:border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.8)] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-tr from-red-900/80 to-red-950/50" />
          <div className="absolute inset-0 flex items-center justify-center font-serif text-red-400 text-xl font-bold drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <span className="text-[9px] font-mono tracking-widest text-red-500 drop-shadow-[0_0_6px_rgba(220,38,38,0.6)] group-hover:text-red-400 transition-colors">
          PROFILE
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-black/95 border border-red-900/60 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-content-fade-in origin-top-right z-50 max-h-[80vh] overflow-y-auto">
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/20 to-transparent h-[200%] animate-scanline-scroll" />
          </div>

          <div className="p-4 sm:p-5 relative z-10">
            {/* User Info */}
            <div className="mb-4">
              <p className="font-serif text-lg text-red-500 tracking-wide">{user.name}</p>
              <p className="text-gray-500 text-xs font-mono lowercase">{user.email}</p>
              <div className="mt-2 flex items-center justify-between bg-red-950/20 border border-red-900/30 px-2 py-1.5 rounded-sm">
                <span className="text-[10px] font-mono text-red-400/80 tracking-tighter">ID: {user.tzId}</span>
                <button onClick={handleCopy} className="text-red-600 hover:text-red-400 transition-colors">
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            <div className="h-px bg-red-900/30 my-4" />

            {loadingDetails ? (
              <div className="text-center py-4">
                <span className="text-gray-500 text-xs font-mono animate-pulse">Loading...</span>
              </div>
            ) : (
              <>
                {/* Events Section */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={12} className="text-red-500" />
                    <p className="text-[10px] font-mono text-gray-500 tracking-[0.2em]">EVENTS</p>
                  </div>
                  
                  {/* Event Fee Status */}
                  <div className="bg-red-950/20 border border-red-900/30 p-2 rounded-sm mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-400">Access Pass</span>
                      {eventFeePaid ? (
                        <span className="flex items-center gap-1 text-[10px] text-green-500 font-mono">
                          <Check size={10} /> PAID
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-yellow-500 font-mono">
                          <Clock size={10} /> PENDING
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Registered Events */}
                  {eventsRegistered.length > 0 ? (
                    <div className="space-y-1">
                      {eventsRegistered.map((eventId) => (
                        <div key={eventId} className="flex items-center justify-between bg-black/30 border border-red-900/20 px-2 py-1.5 rounded-sm">
                          <span className="text-[10px] font-mono text-gray-300">{eventId}</span>
                          {eventFeePaid ? (
                            <span className="text-[9px] font-mono text-green-500">✓ PAID</span>
                          ) : (
                            <span className="text-[9px] font-mono text-yellow-500">PENDING</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] font-mono text-gray-600 italic">No events registered</p>
                  )}
                </div>

                <div className="h-px bg-red-900/30 my-4" />

                {/* Workshops Section */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench size={12} className="text-red-500" />
                    <p className="text-[10px] font-mono text-gray-500 tracking-[0.2em]">WORKSHOPS</p>
                  </div>

                  {workshopsRegistered.length > 0 ? (
                    <div className="space-y-1">
                      {workshopsRegistered.map((workshopId) => {
                        const isPaid = workshopsPaidArray.includes(workshopId) || workshopPayments[workshopId] === "PAID"
                        return (
                          <div key={workshopId} className="flex items-center justify-between bg-black/30 border border-red-900/20 px-2 py-1.5 rounded-sm">
                            <span className="text-[10px] font-mono text-gray-300">{workshopId}</span>
                            {isPaid ? (
                              <span className="text-[9px] font-mono text-green-500">✓ PAID</span>
                            ) : (
                              <span className="text-[9px] font-mono text-yellow-500">PENDING</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-[10px] font-mono text-gray-600 italic">No workshops registered</p>
                  )}
                </div>

                <div className="h-px bg-red-900/30 my-4" />

                {/* Payment Link */}
                <Link
                  href="/payment"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 py-2 mb-3 border border-red-900/50 text-[10px] font-mono text-red-400 hover:bg-red-600/10 hover:text-red-300 transition-all"
                >
                  <CreditCard size={12} /> VIEW PAYMENT PORTAL
                </Link>
              </>
            )}

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2 border border-red-900/50 text-[10px] font-mono text-gray-300 hover:bg-red-600/10 hover:text-red-400 transition-all"
              >
                <User size={12} /> PROFILE
              </Link>
              <button
                onClick={logout}
                className="flex items-center justify-center gap-1.5 py-2 border border-red-900/50 text-[10px] font-mono text-red-600 hover:bg-red-950/30 transition-all"
              >
                <LogOut size={12} /> LOGOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
