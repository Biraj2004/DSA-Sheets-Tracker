<p align="center">
  <img src="public/favicon.svg" alt="DSA Sheets Tracker Logo" width="80" height="80" />
</p>

<h1 align="center">DSA Sheets Tracker</h1>

<p align="center">
  <strong>The Ultimate Unified Coding Interview Preparation Suite</strong><br />
  Track, synchronize, and master 1,003+ curated Data Structures &amp; Algorithms problems across 7 top industry sheets — with zero duplicate effort.
</p>

<p align="center">
  <a href="https://dsa-sheets-tracker.newkid.workers.dev/"><img src="https://img.shields.io/badge/Live-Demo-emerald?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Live Demo" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.7" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /></a>
  <a href="https://dexie.org/"><img src="https://img.shields.io/badge/IndexedDB-Dexie-orange?style=for-the-badge&logo=databricks&logoColor=white" alt="Dexie IndexedDB" /></a>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Curated Sheets Included](#curated-sheets-included)
- [Core Features](#core-features)
- [Topic-Wise Master Catalog](#topic-wise-master-catalog)
- [Platform Routing and Badges Guide](#platform-routing-and-badges-guide)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Cloudflare Deployment](#cloudflare-deployment)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Reporting Issues and Discrepancies](#reporting-issues-and-discrepancies)
- [Security Policy](#security-policy)
- [Disclaimer and Attribution](#disclaimer-and-attribution)
- [License](#license)

---

## Overview

Preparing for technical interviews means juggling multiple famous DSA sheets — **Striver A2Z**, **NeetCode 250**, **Namaste DSA**, **Fraz's Interview Sheet**, **Pattern-Wise**, **Love Babbar 450**, and **Apna College**. This creates three major friction points:

- **Repetitive Solving** — The same canonical problem (*Two Sum*, *Trapping Rain Water*, *0/1 Knapsack*) appears across multiple sheets under slightly different names.
- **Scattered Progress** — Marking solved on one sheet doesn't update the others.
- **Broken Links & Paywalls** — Practice links go stale or lead to LeetCode Premium walls with no fallback.

**DSA Sheets Tracker** solves all three by unifying all 7 sheets into a single, offline-first dashboard backed by a canonical registry of **1,003 unique problems**. Mark a problem solved once → progress syncs across every sheet where that problem appears.

---

## Curated Sheets Included

| Sheet Name | Creator | Items | Description |
| :--- | :--- | :---: | :--- |
| **Pattern-Wise** | Curated Algorithmic Patterns | **475** | 475 problems across 24 core patterns, sorted Easy → Medium → Hard. |
| **Striver A2Z DSA** | Raj Vikramaditya (takeUforward) | **460** | Step-wise roadmap from basics to advanced DP and Graphs. |
| **Love Babbar 450** | Love Babbar | **453** | 450+ problems across 15 DSA topics. |
| **Fraz's Interview Sheet** | Mohammad Fraz (LearnYard) | **327** | High-impact interview prep across 20 algorithmic modules. |
| **NeetCode 250** | Navdeep Singh (NeetCode) | **250** | Deep pattern variations and edge cases across 18 sections. |
| **Apna College DSA** | Aman Dhattarwal & Shraddha Khapra | **184** | Core placement interview questions. |
| **Namaste DSA** | Akshay Saini (NamasteDev) | **165** | Topic-by-topic sheet from foundations through advanced algorithms. |
| **Master Catalog (ALL)** | Unified Global Registry | **1,003** | Deduplicated global catalog across 18 topics, Easy → Medium → Hard. |

---

## Core Features

### 🔁 Real-Time Cross-Sheet Synchronization
Solved, Starred, and Note states are keyed by canonical Problem ID — progress is shared across every sheet where that problem appears.

### 📊 Cross-Sheet Synergy Engine
Live overlap matrix per sheet showing how much of every other sheet you've already completed.

### 📚 18-Topic Master Catalog
Full deduplicated problem library grouped by canonical DSA domain with strict Easy → Medium → Hard ordering.

### 🔁 Spaced Repetition Revision Queue
Mark problems for review with 1-day, 3-day, 7-day, or custom intervals. A dedicated Revision tab surfaces all due items.

### 💾 100% Offline-First — Zero Login
All data lives in browser IndexedDB via [Dexie.js](https://dexie.org/). No accounts, no telemetry, no server. One-click JSON backup and restore.

### 🎨 Dark & Light Modes
Glassmorphic dark mode (default) and a clean light mode — toggle with `T` or the header button. Persisted across sessions.

### 🔒 LeetCode Premium Smart Routing
For the 33 LeetCode-Premium-locked problems, the primary link automatically routes to a 100% free alternative (GFG / NeetCode / LintCode). The original LeetCode link is retained as a secondary badge for paid subscribers.

### 🔍 Advanced Filter & Search
Real-time search with regex-safe input across problem names and topics. Filter by status, difficulty, and platform simultaneously. Active-state `select` dropdowns with vivid 2px indigo focus rings.

---

## Topic-Wise Master Catalog

The **All Problems** tab covers **1,003 canonical problems** across 18 categories:

1. Basics & Patterns
2. Arrays & Vectors
3. 2D Arrays & Matrix
4. Strings
5. Searching & Sorting
6. Two Pointers & Sliding Window
7. Linked Lists
8. Stacks & Queues
9. Binary Trees
10. Binary Search Trees (BST)
11. Heaps & Priority Queues
12. Recursion & Backtracking
13. Greedy Algorithms
14. Dynamic Programming
15. Graphs
16. Tries
17. Bit Manipulation
18. Math & Number Theory

---

## Platform Routing and Badges Guide

| Badge | Behaviour |
| :--- | :--- |
| **Primary platform badge** (LC / GFG / Code360…) | Opens the problem on its primary platform. |
| **LeetCode Premium** problems | Primary opens a **free alternative** (GFG / NeetCode / LintCode). A secondary `LeetCode (Premium)` badge retains the original URL for subscribers. |
| **`Also in TUF`** | Links to a verified takeUforward editorial for this problem. Only shown when a direct article exists — never a search query. |
| **`Also in: [Sheet]`** | Shows which other sheets share this problem — progress is synchronized live. |

---

## Project Structure

```
DSA-Sheets-Tracker/
├── public/
│   ├── favicon.svg
│   └── profile2.jpg          # Developer avatar (ContactPage)
├── src/
│   ├── App.tsx               # Root — routing, theme, DB state
│   ├── main.tsx
│   ├── index.css             # Tailwind v4 + custom variants
│   ├── components/
│   │   ├── AllProblemsView.tsx   # Master Catalog (18-topic accordion)
│   │   ├── ErrorBoundary.tsx     # React error boundary
│   │   ├── FilterBar.tsx         # Search + Status/Difficulty/Platform selects
│   │   ├── Header.tsx            # Sheet tabs + theme toggle + nav
│   │   ├── ProblemRow.tsx        # Single problem row with badges
│   │   ├── RevisionView.tsx      # Spaced repetition queue
│   │   ├── SectionAccordion.tsx  # Collapsible section (first 2 open by default)
│   │   ├── SkeletonLoader.tsx
│   │   ├── StatsCard.tsx         # Sheet stats + synergy matrix
│   │   └── ...modals/utils
│   ├── data/
│   │   ├── sheets/           # Per-sheet problem mappings (index.ts + individual sheets)
│   │   └── synergy.ts        # Cross-sheet overlap computation
│   ├── db/                   # Dexie IndexedDB schema and hooks
│   ├── hooks/                # useProgress, useKeyboard, etc.
│   ├── pages/
│   │   ├── TrackerPage.tsx   # Main tracker view + footer
│   │   ├── ContactPage.tsx   # Developer info, contact form, disclaimer
│   │   └── NotFoundPage.tsx  # Custom 404
│   └── types/
│       └── index.ts          # Problem, Progress, Status, Platform types
├── docs/
├── index.html
├── vite.config.ts
├── wrangler.toml             # Cloudflare Pages / Workers config
└── package.json
```

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) **≥ 20.0.0**
- `npm` or `pnpm`

### Installation

```bash
# Clone
git clone https://github.com/Biraj2004/DSA-Sheets-Tracker.git
cd DSA-Sheets-Tracker

# Install
npm install

# Dev server
npm run dev

# Production build
npm run build
```

Open `http://localhost:5173` in your browser.

---

## Cloudflare Deployment

### Via Cloudflare Dashboard (Recommended)
1. **Workers & Pages** → **Create Application** → **Pages** → **Connect to Git**
2. Select your fork.
3. Build settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node.js version: `20`
4. **Save and Deploy**.

### Via Wrangler CLI
```bash
npx wrangler login
npm run deploy
```

---

## Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `?` | Open keyboard shortcuts modal |
| `/` or `Ctrl+K` | Focus search bar |
| `1` – `7` | Switch between sheets |
| `A` | Jump to All Problems (Master Catalog) |
| `R` | Open Revision Queue |
| `T` | Toggle Dark / Light theme |
| `Esc` | Close open modal |

---

## Reporting Issues and Discrepancies

Problem sheets evolve, platform URLs change, and difficulty ratings vary. If you find:

- A broken, dead, or paywalled link
- A missing question from any sheet
- A misclassified difficulty
- An incorrect problem mapping or duplicate entry
- A UI/UX glitch

Please open a [GitHub Issue](https://github.com/Biraj2004/DSA-Sheets-Tracker/issues) and include:
1. Problem title and ID (e.g. `lc-two-sum`)
2. Sheet and section name
3. Expected vs. actual link or difficulty
4. Proposed fix

PRs fixing mappings or links are warmly welcomed.

---

## Security Policy

- **Zero Remote Storage** — No user data (solved status, notes, timestamps) ever leaves the browser. All state is in IndexedDB.
- **Client-Side Validation** — JSON import/export is parsed and validated strictly against TypeScript schemas.
- **No Tracking** — Zero analytics, no cookies, no telemetry.
- **Vulnerability Reporting** — Open a GitHub Issue or contact via the [Contact page](https://dsa-sheets-tracker.newkid.workers.dev/contact).

---

## Disclaimer and Attribution

DSA Sheets Tracker is an independent, open-source, non-commercial educational aggregator. All problem content, editorial material, and curricular selections remain the intellectual property of their respective creators:

| Creator | Platform |
| :--- | :--- |
| Raj Vikramaditya (Striver) | [takeUforward](https://takeuforward.org/) |
| Navdeep Singh (NeetCode) | [NeetCode.io](https://neetcode.io/) |
| Akshay Saini | [NamasteDev](https://namastedev.com/) |
| Mohammad Fraz | [LearnYard](https://learnyard.com/) |
| Love Babbar | [CodeHelp](https://www.thecodehelp.in/) |
| Aman Dhattarwal & Shraddha Khapra | [Apna College](https://www.apnacollege.in/) |
| Various | [LeetCode](https://leetcode.com/), [GFG](https://www.geeksforgeeks.org/), [Code360](https://www.naukri.com/code360), [SPOJ](https://www.spoj.com/) |

This project claims no ownership over any problem statements, solutions, or curated selections.

---

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for full text.

---

<p align="center">
  If this project helps your interview prep, consider starring the repo ⭐ — it keeps the project visible and motivated!
</p>

<p align="center">
  Built with Claude by <a href="https://github.com/Biraj2004">Biraj Sarkar</a>
</p>
