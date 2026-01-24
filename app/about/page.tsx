"use client"

import { FloatingParticles } from "@/components/floating-particles"

export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Fog Layers, VHS Grain, Scanline, FloatingParticles, Border, Vignette ...existing code... */}
      <FloatingParticles />
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-16 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8 sm:mb-12 animate-content-fade-in w-full">
          <h1
            className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-red-600 tracking-widest animate-flicker text-balance max-w-[90%] mx-auto"
            style={{
              textShadow:
                "0 0 10px rgba(220, 38, 38, 0.8), 0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(220, 38, 38, 0.4), 0 0 80px rgba(220, 38, 38, 0.2)",
            }}
          >
            General Guidelines
          </h1>
          <div className="flex items-center justify-center mt-6 sm:mt-8">
            <div className="relative h-1 w-48 sm:w-64 md:w-80 overflow-hidden rounded-full">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-energy-beam"
                style={{
                  boxShadow: "0 0 20px rgba(220, 38, 38, 0.8), 0 0 40px rgba(220, 38, 38, 0.4)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50 animate-energy-beam-delay" />
            </div>
          </div>
        </div>
        <div className="relative max-w-3xl w-full animate-content-fade-in-delay group" style={{ animationDelay: "0.3s" }}>
          <div className="relative bg-black/90 border border-red-900/50 rounded-sm p-5 sm:p-8 md:p-10 transition-all duration-500 hover:border-red-700/70 animate-border-pulse" style={{ boxShadow: "0 0 30px rgba(127, 29, 29, 0.3), inset 0 0 60px rgba(0, 0, 0, 0.8)" }}>
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <span className="inline-block px-2 py-1 text-[10px] sm:text-xs font-mono font-bold text-red-500 border border-red-800/60 bg-black/80 tracking-wider animate-flicker" style={{ textShadow: "0 0 8px rgba(220, 38, 38, 0.6)" }}>GUIDELINES</span>
            </div>
            <div className="mt-8 sm:mt-10 space-y-5 sm:space-y-8">
              <ul className="space-y-4 list-disc list-inside text-gray-200 text-base sm:text-lg">
                <li className="font-semibold text-red-400">Event Duration</li>
                <ul className="ml-6 list-disc text-gray-200">
                  <li>All events conducted under TechnoThon are one-day events.</li>
                  <li>Participants are required to complete registration, participation, and departure on the same day.</li>
                </ul>
                <li className="font-semibold text-red-400 mt-4">Accommodation Policy</li>
                <ul className="ml-6 list-disc text-gray-200">
                  <li>Since all events are single-day events, no accommodation facilities will be provided to any participants.</li>
                  <li>Participants are requested to make their own travel and stay arrangements if required.</li>
                </ul>
                <li className="font-semibold text-red-400 mt-4">Registration</li>
                <ul className="ml-6 list-disc text-gray-200">
                  <li>On-spot registration is available for selected events, subject to availability.</li>
                  <li>Participants are strongly advised to complete their paid registration before the event to ensure smooth participation.</li>
                  <li>All registrations will be confirmed only after successful payment.</li>
                  <li>A valid college ID or government-issued ID must be produced during check-in.</li>
                </ul>
                <li className="font-semibold text-red-400 mt-4">Certificates</li>
                <ul className="ml-6 list-disc text-gray-200">
                  <li>E-certificates will be provided to all registered participants who actively participate in the events.</li>
                  <li>Certificates will be shared through the registered email IDs after the event.</li>
                </ul>
                <li className="font-semibold text-red-400 mt-4">Prizes</li>
                <ul className="ml-6 list-disc text-gray-200">
                  <li>Cash prizes will be awarded to Winners and Runner-ups of each competitive event.</li>
                  <li>Workshops are excluded from cash prizes; however, workshop participants will receive e-certificates.</li>
                  <li>Prize distribution details will be announced during the valedictory session or through official communication.</li>
                </ul>
                <li className="font-semibold text-red-400 mt-4">Event Rules</li>
                <ul className="ml-6 list-disc text-gray-200">
                  <li>Each event has its own set of rules and judging criteria, which must be strictly followed.</li>
                  <li>The decision of the judges and event coordinators will be final and binding.</li>
                </ul>
                <li className="font-semibold text-red-400 mt-4">Code of Conduct</li>
                <ul className="ml-6 list-disc text-gray-200">
                  <li>Participants are expected to maintain discipline and professional behavior throughout the event.</li>
                  <li>Any form of malpractice, misconduct, or rule violation may lead to immediate disqualification.</li>
                </ul>
                <li className="font-semibold text-red-400 mt-4">Reporting Time</li>
                <ul className="ml-6 list-disc text-gray-200">
                  <li>Participants must report to the venue at least 30 minutes before the scheduled start time of their respective events.</li>
                  <li>Late entry may not be permitted once an event has commenced.</li>
                </ul>
                <li className="font-semibold text-red-400 mt-4">Use of Resources</li>
                <ul className="ml-6 list-disc text-gray-200">
                  <li>Participants should bring their own laptops, chargers, and required materials unless specified otherwise.</li>
                  <li>Internet access, if provided, is subject to availability and fair usage.</li>
                </ul>
                <li className="font-semibold text-red-400 mt-4">Organizers’ Rights</li>
                <ul className="ml-6 list-disc text-gray-200">
                  <li>The organizing committee reserves the right to modify the event schedule, rules, or prizes if necessary.</li>
                  <li>Any updates will be communicated through official TechnoThon channels.</li>
                </ul>
              </ul>
            </div>
            {/* Corner Distress Marks ...existing code... */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-800/40 rounded-tl-sm" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-red-800/40 rounded-tr-sm" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-red-800/40 rounded-bl-sm" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-red-800/40 rounded-br-sm" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-red-900/0 via-red-600/10 to-red-900/0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
        </div>
        <div className="mt-8 sm:mt-14 animate-content-fade-in-delay" style={{ animationDelay: "0.6s" }}>
          <a href="/events" className="group relative inline-flex items-center justify-center px-6 sm:px-10 py-3.5 sm:py-5 text-sm sm:text-lg font-bold tracking-[0.1em] sm:tracking-[0.15em] uppercase transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]">
            <span className="absolute inset-0 rounded-lg bg-red-600/40 blur-lg group-hover:bg-red-500/60 transition-all duration-500 animate-pulse-slow" />
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-800 via-red-600 to-red-800 opacity-90" />
            <span className="absolute inset-[2px] rounded-md bg-gradient-to-b from-red-950 via-black to-red-950" />
            <span className="absolute inset-0 rounded-lg border-2 border-red-500 group-hover:border-red-400 transition-colors duration-300 animate-border-pulse" />
            <span className="relative z-10 flex items-center gap-2 text-red-100 group-hover:text-white transition-colors duration-300" style={{ textShadow: "0 0 15px rgba(220, 38, 38, 0.9)" }}>
              <span>Back to Events</span>
              <span className="text-red-400 group-hover:text-red-300 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </a>
        </div>
      </div>
    </main>
  )
}
