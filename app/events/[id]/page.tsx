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
    topics?:string[]
    rules: string[]
    coordinators: { name: string; phone: string }[]
    fileCode: string
    mode?: string
    domains?: string[]
    generalInstructions?: string[]
    topics?: string[]
  }
> = {
  "workshop-1": {
    title: "LoRa Based IoT Application Development",
    description: [
      "This workshop provides participants with a solid introduction to Internet of Things (IoT) technology through a blend of conceptual learning and hands-on experience. It covers embedded systems, microcontrollers, sensors, and key communication protocols used in real-world IoT applications. Participants will work with platforms such as Arduino and thingZkit Mini, along with wireless technologies like LoRa and LoRaWAN. The workshop also introduces cloud integration and data visualization for complete IoT solutions. By the end, participants will gain practical skills to work with modern hardware, collaborate ethically in teams or individually, and design innovative IoT solutions tailored to industry and client needs."
    ],
    mode: "Offline",
    dateTime: "07/02/2026",
    rules: [
      "Participation : Individual",
      "Entry fee : Rs.500 (Same for PSG Tech and non-PSG Tech; no general fee required if attending only the workshop)"
    ],
    coordinators: [
      { name: "Murali", phone: "+91 93426 28687" },
      { name: "Prahalya", phone: "+91 93451 32434" },
    ],
    EntryFee: "Rs.500",
    fileCode: "FILE W-01",
  },
  "workshop-2": {
    title: "ModelCraft with MATLAB - Simulink for Industrial Applications",
    description: [
      "This workshop introduces Model-Based Development using MATLAB and Simulink for industrial applications, offering a systematic approach to designing, simulating, and validating complex systems. Participants will learn how mathematical models form the foundation of system development, enabling early testing, analysis, and optimization before hardware implementation. The workshop covers building dynamic models, performance evaluation, and automatic code generation for real-time and embedded systems. Industry-focused examples from control systems, automotive engineering, power electronics, and automation are explored. Through guided demonstrations and hands-on exercises, participants will understand how model-based design improves accuracy, reduces development time, and enhances reliability, preparing them for modern, industry-standard engineering workflows."
    ],
    mode: "Offline",
    dateTime: "07/02/2026",
    rules: [
      "Participation : Individual",
      "Entry fee : Rs.500 (Same for PSG Tech and non-PSG Tech; no general fee required if attending only the workshop)"
    ],
    coordinators: [
      { name: "Pavithran S Y", phone: "+91 93456 93986" },
      { name: "Nishanth", phone: "+91 73058 54418" },
    ],
    EntryFee: "Rs.500",
    fileCode: "FILE W-02",
  },


  hackathon: {
    title: "HACKZEN",
    description: [
      "Hackzen is an innovation-driven hackathon that encourages participants to collaboratively design solutions for real-world challenges within a limited time. The event promotes creativity, feasibility, and rapid development while allowing teams to explore diverse technology and application domains. It serves as a platform for transforming ideas into impactful solutions through structured evaluation and hands-on prototyping."
    ],
    mode: "Offline",
    dateTime: "07/02/2026\n9:30 am - 3:30 pm",
    rules: [
      "Participation : Team of  2 - 4 members",
      "Submission mail id : technotronz26hackiete@gmail.com",
      "Abstract submission deadline : 01/02/2026",
      "Teams must submit the presentation of their proposed solution on or before the specified deadline for shortlisting",
      "Selected teams should bring their working prototype on the event day",
      "Shortlisted teams for Round 2 must present and demonstrate their prototype during evaluation",
      "All submissions must be original; plagiarism or use of pre-built solutions is strictly prohibited",
      "Teams should be prepared to clearly explain the problem statement, solution approach, and technical implementation"
    ],
    coordinators: [
      { name: "Rohini", phone: "+91 88386 19825" },
      { name: "Sunil  Sanjay", phone: "+91 93600 41571" }
    ],
    EntryFee: "General fee (Rs.250 for non-PSG Tech and Rs.200 for PSG Tech)",
    fileCode: "FILE-003",
    rounds: [
      {
        name: "Round 1 : IdeaXone",
        description: `IdeaXone is the ideation and proposal phase in which teams select a domain and identify a meaningful problem within it. Participants present a clear problem statement along with an innovative solution, explaining their approach, technology stack, feasibility, and potential impact. Abstracts must be submitted before the deadline, after which teams will be shortlisted to present in this round. Each team will be allotted 7 minutes to present their ideas. This round emphasizes originality, clarity of thought, and effective communication, with the most promising teams advancing to the next stage.`
      },
      {
        name: "Round 2 : BuildVerse",
        description: `BuildVerse challenges shortlisted teams to bring their ideas to life through working prototypes. Participants demonstrate the functionality of their solution, explain design and development decisions, and showcase how the prototype addresses the identified problem within a duration of 7-mins. Evaluation is based on technical depth, practicality, usability, and execution quality.`
      }
    ],
    domains: [
      "Artificial Intelligence & Machine Learning",
      "Internet of Things (IoT)",
      "Signal Processing",
      "Embedded Systems",
      "Robotics and Automation",
      "Healthcare & MedTech",
      "Agriculture Technology (AgriTech)",
      "Smart Cities"
    ],
   
  },
  codeathon: {
    title: "CODEATHON",
    description: [
      "Codeathon is a competitive coding event designed to test participants’ logical thinking, problem-solving ability, and programming fundamentals under time pressure. The event challenges teams to apply core concepts of data structures, algorithms, and computational logic while maintaining accuracy and efficiency."
    ],
    mode: "Offline",
    dateTime: "08/02/2026\n9:30 am - 12:30 pm",
    rules: [
      "Participation : Team of  2 members",
      "Entry fee : General fee (Rs.250 for non-PSG Tech and Rs.200 for PSG Tech)",
      "Contact info : Kavinaya : +91 90251 47460, Prahalya - +91 93451 32434"
    ],
    coordinators: [
      { name: "Kavinaya", phone: "+91 90251 47460" },
      { name: "Prahalya", phone: "+91 93451 32434" }
    ],
    EntryFee: "General fee (Rs.250 for non-PSG Tech and Rs.200 for PSG Tech)",
    fileCode: "FILE-004",
    rounds: [
      {
        name: "Round 1 : LogicXpress",
        description: "LogicXpress is the preliminary round focused on assessing core programming knowledge and logical reasoning. Participants answer a wide range of questions covering topics such as memory allocation, pointers, recursion, type casting, strings, functions, exception handling, object-oriented concepts, and time complexity. Speed, accuracy, and strong conceptual understanding are key to securing a place in the final round."
      },
      {
        name: "Round 2 : Codex",
        description: "Codex is the advanced coding round where shortlisted teams solve challenging algorithmic problems. Participants work on problems involving dynamic programming and graph traversal techniques. This round emphasizes optimization, efficient logic formulation, and clean implementation. Teams are evaluated based on correctness, performance, and overall problem-solving approach."
      }
    ]
  },
  "bot-lf": {
    title: "PATHTRONIX",
    description: [
      "PathTronix is an exciting Line Following Robot Challenge that invites participants to design and program autonomous robots capable of navigating a predefined track using intelligent line-following techniques. The event unfolds across multiple rounds, each testing precision, speed, adaptability, and control. From sharp curves and intersections to ramps and obstacles, teams must showcase robust design and smart.",

      
      
      
    ],
    rounds: [
      { name: "Round 1 : Tracron", description: "This round tests the robot’s ability to handle a dynamic track filled with straight and dashed lines, sharp turns, false paths, and misleading trails. Precision sensing, quick correction, and intelligent path selection are crucial to avoid distractions. Teams must strike the perfect balance between speed and accuracy, as smooth navigation can be the key to advancing further." },
      { name: "Round 2 : SmackBot", description: "The challenge escalates with the introduction of ramps and solid obstacles. Robots must maintain stability and line tracking while tackling elevation changes and physical barriers. Strong mechanical design, proper traction, and efficient obstacle-handling strategies are essential. This round pushes teams to demonstrate resilience, recovery skills, and advanced navigation under tougher conditions." }
    ],
    mode: "Offline",
    dateTime: "08/02/2026\n1:30 pm - 4:30 pm",
    rules: [
      "Participation : Individual / Team of maximum 4 members",
      "The practice track and the actual competition track will be different",
      "The time recorded by the organizers will be taken as final for scoring",
      "If a robot goes off the line, it must restart from the nearest checkpoint already crossed",
      "Robots must not damage the track or leave marks on it; any damage will lead to immediate disqualification",
      "The maximum time allowed per run is 3 to 5 minutes, depending on the round",
      "Only fully autonomous robots are allowed; remote-controlled robots are not permitted",
      "Robots must run only on onboard power (no external power supply)",
      "Robot size must not exceed 20 × 20 × 10 (L × W × H) in cm",
      "Track length will be 15 to 20 meters, depending on the round",
      "Line width will be 20 to 25 mm",
      "Obstacles will be 10 cm cubes weighing 20 to 50 grams",
      "Ramp inclination will be 20 to 25 degrees",
      "Gaps in dashed lines will be 20 to 25 mm"
    ],
    coordinators: [
      { name: "Jayasri Rani S", phone: "+91 93607 37144" },
      { name: "Pavithran S Y", phone: "+91 93456 93986" }
    ],
    EntryFee: "General fee (Rs.250 for non-PSG Tech and Rs.200 for PSG Tech)",
    fileCode: "FILE-005"
  },
  "bot-ba": {
    title: "BOT BATTLE ARENA",
    description: [
      "Bot Battle Arena is a high-intensity combat robotics event where teams design and build manually controlled robots to compete inside a circular arena. The objective is to outmaneuver, push, lift, or force the opponent robot beyond the arena boundary. This event emphasizes mechanical strength, stability, and strategic thinking offering an adrenaline-filled experience for robotics enthusiasts.",
    ],
    rounds: [
      { name: "Round 1 : Arena Clash", description: "Arena Clash is the qualifying elimination round where robots compete in one-on-one battles inside the circular arena. Teams must demonstrate precise control, balance, and effective attack or defense strategies to force their opponent out of bounds. This round focuses on maneuverability, aggression, and stability, with winners advancing to the next stage." },
      { name: "Round 2 : Final Knockout", description: "Final Knockout is the decisive stage where the strongest robots face off in high-stakes battles. Matches become more intense as teams adapt strategies based on previous encounters. Judges closely monitor control, dominance, and safety, and the robot that consistently overpowers its opponent emerges as the champion." }
    ],
    mode: "Offline",
    dateTime: "08/02/2026\n1:30 pm - 4:30 pm",
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
      "Robot dimensions and weight must strictly comply with the following limits: Weight: 3 – 4 kg, Height: 25 – 35 cm, Length: 30 – 40 cm, Breadth: 30 – 40 cm.",
      "Robots must not have sharp edges, spikes, or dangerous protrusions.",
      "Exposed wiring or uncovered battery terminals are strictly prohibited. All wiring must be properly insulated.",
      "Robots must pass a pre-event safety inspection to be allowed to compete.",
      "The arena is circular with a diameter of 6–7 feet, featuring a black boundary line on a flat, non-slippery surface.",
      "A robot is considered OUT if any part of it completely crosses the boundary line."
    ],
    coordinators: [
      { name: "Murali", phone: "+91 93426 28687" },
      { name: "Varalakshmi", phone: "+91 90426 76481" }
    ],
    EntryFee: "General fee (Rs.250 for non-PSG Tech and Rs.200 for PSG Tech)",
    fileCode: "FILE-006"
  },
  "design-event": {
    title: "DESIGN EVENT : PIXFORGE",
    description: [
      "PixForge is a creative design competition that celebrates visual storytelling, originality, and digital design skills. The event encourages participants to communicate strong social and environmental messages through impactful poster designs using professional design tools. It provides a platform for designers to showcase creativity, technical proficiency, and attention to detail under time constraints."
    ],
    mode: "Offline",
    dateTime: "07/02/2026\n1:30 pm - 4:30 pm",
    rules: [
      "Theme must strictly follow the given topics",
      "Poster size must be A4 vertical format",
      "Participants must submit the final poster in JPG or PNG format",
      "A working PSD file with visible layers must also be submitted",
      "Use of copyright-protected or plagiarized content is strictly prohibited",
      "AI-generated images are not allowed",
      "Minor brushes, textures, and overlays are permitted",
      "Flattened PSD files will not be accepted",
      "Work must be original; plagiarism leads to disqualification"
    ],
    requirements: [
      "Laptop",
      "Adobe Photoshop installed",
      "Mouse (optional)"
    ],
    coordinators: [
      { name: "Meiyarasan", phone: "+91 70107 00186" },
      { name: "Sam", phone: "+91 93615 51878" }
    ],
    EntryFee: "General fee (Rs.250 for non-PSG Tech and Rs.200 for PSG Tech)",
    fileCode: "FILE-007",
    rounds: [
      {
        name: "Round 1 : Sketchmorph",
        description: "Sketchmorph focuses on original poster creation based on the given theme. Participants are required to design a visually compelling poster using Adobe Photoshop or Canva, emphasizing creativity, composition, typography, color harmony, and message clarity. The round evaluates how effectively participants translate ideas into meaningful visual communication."
      },
      {
        name: "Round 2 : Framefix",
        description: "Framefix is a precision-based challenge where shortlisted participants must recreate a displayed poster as accurately as possible within a limited duration. This round tests attention to detail, Photoshop proficiency, time management, and the ability to replicate design elements such as layout, color grading, and typography."
      }
    ]
  },
  quiz: {
    title: "QUIZTOPIA",
    description: [
      "Get ready for an engaging quiz event that will put your knowledge and instincts to the ultimate test. Think fast, act smart, and rise to the challenge! Participants will face a series of thought-provoking questions that challenge their critical thinking and quick recall. With prizes and recognition at stake, it promises a fun and engaging experience for everyone. Join us for an unforgettable event filled with learning, excitement, and friendly competition!",
    ],
    rounds: [
      { name: "Round 1-Qlash", description: "Teams of two compete to answer 25 thought-provoking questions within a strict 1-hour limit. The questions come with weighted scores, adding an extra layer of strategy as teams balance speed and accuracy. Only the top-scoring teams advance to the next round, setting the stage for more intense competition." },
      { name: "Round 2-Rapidex", description: "Rapidex takes the competition to the next level, with 6 teams for a 1-hour intellectual battle. Teams collaborate to answer a curated selection of challenging questions, with answers presented audibly. The team with the highest score at the end of this round is crowned the winner, concluding the thrilling contest." },
    ],
      // removed stray rounds
    dateTime: "February 7, 2026 — 9:30 AM to 12:30 PM",
    rules: [
    ],
    coordinators: [
      { name: "Subhasurya", phone: "+91 9566400624" },
      { name: "Vaishnavi", phone: "+91 7418703425" },
    ],
      // removed stray EntryFee
    fileCode: "FILE-009",
    EntryFee: "General fee (Rs.250 for non-PSG Tech and Rs.200 for PSG Tech)",
  },
  "non-tech-1": {
    title: "FINESCAPE",
    description: [
      "FinEscape is an escape-room–style analytical challenge that tests participants’ logic, observation, and problem-solving skills under time pressure. Competing in teams of two, participants progress through a series of interconnected checkpoints, each unlocking clues essential for advancing further. The event blends visual reasoning, numerical analysis, pattern recognition, and strategic thinking, ensuring a dynamic and engaging experience. Every stage builds on previously discovered information, demanding accuracy, teamwork, and quick decision-making. With a mix of puzzles, data interpretation, and creative logic, FinEscape offers an immersive non-technical challenge where only the most focused and analytical teams succeed in uncovering the final escape code."
    ],
    rounds: [],
    mode: "Offline",
    dateTime: "February 7, 2026 - 9:30 AM to 12:30 PM",
    rules: ["Team size: 2 members"],
    coordinators: [
      { name: "Roshan", phone: "+91 9345847502" },
      { name: "Gopika", phone: "+91 9042790305" }
    ],
    EntryFee: "General fee (Rs.250 for non-PSG Tech and Rs.200 for PSG Tech)",
    fileCode: "FILE-010"
  },
  "non-tech-2": {
    title: "EQUINOX",
    description: [
      "Equinox is a dynamic non-technical team event that focuses on balance, coordination, and teamwork. It challenges participants through a mix of fast-paced activities and strategic duo tasks. Teams must adapt quickly, communicate effectively, and stay synchronized under time pressure. Each round tests different skills including memory, precision, logic, and trust. Equinox delivers an engaging and energetic experience where collaboration leads to victory.",
    ],
    rounds: [
      { name: "Round 1-SyncSphere", description: "SyncSphere is a fast-paced, multi-task challenge where all teams participate simultaneously across a series of engaging activity stations. Teams rotate through eight different tasks in a cyclic order, with a fixed time limit of two minutes per task. Each activity tests different skills such as coordination, logic, precision, memory, and creativity.. Points are awarded only for tasks completed within the time limit. Teams must adapt quickly as they move from one task to another. " },
      { name: "Round 2-Twin Tactix Arena", description: "Twin Tactix Arena intensifies the competition with a set of paired challenges designed exclusively for two-member teams. Each task focuses on communication, trust, synchronization, and quick decision-making under pressure. Teams must rely heavily on verbal cues and mutual understanding to succeed. Accuracy, timing, and teamwork play a crucial role in scoring." },
    ],
    mode: "Offline",
    dateTime: "February 7, 2026 - 1:30 PM to 4:30 PM",
    rules: ["Team size: 2 members"],
    coordinators: [
      { name: "Jayasri Rani S", phone: "+91 9360737144" },
      { name: " Prakalya", phone: "+91 9092544666" },
    ],
    EntryFee: "General fee (Rs.250 for non-PSG Tech and Rs.200 for PSG Tech)",
    fileCode: "FILE-011",
  },
  tech: {
    title: "AMPERON",
    description: [
      "Amperon is a technical event that immerses participants in a high-energy problem-solving scenario inspired by power grid failures and electronic instability. Teams step into the role of trainees tasked with diagnosing abnormal electrical behavior, analyzing logical inconsistencies, and restoring system stability. The event focuses on core electronics concepts making it an engaging challenge for students passionate about circuits and analytical thinking."
    ],
    rounds: [
      { name: "Round 1-Netfract", description: "Netfract is the initial challenge where participants face a series of logical and aptitude-based questions designed around fundamental electronics concepts. Teams will analyze patterns, current flow behavior, circuit symbols, and component-based reasoning tasks without relying on formulas. This round evaluates analytical skills, quick decision-making, and the ability to interpret circuit behavior under time pressure." },
      { name: "Round 2-Energen", description: "Energen represents the recovery phase where teams are given a partially faulty circuit that simulates a damaged power node. Participants must carefully inspect the circuit, identify faults, and determine the components required for repair. Components are earned by solving logic, aptitude, and electronics-based tasks. Once acquired, teams must repair the circuit within the given time, ensuring correct polarity, steady output, and safe operation." }
    ],
    mode: "Offline",
    dateTime: "February 8, 2026 — 9:30 AM to 12:30 PM",
    rules: [
      "Team size: 2 members",
    ],
    coordinators: [
      { name: "P. U. Jagadhish Kumaar", phone: "+91 9952513520" },
      { name: "Kavinaya", phone: "+91 9025147460" }
    ],
    EntryFee: "PSG: Rs.200, Non-PSG: Rs.250",
    fileCode: "FILE-012",
  },
  flagship: {
    title: "FLAGSHIP-FF ARENA",
    description: [
      "FF Arena is a competitive Free Fire gaming event designed to test players’ teamwork, strategy,tactical decision-making, and survival skills. The event progresses through structured rounds,moving from intense squad-based combat to large-scale Battle Royale gameplay to determine the ultimate champion.",
   
    ],
    rounds: [
      { name: "Round 1: Alphazone (Clash Squad – Eliminator Format)", description: "Round 1 is conducted in Clash Squad mode with teams competing in head-to-head matches. Each match follows a Best of 7 rounds format, where the first team to secure 4 wins is declared the winner. Every team plays only one match, and the total match completion time is recorded. This round emphasizes tactical coordination, communication, role-based gameplay, and efficiency. Qualification for the next round is decided based on match results and completion time, as determined by the organizers." },
      { name: "Round 2: Metazone (Battle Royale Mode)", description: "Round 2 is the final stage of the event, where qualified teams compete simultaneously in a Squad Battle Royale match. The shrinking safe zone forces intense engagements and strategic positioning. Teams are evaluated based on survival, adaptability, coordination, and combat performance. Final rankings are calculated using a points system that combines placement points and kill points. The team with the highest total score is crowned the winner." },

    ],
    mode: "Offline",
    dateTime: "February 8, 2026 — 9:30 AM to 12:30 PM",
    EntryFee: "General fee (Rs.250 for non-PSG Tech and Rs.200 for PSG Tech)",
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
    title: "PAPER PRESENTATION 1 : UPSPIRE",
    description: [
      "Upspire, the Paper Presentation event of Technotronz’26, invites participants into an Upside Down of innovation and imagination. Inspired by sci fi themes, it explores communication systems, embedded tech, sustainability, and IoT. Through a two stage process, ideas evolve into impactful presentations, guided by expert feedback, creativity, and discussions as electrifying as Hawkins."
    ],
    rounds: [
      { name: "Round 1 : Pitchkinz", description: "Pitchkinz, the initial screening phase of Upspire, requires teams to select an approved topic and submit a concise abstract outlining concept, objectives, and technical approach. Emphasizing clarity, originality, and relevance, submissions are reviewed for innovation and alignment, with only strong ideas advancing. Rule: Only participants who have completed the general registration process will be considered for evaluation. Abstracts must be submitted within the specified deadline to qualify for shortlisting." },
      { name: "Round 2 : Demodownz", description: "Demodownz, the final stage of Upspire, requires shortlisted teams to deliver a 8 minute structured presentation followed by a 2 minute Q&A session with the judges. Evaluation emphasizes innovation, technical depth, feasibility, clarity, and impact, with the most compelling presentations earning recognition." },
    ],
    mode: "Round 1 - Online screening\nRound 2 - Offline",
    dateTime: "07/02/2026\n9:30 am - 12:30 pm",
    rules: [
      "Participation : Individual / Team of maximum 4 members",
      "Submission mail id : technotronz26pp1iete@gmail.com",
      "Abstract submission deadline : 01/02/2026"
    ],
    coordinators: [
      { name: "P. U. Jagadhish Kumaar", phone: "+91 99525 13520" },
      { name: "Vishal", phone: "+91 85239 44845" },
    ],
    EntryFee: "General fee (Rs.250 for non-PSG Tech and Rs.200 for PSG Tech)",
    fileCode: "FILE-014",
    topics: [
      "SignalSphere – Advancements in Long-Range Wireless Communication for Smarter Connectivity",
      "EtherLink Networks – Next-Generation Communication Protocols Enhancing Low-Power IoT Systems",
      "AeroComm Dynamics – Wireless Sensor Networks for Reliable Environmental Monitoring",
      "EmbedX Dynamics – Real-Time Embedded Architectures for Intelligent Control Systems",
      "ControlMatrix – Adaptive Embedded Control for Automation and Smart Devices",
      "GreenCircuit Solutions – Low-Power Electronic Design for Sustainable Technology",
      "IoT Nexus – Cloud-Connected IoT Platforms for Smarter Urban Innovations",
      "EcoSense Networks – IoT-Enabled Smart Monitoring for Environmental Conservation",
      "RenewEdge Systems – Embedded and IoT Approaches for Enhancing Renewable Energy Applications",
      "SustainGrid – Smart Energy Management Using Sensor Networks and Automation"
    ],
    // removed topics property
  },
  "paper-presentation-2": {
    title: "PAPER PRESENTATION 2 : INQUISTA",
    description: [
      "Inquista is the Paper Presentation event of Technotronz’26, offering a dynamic platform for students to explore innovation through research, technical analysis, and creative problem-solving. The event focuses on both hardware and software domains through a structured two-round format, participants refine their concepts and present them before an experienced panel of judges, emphasizing originality, clarity, and technical depth."
    ],
    rounds: [
      { name: "Round 1 : Technix", description: "Technix, the preliminary screening round of Upspire, requires participants to choose an approved topic and submit an abstract detailing idea, objectives, and technical approach. Emphasizing clarity, relevance, feasibility, and innovation, only teams with strong foundational concepts are shortlisted for the next stage. Rule: Only participants who have completed the general registration process will be considered for evaluation. Abstracts must be submitted within the specified deadline to qualify for shortlisting." },
      { name: "Round 2 : Explora", description: "Explora, the final round of Upspire, requires shortlisted teams to present their work in detail before judges. Each team delivers an 8 minute structured presentation followed by a 2 minute Q&A. Evaluation focuses on technical depth, clarity, presentation quality, and real world relevance." },
    ],
    // removed topics property
    mode: "Round 1 - Online screening\nRound 2 - Offline",
    dateTime: "07/02/2026\n1:30 pm - 4:30 pm",
    rules: [
      "Participation : Individual / Team of maximum 4 members",
      "Abstract submission deadline : 01/02/2026"
    ],
    coordinators: [
      { name: "Rohini", phone: "+91 88386 19825" },
      { name: "Lijith", phone: "+91 63821 45569" },
    ],
    EntryFee: "General fee (Rs.250 for non-PSG Tech and Rs.200 for PSG Tech)",
    fileCode: "FILE-015",
    topics: [
      "Artificial Intelligence – Basics and Real-World Applications",
      "Machine Learning – Algorithms and Practical Applications",
      "Cyber Security – Threats, Attacks, and Protection Techniques",
      "Cloud Computing – Architecture and Service Models (IaaS, PaaS, SaaS)",
      "Blockchain Technology – Secure and Decentralized Digital Systems",
      "VLSI Design Flow – From Specification to Fabrication",
      "5G Technology – Architecture, Features, and Applications",
      "Internet of Things (IoT) – Architecture and Smart Applications",
      "Sensors and Actuators – Core Building Blocks of Robotic Systems",
      "PID Control Systems – Control of Mobile and Autonomous Robots"
    ],
    // removed topics property
  }
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
  EntryFee: "250 for non-PSG Tech, 200 for PSG Tech",
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
    />
  )
}
