# AGENTS.md — DSA Sheets Tracker

> **Purpose**: This file maps the codebase for AI coding agents (GitHub Copilot, Cursor, Antigravity, Claude, etc.) so they can navigate, edit, and extend the project without reading every file from scratch.

---

## 1. Project Summary

**DSA Sheets Tracker** is a React 19 + Vite + TypeScript single-page application.  
It is an **offline-first, zero-login progress tracker** for 1,003 curated DSA problems spread across 7 famous coding interview sheets.

Key constraints any agent must respect:
- **All user data lives in browser IndexedDB** (Dexie.js). There is no backend, no API calls, no authentication.
- **Tailwind CSS v4** is used. Always use `bg-linear-to-*` (not `bg-gradient-to-*`), `focus:ring-2` for active rings, and prefer scale values (`min-h-30`) over arbitrary pixels (`min-h-[120px]`) where a scale match exists.
- **React Router v7** handles `/`, `/contact`, and `/*` (404) routes.
- **Dark mode is the default**. Light mode is toggled by adding `.light` on `<html>`. The `html-light:` Tailwind variant is registered in `src/index.css` via `@custom-variant`.
- **TypeScript strict mode** is on. Run `npx tsc --noEmit` before claiming a fix is done.

---

## 2. Repository Layout

```
DSA-Sheets-Tracker/
├── src/
│   ├── App.tsx               ← Root: routing, theme, DB wiring, modal state
│   ├── main.tsx              ← React.StrictMode mount
│   ├── index.css             ← Tailwind v4 import + custom variants + CSS vars
│   │
│   ├── types/
│   │   └── index.ts          ← ALL shared types (Problem, Progress, Status, Platform…)
│   │
│   ├── db/                   ← Dexie schema + React hooks for IndexedDB
│   │
│   ├── hooks/                ← useProgress (CRUD), useKeyboard (shortcuts)
│   │
│   ├── data/
│   │   ├── problems.json     ← Canonical Problem registry (1,003 verified entries)
│   │   ├── sheets.ts         ← allProblems[], allSheets, getSheetData(), getProblem()
│   │   ├── sheets.test.ts    ← Vitest integrity test suite (0 dangling IDs, 7 sheets)
│   │   ├── striver-a2z.json  ← Striver A2Z sheet mapping (460 items)
│   │   ├── neetcode-250.json ← NeetCode 250 sheet mapping (250 items)
│   │   ├── love-babbar-450.json ← Love Babbar 450 sheet mapping (453 items)
│   │   ├── fraz-interview.json  ← Fraz interview sheet mapping (327 items)
│   │   ├── namaste-dsa.json  ← Namaste DSA sheet mapping (165 items)
│   │   ├── apna-college.json ← Apna College sheet mapping (184 items)
│   │   ├── pattern-wise.json ← Pattern-Wise sheet mapping (475 items)
│   │   └── synergy.ts        ← Cross-sheet overlap computation (getSheetSynergy)
│   │
│   ├── components/
│   │   ├── Header.tsx            ← Sheet tab nav + theme toggle + keyboard shortcuts button
│   │   ├── FilterBar.tsx         ← Search input (regex-safe) + Status/Difficulty/Platform selects
│   │   ├── SectionAccordion.tsx  ← Collapsible section (first 2 defaultOpen=true)
│   │   ├── ProblemRow.tsx        ← Single problem row: status, badges, note, star, schedule
│   │   ├── AllProblemsView.tsx   ← Master Catalog: 18-topic accordion with filters
│   │   ├── RevisionView.tsx      ← Spaced repetition queue: due/starred problems
│   │   ├── StatsCard.tsx         ← Sheet stats + cross-sheet synergy matrix
│   │   ├── ErrorBoundary.tsx     ← React error boundary wrapping App
│   │   ├── SkeletonLoader.tsx    ← Loading skeleton for initial DB read
│   │   ├── DataManagementModal.tsx ← JSON backup / restore modal
│   │   ├── KeyboardShortcutsModal.tsx ← Shortcut reference modal
│   │   ├── MobileNotice.tsx      ← Mobile-only bypass screen
│   │   └── ScrollToTop.tsx       ← Scroll restoration on route change
│   │
│   └── pages/
│       ├── TrackerPage.tsx   ← Main tracker: StatsCard + FilterBar + SectionAccordions + Footer
│       ├── ContactPage.tsx   ← Developer info, contact form (mailto), disclaimer
│       └── NotFoundPage.tsx  ← Custom 404 with quick-links back to sheets
│
├── public/
│   ├── favicon.svg
│   └── profile2.jpg          ← Developer avatar used in ContactPage
│
├── index.html                ← Vite entry point + meta tags + Inter font
├── vite.config.ts
├── wrangler.toml             ← Cloudflare Pages deployment config
├── package.json
└── tsconfig.app.json
```

