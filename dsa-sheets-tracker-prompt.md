# Build "DSA Tracker": a simple, original DSA sheet tracker

Paste this whole file into Antigravity as your first message. Use Planning mode. Do not write app code until the Phase 0 audit and the plan are posted and I have approved them.

Write all your messages, comments and docs in simple English. Short sentences. No rare words.

---

## 0. Rules for the agent

1. Work in phases (see Section 10). After each phase, post a short summary and stop for my review.
2. Never make up data. Every problem, link, platform and section must come from a real source you opened. If you cannot check something, mark it `unchecked` and list it in a report.
3. https://dsatracker.in/ is for **looking only**. Do not copy its code, styles, text, hints, logo or layout. Build an original app with its own design.
4. If something is not covered here and is hard to undo later, ask me first.
5. Keep a file `docs/decisions.md`. Add one line for each important choice and the reason.

---

## 1. Goal

A personal tracker for DSA practice. I pick a sheet (Striver A2Z, Love Babbar 450, NeetCode 150, NeetCode 250, Apna College 184), go through it section by section, and my progress is saved safely.

The old site has two big problems. This rebuild must fix both:

- **Saving does not work well.** Both local and cloud saving failed for me.
- **Mapping is not reliable.** Some platform tags are wrong, some problems are repeated, and some sit in the wrong section.

---

## 2. Phase 0: Look at the reference site

Use the browser agent to open https://dsatracker.in/ on desktop and mobile width. Write `docs/reference-audit.md` with:

1. **Pages and menus.** What is in the sidebar, the sheet switcher, the combined view, the roadmap page and the info pages.
2. **Features.** Mark as done, star, notes, filters, search, hide hints, progress bars, activity heatmap, streaks, revision tracker, cloud sync, Chrome extension key.
3. **Data shown per row.** Number, title, sub-text, difficulty, platform, status. How numbering works. What happens when one problem is in many sheets.
4. **Bugs to avoid.** Test these and add screenshots:
   - Does progress stay after page reload, closing the tab, and restarting the browser?
   - Does signing in keep the guest progress?
   - If I mark a problem done in one sheet, does it change in other sheets?
   - Are there repeated problems?
   - Does each platform tag match the real link?
   - Are any problems in the wrong section?
5. **Design problems.** Spacing, fonts, colours, emoji use, mobile view.

Things I already noticed. Please confirm or reject each one:

- The same problem appears many times (for example Count Inversions, Fractional Knapsack).
- Some problems are in the wrong step (for example greedy problems under Sliding Window).
- Some SPOJ-type or theory items have an LC tag.
- Step 1 (basics) has unrelated problems at the end (NeetCode Math and JavaScript problems).
- Row numbers are global across all sheets.

Stop after Phase 0. Wait for my approval.

---

## 3. What the app must do

### 3.1 Sheets and sections

- Each sheet keeps its **own** sections, as the sheet creator made them. Do not force one common list of steps on every sheet.
- An **All problems** page is built from the data automatically. It groups by topic and shows which sheets each problem is in.
- Each sheet page shows: name, creator, link to the original, total and solved count, and progress for each section.

### 3.2 Problems

- Each real problem is stored **once**. If many sheets have it, they all point to the same record.
- Progress belongs to the problem, not to the sheet. Solving Two Sum in one sheet marks it solved in all sheets. Show this clearly ("Also in: Striver A2Z, NeetCode 150").
- Each problem has: title, platform, link, difficulty, status, star, my notes, solved date, next revision date.
- Notes are written by me. Do not add hints or solutions copied from any site.

### 3.3 Features

- Search, and filters for status, difficulty, platform, starred, has notes and sheet.
- Open and close sections. Remember the state.
- Revision list with gaps of 1, 3, 7 and 21 days. A "due today" view.
- Activity heatmap and streaks. Show the counting rules on screen.
- Target date planner. I set a date. The app shows problems left, days left, problems per day needed, and if I am ahead or behind. The date starts empty.
- Keyboard keys: `/` search, `j` and `k` move, `x` solved, `s` star, `n` notes, `?` help.
- Export and import my progress as a JSON file.
- An attribution page that thanks each sheet creator and links to the original.

---

## 4. Data design

