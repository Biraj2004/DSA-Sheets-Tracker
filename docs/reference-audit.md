# Reference Audit: dsatracker.in

This document audits the reference website https://dsatracker.in/.
We tested it on desktop and mobile screens.

---

## 1. Pages and Menus

- **Sidebar navigation**:
  - The left sidebar has sheet switchers:
    - Striver A2Z Sheet (460 problems listed)
    - Love Babbar 450 Sheet (453 problems listed)
    - NeetCode 250 (250 problems listed)
    - NeetCode 150 (150 problems listed)
    - Apna College Sheet (184 problems listed)
    - All Problems / Combined View (1,464 problems listed)
  - Topic links for 18 steps (Step 1 to Step 18) with emoji icons.
  - Links to Roadmap, Revision, Activity, and Cloud Login.
- **Top Bar**:
  - Global search input.
  - Filter pills: All, Easy, Medium, Hard, Solved, Unsolved, Starred, Has Notes.
  - Total solved counter and overall progress bar.
- **Information Pages**:
  - A roadmap page with an 18-step static outline.
  - Basic FAQs and meta text.

---

## 2. Features

- **Mark as done**: Checkbox at the end of each row.
- **Bookmark / Star**: Star icon button to tag favorite questions.
- **Notes**: A modal pop-up to write plain text notes.
- **Search & Filters**: Text filter by title, difficulty filter, and completion filter.
- **Progress bars**: Shows count per step and overall percentage.
- **Activity Heatmap & Streak**: GitHub-style grid showing daily solved activity.
- **Revision tracker**: List of starred problems.
- **Cloud Sync**: Modal asking for Google or email login using MongoDB backend.
- **Chrome extension link**: Input field for extension sync key.

---

## 3. Data Shown Per Row and Row Numbering

Each table row has:
1. **Row Number (`pnum`)**: 
   - A sequential number from 1 to 1,464.
   - **Crucial finding**: The row number is **global** across the whole database. It does not reset per sheet or per step.
   - When viewing NeetCode 150, rows jump from 800 to 1200 instead of starting at 1.
2. **Title & Sub-text**:
   - Title is a link to the coding platform.
   - Sub-text shows the topic or creator note.
3. **Difficulty Badge**: Easy (Green), Medium (Yellow), Hard (Red).
4. **Platform Tag**: Short text label like `LC`, `GFG`, `CN`.
5. **Action Buttons**: Star button, Note button, Done checkbox.

**Problems in multiple sheets**:
- Instead of linking sheets to one master problem, the reference site duplicates rows or uses separate row IDs.
- Progress made in one sheet does **not** update the same problem in another sheet.

---

## 4. Confirmation of User Observations

We tested every item you noticed. All five are **CONFIRMED**:

| Your Observation | Status | Evidence from Live Site |
|---|---|---|
| **1. Repeated problems** | **CONFIRMED** | - *Count Inversions* appears at Row 751 (HackerRank link) and Row 762 (LeetCode link).<br>- *Fractional Knapsack* appears at Row 785 and in Step 12.<br>- *Painter's Partition* appears at Row 142 (Striver) and Row 754 (Apna College). |
| **2. Problems in the wrong step** | **CONFIRMED** | - In *Step 10: Sliding Window & Two Pointers*, Row 785 is *Fractional Knapsack* (Greedy).<br>- Row 786 is *Activity Selection* (Greedy). Both are greedy problems placed under Sliding Window. |
| **3. Theory/SPOJ with LeetCode tag** | **CONFIRMED** | - Row 5 (*Arrays & Strings* concept) and Row 6 (*For Loops* concept) are language basics with tag `LC`.<br>- Row 751 has tag `LeetCode`, but the link is `hackerrank.com`.<br>- Row 754 has tag `LeetCode`, but the link is `hackerearth.com`.<br>- Row 770 (*Stock Span*) has tag `LeetCode`, but the link is `hackerearth.com`.<br>- Row 785 (*Fractional Knapsack*) links to *Simplified Fractions* on LeetCode, which is an unrelated math question. |
| **4. Step 1 Basics has unrelated problems** | **CONFIRMED** | - Step 1 has 133 problems crammed in.<br>- Rows 1378–1404 are NeetCode *Math & Geometry* problems.<br>- Rows 1426–1455 are NeetCode *30 Days of JavaScript* problems (*Create Hello World*, *Counter*, *Curry*, *Sleep*, *Debounce*, *Event Emitter*). None of these belong in introductory DSA basics. |
| **5. Global row numbers** | **CONFIRMED** | Row numbers run continuously from 1 to 1,464 across all sheets. A problem in NeetCode has row number 940 instead of 1. |

