# DSA Tracker: Implementation Plan

This plan follows the phases in `dsa-sheets-tracker-prompt.md` and the design rules in `.impeccable.md`.

---

## Overall Strategy and Principles

1. **Step-Wise Arrangement**:
   - Every sheet (Striver A2Z, Love Babbar 450, NeetCode 150, NeetCode 250, Apna College 184) keeps its exact creator hierarchy and sections.
   - Problems within sections are strictly ordered as intended by the creator.
   - No mixing of unrelated topics (such as 30 Days of JS in basic algorithmic steps).
2. **Unified Data Architecture**:
   - Each unique problem exists once in `src/data/problems.json` with a canonical ID (e.g., `lc-two-sum`, `gfg-kadanes-algorithm`).
   - Sheet files (`src/data/striver-a2z.json`, etc.) reference `problemId` and `sectionId`.
   - Progress belongs to the problem. Solving a problem in one sheet marks it solved in every sheet that contains it.
3. **Impeccable Design**:
   - **Typography**: Inter for crisp reading, JetBrains Mono with `tabular-nums` for counts and numbers.
   - **Colors**: Dual Light & Dark themes with OKLCH-based semantic tokens. High contrast (WCAG AA). No neon glow.
   - **Icons**: Lucide icons only. Consistent 1.75px stroke width. No emojis anywhere.
   - **Motion & Spacing**: 4px base spacing grid. Fluid transitions under 180ms with reduced-motion support.
4. **Reliable Saving**:
   - Dexie.js (IndexedDB) with `navigator.storage.persist()`.
   - Fast 300ms debounced saves. "Saved" badge appears only after the write completes.
   - Full JSON import/export with schema validation and conflict resolution preview.

---

## Phase Breakdown

### Phase 0: Reference Audit and Architecture Plan (Current Phase)
- [x] Inspect https://dsatracker.in/ on desktop and mobile viewports.
- [x] Test and confirm all 5 user observations (duplicates, miscategorization, wrong tags, JS in basics, global numbers).
- [x] Find root causes of save failures (`escapeHtml` crash on reload).
- [x] Create `docs/decisions.md`.
- [x] Create `.impeccable.md` for design context and styling rules.
- [x] Write `docs/reference-audit.md`.
- [x] Write `docs/plan.md`.
- [ ] **Checkpoint**: User reviews and approves Phase 0 before any app code is written.

---

### Phase 1: Clean Data Extraction, Validation Script & Reports
- **Goal**: Collect authentic problem lists from official sources. Store data cleanly without duplicates.
- **Steps**:
  1. Write `src/lib/platform.ts` with `getPlatformFromUrl(url: string): Platform` and unit tests.
  2. Compile verified JSON datasets in `src/data/`:
     - `striver-a2z.json`
     - `love-babbar-450.json`
     - `neetcode-150.json`
     - `neetcode-250.json`
     - `apna-college.json`
     - `problems.json`
  3. Write data verification script: `scripts/check-data.ts`.
     - Validates that every `SheetItem` points to an existing problem and section.
     - Validates that platform tags match URL hostnames exactly.
     - Validates that no sheet has duplicate problems.
     - Checks link status.
  4. Generate reports in `reports/`:
     - `platform-list.md`
     - `repeated-problems.md`
     - `unchecked.md`
     - `count-differences.md`
- **Checkpoint**: `npm run check:data` passes. User reviews count differences.

---

### Phase 2: Project Setup, Design Tokens, Small Components & Gallery
- **Goal**: Build small, robust building blocks and verify them visually on `/gallery`.
- **Steps**:
  1. Initialize React + TypeScript + Vite + Tailwind CSS project with strict typing.
  2. Implement CSS design tokens in `src/styles/tokens.css` (dual Light & Dark themes, semantic colors, spacing tokens).
  3. Configure Inter and JetBrains Mono typography.
  4. Build small reusable components (Lucide icons only, no emojis):
     - `Button`, `IconButton`, `Badge`, `ProgressBar`, `Checkbox`, `SearchBox`
     - `Select`, `Drawer`, `Tabs`, `EmptyMessage`
     - `PlatformLabel`, `DifficultyLabel`, `StatusButton`, `StarButton`
  5. Build development `/gallery` page demonstrating all components in normal, hover, focused, disabled, and dark states.
- **Checkpoint**: User reviews `/gallery` and approves visual design.

---