Keep the types small and easy to read.

```ts
// Where a problem is hosted. Filled in by code from the link, never typed by hand.
type Platform =
  | 'leetcode' | 'gfg' | 'codingninjas' | 'spoj'
  | 'hackerearth' | 'interviewbit' | 'other' | 'concept';

type Status = 'todo' | 'tried' | 'solved' | 'revise';

type Problem = {
  id: string;            // like "lc-two-sum"
  title: string;
  platform: Platform;
  url: string | null;    // empty only for concept questions
  difficulty: 'easy' | 'medium' | 'hard' | null;
  topics: string[];
  check: 'ok' | 'unchecked' | 'broken';
  checkedAt: string | null;
};

type Sheet = {
  id: string;            // like "striver-a2z"
  name: string;
  creator: string;
  sourceUrl: string;
  fetchedAt: string;
  expectedCount: number;
};

type Section = {
  id: string;
  sheetId: string;
  title: string;
  parentId: string | null;
  position: number;
};

// Says which problem sits in which section of which sheet.
type SheetItem = {
  sheetId: string;
  sectionId: string;
  problemId: string;
  position: number;
  titleInSheet?: string; // only if the sheet uses a different title
};

// Saved on the user's device. One record per problem.
type Progress = {
  problemId: string;
  status: Status;
  isStarred: boolean;
  note: string;
  solvedAt: string | null;
  nextReviewAt: string | null;
  reviewStep: number;
  updatedAt: string;
};
```

Save the fixed data as JSON files in `src/data/`: one file per sheet, plus `problems.json`. Progress is the only data that users create.

---

## 5. Data rules (most important)

1. **Use the real source.** Get each sheet from its creator's own page or official sheet. Use the browser agent if the page needs scripts. Save `sourceUrl` and `fetchedAt`. Use dsatracker.in only to compare, never as the source.
2. **Platform comes from the link.** One small function, `getPlatformFromUrl`, reads the link's host and returns the platform. It has unit tests. Items with no link are `concept`. Because of this, a wrong platform tag cannot happen.
3. **No repeated problems.** Clean each link (remove extra parts, `www`, trailing slash) and use platform plus slug as the id. If one problem has two titles, keep one record and put the other title in `titleInSheet`.
4. **Keep the sheet's own order and sections.** Never move a problem to another section to make numbers look nice.
5. **Honest counts.** Do not force totals to match 460, 453, 250, 150 or 184. Use the real count from the source. Write every difference in `reports/count-differences.md`.
6. **Check every link.** Open it and confirm the page title matches. If a site blocks simple requests (LeetCode may), use the browser agent, or mark `unchecked`. Never mark `ok` without checking.
7. **Data check script.** `npm run check:data` must fail if:
   - a `SheetItem` points to a missing problem or section;
   - a platform does not match the link host;
   - a problem that is not `concept` has no link;
   - the same problem appears twice in one sheet;
   - a sheet's item count is not equal to `expectedCount`;
   - any problem is `broken`.
8. **Reports** in `reports/`: `platform-list.md`, `repeated-problems.md`, `unchecked.md`, `count-differences.md`.
9. **Copyright.** Store only what is needed to find the problem: title, link, platform, difficulty, and where it sits. Do not copy explanations, solutions or hints. Thank the creators on the attribution page.

---

## 6. Saving data

Saving is the most important part. Build and test it before the screens.

### 6.1 On the device

- Use IndexedDB with the `dexie` library. Do not use plain `localStorage` for progress.
- Use the problem `id` as the key. Never use a row number.
- Give the database a version number. Write a migration for each change.
- Save right after each change (wait 300 ms at most). Show "Saved" only after the save worked.
- Ask the browser for lasting storage with `navigator.storage.persist()`.
- If storage is blocked (private mode, no space), show a clear banner and offer a JSON export. Never fail quietly.
- Show a status label: `Saved on this device`, `Syncing`, `Synced`, `Offline, will sync later`, `Error`.
- Export and import JSON with a version number. On import, show a preview and let me choose to merge or replace.

### 6.2 In the cloud

