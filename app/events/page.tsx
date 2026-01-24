"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FloatingParticles } from "@/components/floating-particles"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

const workshops = [
	{
		id: "w-01",
		title: "Workshop 1",
		description:
			"Dive into the unknown depths of emerging technology. Classified briefing on advanced systems.",
		label: "W-01",
	},
	{
		id: "w-02",
		title: "Workshop 2",
		description:
			"Explore the parallel dimensions of innovation. Hands-on experiments with cutting-edge tools.",
		label: "W-02",
	},
]

const otherEvents = [
	{
		id: "paper-presentation-1",
		title: "Paper Presentation-UPSIRE",
		description: "Present your research findings from the depths of the unknown.",
		label: "001",
	},
	{
		id: "paper-presentation-2",
		title: "Paper Presentation-INQUISTA",
		description: "Share discoveries that defy conventional understanding.",
		label: "002",
	},
	{
		id: "hackathon",
		title: "Project Presentation",
		description: "48 hours in the Upside Down. Build or be consumed by the void.",
		label: "003",
	},
	{
		id: "codeathon",
		title: "Codeathon",
		description: "Race against time in the shadow realm of algorithms.",
		label: "004",
	},
	{
		id: "bot-lf",
		title: "BOT-PATHTRONIX",
		description: "Line following automatons navigate the dark corridors.",
		label: "005",
	},
	{
		id: "bot-ba",
		title: "BOT BATTLE ARENA",
		description: "Battle arena where machines clash in supernatural combat.",
		label: "006",
	},
	{
		id: "design-event",
		title: "DESIGN-PIXFROGE",
		description: "Create visuals that transcend dimensions and reality.",
		label: "007",
	},
	{ id: "quiz", title: "Quiz", description: "Test your knowledge of the mysteries that lurk beyond.", label: "008" },
	{
		id: "non-tech-1",
		title: "Non Tech",
		description: "Activities from another dimension, no tech required.",
		label: "009",
	},
	{ id: "non-tech-2", title: "NON TECH - EQUINOX", description: "More supernatural challenges await the brave.", label: "010" },
	{ id: "tech", title: "TECH EVENT-AMPERON", description: "Technical challenges that push the boundaries of reality.", label: "011" },
	{
		id: "flagship",
		title: "FF ARENA",
		description: "The ultimate event. Face the Demogorgon of all challenges.",
		label: "012",
	},
]

