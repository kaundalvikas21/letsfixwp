# Design System Master File: fixmywp-v1 (Incident Console)

> **LOGIC:** When building a specific page, first check `design-system/fixmywp-v1/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file. If not, follow the rules below.
> Precedence (docs/section-contract.md rule 1): accessibility and touch > taste-skill hard bans and Pre-Flight > fixmywp brand anchors > this file's generated baseline > dials and judgment.

**Project:** fixmywp-v1, branch `v1-incident-console`
**Generated:** 2026-10-06 by `search.py "SaaS WordPress emergency repair incident response" --design-system --variance 7 --motion 6 --density 5`, then edited to the V1.0 brief.
**Generator category:** Home Services (Plumber/Electrician)
**Design Read:** SaaS-grade landing for site owners in the middle of an outage, with a dark incident-console language, leaning toward Tailwind v4 + Geist + restrained Motion.
**Dials:** DESIGN_VARIANCE 7 | MOTION_INTENSITY 6 | VISUAL_DENSITY 5

---

## Overrides (win over the generated output)

| # | Generated | Override | Reason |
| --- | --- | --- | --- |
| 1 | Light theme: background `#EFF6FF`, cards `#FFFFFF` | Theme **locked dark**. No section flips to light | Brief, taste 4.11 Page Theme Lock. The site is for people in the middle of an outage, and an incident console reads as dark |
| 2 | Primary `#1E40AF`, secondary `#3B82F6`, accent `#EA580C`, foreground `#1E3A8A` | One accent `#CC3333` (brand red). Nothing else coloured | Brief and brand anchor. A single accent keeps urgency legible |
| 3 | On Primary / On Destructive `#FFFFFF`, On Accent / On Secondary `#000000` | No pure black or white anywhere. Text on accent fills uses `--accent-label #FAFAFA` (4.92:1) | Contract rule 6 bans `#000000` and `#FFFFFF`. `--text #EDEDEF` on `#CC3333` is only 4.39:1 and fails AA, so a separate label token is needed |
| 4 | Destructive `#DC2626`, success green implied | Resolved or success states use `--text` plus a Phosphor check icon. Errors use `--accent-ink` text plus an icon. No green | Brief: one accent only. Meaning never relies on colour alone (WCAG 1.4.1) |
| 5 | Poppins headings, Open Sans body, Google Fonts `@import` | Geist (display 600, `tracking-tight`, leading 1.05) and Geist Mono for codes, timestamps and error strings, both via `next/font` | Brief. `next/font` self-hosts, so no render-blocking CSS import and no layout shift |
| 6 | Flat Design: "no gradients/shadows" | Shadows allowed but **tinted to the background hue**. Still no gradients on text, no glows | Brief. Tinted shadows give depth on dark surfaces without the neon look |
| 7 | Shadow tokens built on `rgba(0,0,0,...)` | One tinted shadow token, `--shadow-card` | Contract rule 6 bans pure black. Dark shadows are tinted from `--bg` |
| 8 | Modal radius 16px, mixed radii | **Shape lock:** cards 12px, inputs and buttons 8px, nothing else rounded | Brief. A consistent shape language |
| 9 | Hover `transform: translateY(-1px)` with `transition: all` | Motion springs (stiffness 100, damping 20) for entrances and hover. Animate transform and opacity only. `:active` uses `scale-[0.98]` | Brief and contract rules 5 and 10. `transition: all` animates layout properties |
| 10 | GSAP Stagger List with `back.out(1.4)` | Motion only. GSAP is not installed, and the two are never mixed (contract rule 2). Allowed effects: **one** streaming-text effect (inside the triage widget only), **one** sticky card stack (process timeline), **one** marquee (platform logos). No other loops | Brief: restrained Motion |
| 11 | Icons: Heroicons or Lucide | Phosphor (`@phosphor-icons/react`), weight `regular` everywhere | Brief |
| 12 | Checklist item "Light mode: text contrast 4.5:1" | Dark-only contrast checks (table below) | Theme is locked dark |
| 13 | CTA placement "Contact Sales / Get Quote" | CTA labels only from `src/config/cta.ts`: BOOK "Fix my site", CHAT "Chat with an engineer", PLANS "See care plans" | Contract rule 5 and the foundation CRO plumbing |
| 14 | Proof section "logos, certs, stats" | Proof uses only real data: the two approved testimonials, the 30-day guarantee, the hacked-site promise, and the platform marquee. No invented stats or certifications | Contract rule 8 and the brand anchors |
| 15 | Style result "dark-mode-oled": `#000000` background, neon accents, `text-shadow` glow, 7:1 target | Kept: `color-scheme: dark`, visible focus, high readability. Rejected: pure black, neon, glow | Contract rule 6 bans glows and pure black |

