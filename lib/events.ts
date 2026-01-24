// Static event and workshop metadata for use throughout the app
// This is the single source of truth for event/workshop titles and fees

export const EVENTS = {
  W01: {
    title: "Workshop 1",
    fee: 500,
    rounds: [
      { name: "Round 1", description: "Introduction and basics." },
      { name: "Round 2", description: "Hands-on session." }
    ]
  },
  W02: {
    title: "Workshop 2",
    fee: 500,
    rounds: [ 
      { name: "Round 1", description: "Overview and setup." },
      { name: "Round 2", description: "Advanced techniques." }
    ]
  },
  E01: {
    title: "General Events",
    fee: {
      psg: 200,
      nonpsg: 250
    },
    rounds: [
      { name: "Prelims", description: "Preliminary round for all participants." },
      { name: "Finals", description: "Final round for selected participants." }
    ]
  },
} as const;