- Use Supabase (login, database and row rules). Ask me before using anything else.
- Login with email link and Google.
- One table `progress` with the key `(user_id, problem_id)`. Row rules so each user can only see and change their own rows.
- Works offline first. Changes are saved on the device, put in a queue, and sent when the internet is back.
- If two devices change the same problem, the newest `updatedAt` wins. Explain this in `docs/sync.md`.
- First login with guest progress on the device: show a preview (how many problems on each side, what will change) before joining them. Never overwrite without asking.
- Keep all cloud code in **one file**, `src/lib/cloud.ts`, so the app also works with no cloud.
- Build the cloud part after the device part is fully working.

### 6.3 Tests that must pass

- Mark a problem, reload the page, it is still marked.
- Mark a problem, close the browser, open again, it is still marked.
- Mark a problem offline, go online, it reaches the cloud.
- Two devices change different problems: both changes stay.
- Two devices change the same problem: the newest wins.
- Database update from version 1 to 2 keeps the data.
- A broken or too big import file is refused with a clear message.

Use Vitest for small tests and Playwright for browser tests.

---

## 7. Tech stack (keep it simple)

- **Vite + React + TypeScript** (strict mode). No server needed: the sheets are fixed files and progress lives on the device.
- **React Router** for pages.
- **Tailwind CSS** for styles, with colours and sizes set once as CSS variables.
- **State:** use React `useState`, `useReducer` and small custom hooks. Do not add a state library.
- **Device storage:** `dexie`.
- **Cloud:** `@supabase/supabase-js`, only inside `src/lib/cloud.ts`.
- **Icons:** `lucide-react`.
- **Tests:** Vitest and Playwright.
- **Tools:** ESLint and Prettier.
- **Deploy:** Vercel or Netlify (static site).

Do not add extra libraries without telling me why. Fewer libraries is better.

---

## 8. Code style: component-first, simple names

### 8.1 Component-first way of working

1. First build small, reusable pieces. Each does one job and has no data loading inside.
2. Show every piece on a `/gallery` page in all its states (normal, hover, disabled, dark mode) before building real pages.
3. Then build bigger parts by joining small pieces.
4. Pages only join parts and connect them to data.

Small pieces to build first: `Button`, `IconButton`, `Badge`, `ProgressBar`, `Checkbox`, `SearchBox`, `Select`, `Drawer`, `Tabs`, `EmptyMessage`, `PlatformLabel`, `DifficultyLabel`, `StatusButton`, `StarButton`.

Bigger parts: `ProblemRow`, `SectionCard`, `SheetCard`, `NotesDrawer`, `FilterBar`, `Heatmap`, `SyncStatus`.

### 8.2 Folders

```
src/
  components/   small pieces (Button, Badge, ProgressBar ...)
  features/     bigger parts grouped by topic (sheets, progress, notes, revision, planner)
  pages/        one file per page
  hooks/        useProgress, useFilters, useSyncStatus ...
  lib/          platform.ts, storage.ts, cloud.ts, dates.ts
  data/         sheets and problems as JSON
  styles/       tokens.css, global.css
scripts/        check-data.ts, make-reports.ts
tests/
docs/
reports/
```

### 8.3 Naming rules

- Use plain, common English words. Say what the thing is. Short is good, but never cut words so much that the meaning is lost.
- Components and types: `PascalCase` (`ProblemRow`, `SheetItem`). File name is the same as the component (`ProblemRow.tsx`).
- Variables and functions: `camelCase`.
- Functions start with a verb: `getPlatformFromUrl`, `saveProgress`, `toggleSolved`, `loadSheet`.
- Yes/no values start with `is`, `has` or `can`: `isSolved`, `hasNotes`, `canSync`.
- Lists end with `List` or use a plural noun: `problemList`, `sectionList`.
- Hooks start with `use`: `useProgress`.
- Constants: `UPPER_SNAKE_CASE` (`REVIEW_GAP_DAYS`).
- Data and script files: `kebab-case` (`striver-a2z.json`, `check-data.ts`).
- No short forms except `id`, `url`, `db`. Write `section`, not `sec`. Write `count`, not `cnt`.
- Status names in the UI are simple words: To do, Tried, Solved, Revise.

### 8.4 Code rules

