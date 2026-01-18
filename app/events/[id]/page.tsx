import Link from "next/link"
import { cookies } from "next/headers"
import { getAuthFromCookies } from "@/lib/auth"
import connectDB from "@/lib/db"
import User from "@/models/User"
import UserPayment from "@/models/UserPayment"
import EventDetailsClient from "./EventDetailsClient"

// Event data mapping
const eventData: Record<
  string,
  {
    title: string
    description: string[]
    topics?:string[]
    rounds: { name: string; description: string }[]
    mode: string
    dateTime: string
    requirements?:string[]
    rules: string[]
    coordinators: { name: string; phone: string }[]
    fileCode: string
  }
> = {
  "workshop-1": {
    title: "WORKSHOP 1",
    description: [
      "Venture into the unknown depths of emerging technology where reality bends and possibilities are limitless.",
      "This classified briefing will expose you to advanced systems that exist beyond conventional understanding.",
      "Only those brave enough to face the shadows of innovation will emerge with knowledge from the other side.",
    ],
    rounds: [
      { name: "Round 1", description: "Exploration Phase - Navigate the foundational concepts" },
      { name: "Round 2", description: "Final Showdown - Apply your knowledge in the ultimate test" },
    ],
    mode:"offline",
    dateTime: "February 28, 2025 — 10:00 AM to 1:00 PM",
    rules: [
      "Participants must arrive 15 minutes before the scheduled time",
      "Bring your own laptop with required software pre-installed",
      "Team size: 2-3 members",
      "No external assistance or internet access during rounds",
    ],
    coordinators: [
      { name: "John Doe", phone: "9876543210" },
      { name: "Jane Doe", phone: "9876543211" },
    ],
    fileCode: "FILE-001",
  },
  "workshop-2": {
    title: "WORKSHOP 2",
    description: [
      "Explore the parallel dimensions of innovation where technology transcends its earthly limitations.",
      "Hands-on experiments with cutting-edge tools that blur the line between science and the supernatural.",
      "The veil between worlds grows thin as you master techniques from realms unknown.",
    ],
    rounds: [
      { name: "Round 1", description: "Discovery Phase - Uncover hidden technological secrets" },
      { name: "Round 2", description: "Implementation Phase - Build something extraordinary" },
    ],
    mode:"offline",
    dateTime: "February 28, 2025 — 2:00 PM to 5:00 PM",
    rules: [
      "Individual participation only",
      "Basic programming knowledge required",
      "Materials will be provided on-site",
      "Certificates awarded to all participants",
    ],
    coordinators: [
      { name: "Mike Wheeler", phone: "9876543212" },
      { name: "Eleven", phone: "9876543213" },
    ],
    fileCode: "FILE-002",
  },
  "workshop-3": {
    title: "WORKSHOP 3",
    description: [
      "Unlock hidden potentials in the realm of tech where the impossible becomes inevitable.",
      "Secrets from the Upside Down revealed to those who dare to look beyond the surface.",
      "Transform your understanding of technology in ways that defy conventional explanation.",
    ],
    rounds: [
      { name: "Round 1", description: "Initiation - Enter the realm of advanced concepts" },
      { name: "Round 2", description: "Mastery - Prove your worth in the final challenge" },
    ],
    mode: "offline",
    dateTime: "March 1, 2025 — 9:00 AM to 12:00 PM",
    rules: [
      "Pre-registration mandatory",
      "Bring government-issued ID for verification",
      "Limited seats available - first come, first served",
      "No photography or recording allowed",
    ],
    coordinators: [
      { name: "Dustin Henderson", phone: "9876543214" },
      { name: "Lucas Sinclair", phone: "9876543215" },
    ],
    fileCode: "FILE-003",
  },
  hackathon: {
    title: "HACKATHON - HACKZEN",
    description: [
     "Hackzen is an innovation-driven hackathon that encourages participants to collaboratively design solutions for real-world challenges within a limited time. The event promotes creativity, feasibility, and rapid development while allowing teams to explore diverse technology and application domains. It serves as a platform for transforming ideas into impactful solutions through structured evaluation and hands-on prototyping."
    ],
    rounds: [
      { name: "IdeaXone", description: "IdeaXone is the ideation and proposal phase where teams select a domain and identify a meaningful problem within it. Participants present a clear problem statement along with an innovative solution, explaining the approach, technology stack, feasibility, and potential impact. Participants will be given a duration of 7-mins to present their ideas. This round focuses on originality, clarity of thought, and effective communication, with the most promising teams advancing to the next stage." },
      { name: "BuildVerse", description: "BuildVerse challenges shortlisted teams to bring their ideas to life through working prototypes. Participants demonstrate the functionality of their solution, explain design and development decisions, and showcase how the prototype addresses the identified problem within a duration of 7-mins. Evaluation is based on technical depth, practicality, usability, and execution quality." },
    ],
    mode: "offline",
    dateTime: "February 07, 2026 -  9:00 am - 01:00 pm",
    rules: [
      "Team of  2 - 4 members",
      "Teams must submit the presentation of their proposed solution on or before the specified deadline for shortlisting",
      "Selected teams should bring their working prototype on the event day",
      "Shortlisted teams for Round 2 must present and demonstrate their prototype during evaluation",
      "All submissions must be original; plagiarism or use of pre-built solutions is strictly prohibited",
      "Teams should be prepared to clearly explain the problem statement, solution approach, and technical implementation",
    ],
    topics:[ "Artificial Intelligence & Machine Learning",
    "Internet of Things (IoT)",
    "Signal Processing",
    "Embedded Systems",
    "Robotics and Automation",
    "Healthcare & MedTech",
    "Agriculture Technology (AgriTech)",
    "Smart Cities",
    ],
    coordinators: [
      { name: "Rohini", phone: "+91 88386 19825" },
      { name: "Sunil  Sanjay ", phone: "+91 93600 41571" },
    ],
    fileCode: "FILE-004",
  },
  codeathon: {
    title: "CODEATHON",
    description: [
      "Codeathon is a competitive coding event designed to test participants’ logical thinking, problem-solving ability, and programming fundamentals under time pressure. The event challenges teams to apply core concepts of data structures, algorithms, and computational logic while maintaining accuracy and efficiency. ",
    ],
    rounds: [
      { name: "LogicXpress", description: "LogicXpress is the preliminary round focused on assessing core programming knowledge and logical reasoning. Participants answer a wide range of questions covering topics such as memory allocation, pointers, recursion, type casting, strings, functions, exception handling, object-oriented concepts, and time complexity.Speed, accuracy, and strong conceptual understanding are key to securing a place in the final round." },
      { name: "Codex", description: "Codex is the advanced coding round where shortlisted teams solve challenging algorithmic problems. Participants work on problems involving dynamic programming and graph traversal techniques. This round emphasizes optimization, efficient logic formulation, and clean implementation. Teams are evaluated based on correctness, performance, and overall problem-solving approach." },
    ],
    mode: "offline",
    dateTime: "February 08,2026 — 9:00 am - 12:00 pm",
    rules: [
      "Participation : Team of  2 members",
    ],
    coordinators: [
      { name: "Kavinaya", phone: "+91 90251 47460" },
      { name: "Prahalya", phone: "+91 93451 32434" },
    ],
    fileCode: "FILE-005",
  },
  "bot-lf": {
    title: "BOT EVENT 1 - PATHTRONIX",
    description: [
      "PathTronix is an exciting Line Following Robot Challenge that invites participants to design and program autonomous robots capable of navigating a predefined track using intelligent line-following techniques. The event unfolds across multiple rounds, each testing precision, speed, adaptability, and control. From sharp curves and intersections to ramps and obstacles, teams must showcase robust design and smart .",
    ],
    rounds: [
      { name: "Tracron", description: "This round tests the robot’s ability to handle a dynamic track filled with straight and dashed lines, sharp turns, false paths, and misleading trails. Precision sensing, quick correction, and intelligent path selection are crucial to avoid distractions. Teams must strike the perfect balance between speed and accuracy, as smooth navigation can be the key to advancing further." },
      { name: "SmackBot", description: "The challenge escalates with the introduction of ramps and solid obstacles. Robots must maintain stability and line tracking while tackling elevation changes and physical barriers. Strong mechanical design, proper traction, and efficient obstacle-handling strategies are essential. This round pushes teams to demonstrate resilience, recovery skills, and advanced navigation under tougher conditions." },
    ],
    mode: "offline",
    dateTime: "February 08, 2026 — 9:00 am - 13:00 pm",
    requirements: ["Only fully autonomous robots are allowed; remote-controlled robots are not permitted",
    "Robots must run only on onboard power (no external power supply)",
    "Robot size must not exceed 20 × 20 × 10  (L × W × H) in cm",
    "Track length will be 15 to 20 meters, depending on the round",
    "Line width will be 20 to 25 mm",
    "Obstacles will be 10 cm cubes weighing 20 to 50 grams",
    "Ramp inclination will be 20 to 25 degrees",
    "Gaps in dashed lines will be 20 to 25 mm",
    ],
    rules: [
      "The practice track and the actual competition track will be different",
      "The time recorded by the organizers will be taken as final for scoring",
      "If a robot goes off the line, it must restart from the nearest checkpoint already crossed",
      "Robots must not damage the track or leave marks on it; any damage will lead to immediate disqualification",
      "The maximum time allowed per run is 3 to 5 minutes, depending on the round",
    ],
    coordinators: [
      { name: "Jayasri Rani S ", phone: "+91 93607 37144" },
      { name: "Pavithran S Y ", phone: "+91 93456 93986" },
    ],
    fileCode: "FILE-006",
  },
  "bot-ba": {
    title: "BOT BA",
    description: [
      "Battle arena where machines clash in supernatural combat from another dimension.",
      "Build your warrior to dominate the arena and destroy all opposition.",
      "Only one will emerge victorious from the chaos of the Upside Down battleground.",
    ],
    rounds: [
      { name: "Round 1", description: "Qualifying Battles - Prove your bot's worth" },
      { name: "Round 2", description: "Semi-Finals - The survivors clash" },
      { name: "Round 3", description: "Grand Final - Champion crowned" },
    ],
    mode: "offline",
    dateTime: "March 1, 2025 — 3:00 PM to 7:00 PM",
    rules: [
      "Weight limit: 5kg maximum",
      "No projectiles or flammable materials",
      "Wireless control mandatory",
      "Safety inspection required before competition",
    ],
    coordinators: [
      { name: "Murray Bauman", phone: "9876543222" },
      { name: "Dmitri Antonov", phone: "9876543223" },
    ],
    fileCode: "FILE-007",
  },
  "design-event": {
    title: "DESIGN EVENT",
    description: [
      "Create visuals that transcend dimensions and bend reality to your artistic will.",
      "Channel the supernatural energy of the Upside Down into your designs.",
      "Show us visions that exist beyond the veil of ordinary perception.",
    ],
    rounds: [
      { name: "Round 1", description: "Theme Reveal - 2 hours to create" },
      { name: "Round 2", description: "Presentation - Defend your vision" },
    ],
    mode: "offline",
    dateTime: "February 28, 2025 — 11:00 AM to 3:00 PM",
    rules: [
      "Software: Adobe Suite or Figma only",
      "Original artwork required",
      "Submit in PNG/PDF format",
      "Theme revealed at event start",
    ],
    coordinators: [
      { name: "Max Mayfield", phone: "9876543224" },
      { name: "Erica Sinclair", phone: "9876543225" },
    ],
    fileCode: "FILE-008",
  },
  quiz: {
    title: "QUIZ",
    description: [
      "Test your knowledge of the mysteries that lurk beyond ordinary understanding.",
      "Questions that probe the depths of technology, science, and the unknown.",
      "Only those with minds sharp as Demogorgon claws will prevail.",
    ],
    rounds: [
      { name: "Round 1", description: "Written Prelims - Top 20 qualify" },
      { name: "Round 2", description: "Buzzer Round - Quick-fire questions" },
      { name: "Round 3", description: "Final Showdown - The ultimate test" },
    ],
    mode: "offline",
    dateTime: "March 1, 2025 — 11:00 AM to 1:00 PM",
    rules: [
      "Team size: 2 members",
      "No electronic devices allowed",
      "Questions in English only",
      "Judge's decision is final",
    ],
    coordinators: [
      { name: "Will Byers", phone: "9876543226" },
      { name: "Joyce Byers", phone: "9876543227" },
    ],
    fileCode: "FILE-009",
  },
  "non-tech-1": {
    title: "NON TECH 1",
    description: [
      "Activities from another dimension where technology takes a back seat.",
      "Challenge your mind and body in ways that defy conventional competition.",
      "The Upside Down has more mysteries than just circuits and code.",
    ],
    rounds: [
      { name: "Round 1", description: "Elimination Games" },
      { name: "Round 2", description: "Finals" },
    ],
    mode: "offline",
    dateTime: "February 28, 2025 — 4:00 PM to 6:00 PM",
    rules: ["Individual participation", "Comfortable clothing recommended", "Rules explained at venue", "Have fun!"],
    coordinators: [
      { name: "Hopper", phone: "9876543228" },
      { name: "Karen Wheeler", phone: "9876543229" },
    ],
    fileCode: "FILE-010",
  },
  "non-tech-2": {
    title: "NON TECH 2",
    description: [
      "More supernatural challenges await the brave souls who venture here.",
      "Leave your laptops behind and embrace the chaos of the unknown.",
      "Sometimes the greatest adventures require no technology at all.",
    ],
    rounds: [
      { name: "Round 1", description: "Team Challenges" },
      { name: "Round 2", description: "Individual Finals" },
    ],
    mode: "offline",
    dateTime: "March 1, 2025 — 4:00 PM to 6:00 PM",
    rules: ["Team size: 4 members", "Sportswear mandatory", "ID cards required", "Spirit of sportsmanship expected"],
    coordinators: [
      { name: "Bob Newby", phone: "9876543230" },
      { name: "Barb Holland", phone: "9876543231" },
    ],
    fileCode: "FILE-011",
  },
  tech: {
    title: "TECH",
    description: [
      "Technical challenges that push the boundaries of reality and possibility.",
      "Prove your mastery over machines and code in this ultimate test.",
      "The Upside Down rewards those who understand its technological secrets.",
    ],
    rounds: [
      { name: "Round 1", description: "Technical Quiz" },
      { name: "Round 2", description: "Hands-on Challenge" },
    ],
    mode: "offline",
    dateTime: "February 28, 2025 — 1:00 PM to 4:00 PM",
    rules: [
      "Individual participation",
      "Bring your own laptop",
      "Internet access provided",
      "Multiple domains covered",
    ],
    coordinators: [
      { name: "Dr. Brenner", phone: "9876543232" },
      { name: "Dr. Owens", phone: "9876543233" },
    ],
    fileCode: "FILE-012",
  },
  flagship: {
    title: "FLAGSHIP",
    description: [
      "The ultimate event. Face the Demogorgon of all challenges and emerge victorious.",
      "Every skill you possess will be tested in this legendary competition.",
      "Only the chosen ones will conquer the flagship and claim eternal glory.",
    ],
    rounds: [
      { name: "Round 1", description: "Qualifier - Survival of the fittest" },
      { name: "Round 2", description: "Semi-Final - The elite clash" },
      { name: "Round 3", description: "Grand Finale - Legend is born" },
    ],
    mode: "offline",
    dateTime: "March 1, 2025 — All Day Event",
    rules: [
      "Team size: 3-5 members",
      "Multi-disciplinary challenges",
      "Surprise elements throughout",
      "Flagship trophy + cash prize for winners",
      "Registration closes 24 hours before event",
    ],
    coordinators: [
      { name: "Vecna", phone: "9876543234" },
      { name: "Mind Flayer", phone: "9876543235" },
    ],
    fileCode: "FILE-013",
  },
  "paper-presentation-1": {
    title: "PAPER PRESENTATION 1",
    description: [
      "Present your research findings from the depths of the unknown scientific frontier.",
      "Share discoveries that challenge conventional understanding of our world.",
      "The brightest minds gather to illuminate the darkness with knowledge.",
    ],
    rounds: [
      { name: "Round 1", description: "Abstract Submission Review" },
      { name: "Round 2", description: "Presentation & Q&A" },
    ],
    mode: "offline",
    dateTime: "February 28, 2025 — 9:00 AM to 12:00 PM",
    rules: [
      "Team size: 1-2 members",
      "10 minutes presentation + 5 minutes Q&A",
      "PPT format only",
      "Original research preferred",
    ],
    coordinators: [
      { name: "Scott Clarke", phone: "9876543236" },
      { name: "Principal Coleman", phone: "9876543237" },
    ],
    fileCode: "FILE-014",
  },
  "paper-presentation-2": {
    title: "PAPER PRESENTATION 2",
    description: [
      "Share discoveries that defy conventional understanding and open new portals of thought.",
      "Your research could be the key to unlocking mysteries yet unsolved.",
      "Present to the council and change the course of technological history.",
    ],
    rounds: [
      { name: "Round 1", description: "Paper Screening" },
      { name: "Round 2", description: "Live Presentation" },
    ],
    mode: "offline",
    dateTime: "March 1, 2025 — 9:00 AM to 12:00 PM",
    rules: [
      "IEEE format required",
      "Plagiarism check mandatory",
      "Domain: AI/ML, IoT, Cybersecurity",
      "Best paper award available",
    ],
    coordinators: [
      { name: "Alexei", phone: "9876543238" },
      { name: "Yuri", phone: "9876543239" },
    ],
    fileCode: "FILE-015",
  },
}

