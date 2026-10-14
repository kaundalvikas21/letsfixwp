# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/letsfixwp-v3/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** letsfixwp-v3 (branch `v3-bento-ops`)
**Generated:** 2026-10-13 10:35:36, then hand-edited with the V3.0 brief overrides (see "Overrides and reasons" at the end)
**Category:** SaaS (General)
**Design Read:** product-led SaaS landing for site owners and agencies, soft premium bento language, Tailwind v4 + Cabinet Grotesk + spring motion.
**Design Dials:** Variance 7/10 | Motion 6/10 | Density 4/10
**Skills to load when building:** design-taste-frontend, high-end-visual-design, plus docs/section-contract.md.

---

## Global Rules

### Theme

Light is the default. Dark follows `prefers-color-scheme: dark`. Both themes are designed, not inverted.

### Color Palette

| Role | Light | Dark | CSS Variable |
|------|-------|------|--------------|
| Page background | `#F3F4F6` | `#0D0F12` | `--bg` |
| Card / surface | `#FCFCFD` | `#15181D` | `--surface` |
| Raised / inset surface | `#ECEEF1` | `#1B1F25` | `--surface-2` |
| Text | `#0F1115` | `#E9EBEE` | `--text` |
| Muted text | `#555B66` | `#9AA1AC` | `--muted` |
| Hairline (decorative) | `#E1E4E8` | `rgb(255 255 255 / 0.08)` | `--line` |
| Control border (inputs, toggles) | `#7E8590` | `rgb(255 255 255 / 0.36)` | `--line-strong` |
| Accent fill (buttons, toggle thumb, focus ring) | `#15803D` | `#4ADE80` | `--accent` |
| On accent | `#FFFFFF` | `#0D0F12` | `--on-accent` |
| Accent as text | `#15803D` | `#4ADE80` | `--accent-text` |

One accent only: "back-online green". Brand red (`brand.accent`, `#CC3333`) does not appear in this variation.

**Measured contrast (WCAG 2.x, computed 2026-10-13):**

| Pair | Ratio | Target |
|------|-------|--------|
| `#FFFFFF` on `#15803D` (light button label) | 5.02 | 4.5 ✓ |
| `#0D0F12` on `#4ADE80` (dark button label) | 11.01 | 4.5 ✓ |
| `#4ADE80` on dark `--surface` | 10.21 | 4.5 ✓ |
| `#15803D` on light `--surface` / `--bg` | 4.89 / 4.56 | 4.5 ✓ |
| `#15803D` on light `--surface-2` | 4.31 | 4.5 ✗ (large text or icons only there) |
| `--text` on `--bg` light / dark | 17.17 / 16.07 | 4.5 ✓ |
| `--muted` on `--bg` light / dark | 6.21 / 7.37 | 4.5 ✓ |
| `--muted` on `--surface-2` light / dark | 5.88 / 6.36 | 4.5 ✓ |
| `--line` on `--surface` light / dark | 1.24 / 1.24 | decorative only |
| `--line-strong` on every surface light / dark | ≥3.20 / ≥3.32 | 3.0 ✓ |

Rules that fall out of the table:
- `--line` is decorative (card edges, dividers). Any boundary that identifies a control (input, select, checkbox, toggle track) uses `--line-strong`.
- Small accent-colored text in light mode sits on `--surface` or `--bg`, never on `--surface-2`.
- For reference, brand `#399A35` with white labels measures 3.59:1, which is why the accent is darkened.

### Typography

- **Display:** Cabinet Grotesk 700 / 800 (Fontshare), loaded with `next/font/local` from `src/fonts/`. Headlines only.
- **Body / UI:** Inter Tight via `next/font/google`. Pairing listed in design-taste-frontend ("Pairings to know: Cabinet Grotesk + Inter Tight").
- **Body:** 16px, line-height 1.6. Muted copy uses `--muted`, never reduced opacity.
- Display tracking tightens at large sizes (about `-0.02em` from 48px up). Never set body copy in Cabinet Grotesk.

### Shape Lock

| Element | Radius |
|---------|--------|
| Cards, bento cells, device frames, image containers | `20px` |
| Inputs, selects, textareas | `12px` |
| Buttons, chips, segmented controls, pricing toggle | full pill (`9999px`) |

No other radii. Nested elements inside a card use `20px - padding` only if they would visibly clash, otherwise follow the table.

### Spacing Variables