---

## Tokens (implemented in `src/app/globals.css`)

| Token | Value | Tailwind utility | Use |
| --- | --- | --- | --- |
| `--bg` | `#0B0B0D` | `bg-bg` | Page background |
| `--surface` | `#131316` | `bg-surface` | Cards, panels |
| `--surface-2` | `#1A1A1F` | `bg-surface-2` | Raised panels, inputs, hover |
| `--line` | `rgb(255 255 255 / 0.08)` | `border-line` | Hairlines and borders |
| `--text` | `#EDEDEF` | `text-text` | Body and headings |
| `--muted` | `#A1A1AA` | `text-muted` | Secondary text |
| `--accent` | `#CC3333` | `bg-accent`, `ring-accent` | Fills and focus ring only, never as text on dark |
| `--accent-ink` | `#F07070` | `text-accent-ink` | Accent text on dark |
| `--accent-label` | `#FAFAFA` | `text-accent-label` | Text on accent fills |
| `--shadow-card` | `0 1px 0 rgb(255 255 255 / 0.04) inset, 0 12px 32px -12px rgb(4 4 6 / 0.7)` | `shadow-card` | Cards (tinted to the bg hue) |
| `--radius-card` | `12px` | `rounded-card` | Cards |
| `--radius-control` | `8px` | `rounded-control` | Buttons, inputs |
| `--font-sans` | Geist | `font-sans` | Everything by default |
| `--font-mono` | Geist Mono | `font-mono` | Error strings, codes, timestamps |

### Contrast (computed, WCAG 2.x relative luminance)

| Pair | Ratio | Requirement |
| --- | --- | --- |
| `--text` on `--bg` | 16.82 | 4.5 body |
| `--muted` on `--bg` / `--surface` / `--surface-2` | 7.67 / 7.24 / 6.76 | 4.5 body |
| `--accent-ink` on `--bg` / `--surface` / `--surface-2` | 6.80 / 6.41 / 5.99 | 4.5 body |
| `--accent-label` on `--accent` | 4.92 | 4.5 body (button labels) |
| `--accent` on `--bg` (focus ring, UI boundary) | 3.83 | 3.0 UI |
| `--text` on `--accent` | 4.39 | fails, so it is **not used** |
| `--accent` as text on `--bg` | 3.83 | fails for body text, so it is **not used as text** |

Re-run these whenever a token changes.

### Typography

- Display: Geist 600, `tracking-tight`, `leading-[1.05]`. Headline max 8 words; hero headline max 2 lines.
- Body: 16px, line-height 1.6, `max-w-[65ch]`.
- Mono: Geist Mono for WordPress error strings (`There has been a critical error on this website.`), status codes (`500`, `ERR_TOO_MANY_REDIRECTS`) and timestamps.

### Spacing (kept from the generated output, density 5)

| Token | Value | Usage |
| --- | --- | --- |
| `--space-xs` | 4px | Tight gaps |
| `--space-sm` | 8px | Icon gaps, minimum spacing between touch targets |
| `--space-md` | 16px | Standard padding, mobile side gutter |
| `--space-lg` | 24px | Card padding |
| `--space-xl` | 32px | Large gaps |
| `--space-2xl` | 48px | Section margins |
| `--space-3xl` | 64px | Hero padding (top padding max `pt-24`) |

---

## Component specs

### Buttons (8px radius)
- Primary (BOOK): `bg-accent text-accent-label rounded-control font-semibold`, min 44x44px, padding 12px 24px, `whitespace-nowrap` at desktop, `active:scale-[0.98]`. Hover: a spring on transform only.
- Secondary (CHAT, PLANS): transparent with a 1px `--line` border and `--text` label, same size and press rules.
- Focus: `focus-visible:outline-2 outline-offset-2 outline-accent` (2px accent ring, 2px offset).
- `cursor-pointer` on everything clickable.

### Cards (12px radius)
- `bg-surface border border-line rounded-card shadow-card p-6`. No hover lift on non-interactive cards.
- Never three equal cards in a row (contract rule 6).

