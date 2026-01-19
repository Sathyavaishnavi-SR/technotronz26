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
    rounds?: { name: string; description: string }[]
    venue?: string
    requirements?: string[]
    EntryFee: string
    dateTime: string
    rules: string[]
    coordinators: { name: string; phone: string }[]
    fileCode: string
    mode?: string
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
    mode: "Offline",
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
    EntryFee: "200 for non-PSG Tech, 250 for PSG Tech",
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
    mode: "Offline",
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
    EntryFee: "200 for non-PSG Tech, 250 for PSG Tech",
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
    mode: "Offline",
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
    EntryFee: "200 for non-PSG Tech, 250 for PSG Tech",
    fileCode: "FILE-003",
  },
  hackathon: {
    title: "HACKATHON",
    description: [
      "48 hours in the Upside Down. Build or be consumed by the void of infinite possibilities.",
      "Push the boundaries of creation as time warps around you in this ultimate coding challenge.",
      "Only the strongest minds will survive the darkness and emerge with solutions to save the world.",
    ],
    rounds: [
      { name: "Round 1", description: "Ideation Phase - Pitch your concept to the council" },
      { name: "Round 2", description: "Development Sprint - 24 hours of intense building" },
      { name: "Round 3", description: "Final Presentation - Showcase your creation" },
    ],
    mode: "Offline",
    dateTime: "February 28-29, 2025 — 48 Hours Non-Stop",
    rules: [
      "Team size: 3-4 members",
      "Original work only - no pre-built solutions",
      "Must use at least one API from sponsors",
      "Sleeping bags and refreshments allowed",
      "Mentors available throughout the event",
    ],
    coordinators: [
      { name: "Steve Harrington", phone: "9876543216" },
      { name: "Nancy Wheeler", phone: "9876543217" },
    ],
    EntryFee: "200 for non-PSG Tech, 250 for PSG Tech",
    fileCode: "FILE-004",
  },
  codeathon: {
    title: "CODEATHON",
    description: [
      "Race against time in the shadow realm of algorithms where every second counts.",
      "Solve puzzles that twist reality and challenge your perception of what's possible.",
      "The clock ticks down as you navigate through increasingly complex challenges.",
    ],
    rounds: [
      { name: "Round 1", description: "Warm-up Challenges - Easy to Medium difficulty" },
      { name: "Round 2", description: "Final Battle - Hard problems only" },
    ],
    mode: "Offline",
    dateTime: "March 1, 2025 — 2:00 PM to 6:00 PM",
    rules: [
      "Individual participation",
      "Languages allowed: C, C++, Java, Python",
      "Internet access prohibited during contest",
      "Plagiarism results in immediate disqualification",
    ],
    coordinators: [
      { name: "Roshan", phone: "9876543218" },
      { name: "Roshan", phone: "0" },
    ],
    EntryFee: "200 for non-PSG Tech, 250 for PSG Tech",
    fileCode: "FILE-005",
  },
  "bot-lf": {
    title: "BOT LF",
    description: [
      "Line following automatons navigate the dark corridors of the Upside Down.",
      "Program your creation to sense the path through shadow and light.",
      "Only the most precise machines will find their way through the maze.",
    ],
    rounds: [
      { name: "Round 1", description: "Time Trials - Complete the track" },
      { name: "Round 2", description: "Final Race - Head-to-head competition" },
    ],
    mode: "Offline",
    dateTime: "March 1, 2025 — 10:00 AM to 2:00 PM",
    rules: [
      "Bot dimensions: Max 20cm x 20cm",
      "Pre-built bots allowed",
      "Maximum 2 attempts per round",
      "No wireless controllers",
    ],
    coordinators: [
      { name: "Jonathan Byers", phone: "9876543220" },
      { name: "Argyle", phone: "9876543221" },
    ],
    EntryFee: "200 for non-PSG Tech, 250 for PSG Tech",
    fileCode: "FILE-006",
  },
  "bot-ba": {
    title: "BOT BATTLE ARENA",
    description: [
      "Bot Battle Arena is a high-intensity combat robotics event where teams design and build manually controlled robots to compete inside a circular arena. The objective is to outmaneuver, push, lift, or force the opponent robot beyond the arena boundary. This event emphasizes mechanical strength, stability, and strategic thinking offering an adrenaline-filled experience for robotics enthusiasts.",
    ],
    rounds: [
      { name: "Round 1-Arena Clash", description: "Arena Clash is the qualifying elimination round where robots compete in one-on-one battles inside the circular arena. Teams must demonstrate precise control, balance, and effective attack or defense strategies to force their opponent out of bounds. This round focuses on maneuverability, aggression, and stability, with winners advancing to the next stage." },
      { name: "Round 2-Final Knockout", description: "Final Knockout is the decisive stage where the strongest robots face off in high-stakes battles. Matches become more intense as teams adapt strategies based on previous encounters. Judges closely monitor control, dominance, and safety, and the robot that consistently overpowers its opponent emerges as the champion." },
    ],
    mode: "Offline",
    dateTime: "February 2, 2025 — 9:00 PM to 01:00 PM",
    rules: [
      "Only manually controlled robots are permitted for the event. Control methods allowed include wired control and Bluetooth / RC control.",
      "Fully autonomous robots, pre-programmed navigation, or sensor-based automatic movement are strictly prohibited.",
      "Detection of any autonomous behavior at any stage will result in immediate disqualification.",
      "The competition follows a knockout elimination format with one-on-one matches.",
      "The loser of each match is eliminated, and the winner advances to the next round.",
      "No league or round-robin format will be followed.",
      "Each match will last 2–3 minutes.",
      "If no robot is eliminated within the time limit, judges will decide the winner based on control, strategy, aggression, and arena dominance.",
      "The judges’ decision is final and binding in all cases.",
      "A team wins a match if it pushes, lifts, or forces the opponent robot completely outside the arena boundary or holds the opponent on or beyond the boundary for 5 continuous seconds.",
      "Intentional damage to the opponent’s robot, electronics, or structure is strictly prohibited.",
      "Use of fire, liquids, explosives, entanglement devices, or signal jamming is not allowed.",
      "Cutting wires, breaking components deliberately, or interfering with opponent controls will lead to disqualification.",
      "Allowed actions include pushing, lifting, blocking, defensive positioning, and strategic maneuvering.",
      "Judges may stop a match at any time for safety concerns, and safety violations override match results.",
      "Event coordinators reserve the right to modify rules when required for safety and fairness.",
      "Bots must be ready at the scheduled call time.",
      "Unauthorized or unnecessary touching of the robot may lead to a reduction in bot touch points.",
      "Each team must bring a fully charged robot, spare batteries, controller/remote, and basic repair tools.",
      "The robot must be battery powered only; external power supplies are strictly prohibited.",
      "Batteries must be securely mounted and properly insulated. Battery replacement is allowed only between matches, not during a live match.",
      "The robot must be hand-built by the participating team. Commercially pre-assembled robots or ready-made kits are not allowed.",
      "Use of off-the-shelf components such as motors, wheels, gearboxes, motor drivers, and controllers is permitted. Custom-fabricated and 3D-printed parts are allowed.",
      "Robot dimensions and weight must strictly comply with the following limits:",
      "Weight: 3 – 4 kg",
      "Height: 25 – 35 cm",
      "Length: 30 – 40 cm",
      "Breadth: 30 – 40 cm",
      "Robots must not have sharp edges, spikes, or dangerous protrusions.",
      "Exposed wiring or uncovered battery terminals are strictly prohibited. All wiring must be properly insulated.",
      "Robots must pass a pre-event safety inspection to be allowed to compete.",
      "The arena is circular with a diameter of 6–7 feet, featuring a black boundary line on a flat, non-slippery surface.",
      "A robot is considered OUT if any part of it completely crosses the boundary line.",
    ],
    coordinators: [
      { name: "Murali", phone:"+91 9342628687" },
      { name: "Varalakshmi", phone:"+91 9042676481" },
    ],
    EntryFee: "200 for non-PSG Tech, 250 for PSG Tech",
    fileCode: "FILE-007",
  },
  "design-event": {
    title: "DESIGN EVENT-PIXFORGE",
    description: [
      "PixForge is a creative design competition that celebrates visual storytelling, originality, and digital design skills. The event encourages participants to communicate strong social and environmental messages through impactful poster designs using professional design tools. It provides a platform for designers to showcase creativity, technical proficiency, and attention to detail under time constraints.",
    ],
    rounds: [
      { name: "Round 1-Sketchmorph", description: "Sketchmorph focuses on original poster creation based on the given theme. Participants are required to design a visually compelling poster using Adobe Photoshop, emphasizing creativity, composition, typography, color harmony, and message clarity. The round evaluates how effectively participants translate ideas into meaningful visual communication." },
      { name: "Round 2-Framefix", description: "Framefix is a precision-based challenge where shortlisted participants must recreate a displayed poster as accurately as possible within a limited duration. This round tests attention to detail, Photoshop proficiency, time management, and the ability to replicate design elements such as layout, color grading, and typography." },
    ],
    mode: "Offline",
    dateTime: "February 8, 2026 — 9:00 AM to 12:00 PM",
    rules: [
      "Individual participation only",
      "Theme must strictly follow the given topics",
      "Poster size must be A4 vertical format",
      "Participants must submit the final poster in JPG or PNG format",
      "A working PSD file with visible layers must also be submitted",
      "Use of copyright-protected or plagiarized content is strictly prohibited",
      "AI-generated images are not allowed",
      "Minor brushes, textures, and overlays are permitted",
      "Flattened PSD files will not be accepted",
      "Work must be original; plagiarism leads to disqualification",
    ],
    coordinators: [
      { name: "Meiyarasan", phone: "+91 7010700186" },
      { name: "Sam", phone: "+91 9361551878" },
    ],
    requirements: [
      "Laptop",
      "Adobe Photoshop installed",
      "Mouse (optional)",
    ],
    EntryFee: "200 for non-PSG Tech, 250 for PSG Tech",
    fileCode: "FILE-008",
  },
  quiz: {
    title: "QUIZ-QUIZTOPIA",
    description: [
      "Get ready for an engaging quiz event that will put your knowledge and instincts to the ultimate test. Think fast, act smart, and rise to the challenge! Participants will face a series of thought-provoking questions that challenge their critical thinking and quick recall. With prizes and recognition at stake, it promises a fun and engaging experience for everyone. Join us for an unforgettable event filled with learning, excitement, and friendly competition!",
    ],
    rounds: [
      { name: "Round 1-Qlash", description: "Teams of two compete to answer 25 thought-provoking questions within a strict 1-hour limit. The questions come with weighted scores, adding an extra layer of strategy as teams balance speed and accuracy. Only the top-scoring teams advance to the next round, setting the stage for more intense competition." },
      { name: "Round 2-Rapidex", description: "Rapidex takes the competition to the next level, with 6 teams for a 1-hour intellectual battle. Teams collaborate to answer a curated selection of challenging questions, with answers presented audibly. The team with the highest score at the end of this round is crowned the winner, concluding the thrilling contest." },
    ],
    mode: "Offline",
    dateTime: "February 7, 2026 — 9:00 AM to 12:00 PM",
    rules: [
      "Team size: 2 members",
    ],
    coordinators: [
      { name: "Subhasurya", phone: "+91 9566400624" },
      { name: "Vaishnavi", phone: "+91 7418703425" },
    ],
    EntryFee: "200 for non-PSG Tech, 250 for PSG Tech",
    fileCode: "FILE-009",
  },
  "non-tech-1": {
    title: "NON TECH 1-FINESCAPE",
    description: [
      "FinEscape is an escape-room–style analytical challenge that tests participants’ logic, observation, and problem-solving skills under time pressure. Competing in teams of two, participants progress through a series of interconnected checkpoints, each unlocking clues essential for advancing further. The event blends visual reasoning, numerical analysis, pattern recognition, and strategic thinking, ensuring a dynamic and engaging experience. Every stage builds on previously discovered information, demanding accuracy, teamwork, and quick decision-making. With a mix of puzzles, data interpretation, and creative logic, FinEscape offers an immersive non-technical challenge where only the most focused and analytical teams succeed in uncovering the final escape code.",
    ],
    mode: "Offline",
    dateTime: "February 7, 2026 — 9:00 AM to 12:00 PM",
    rules: ["Participation: 2 members"],
    coordinators: [
      { name: "Roshan", phone: "+91 9345847502" },
      { name: "Gopika", phone: "+91 9042790305" },
    ],
    EntryFee: "200 for non-PSG Tech, 250 for PSG Tech",
    fileCode: "FILE-010",
  },
  "non-tech-2": {
    title: "NON TECH 2-EQUINOX",
    description: [
      "Equinox is a dynamic non-technical team event that focuses on balance, coordination, and teamwork. It challenges participants through a mix of fast-paced activities and strategic duo tasks. Teams must adapt quickly, communicate effectively, and stay synchronized under time pressure. Each round tests different skills including memory, precision, logic, and trust. Equinox delivers an engaging and energetic experience where collaboration leads to victory.",
    ],
    rounds: [
      { name: "Round 1-SyncSphere", description: "SyncSphere is a fast-paced, multi-task challenge where all teams participate simultaneously across a series of engaging activity stations. Teams rotate through eight different tasks in a cyclic order, with a fixed time limit of two minutes per task. Each activity tests different skills such as coordination, logic, precision, memory, and creativity.. Points are awarded only for tasks completed within the time limit. Teams must adapt quickly as they move from one task to another. " },
      { name: "Round 2-Twin Tactix Arena", description: "Twin Tactix Arena intensifies the competition with a set of paired challenges designed exclusively for two-member teams. Each task focuses on communication, trust, synchronization, and quick decision-making under pressure. Teams must rely heavily on verbal cues and mutual understanding to succeed. Accuracy, timing, and teamwork play a crucial role in scoring." },
    ],
    mode: "Offline",
    dateTime: "February 7, 2026 - 9:00 AM to 12:00 PM",
    rules: ["Team size: 2 members"],
    coordinators: [
      { name: "Jayasri Rani S", phone: "+91 9360737144" },
      { name: " Prakalya", phone: "+91 9092544666" },
    ],
    EntryFee: "200 for non-PSG Tech, 250 for PSG Tech",
    fileCode: "FILE-011",
  },
  tech: {
    title: "TECH-AMPERON",
    description: [
    "Amperon is a technical event that immerses participants in a high-energy problem-solving scenario inspired by power grid failures and electronic instability. Teams step into the role of trainees tasked with diagnosing abnormal electrical behavior, analyzing logical inconsistencies, and restoring system stability. The event focuses on core electronics concepts making it an engaging challenge for students passionate about circuits and analytical thinking."
    ],
    rounds: [
      { name: "Round 1-Netfract", description: "Netfract is the initial challenge where participants face a series of logical and aptitude-based questions designed around fundamental electronics concepts. Teams will analyze patterns, current flow behavior, circuit symbols, and component-based reasoning tasks without relying on formulas. This round evaluates analytical skills, quick decision-making, and the ability to interpret circuit behavior under time pressure." },
      { name: "Round 2-Energen", description: "Energen represents the recovery phase where teams are given a partially faulty circuit that simulates a damaged power node. Participants must carefully inspect the circuit, identify faults, and determine the components required for repair. Components are earned by solving logic, aptitude, and electronics-based tasks. Once acquired, teams must repair the circuit within the given time, ensuring correct polarity, steady output, and safe operation. " },
    ],
    mode: "Offline",
    dateTime: "February 8, 2026 — 9:00 AM to 12:00 PM",
    rules: [
      "Team size: 2 members",
    ],
    coordinators: [
      { name: "P. U. Jagadhish Kumaar", phone: "+91 9952513520" },
      { name: "Kavinaya", phone: "+91 9025147460" },
    ],
    EntryFee: "200 for non-PSG Tech, 250 for PSG Tech",
    fileCode: "FILE-012",
  },
  flagship: {
    title: "FLAGSHIP-FF ARENA",
    description: [
      "The ultimate event. Face the Demogorgon of all challenges and emerge victorious.",
      "Every skill you possess will be tested in this legendary competition.",
      "Only the chosen ones will conquer the flagship and claim eternal glory.",
    ],
    rounds: [
      { name: "Round 1: Alphazone (Clash Squad – Eliminator Format)", description: "Round 1 is conducted in Clash Squad mode with teams competing in head-to-head matches. Each match follows a Best of 7 rounds format, where the first team to secure 4 wins is declared the winner. Every team plays only one match, and the total match completion time is recorded. This round emphasizes tactical coordination, communication, role-based gameplay, and efficiency. Qualification for the next round is decided based on match results and completion time, as determined by the organizers." },
      { name: "Round 2: Metazone (Battle Royale Mode)", description: "Round 2 is the final stage of the event, where qualified teams compete simultaneously in a Squad Battle Royale match. The shrinking safe zone forces intense engagements and strategic positioning. Teams are evaluated based on survival, adaptability, coordination, and combat performance. Final rankings are calculated using a points system that combines placement points and kill points. The team with the highest total score is crowned the winner." },
      { name: "Round 3", description: "Grand Finale - Legend is born" },
    ],
    mode: "Offline",
    dateTime: "February 2, 2026 - 9:00 AM to 12:00 PM",
    EntryFee: "200 for non-PSG Tech, 250 for PSG Tech",
    rules: [
      "Each team must consist of exactly 4 registered players",
      "No mid-match substitutions are allowed",
      "All players must use verified Free Fire accounts",
      "Guest logins are strictly prohibited",
      "Use of hacks, cheats, bugs, or third-party tools will result in immediate disqualification",
      "Teaming with other squads is not permitted",
      "Abusive language, toxic behavior, or misconduct is strictly prohibited",
      "Players are not allowed to exit the lobby once a match has started",
      "Organizer decisions regarding matches and results are final and binding",
    ],
    coordinators: [
      { name: "Sunil  Sanjay ", phone: "+91 9360041571" },
      { name: "Roshan", phone: "+91 9345847502" },
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
    mode: "Offline",
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
    EntryFee: "200 for non-PSG Tech, 250 for PSG Tech",
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
    mode: "Offline",
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
    EntryFee: "200 for non-PSG Tech, 250 for PSG Tech",
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
  mode: "Offline",
  EntryFee: "200 for non-PSG Tech, 250 for PSG Tech",
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