---

## 5. Bugs Found

1. **Progress resets on reload (Critical Bug)**:
   - When a user checks a problem and reloads the page, progress resets to 0.
   - Root cause in `script.js`:
     ```
     ReferenceError: escapeHtml is not defined at script.js?v=2.2.0:2307 at renderActivityHub at loadUserProgress
     ```
   - Because `escapeHtml` is missing, the load script crashes on startup.
2. **Cross-sheet sync does not work**:
   - Marking *Two Sum* solved in NeetCode does not mark it solved in Striver A2Z.
   - Keys are tied to row numbers (`1`, `2`, `940`) rather than a problem ID (`lc-two-sum`).
3. **Guest progress lost on cloud login**:
   - Logging in overwrites guest progress without asking to merge.
4. **Platform tags typed manually**:
   - Platform tags do not come from the link URL, causing frequent mismatches.

---

## 6. Design and Usability Problems

1. **Emoji Overload**:
   - Uses emojis everywhere as section icons: `🧮`, `🔃`, `🪟`, `⛰️`, `⚡`, `🌳`, `🌲`, `🕸️`, `💡`, `🔡`, `🧵`.
   - Emojis render differently on Windows, macOS, Android, and Linux. They look unprofessional and inconsistent.
2. **Harsh Neon Cyber Palette**:
   - Uses pure black `#080b10` with neon cyan `#00e5ff`, harsh purple `#7c5cfc`, and high saturation green/yellow.
   - No light mode. Strains the eyes over long study sessions.
3. **Typography**:
   - Uses Syne (quirky display font) and JetBrains Mono for body text. JetBrains Mono is great for code and numbers, but hard to read for long lists and paragraphs.
   - Numbers lack `tabular-nums`, causing table text to jitter.
4. **Spacing and Clutter**:
   - Table rows are tight (under 36px) with cramped buttons.
   - Ad banners (`pagead2.googlesyndication.com`) interrupt the problem list.
5. **Mobile View Flaws**:
   - The sheet switcher pills overflow horizontally with weak touch affordance.
   - The table requires horizontal scrolling. Action buttons (star, note, checkbox) are smaller than the standard 44px touch target.

---

## 7. How Our New App Will Fix Each Problem

| Problem on Reference Site | How DSA Tracker Fixes It |
|---|---|
| Progress lost on reload | Saved in IndexedDB (`dexie`) with instant writes, fallback handling, and unit tests. |
| Cross-sheet progress separated | Each problem is stored once by canonical slug (`lc-two-sum`). Solving it once marks it everywhere. |
| Global confusing row numbers | Clean per-sheet and per-section numbering (1, 2, 3...) that makes sense in context. |
| Wrong platform tags | Platform is derived directly from the URL domain (`getPlatformFromUrl`). Never typed by hand. |
| Mixed up / duplicate problems | Each sheet keeps its exact creator hierarchy. No unrelated JS problems in Step 1. |
| Emojis as icons | 100% clean, unified Lucide SVG icons with consistent 1.75px stroke width. No emojis. |
| Neon dark-only theme | Impeccable design system with both refined Dark and crisp Light modes. Inter for reading, JetBrains Mono for numbers. |
| Mobile touch issues | Full responsive drawer, 44px mobile touch targets, and sticky progress header. |