// Default event for unknown IDs
const defaultEvent = {
  title: "CLASSIFIED EVENT",
  description: [
    "This event file has been sealed by Hawkins National Laboratory.",
    "The contents remain classified until further notice from the Department.",
    "Unauthorized access will result in immediate termination of clearance.",
  ],
  rounds: [
    { name: "Round 1", description: "Information Redacted" },
    { name: "Round 2", description: "Information Redacted" },
  ],
  mode: "offline",
  dateTime: "Date & Time TBD",
  rules: ["Clearance Level 4 required", "Non-disclosure agreement mandatory", "Await further instructions"],
  coordinators: [{ name: "Agent [REDACTED]", phone: "CLASSIFIED" }],
  fileCode: "FILE-XXX",
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = eventData[id] || defaultEvent

  // Server-side: Fetch session and user data using JWT
  const cookieStore = await cookies()
  const auth = getAuthFromCookies(cookieStore)
  let isRegistered = false
  let eventFeePaid = false
  const isAuthenticated = !!auth

  if (isAuthenticated && auth) {
    try {
      await connectDB()

      // Fetch user data by userId from JWT
      const user = await User.findById(auth.userId)
      
      if (user) {
        // Check if user is registered for this event
        isRegistered = user.eventsRegistered?.includes(id) || false

        // Fetch payment status
        const userPayment = await UserPayment.findOne({ userId: auth.userId })
        if (userPayment) {
          eventFeePaid = userPayment.eventFeePaid
        }
      }
    } catch (error) {
      console.error("[EventDetailsPage] Error fetching user data:", error)
      // Continue with default values on error
    }
  }

  return (
    <EventDetailsClient
      eventId={id}
      event={event}
      isRegistered={isRegistered}
      eventFeePaid={eventFeePaid}
      isAuthenticated={isAuthenticated}
    />
  )
}