---

## 3. Key Type Definitions (`src/types/index.ts`)

```ts
type Platform = 'leetcode' | 'gfg' | 'tuf' | 'codingninjas' | 'spoj' |
                'hackerearth' | 'interviewbit' | 'namastedev' | 'other' | 'concept';

type Status    = 'todo' | 'tried' | 'solved' | 'revise';
type Difficulty = 'easy' | 'medium' | 'hard' | null;

type Problem = {
  id: string;           // e.g. "lc-two-sum" — canonical unique key
  title: string;
  platform: Platform;
  url: string | null;
  difficulty: Difficulty;
  topics: string[];
  tufUrl?: string | null;           // takeUforward article link
  isLeetCodePremium?: boolean;      // true → primary routes to free alt
  altUrl?: string | null;           // free alternative URL for premium problems
  category?: string;                // canonical 18-topic category
};

type Progress = {
  id: string;           // matches Problem.id
  status: Status;
  isStarred: boolean;
  note: string;
  nextReviewAt: string | null;      // ISO date for spaced repetition
  solvedAt: string | null;
};
```

> ⚠️ The type is `Progress`, **not** `ProblemProgress`. Never import `ProblemProgress` from `../types`.

---

## 4. Data Layer Rules

### Adding / editing a problem
Edit `src/data/problems.json`. Each entry **must** have a globally unique `id`.

### Adding a problem to a sheet
Edit the appropriate sheet JSON file (e.g. `src/data/striver-a2z.json`). Each sheet item entry is:
```json
{
  "sheetId": "striver-a2z",
  "sectionId": "striver-step-1-sub-4",
  "problemId": "lc-reverse-integer",
  "position": 34,
  "titleInSheet": "Reverse a Number"
}
```
`titleInSheet` is only needed when the sheet uses a different name than the canonical `Problem.title`.

### LeetCode Premium routing
If `problem.isLeetCodePremium === true`:
- `problem.url` should be the **free alternative** (primary)
- `problem.altUrl` should be the **original LeetCode** URL (secondary badge)

### Data integrity & Difficulty standards
- All LeetCode problem difficulties and URLs are verified against official LeetCode GraphQL/REST API.
- Do not guess or fuzzy-map problem URLs. Never map non-LeetCode problems to random LeetCode contest/SQL questions.
- Run `npx vitest run` to verify zero dangling IDs, zero broken section links, and sheet count integrity.

### Cross-sheet synergy
`src/data/synergy.ts` exports `getSheetSynergy(sheetId)` which returns overlap counts. It reads from the same sheet data — no separate maintenance needed.

---

## 5. Component Props Quick Reference

### `<AllProblemsView>`
```ts
problems: Problem[];
progressMap: Map<string, Progress>;
filters: FilterState;
onFilterChange: (f: FilterState) => void;
onToggleSolved / onSetStatus / onToggleStar / onSaveNote / onScheduleReview
```

### `<RevisionView>`
```ts
progressMap: Map<string, Progress>;
onToggleSolved / onSetStatus / onToggleStar / onSaveNote / onScheduleReview
// No onSelectSheet — it does NOT navigate sheets
```

### `<StatsCard>`
```ts
sheetData: SheetData;
progressMap: Map<string, Progress>;
onSelectSheet?: (sheetId: string) => void;
onJumpToSection?: (sectionId: string) => void;
// No allSheetsProgressStats — stats are computed internally
```

