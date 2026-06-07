# DocuMind UI Redesign — What Changed & Why

## The problem (what screamed "AI-made")

| Old | Why it looks AI-generated |
|---|---|
| `radial-gradient(circle_at_top, rgba(99,102,241,0.22)…)` | **#1 AI cliché** — purple glow on dark bg is in 80% of AI-generated UIs |
| `Geist` font | Default Next.js scaffold font, unchanged from `npx create-next-app` |
| `bg-white/5 border-white/10` frosted glass everywhere | Overused "glassmorphism" pattern — looks like a template |
| `font-semibold` forced on ALL text in globals.css | Kills typographic hierarchy — everything looks the same weight |
| Generic copy: "AI document intelligence platform" | Every AI product says this |
| Uniform `rounded-2xl` cards with identical padding | No visual hierarchy, everything same weight/size |
| Floating animation on interactive elements | Gratuitous, purposeless motion |

---

## What the redesign does instead

### 1. Color palette — warm off-white + ink + rust accent
- **Background**: warm `oklch(0.975 0.006 80)` — paper tone, not pure white or dark grey
- **Primary**: near-black ink `oklch(0.14 0.01 60)`
- **Accent**: rust/terracotta `oklch(0.58 0.15 38)` — specific, unusual, memorable
- No purple. No indigo. No glows.

### 2. Typography — real hierarchy
- **DM Serif Display** for headings — editorial, distinctive, not a system font
- **DM Sans** for body — clean but not generic
- **DM Mono** for labels, tags, metadata — adds information-design character
- `font-semibold` **removed** from globals. Headings use `font-400` (the serif weight carries itself), body is `font-400`, only UI labels are `font-500`

### 3. Layout — editorial grid, not card soup
- Landing: two-column split — big headline left, live product preview right
- Dashboard: stats as a horizontal rule strip (like a newspaper), not stat cards
- Content in left column, contextual info in narrower right column
- **Rule lines** (`border-b`) separate sections — cheap, effective, professional

### 4. Components — minimal radius, real borders
- `rounded-sm` (2px) instead of `rounded-2xl` (16px) — less bubbly, more precise
- Solid `border-border` instead of `border-white/10` — actual contrast, not ghost lines
- Upload zone: clean dashed border, no glow on hover
- Progress bar: monochrome `bg-foreground` — no gradient, no color theatre

### 5. Motion — one entrance, nothing else
- Single `fade-up` keyframe with staggered delays on hero text only
- **No floating**, no `transition: all`, no hover scale effects
- Hover states: `opacity` or `background-color` only — subtle, fast (150ms)

### 6. Copy — specific, not breathless
- "Turn PDFs into working knowledge." — concrete, direct
- "Three steps." — blunt
- Stats shown as serif numbers — makes data feel architectural, not decorative

---

## Files to replace

```
src/app/globals.css          → replace entirely
src/app/page.tsx             → replace entirely
src/app/dashboard/page.tsx   → replace entirely
```

Add to `next/font` or `<head>` (if not using Google Fonts import in CSS):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet">
```

Or use `next/font/google`:
```ts
// src/app/layout.tsx
import { DM_Serif_Display, DM_Sans, DM_Mono } from 'next/font/google'

const serif = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-serif' })
const sans  = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const mono  = DM_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-mono' })
```