*Density 4/10, standard.*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Tight gaps |
| `--space-sm` | `8px` | Icon gaps, min spacing between touch targets |
| `--space-md` | `16px` | Bento grid gap on mobile, card padding on mobile |
| `--space-lg` | `24px` | Bento grid gap on desktop, card padding |
| `--space-xl` | `32px` | Large gaps |
| `--space-2xl` | `48px` | Section margins on mobile |
| `--space-3xl` | `96px` | Section margins on desktop (hero top padding still max pt-24 per contract) |

### Shadows (Soft UI Evolution)

Two layers, tinted to the `--bg` hue (cool grey, hue about 220), never black.

| Token | Light | Dark |
|-------|-------|------|
| `--shadow-card` | `0 1px 2px hsl(220 20% 40% / 0.06), 0 8px 24px -6px hsl(220 20% 40% / 0.10)` | `0 1px 2px hsl(220 30% 2% / 0.50), 0 12px 32px -8px hsl(220 30% 2% / 0.60)` |
| `--shadow-lift` (hover) | `0 2px 4px hsl(220 20% 40% / 0.07), 0 16px 40px -10px hsl(220 20% 40% / 0.16)` | `0 2px 4px hsl(220 30% 2% / 0.55), 0 20px 48px -12px hsl(220 30% 2% / 0.70)` |

Dark cards also get a 1px inset top highlight (`inset 0 1px 0 rgb(255 255 255 / 0.04)`) so the edge reads without a heavy border.

### Glass (floating nav only)

The floating nav is the only translucent surface.

```css
/* Web approximation of a frosted material. This is not Apple Liquid Glass. */
.nav-glass {
  background: color-mix(in srgb, var(--surface) 72%, transparent);
  backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid rgb(255 255 255 / 0.10); /* inner border */
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.12), var(--shadow-card); /* inset highlight */
  border-radius: 9999px;
}
@media (prefers-reduced-transparency: reduce) {
  .nav-glass { background: var(--surface); backdrop-filter: none; }
}
```

---

## Component Specs

### Buttons

```css
.btn-primary {
  background: var(--accent);
  color: var(--on-accent);
  min-height: 44px;
  padding: 12px 24px;
  border-radius: 9999px;
  font-weight: 600;
  white-space: nowrap; /* primary label never wraps at desktop */
  transition: transform 150ms ease, box-shadow 200ms ease;
}
.btn-primary:active { transform: scale(0.98); }
.btn-primary:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.btn-secondary {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--line-strong);
  min-height: 44px;
  padding: 12px 24px;
  border-radius: 9999px;
  font-weight: 600;
}
```

### Bento cells

```css
.bento {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 on desktop, 2 at md, 1 under 768px */
  gap: var(--space-lg);
}
.cell {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: var(--space-lg);
  box-shadow: var(--shadow-card);
}
```

Spans vary (2x1, 2x2, 4x1, 3x1) so no row reads as three equal cards. Cells stay fully readable without hover.

### Inputs

```css
.input {
  min-height: 44px;
  padding: 12px 16px;
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: 12px;
  font-size: 16px; /* prevents iOS zoom */
}
.input:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
```

Errors render inline under the field.

### Device frame

Real captures from `public/screens/` sit inside a simple frame: `--surface-2` bezel, 20px outer radius, 12px inner radius on the screenshot, `--shadow-card`. No fake browser chrome built from divs beyond a thin top bar, and never a div-built dashboard.

### Pricing toggle and tabs

Pill segmented control, `--line-strong` track border, accent thumb animated with a shared `layoutId`. Keyboard: arrow keys move selection, the control is a `role="radiogroup"` (toggle) or `role="tablist"` (tabs).

---

## Motion

Library: **Motion** (`motion/react`), not installed yet. **No GSAP. No marquee in this variation.**

| Use | Spec | Communicates |
|-----|------|--------------|
| Bento cells enter | `whileInView`, opacity 0→1 and y 16→0, stagger 60ms, spring stiffness 100 / damping 20, `viewport={{ once: true }}` | Reading order across the grid |
| Bento cell hover | scale 1.02 + `--shadow-lift` (Bento Grid style row) | The cell is a link |
| Tabs and pricing toggle | shared `layoutId` on the active indicator | Which option is selected |
| Buttons press | scale 0.98 | Press feedback |

`useReducedMotion()` renders the final state with no transitions. Transform and opacity only. Hover scale sits on a wrapper so it never shifts layout.

---

## Imagery