- One component per file. Keep files under about 150 lines.
- One job per function. Keep functions under about 30 lines.
- No clever code. No nested `? :`. No deep generics. No tricks that need a comment to understand.
- Comments in simple English. Say **why**, not what.
- Prefer plain `if` and `for`/`map` that a student can read.
- Put logic in `lib/` and hooks. Keep components mostly about what is shown.
- Every function in `lib/` has at least one test.

---

## 9. Design

Calm, clean and easy to read. No emoji anywhere (UI, text or comments). Use one icon set (Lucide) with the same line width.

### 9.1 Fonts

- Text: **Inter**. Numbers and code: **JetBrains Mono**. Use `font-variant-numeric: tabular-nums` for all counts.
- Sizes (size / line height): 12/16 small, 13/20 table text, 14/22 normal, 16/24 large, 20/28 section title, 28/36 page title.
- Weights: 400, 500, 600 only.
- Prose lines are at most 72 characters wide.

### 9.2 Spacing and layout

- Use a 4px base. Allowed steps: 4, 8, 12, 16, 24, 32, 48.
- Table rows: 44px normal, 36px compact (a switch in settings, remembered).
- Sidebar 280px. On tablet it shrinks. On mobile it becomes a drawer.
- Page content is at most 1120px wide and centred.
- The page header stays on top and shows the sheet name, total progress and the save status.

### 9.3 Colour

- Set colours once as CSS variables (`--bg`, `--surface`, `--border`, `--text`, `--text-muted`, `--accent`, `--success`, `--warning`, `--danger`) for light and dark themes. Follow the system setting and allow a switch.
- Grey tones plus **one** accent colour. Difficulty colours are soft, and the difficulty word is always shown too.
- Text and controls must pass WCAG AA contrast.

### 9.4 Look of the main parts

- Problem row: status button, number, title (link), difficulty word, platform label with a small link icon, star, notes dot.
- Progress bars are thin (4px) with the count as text, like `14 / 63`.
- Notes open in a side drawer with fields: approach, time and space, mistakes, free text. They save automatically and show the save state.
- Empty pages show one plain sentence and one button. No pictures.
- Animations are short (120 to 180 ms). Respect the "reduce motion" setting.

### 9.5 Pages

`/` home (sheets, total progress, revisions due, streak), `/sheet/:id`, `/all`, `/revision`, `/activity`, `/planner`, `/settings`, `/about`, `/attribution`, `/privacy`, `/terms`, `/gallery` (development only).

---

## 10. Plan and checkpoints

| Phase | What to deliver | Check before moving on |
|---|---|---|
| 0 | `docs/reference-audit.md` and the plan | I approve |
| 1 | Data files, `check:data` script, four reports | Script passes. No platform mismatch. I read the count differences |
| 2 | Project setup, design tokens, small components, `/gallery` | I review the gallery |
| 3 | Bigger parts and pages: sheets, All view, filters, search, notes drawer | Screenshots on desktop and mobile |
| 4 | Device saving, export and import, save status | All device tests pass |
| 5 | Login, cloud sync, guest-to-account join | All cloud tests pass |
| 6 | Revision list, heatmap, planner, keyboard keys | Screenshots |
| 7 | Accessibility and speed check, README, deploy | Lighthouse: speed 90+, accessibility 95+. Live link works |

After each phase, post: what changed, screenshots, test results, and open questions.

Also:
- The app must work with the keyboard only, with clear focus outlines.
- Long lists must stay smooth on a mid-range phone (show a section at a time or use a windowed list).
- No layout jump while progress loads. Show the fixed data first, then add progress.

---

## 11. Done means

- Every problem has a checked link, or is listed as `unchecked`.
- Platform always matches the link.
- No repeated problem inside a sheet. Problems shared by many sheets have one progress record.
- Progress stays after reload, browser restart, offline use, and login on a second device.
- No emoji in the UI or code.
- All tests pass. The README explains setup, how to update the data, and how sync works, in simple English.

## 12. Do not

- Do not copy code, styles, text, hints or images from dsatracker.in or any other tracker.
- Do not change sheets to match the advertised counts.
- Do not type platform names by hand.
- Do not use row numbers as keys.
- Do not show "Saved" before the save has worked.
- Do not add a state library, a UI kit, or analytics without asking me.
- Do not use hard words in names, comments or docs.