function WorkshopCard({
	id,
	title,
	description,
	label,
}: {
	id: string
	title: string
	description: string
	label: string
}) {
	return (
		<Link href={`/workshops/${id}`} className="group relative block cursor-pointer">
			<div className="relative bg-black/80 border border-red-900/50 p-4 sm:p-6 overflow-hidden transition-all duration-300 hover:border-red-600 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:scale-[1.02] group-hover:animate-glitch-subtle">
				{/* Scanline effect */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent h-[200%] animate-scanline-scroll" />
				</div>

				{/* Corner marks */}
				<div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-red-600/60" />
				<div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-red-600/60" />
				<div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-red-600/60" />
				<div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-red-600/60" />

				{/* Neon glowing label with flicker animation */}
				<div
					className="absolute -top-1 -right-1 px-2 py-0.5 font-mono text-[10px] sm:text-xs tracking-wider text-red-400 rotate-2"
					style={{
						textShadow:
							"0 0 5px rgba(220, 38, 38, 0.8), 0 0 10px rgba(220, 38, 38, 0.6), 0 0 20px rgba(220, 38, 38, 0.4)",
						animation: "labelFlicker 3s infinite",
					}}
				>
					{label}
				</div>

				{/* Content */}
				<h3 className="font-serif text-lg sm:text-xl text-red-500 mb-2 sm:mb-3 tracking-wide group-hover:animate-glitch-1 transition-all">
					{title}
				</h3>
				<p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{description}</p>

				{/* Hover glow overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
			</div>
		</Link>
	)
}

function EventCard({
	id,
	title,
	description,
	label,
	isRegistered,
}: {
	id: string
	title: string
	description: string
	label: string
	isRegistered: boolean
}) {
	const router = useRouter()

	const handleCardClick = () => {
		router.push(`/events/${id}`)
	}

	return (
		<div className="group relative">
			<div
				onClick={handleCardClick}
				className="block cursor-pointer"
				role="link"
				tabIndex={0}
				onKeyDown={(e) => e.key === "Enter" && router.push(`/events/${id}`)}
			>
				<div className="relative bg-black/80 border border-red-900/50 p-4 sm:p-6 overflow-hidden transition-all duration-300 hover:border-red-600 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-border-pulse group-hover:animate-none">
					{/* Scanline effect */}
					<div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
						<div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent h-[200%] animate-scanline-scroll" />
					</div>

					{/* Corner marks */}
					<div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-red-600/60" />
					<div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-red-600/60" />
					<div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-red-600/60" />
					<div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-red-600/60" />

					{/* Label Badge */}
					<div className="absolute -top-1 -right-1">
						<div
							className="px-2 py-0.5 font-mono text-[10px] sm:text-xs tracking-wider text-red-400 rotate-2"
							style={{
								textShadow:
									"0 0 5px rgba(220, 38, 38, 0.8), 0 0 10px rgba(220, 38, 38, 0.6), 0 0 20px rgba(220, 38, 38, 0.4)",
								animation: "labelFlicker 3s infinite",
							}}
						>
							{label}
						</div>
					</div>

					{/* Content */}
					<h3 className="font-serif text-lg sm:text-xl text-red-500 mb-2 sm:mb-3 tracking-wide group-hover:animate-glitch-1 transition-all">
						{title}
					</h3>
					<p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">{description}</p>

					{isRegistered && (
						<div className="mt-2 px-4 sm:px-6 py-2 bg-green-950/20 border border-green-900/50 text-green-400 text-xs sm:text-sm font-mono tracking-wider">
							REGISTERED
						</div>
					)}

					{/* Hover glow overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
				</div>
			</div>
		</div>
	)
}

export default function EventsPage() {
	const { isLoggedIn, login, user, isLoading: authLoading, refetch } = useAuth()
	const { toast } = useToast()
	useEffect(() => {
		refetch()
	}, [refetch])
	const [userData, setUserData] = useState<any>(null)
	const [loading, setLoading] = useState(true)

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

	const handleRegisterEvent = async (eventId: string) => {
		try {
			const response = await fetch("/api/user/register-event", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
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

			// Refresh user data
			const userResponse = await fetch("/api/user/me")
			if (userResponse.ok) {
				const data = await userResponse.json()
				setUserData(data)
			}

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
		}
	}

	if (loading || authLoading) {
		return (
			<main className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
				<div className="text-red-500 font-mono">Loading...</div>
			</main>
		)
	}

	if (!isLoggedIn) {
		return (
			<main className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
				{/* Background layers */}
				<div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/20 to-black" />

				{/* Fog layers */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div
						className="absolute -inset-1/2 bg-gradient-radial from-red-900/20 via-transparent to-transparent animate-fog-slow blur-3xl"
						style={{ width: "150%", height: "150%" }}
					/>
				</div>

				{/* Floating particles */}
				<FloatingParticles />

				{/* VHS grain overlay */}
				<div
					className="absolute inset-0 pointer-events-none z-40 opacity-[0.03] animate-grain"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
					}}
				/>

				{/* Content */}
				<div className="relative z-20 text-center px-4">
					<h1 className="font-serif text-3xl sm:text-5xl text-red-600 tracking-[0.2em] mb-6 animate-flicker drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]">
						ACCESS DENIED
					</h1>
					<p className="text-gray-400 text-sm sm:text-base mb-8 max-w-md mx-auto">
						Please sign in to view events from the Upside Down
					</p>
					<button
						onClick={login}
						className="px-8 py-3 bg-transparent border border-red-600 text-red-500 font-mono text-sm tracking-wider hover:bg-red-600/20 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all duration-300"
					>
						SIGN IN
					</button>
				</div>
			</main>
		)
	}

	return (
		<main className="relative min-h-screen bg-black overflow-hidden">
			{/* Background layers */}
			<div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/20 to-black" />

			{/* Fog layers */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div
					className="absolute -inset-1/2 bg-gradient-radial from-red-900/20 via-transparent to-transparent animate-fog-slow blur-3xl"
					style={{ width: "150%", height: "150%" }}
				/>
				<div
					className="absolute -inset-1/4 bg-gradient-radial from-red-800/15 via-transparent to-transparent animate-fog-mid blur-2xl"
					style={{ width: "120%", height: "120%", top: "20%", left: "-10%" }}
				/>
				<div
					className="absolute inset-0 bg-gradient-radial from-red-950/25 via-transparent to-transparent animate-fog-fast blur-xl"
					style={{ width: "100%", height: "100%", top: "40%" }}
				/>
			</div>

			{/* Floating particles */}
			<FloatingParticles />

			{/* VHS grain overlay */}
			<div
				className="absolute inset-0 pointer-events-none z-40 opacity-[0.03] animate-grain"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
				}}
			/>

			{/* Scanlines */}
			<div
				className="absolute inset-0 pointer-events-none z-40 opacity-[0.02]"
				style={{
					backgroundImage:
						"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
				}}
			/>

			{/* Vignette */}
			<div
				className="absolute inset-0 pointer-events-none z-30 bg-radial-gradient from-transparent via-transparent to-black/80"
				style={{
					background: "radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.8) 100%)",
				}}
			/>

			{/* Content */}
			<div className="relative z-20 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
				<div className="max-w-7xl mx-auto">
					{/* Title */}
					<div className="text-center mb-12 sm:mb-16">
						<h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-red-600 tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-6 animate-flicker drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]">
							UNLOCK THE MYSTERIES
						</h1>

						{/* Energy beam divider */}
						<div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
							<div className="h-[1px] w-16 sm:w-32 bg-gradient-to-r from-transparent via-red-600 to-red-600 animate-energy-beam" />
							<div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-600 animate-pulse-glow shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
							<div className="h-[1px] w-16 sm:w-32 bg-gradient-to-l from-transparent via-red-600 to-red-600 animate-energy-beam-delay" />
						</div>
					</div>

					{/* Workshops Section */}
					<section className="mb-12 sm:mb-16">
						<h2 className="font-serif text-xl sm:text-2xl text-red-500/80 tracking-widest mb-6 sm:mb-8 text-center">
							— WORKSHOPS —
						</h2>
						<div className="flex justify-center items-center gap-6 flex-row w-full max-w-2xl mx-auto">
							{workshops.map((workshop, index) => (
								<div
									key={workshop.id}
									className="animate-content-fade-in opacity-0"
									style={{ animationDelay: `${index * 0.15}s`, animationFillMode: "forwards" }}
								>
									<WorkshopCard {...workshop} />
								</div>
							))}
						</div>
					</section>

					{/* Other Events Section */}
					<section>
						<h2 className="font-serif text-xl sm:text-2xl text-red-500/80 tracking-widest mb-6 sm:mb-8 text-center">
							— EVENTS —
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
							{otherEvents.map((event, index) => (
								<div
									key={event.id}
									className="animate-content-fade-in opacity-0"
									style={{ animationDelay: `${0.5 + index * 0.1}s`, animationFillMode: "forwards" }}
								>
									<EventCard
										{...event}
										isRegistered={userData?.eventsRegistered?.includes(event.id) || false}
									/>
								</div>
							))}
						</div>
					</section>

					{/* Back to Portal */}
					<div className="text-center mt-12 sm:mt-16">
						<Link
							href="/"
							className="inline-block px-6 sm:px-8 py-3 border border-red-800/50 text-red-500/70 font-mono text-xs sm:text-sm tracking-wider hover:border-red-600 hover:text-red-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]"
						>
							← RETURN TO PORTAL
						</Link>
					</div>
				</div>
			</div>
		</main>
	)
}