- Bright daylight lifestyle-tech photography: a laptop on a clean desk showing a healthy WordPress site; a shop owner checking orders on a phone. Natural light, neutral and green tones, no red.
- Real dashboard and site captures from `public/screens/` inside the device frame above.
- One soft green-to-surface radial mesh, allowed on the final CTA only. No other gradients.
- Photo library: `src/content/photos.ts` (tone per frame; never use `red` on v3), rendered with `<Photo id>` from `src/components/sections/v3/Photo.tsx`.
- No pills or labels on images. Order of sourcing and logging follows section-contract rule 7.

---

## Page Pattern

**Bento Grid Showcase:** Hero > Bento grid (key features) > Detail cards > Specs or proof > CTA. Primary CTA at the bottom of the grid and in the floating nav.
**Pricing page:** Hero (value) > Pricing cards with monthly/annual toggle > Feature comparison > FAQ > Final CTA. Show real totals from `src/content` only; the highlighted plan uses an accent border, not a red or extra hue.

---

## Anti-Patterns (Do NOT Use)

- Brand red or any second accent
- Glass anywhere except the floating nav
- Black (`#000`) shadows, pure `#000000` / `#FFFFFF` surfaces
- GSAP, marquees, parallax
- Gradients outside the final-CTA mesh
- Emojis as icons. One icon set site-wide: Phosphor (`@phosphor-icons/react/ssr`, `…Icon` names), weight `duotone` everywhere; every icon the site uses has a duotone match (checked in V3.9)
- Layout-shifting hovers, invisible focus states, low-contrast text
- Everything in section-contract rule 6

---

## Pre-Delivery Checklist

- [ ] Contrast checked in both themes against the table above
- [ ] `--line-strong` on every control boundary
- [ ] Radii match the shape lock (20 / 12 / pill)
- [ ] Shadows use the tinted tokens
- [ ] Nav glass has the reduced-transparency fallback
- [ ] `useReducedMotion()` collapses all motion
- [ ] Focus visible: 2px accent ring, 2px offset
- [ ] 375, 768, 1024, 1440 checked; no horizontal scroll
- [ ] No content hidden behind the floating nav

---

## Overrides and reasons

The generator returned trust blue `#2563EB` + orange CTA `#EA580C`, Plus Jakarta Sans, glassmorphism as the page style, 8 to 16px radii, black-based shadows and a GSAP stagger. Each was replaced by the V3.0 brief:

| Generated | Override | Reason |
|-----------|----------|--------|
| Blue primary + orange CTA | Single accent `#15803D` / dark `#4ADE80` | Color lock: one accent. Derived from brand `#399A35`, darkened so white labels pass (5.02:1). Green reads as "back online", the outcome customers buy. |
| Brand red allowed by default | Excluded | Color lock for this variation; red competes with the single-accent rule and reads as an error state. |
| `#F8FAFC` / `#1E293B` slate | Brief tokens, both themes | Both themes designed; tokens all measured at AA (table above). |
| (none) | `--line-strong` added | Not in the brief. `--line` measures 1.24:1, below the 3:1 that contract rule 9 requires for control boundaries. |
| Plus Jakarta Sans | Cabinet Grotesk display + Inter Tight body | Taste skill discourages generic defaults; this pairing is listed there. Inter Tight is the body face, not "Inter as default". |
| Glassmorphism as page style | Bento Grid + Soft UI Evolution; glass on the nav only | Bento suits a feature-dense SaaS showcase at density 4. Glass everywhere hurts contrast and performance. |
| 8 / 12 / 16px radii | 20 / 12 / pill shape lock | One documented rule keeps cells, fields and controls visually distinct. |
| `rgba(0,0,0,...)` shadows | Two-layer shadows tinted to the bg hue | Soft UI Evolution; black shadows look dirty on cool grey. |
| GSAP `back.out` stagger | Motion springs (stiffness 100, damping 20), 60ms stagger, layoutId | Brief: no GSAP. Contract rule 2 forbids mixing GSAP and Motion; springs match the contract defaults. |
| Generic "Hero + Features + CTA" | Bento Grid Showcase; Pricing-focused pattern for /pricing | From the landing lookups for "bento grid showcase" and "pricing focused toggle". |
| `-p fixmywp-v3` (brief) | Folder `letsfixwp-v3` | fixmywp.com is a different, trading company; CLAUDE.md forbids reusing its name. |

**Open prerequisites before the first section:** install `motion`; add Cabinet Grotesk 700/800 woff2 files to `src/fonts/` (Fontshare licence: free for commercial use, keep the licence file with them); create `public/screens/` with real captures; source the two daylight photographs.
