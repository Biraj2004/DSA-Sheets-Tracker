# DSA Sheets Tracker 🚀

A modern, offline-first, high-performance web tracker for mastering 1,000+ curated Data Structures & Algorithms problems across the industry's top interview preparation sheets:

* **Striver A2Z DSA Sheet** (460 problems + 22 Star Patterns)
* **NeetCode 150** (150 essential patterns)
* **NeetCode 250** (250 comprehensive practice questions)
* **Love Babbar 450 DSA Sheet** (453 problems across 15 core sections)
* **Apna College DSA Sheet** (184 foundational questions)
* **Master Catalog** (736 deduplicated canonical problems with 18 topic accordions sorted Easy &rarr; Medium &rarr; Hard)

---

## ✨ Features

- **Topic-Wise Master Catalog**: Global view categorized across 18 canonical DSA topics with strict **Easy &rarr; Medium &rarr; Hard** ordering and difficulty breakdown pills.
- **Unified Progress Synchronization**: Mark a problem solved once; progress immediately reflects across every sheet containing that question.
- **Cross-Sheet Synergy & Overlap**: Real-time Venn synergy calculations showing shared coverage across all sheets.
- **Smart Link Routing**: Direct problem links to primary platforms (LeetCode, GFG) paired with secondary **`Also in TUF`** and alternative problem mappings.
- **Revision & Spaced Repetition**: Dedicated Revision Queue to mark tricky problems and schedule reviews.
- **Offline-First Persistence**: Powered by client-side IndexedDB via Dexie.js with instant JSON backup/restore.
- **Dark & Light Mode**: Curated HSL color palette with sleek dark mode and vibrant status indicators.
- **Keyboard Shortcuts**: Press `?` for shortcuts modal, `/` for instant search, `1-5` for sheet switching, and `A` for All Problems.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [Dexie.js](https://dexie.org/) (IndexedDB)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Biraj2004/DSA-Sheets-Tracker.git
cd DSA-Sheets-Tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Run production build
npm run build
```

---

## ☁️ Cloudflare Pages Deployment

This repository is **100% Cloudflare Pages ready** out of the box with SPA redirect rules (`_redirects`), security headers (`_headers`), and `wrangler.toml` preconfigured.

### Option 1: Git Integration (Recommended)
1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) &rarr; **Workers & Pages** &rarr; **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
2. Select this repository.
3. Configure build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `20` (already defined in `.node-version` & `.nvmrc`)
4. Click **Save and Deploy**.

### Option 2: Wrangler CLI
```bash
# Authenticate with Cloudflare
npx wrangler login

# Build & deploy directly
npm run deploy
```

---

## 📄 License

MIT License. Designed and built with ❤️ for competitive programmers and interview preppers.