### Phase 3: Features, Layouts & Sheet Views
- **Goal**: Join components into feature cards, sections, and complete pages.
- **Steps**:
  1. Build layout:
     - Top Navigation Header with sheet switcher, quick search, theme toggle, and live save status.
     - Responsive Sidebar with clean Lucide icons and step indicators.
     - Mobile drawer navigation with 44px touch targets.
  2. Build feature components:
     - `ProblemRow`: Row number, title with link icon, difficulty pill, platform pill, star toggle, notes indicator, status menu.
     - `SectionCard`: Collapsible step card with section progress bar (`X / Y solved`), collapse state saved locally.
     - `FilterBar`: Filters for status (To do, Tried, Solved, Revise), difficulty, platform, starred, has notes.
     - `NotesDrawer`: Slide-over panel with approach, time/space complexity, and personal notes.
  3. Build pages:
     - Sheet View (`/sheet/:id`)
     - All Problems Master View (`/all`) with cross-sheet badges ("Also in: NeetCode 150").
     - Search and multi-filter integration.
- **Checkpoint**: Screenshots on desktop and mobile viewports.

---

### Phase 4: Local Device Persistence, Import/Export & Testing
- **Goal**: Ensure data never vanishes, works 100% offline, and survives reloads.
- **Steps**:
  1. Implement `src/lib/storage.ts` using `dexie`:
     - IndexedDB table `progress` keyed by canonical `problemId`.
     - Request persistent storage via `navigator.storage.persist()`.
     - Fast 300ms debounced auto-save.
  2. Build live Save Status indicator: `Saved on this device`, `Syncing`, `Offline`, `Error`.
  3. Implement JSON Export and Import:
     - File format versioning.
     - Import preview modal showing problem counts and conflict resolution (merge vs replace).
  4. Write unit tests (Vitest) for persistence, state transitions, and import/export edge cases.
- **Checkpoint**: All device persistence tests pass.

---

### Phase 5: Cloud Sync (Supabase) & Offline-First Joining
- **Goal**: Allow multi-device sync without risking guest progress.
- **Steps**:
  1. Isolate all cloud logic in `src/lib/cloud.ts`.
  2. Supabase auth: Magic Link email and Google OAuth.
  3. Row Level Security: Users can only read/write their own progress rows.
  4. Offline-first change queue: changes on device are queued and synced when back online.
  5. Conflict resolution: Last-write-wins based on UTC `updatedAt`.
  6. Guest account merge flow: Shows preview modal before joining local progress into the signed-in account.
- **Checkpoint**: All cloud sync and merge tests pass.

---

### Phase 6: Revision Tracker, Heatmap, Planner & Keyboard Ergonomics
- **Goal**: Spaced repetition, habit tracking, target date scheduling, and keyboard shortcuts.
- **Steps**:
  1. Spaced Repetition Revision (`/revision`):
     - Intervals: 1 day, 3 days, 7 days, 21 days.
     - "Due Today" tab and overdue flags.
  2. Heatmap & Streaks (`/activity`):
     - Interactive SVG activity calendar.
     - Clear rules explained on screen (based on problems marked solved per day).
  3. Target Date Planner (`/planner`):
     - User picks a target exam or interview date.
     - Calculates: problems remaining, days left, daily pace needed, and pace status (ahead / behind).
  4. Keyboard Shortcuts:
     - `/` Focus search
     - `j` / `k` Navigate rows
     - `x` Toggle solved
     - `s` Toggle star
     - `n` Open notes drawer
     - `?` Help shortcut cheat sheet
- **Checkpoint**: Feature verification and screenshots.

---

### Phase 7: Quality Audit, Accessibility, Documentation & Deployment
- **Goal**: Verify performance, accessibility, documentation, and production readiness.
- **Steps**:
  1. Accessibility & Performance audit:
     - Lighthouse score targets: 90+ Performance, 95+ Accessibility.
     - WCAG AA contrast check across all light and dark tokens.
     - Full keyboard navigation test with visible focus rings.
  2. Complete documentation:
     - `README.md`: Setup, architecture, data updates, and sync model.
     - `docs/sync.md`: Cloud sync rules, conflict handling, and offline behavior.
     - `docs/decisions.md`: Final record of choices.
     - Attribution page thanking all sheet creators with official links.
  3. Production build test and deployment configuration (Vercel / Netlify static output).
- **Checkpoint**: Final review and sign-off.