### Inputs (8px radius)
- `bg-surface-2 border border-line rounded-control px-4 py-3 text-base` (16px, which stops iOS zoom).
- Focus: the same accent outline as buttons. Errors go inline under the field in `--accent-ink` with a Phosphor warning icon (`aria-describedby`).

### Browser frame (for `public/screens/` captures)
- A simple frame around a real `next/image`: one 12px-radius surface, a thin top bar with a mono URL string, and nothing faked inside it. No decorative traffic-light dots.

### Modals and Sheets (shadcn Dialog/Sheet, restyled)
- Overlay `rgb(11 11 13 / 0.7)`, panel `bg-surface rounded-card shadow-card`, max-width 500px.

---

## Motion vocabulary

| Effect | Where | What it communicates |
| --- | --- | --- |
| Spring entrance (opacity + y) | Section content on first view | Hierarchy: what to read first |
| Spring hover (transform) | Interactive cards and buttons | Feedback: this responds |
| Streaming text | Triage widget only | State: the diagnosis is being worked out from your input |
| Sticky card stack | Process timeline only | Story: the five steps deal over each other in order, so you cannot reach Harden without passing Diagnose |
| Marquee | Platform logos only | Breadth: the platforms we work on |

- Springs: stiffness 100, damping 20.
- `useReducedMotion()` collapses every effect to its final static state. The marquee becomes a static logo row.
- The marquee needs pause, previous and next controls, and stops on hover, focus, reduced motion and when offscreen (from the trust-authority-conversion pattern).
- No `window.addEventListener('scroll')`. Use Motion `whileInView` or IntersectionObserver.

---

## Page pattern (generated, kept)

**Trust & Authority + Conversion:** Hero (mission and credibility) > Proof > Solution overview > Clear CTA path.
Supplement from "ai dynamic input hero": the **Prompt/Input Hero** (the triage widget is the hero's input), then the result preview, then How it works. Show, don't tell. Low-friction start.

---

## Art direction (images, contract rule 7)

- Low-key real photography: an engineer at a desk lit by monitor light, with one warm red practical light in frame. Macro shots of a laptop keyboard.
- Real WordPress error captures from `public/screens/` shown inside the browser frame component.
- Source order: an image-generation tool with this art direction, then `public/screens/`, then a picsum placeholder logged in `docs/image-todo.md`.

---

## Supplement: search findings applied

- **dark mode oled (style):** keep `color-scheme: dark`, visible focus and low white emission. Reject `#000000`, neon and glow (override 15).
- **ai dynamic input hero (landing):** input-first hero; disable typing, shimmer and morph effects under reduced motion, and render the generated content in its final state.
- **hero-centric (landing):** one primary CTA, hero dominates the first viewport, CTA label checked at 4.5:1 against its fill (done: 4.92), non-pulsing CTA.
- **trust authority conversion (landing):** low-friction form, transparent pricing (shown only when `priceFrom` is real), and an accessible logo carousel with pause and previous/next controls.
- **nextjs streaming suspense (stack):** Server Components by default. `'use client'` only on Motion and pointer leaves. Wrap slow data (`getSiteStatus()`) in `<Suspense>`, and don't block render on all data.

---

## Anti-patterns (do not use)

- Hidden contact info (help@fixmywp.com stays visible in the footer and on /contact)
- Invented certifications, badges or stats
- Emojis as icons
- Layout-shifting hovers (transform only, never width, height or margin)
- Low contrast text (see the contrast table)
- Instant state changes on interactive elements (spring or 150-300ms)
- Invisible focus states
- Everything in contract rule 6: em-dashes and en-dashes, "Step 1" labels, decorative dots, pills on images, scroll cues, fake screenshots, three equal cards, Inter, purple or neon glows, pure black or white, custom cursors, scroll listeners, filler verbs, invented statistics

---

## Pre-Delivery Checklist

- [ ] No emojis used as icons; Phosphor `regular` only
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states via springs or 150-300ms transitions, transform and opacity only
- [ ] Dark theme: every text pair checked against the contrast table (4.5:1 body, 3:1 large text and UI)
- [ ] Focus states visible (2px accent outline, 2px offset)
- [ ] `prefers-reduced-motion` respected (final static state)
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
- [ ] Ledger updated (docs/layout-ledger.md)
