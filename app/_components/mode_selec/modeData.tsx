import React from "react";

/* ---------- Icons (inline SVG) ---------- */
export const TerminalIcon = (
  <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8l5 4-5 4" />
    <path d="M13 17h6" />
  </svg>
);

export const GraphIcon = (
  <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2.2" />
    <circle cx="5" cy="18" r="2.2" />
    <circle cx="19" cy="18" r="2.2" />
    <path d="M11 7l-5 9M13 7l5 9M7.2 18h9.6" />
  </svg>
);

export const BugIcon = (
  <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="8" height="12" rx="4" />
    <path d="M9 8a3 3 0 016 0M12 11v9M8 12H4M16 12h4M8 16H5M16 16h3M9 5L7 3M15 5l2-2" />
  </svg>
);

export type ModeId = "mcq" | "dsa" | "bug";
export type OpponentId = "pve" | "pvp";
export type DifficultyId = "easy" | "medium" | "hard";

export interface ModeItem {
  id: ModeId;
  title: string;
  heading: string;
  badge: string;
  badgeCommand: string;
  description: string;
  tags: string[];
  image: string;
  accent: string;
  icon: React.ReactNode;
  tilt: number;
}

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

export const MODES: ModeItem[] = [
  {
    id: "mcq",
    title: "Terminal Protocol",
    heading: "TERMINAL PROTOCOL",
    badge: "MCQ Challenge",
    badgeCommand: ">_ MCQ CHALLENGE",
    description:
      "Test your programming knowledge with timed multiple-choice questions across various concepts.",
    tags: ["Concepts", "Quick Thinking", "Timed"],
    image: `${IMAGEKIT_URL}/mode_selec_img/mcq.png`,
    accent: "#22e56b",
    icon: TerminalIcon,
    tilt: -1.5,
  },
  {
    id: "dsa",
    title: "DSA Arena",
    heading: "DSA ARENA",
    badge: "Coding Challenge",
    badgeCommand: ">_ CODING CHALLENGE",
    description:
      "Solve real coding problems and battle through algorithms and data structures.",
    tags: ["Algorithms", "Data Structures", "Real Coding"],
    image: `${IMAGEKIT_URL}/mode_selec_img/dsa.png`,
    accent: "#2f9bff",
    icon: GraphIcon,
    tilt: 0,
  },
  {
    id: "bug",
    title: "Bug Bounty",
    heading: "BUG BOUNTY",
    badge: "Debugging Challenge",
    badgeCommand: ">_ DEBUGGING CHALLENGE",
    description:
      "Find and fix bugs in code. Spot the issue, understand the problem, and make it work.",
    tags: ["Bug Hunting", "Code Analysis", "Problem Solving"],
    image: `${IMAGEKIT_URL}/mode_selec_img/bug.png`,
    accent: "#ff4d5e",
    icon: BugIcon,
    tilt: 1.5,
  },
];

export interface OpponentItem {
  id: OpponentId;
  title: string;
  description: string;
  image: string;
}

export const OPPONENTS: OpponentItem[] = [
  {
    id: "pve",
    title: "PVE",
    description: "Fight against AI opponents. Improve your skills and learn at your own pace.",
    image: `${IMAGEKIT_URL}/mode_selec_img/pve.png`,
  },
  {
    id: "pvp",
    title: "PVP",
    description: "Challenge real players from around the world. Test your skills and prove you're the best.",
    image: `${IMAGEKIT_URL}/mode_selec_img/pvp.png`,
  },
];

export interface DifficultyItem {
  id: DifficultyId;
  title: string;
  description: string;
  accent: string;
  bars: number;
}

export const DIFFICULTIES: DifficultyItem[] = [
  {
    id: "easy",
    title: "EASY",
    description: "Basic concepts and fundamentals.",
    accent: "#10b981",
    bars: 1,
  },
  {
    id: "medium",
    title: "MEDIUM",
    description: "Balanced challenge for most players.",
    accent: "#f59e0b",
    bars: 2,
  },
  {
    id: "hard",
    title: "HARD",
    description: "Tricky questions, faster timers.",
    accent: "#ef4444",
    bars: 3,
  },
];

export function getModeById(id: ModeId | null): ModeItem {
  return MODES.find((m) => m.id === id) || MODES[0];
}
