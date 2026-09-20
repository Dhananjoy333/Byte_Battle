# ⚡ Byte Battle

<div align="center">

![Byte Battle Banner](/img/battle_arena.jpg)

**Redefine Competitive Programming — Battle Against Bots or Players To Become The Ultimate Coding Champion.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.186-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.14.2-green?style=for-the-badge&logo=greensock)](https://gsap.com/)

[Overview](#-about-the-project) • [Key Features](#-features) • [Game Combat & HUD](#-arcade-combat--hud-engine) • [Character Roster](#-character-roster) • [Tech Stack](#-tech-stack) • [Installation](#-getting-started) • [Project Structure](#-project-structure)

</div>

---

## 🚀 About the Project

**Byte Battle** is a next-generation gamified programming combat experience. Inspired by retro fighting arcades (Street Fighter, Tekken) and award-winning interactive web design (Awwwards, Zentry), Byte Battle transforms technical computer science challenges into an adrenaline-fueled combat arena.

Instead of answering dry quiz cards or coding in isolated terminals, players select cybernetically enhanced fighters on a real-time **3D rotating podium**, enter the combat ring, and solve time-critical computer science problems to power light strikes, heavy combos, and devastating ultimate abilities.

---

## ✨ Features

### 🌌 1. Cinematic Landing Experience (`/`)
- **Dual-Buffered Seamless Video Hero:** Multi-channel HTML5 video preloading and buffer-swapping system with GSAP-powered clip-path morphing.
- **Interactive 3D Bento Grid:** Perspective tilt cards calculating real-time cursor trajectory (`perspective(700px) rotateX(...) rotateY(...)`).
- **Scroll-Driven GSAP Storytelling:** ScrollTrigger timeline pinning, dynamic masked clip-path expansion, and animated typography.
- **Audio Soundscape:** Floating navigation bar with integrated ambient soundtrack, audio state toggle, and animated sound equalizer bars.
- **Viewport Morphing Navigation:** Full-screen radial transition expanding smoothly from CTA buttons directly into the game selection flow.

### 🕹️ 2. Game Mode & Difficulty Selector (`/mode_selection`)
- **GSAP MotionPath 3D Entrance:** High-velocity flying cards swooping through bezier arcs before snapping into dock position.
- **Battle Modes:**
  - **PvE (Player vs Environment):** Face algorithmic bots calibrated across varying response speeds and counter-attack rates.
  - **PvP (Player vs Player):** Prepare for head-to-head coding combat.
- **Difficulty Tiers:** Easy, Medium, and Hard tiers featuring staggered badge entry animations.

### 🥋 3. 3D Character Selection Stage (`/char_selection`)
- **Real-Time 3D Rotating Mesh Podium:** Built with **Three.js** and **React Three Fiber** (`@react-three/fiber`, `@react-three/drei`).
  - Loads a custom GLTF model (`/models/white_mesh.glb`) with cylindrical/planar UV projection.
  - High-resolution diffuse and emissive PBR texture maps (`podium_diffuse.png`, `podium_emissive.png`).
  - GSAP-interpolated smooth rotation synced to the active fighter index.
- **Curved Character Rail:** Interactive selector rail with dynamic avatar scaling and animated circular SVG segmented progress rings.
- **Fighter Stat Breakdown:** Real-time attribute cards detailing role, power, acceleration, and speed statistics.

### ⚔️ 4. Arcade Match Combat HUD (`/gameHUD`)
- **Retro Fighting Game Top Bar:**
  - Dynamic dual fighter cards with animated portraits, character names, and player titles.
  - Smooth dual-layer health bars with a delayed red ghost damage bar to visualize incoming impact.
  - Round counter gems tracking victories toward a 2-round win condition.
  - 99-second arcade match timer with pulsing low-time urgency warning and automatic `TIME OVER` resolution.
- **CS Knowledge Combat Deck:**
  - Multiple-choice trivia questions spanning Data Structures, Algorithms, JS Concurrency, and Networking.
  - Formatted code snippets and multiple-choice answers (`A`, `B`, `C`, `D`).
  - Full keyboard hotkey integration (`1`, `2`, `3`, `4`).
- **Combat Actions & Super Meter:**
  - **Light Strike (`Q`):** Fast cooldown, steady damage, generates Super energy.
  - **Heavy Strike (`W`):** Moderate cooldown, high impact damage.
  - **Ultimate / Super (`E`):** Screen-shaking attack unlocked only when Super Meter reaches 100%.
- **Street Fighter Style Announcer & Banner System:**
  - Dramatic animated banners for `ROUND 1`, `FIGHT`, `K.O.`, `DOUBLE K.O.`, `TIME OVER`, and `VICTORY`.
  - Dynamic Combo Counter scaling damage multipliers (`x1.5`, `x2.0`, `x3.0`) with performance ranks (`NICE`, `GREAT`, `SUPERB`, `BRUTAL`, `PERFECT`).
  - Floating damage numbers with critical hit styling.
- **Procedural Web Audio Synthesizer:**
  - Zero-asset audio engine (`audioSynth.ts`) leveraging the native browser **Web Audio API**.
  - Synthesizes hit thuds, blade slashes, critical strikes, shield blocks, round announcer gongs, and countdown ticks on the fly.

---

## 🥋 Character Roster

| Character | Role | Power | Acceleration | Speed | Signature Profile |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Aurelia Veyne** | Sprinter | 9 | 11 | 8 | Lightning-fast playmaker who breaks defensive formations and turns split seconds into decisive advantages. |
| **Raze** | Tactician | 7 | 8 | 10 | Calculates passing lanes and algorithm transitions with surgical, high-tempo precision. |
| **Kira Byte** | Striker | 12 | 7 | 6 | Unstoppable kinetic powerhouse capable of blasting through defense with high-impact finishing. |
| **Lucien Frostvale** | Sprinter | 9 | 11 | 8 | Agile flanker leveraging cryo-precision to outmaneuver rival code submissions. |
| **Liora** | Sprinter | 9 | 11 | 8 | High-velocity offensive strategist dominating the transition game. |
| **Kai & Ryuuga** | Martial Masters | — | — | — | Featured combatants in the core fighting arena (`Dragon Fist` vs `Shadow Blade`). |

---

## 🎮 Arcade Combat & HUD Engine

```
+---------------------------------------------------------------------------------------+
|  [KAI] HP: [████████████░░]  (O)( )  |   99s   |  ( )( )  HP: [██████████████] [RYUUGA]|
+---------------------------------------------------------------------------------------+
|                                                                                       |
|                                    [ K. O. ! ]                                        |
|                          COMBO x3.0  ★★ BRUTAL ★★                                     |
|                                                                                       |
+---------------------------------------------------------------------------------------+
|  [TRIVIA DECK]                                        |  [ACTION ABILITIES]           |
|  Category: ALGORITHMS // SEARCH                       |                               |
|  "What is the worst-case time complexity of Binary    |  [Q] Light Strike   (Ready)   |
|   Search on a sorted array?"                          |  [W] Heavy Strike   (3.2s)    |
|                                                       |  [E] SUPER ULT      (100% NRG)|
|  [1] O(1)     [2] O(log n)    [3] O(n)    [4] O(n log n)|  SUPER: [====================]|
+---------------------------------------------------------------------------------------+
```

### Controls & Hotkeys

| Key | Context | Action |
| :---: | :--- | :--- |
| `1` / `2` / `3` / `4` | Trivia Combat Deck | Select answer option `A`, `B`, `C`, or `D` |
| `Q` | Ability Deck | Execute **Light Strike** |
| `W` | Ability Deck | Execute **Heavy Strike** |
| `E` | Ability Deck | Unleash **Super / Ultimate Attack** (requires 100% Super Meter) |
| Click / Tap | UI Navigation | Interactive buttons, 3D character selection, audio mute |

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Server and client component architecture, route optimization |
| **UI Library** | [React 19](https://react.dev/) | Core component lifecycle and state management |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type safety for combat state, models, and game logic |
| **3D Engine** | [Three.js](https://threejs.org/) + [React Three Fiber](https://r3f.docs.pmnd.rs/) + [Drei](https://github.com/pmndrs/drei) | Real-time WebGL rendering, 3D character podium, PBR materials |
| **Animation Engine** | [GSAP 3](https://gsap.com/) + `@gsap/react` | ScrollTrigger, MotionPath, bezier curves, and complex timelines |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Cutting-edge utility-first styling with custom theme tokens |
| **Audio Engine** | Web Audio API (`audioSynth.ts`) | Procedural synthesizer generating 8-bit arcade sound effects |
| **Icons** | [React Icons](https://react-icons.github.io/react-icons/) | Vector iconography |

---

## 📂 Project Structure

```text
Byte_Battle/
├── app/
│   ├── _components/
│   │   ├── char_selec/          # 3D Character Selection & Podium components
│   │   │   ├── CharacterInfo.tsx       # Character statistics & role description
│   │   │   ├── CharacterRail.tsx       # Curved selection arc & avatar list
│   │   │   ├── CharacterStage.tsx      # Stage glow, hero cutouts & play CTA
│   │   │   ├── Podium.tsx              # Three.js / R3F 3D rotating GLTF stage
│   │   │   └── SegmentedProgressRing.tsx # Radial SVG stat meters
│   │   ├── gameHUD/             # Retro Arcade Combat HUD
│   │   │   ├── GameHUD.tsx             # Central combat state controller
│   │   │   ├── audioSynth.ts           # Web Audio procedural sound synthesizer
│   │   │   ├── types.ts                # Combat, question, fighter & action types
│   │   │   ├── combatFeedback/         # Announcer banners, combo counters, floating damage
│   │   │   ├── controlDeck/            # Trivia questions & action ability buttons
│   │   │   └── topBar/                 # Fighter cards, health bars & match timer
│   │   ├── main_page/           # Landing page components (Hero, Bento, Story, Navbar)
│   │   └── mode_selec/          # PvE/PvP cards & difficulty selection
│   ├── char_selection/          # /char_selection page route
│   ├── gameHUD/                 # /gameHUD page route
│   ├── mode_selection/          # /mode_selection page route
│   ├── globals.css              # Custom font faces, animations & Tailwind v4 theme
│   ├── layout.tsx               # Root application layout
│   └── page.tsx                 # Main landing page
├── public/
│   ├── char_portrait/           # High-resolution character portraits
│   ├── fonts/                   # Zentry, Circular Web, General Sans fonts
│   ├── icons/                   # Mode badges (PvE, PvP, Easy, Medium, Hard)
│   ├── img/                     # Background artwork & arenas
│   ├── models/                  # 3D GLTF meshes and texture maps (white_mesh.glb)
│   └── videos/                  # Dual-buffered hero loops & feature previews
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version `v18.17+` or `v20+` recommended)
- `npm`, `yarn`, `pnpm`, or `bun`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dhananjoy333/Awwwards.git
   cd Awwwards
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to experience the application.

---

## 🗺️ Available Routes

| Route | Description |
| :--- | :--- |
| [`/`](http://localhost:3000/) | **Cinematic Landing Page:** Dual-buffered video hero, Bento grid, and interactive showcase |
| [`/mode_selection`](http://localhost:3000/mode_selection) | **Mode Selection:** PvE / PvP selection with 3D flying motion path cards |
| [`/char_selection`](http://localhost:3000/char_selection) | **Character Selection:** Real-time 3D rotating podium with fighter stat cards |
| [`/gameHUD`](http://localhost:3000/gameHUD) | **Arcade Match HUD:** Fighting game arena with real-time coding trivia & combat deck |

---

## 🔮 Roadmap

- [ ] **Multiplayer PvP via WebSockets / WebRTC:** Real-time peer-to-peer trivia duel matchmaking.
- [ ] **Live Code Execution Engine:** Sandboxed runners (e.g., Pyodide / WebAssembly) for live algorithm coding rounds.
- [ ] **Global Leaderboard & Ranked MMR:** Competitive ranking ladders and skill-based matching tiers.
- [ ] **Expanded 3D Fighter Models:** Rigged skeletal 3D fighters performing strike animations on the podium.

---

## 📄 License

This project is created for educational and portfolio demonstration purposes. Feel free to explore, learn from, and adapt the interactive design techniques!