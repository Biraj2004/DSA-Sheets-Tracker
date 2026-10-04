# DSA Sheets Tracker — Brand Identity Guidelines

> **Version**: 2.0 (Redesign 2026)  
> **Master Symbol**: The Code-Check  
> **Repository Location**: `docs/brand/`  

---

## 1. The Logo & Visual Concept

**The Code-Check** is the official visual identifier for **DSA Sheets Tracker**.  
- **Idea**: A single continuous, unbroken ribbon: code syntax (`<`) turns seamlessly into an ascending solved checkmark (`✓`).
- **Core Narrative**: From code problem to solved milestone. It eliminates generic textbook tree graphs and hairline diagrams in favor of pure, bold geometric minimalism.
- **Production Score**: **99 / 100** on `svg_audit.py` (0 near-miss angles, exact 45° and 90° integer coordinates, perfectly centered).

### Versions & File Map

```
docs/brand/
├── svg/
│   ├── dsa-symbol.svg              ← Transparent master glyph (indigo & emerald)
│   ├── dsa-symbol-tile.svg         ← Master on signature dark squircle (#0b0f19)
│   ├── dsa-symbol-black.svg        ← Solid one-colour black master
│   ├── dsa-symbol-white.svg        ← Solid one-colour white master (reversed)
│   ├── dsa-symbol-mono-indigo.svg  ← Monochrome Electric Indigo (#6366f1)
│   ├── dsa-symbol-mono-emerald.svg ← Monochrome Solved Emerald (#10b981)
│   ├── dsa-horizontal-lockup-dark.svg  ← Lockup for dark surfaces (white wordmark)
│   └── dsa-horizontal-lockup-light.svg ← Lockup for light surfaces (slate wordmark)
├── slides/                         ← Client presentation slides (slide-01 to 05)
├── presentation.html               ← Interactive mockup presentation
└── presentation-spec.json          ← Brand spec for presentation_board.py
```

---

## 2. Clear Space & Proportions

- **Clear zone**: Maintain a minimum exclusion zone of **$1 \times S$** around the logo on all sides, where $S$ equals the stroke thickness (28 px on a 256 px canvas, or approximately $11\%$ of the mark's width).
- No UI element, text, or border should intrude into this zone.

---

## 3. Minimum Sizes

| Format | Digital / Screen | Print / Physical |
|---|---|---|
| **Symbol (Tile / Favicon)** | **16 × 16 px** (tested down to 16 px) | 6 × 6 mm |
| **Horizontal Lockup** | **120 × 28 px** | 35 × 8 mm |
| **App Icon / Touch Icon** | **180 × 180 px** | 15 × 15 mm |

---

## 4. Colour Palette

| Name | Role | HEX | RGB | HSL |
|---|---|---|---|---|
| **Electric Indigo** | Code syntax / Input / Primary | `#6366f1` | `rgb(99, 102, 241)` | `hsl(239, 84%, 67%)` |
| **Solved Emerald** | Checkmark / Solved Milestone | `#10b981` | `rgb(16, 185, 129)` | `hsl(161, 84%, 39%)` |
| **Night Slate** | Dark background tile | `#0b0f19` | `rgb(11, 15, 25)` | `hsl(223, 39%, 7%)` |
| **Border Slate** | Tile stroke / Divider | `#1e293b` | `rgb(30, 41, 59)` | `hsl(217, 33%, 17%)` |
| **Pure White** | Reversed / High-contrast text | `#ffffff` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)` |

### Approved Color Pairings
- **Default (Dark Mode)**: `dsa-symbol-tile.svg` or `dsa-horizontal-lockup-dark.svg` on `#0b0f19` / `#0f172a`.
- **Light Mode**: `dsa-horizontal-lockup-light.svg` on `#ffffff` / `#f8fafc`.
- **Monochrome Print**: `dsa-symbol-black.svg` on light paper; `dsa-symbol-white.svg` on dark merchandise.

---

## 5. Typography

- **Logo Lockup Wordmark**: Geometrically outlined vector letterforms based on modern Swiss grotesque geometry with optical kerning.
- **App Body & UI Typography**: `Inter`, system-ui, -apple-system, sans-serif.

---

## 6. Logo Misuse Rules (Don'ts)

- ❌ **Do not stretch or squish** the aspect ratio (always scale proportionally).
- ❌ **Do not recolour** individual segments with arbitrary colors outside the approved palette.
- ❌ **Do not add drop shadows, outer glows, or bevels** (the vector is designed to be flat and bold).
- ❌ **Do not rotate** the angle away from strict 45°/90° orientation.
- ❌ **Do not crowd the mark** without the minimum $1 \times S$ clear space.
- ❌ **Do not attempt to retype the wordmark** using a system font — always use the outlined SVG master.