### `<FilterBar>`
```ts
filters: FilterState;
onFilterChange: (f: FilterState) => void;
filteredCount: number;
totalCount: number;       // NOTE: "totalCount" NOT "totalProblems"
```

### `<SectionAccordion>`
```ts
defaultOpen: boolean;     // true for idx < 2 (lazy-load pattern)
```

---

## 6. Theme System

| Class on `<html>` | Mode |
| :--- | :--- |
| `.dark` (default) | Dark mode |
| `.light` | Light mode |

CSS custom variants registered in `src/index.css`:
```css
@custom-variant dark  (&:where(.dark,  .dark  *));
@custom-variant html-light (&:where(.light *, .light));
```

Always use **both** a dark-default class and an `html-light:` override when adding themed UI:
```tsx
className="bg-slate-900 text-white html-light:bg-white html-light:text-slate-900"
```

CSS custom properties (vars) are defined on `:root` (light values) and `.dark` (dark overrides) in `src/index.css`. Prefer CSS vars (`var(--bg-card)`) in custom CSS, and Tailwind classes in JSX.

---

## 7. Routing

Managed by `react-router-dom` v7 in `src/App.tsx`:

| Path | Component |
| :--- | :--- |
| `/` | `<TrackerPage>` |
| `/contact` | `<ContactPage>` |
| `/*` | `<NotFoundPage>` |

Sheet selection is handled via URL query param `?sheet=<sheetId>` read/written in `App.tsx`. No separate route per sheet.

---

## 8. Agent Dos and Don'ts

### ✅ DO
- Run `npx tsc --noEmit` after every TypeScript change.
- Use `Progress` (not `ProblemProgress`) for the progress map type.
- Use `totalCount` (not `totalProblems`) for FilterBar's total prop.
- Use `bg-linear-to-*` for gradients (Tailwind v4).
- Use `focus:ring-2 focus:ring-indigo-500/40` for active input states.
- Keep only the first 2 `<SectionAccordion>` sections `defaultOpen={true}` (lazy loading).
- Apply `html-light:` overrides to every element that needs light mode styling.

### ❌ DON'T
- Don't add `onSelectSheet` to `<RevisionView>` — it's not in its props.
- Don't add `allSheetsProgressStats` to `<StatsCard>` — it computes this itself.
- Don't use `bg-gradient-to-*` — Tailwind v4 dropped this alias.
- Don't use arbitrary `min-h-[120px]` where a scale value (`min-h-30`) exists.
- Don't create backend routes, API endpoints, or auth flows — this is entirely client-side.
- Don't remove the `onError` fallback on `<img src="/profile2.jpg">` in `ContactPage`.
- Don't import from `../types` expecting `ProblemProgress` — use `Progress`.

---

## 9. Common Tasks

### Add a new sheet
1. Create `src/data/<mysheet>.json` with `SheetData` JSON shape.
2. Import and export it from `src/data/sheets.ts`.
3. Add its `id` to the `SHEET_IDS` array in `Header.tsx` tabs config.
4. Add its synergy entry in `src/data/synergy.ts`.

### Add a new problem to the canonical registry
1. Add to `src/data/problems.json` with a unique `id`.
2. Reference the `id` in the relevant sheet JSON file(s).

### Fix a broken link
1. Find the problem by `id` in `src/data/problems.json`.
2. Update `url` (primary) and/or `altUrl` (secondary).
3. If the problem became LeetCode-Premium, set `isLeetCodePremium: true` and swap `url` ↔ `altUrl`.

### Add a new page
1. Create the component in `src/pages/`.
2. Add the route in `src/App.tsx`.
3. Link from `Header.tsx` and `NotFoundPage.tsx` quick-links.
4. Ensure all elements use `html-light:` variants for light mode.

---

## 10. Build & Lint Commands

```bash
npm run dev          # Vite dev server (HMR)
npm run build        # Production build → dist/
npm run deploy       # Cloudflare Pages deploy via Wrangler
npx vitest run       # Data integrity test suite (zero dangling IDs)
npx tsc --noEmit     # TypeScript check (run before any commit)
npx oxlint .         # Lint check (.oxlintrc.json)
```

---

*Last updated: October 2026 — Biraj Sarkar ([@Biraj2004](https://github.com/Biraj2004))*
