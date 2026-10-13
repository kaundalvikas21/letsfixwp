# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/letsfixwp-v2/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

> **PRECEDENCE** (docs/section-contract.md rule 1): accessibility and touch (ui-ux-pro-max P1-P2)
> > taste-skill hard bans and Section 14 Pre-Flight > letsfixwp.com brand anchors
> > ui-ux-pro-max design-system output > dials and judgment.
> This file is the fourth rank. Where it contradicts the contract or a measured contrast floor,
> the contract wins. Every deviation from the generated output is logged in **Override Log** below.

---

**Project:** letsfixwp-v2
**Branch:** v2-swiss-precision
**Generated:** 2026-10-12 (ui-ux-pro-max, query "WordPress repair service trust professional booking")
**Overridden:** 2026-10-12 (V2.0 design brief)
**Category:** Home Services (Plumber/Electrician) as matched by the skill. Read as: on-demand WordPress repair.
**Design Dials:** Variance 5/10 (Balanced / Modern) | Motion 4/10 (Standard) | Density 3/10 (Spacious)
**Design read:** trust-first service landing for small-business owners and agencies, Swiss minimalist
language, Tailwind v4 + Satoshi + near-static motion.

**Skills loaded:** design-taste-frontend, minimalist-ui, ui-ux-pro-max, full-output-enforcement.
**Reference rows consulted:** styles `minimalism-and-swiss-style`, styles `accessible-and-ethical`,
landing `comparison-table-focus`, ux `Form Labels` / `Inline Validation` / `Focusable Error Summary`.

---

## Global Rules

### Color Palette

Two themes, both designed (taste 6.C). Light is the default; dark comes from
`@media (prefers-color-scheme: dark)`. No third theme, no theme toggle.

| Role | Light | Dark | CSS Variable |
|------|-------|------|--------------|
| Page background | `#F6F6F7` | `#0E0E10` | `--bg` |
| Raised surface | `#FCFCFD` | `#151518` | `--surface` |
| Body and heading text | `#111113` | `#ECECEE` | `--text` |
| Secondary text | `#5B5B66` | `#A0A0AA` | `--muted` |
| Hairline, dividers | `#E2E2E6` | `rgb(255 255 255 / 0.09)` | `--line` |
| Accent fill, focus ring | `#CC3333` | `#CC3333` | `--accent` |
| Accent text and links | `#CC3333` | `#E04F4F` | `--accent-text` |
| Label on accent fill | `#FFFFFF` | `#FFFFFF` | `--accent-on` |

**Measured contrast (verified 2026-10-12, sRGB WCAG 2.1 formula):**

| Pair | Light | Dark | Floor | Verdict |
|------|-------|------|-------|---------|
| `--text` on `--bg` | 17.46:1 | 16.35:1 | 4.5 | pass, AAA |
| `--text` on `--surface` | 18.40:1 | 15.45:1 | 4.5 | pass, AAA |
| `--muted` on `--bg` | 6.21:1 | 7.44:1 | 4.5 | pass |
| `--muted` on `--surface` | 6.54:1 | 7.03:1 | 4.5 | pass |
| `--accent-on` on `--accent` fill | 5.14:1 | 5.14:1 | 4.5 | pass |
| `--accent-text` on `--bg` | 4.76:1 | 4.96:1 | 4.5 | pass |
| `--accent` ring against `--bg` | 4.76:1 | 3.75:1 | 3.0 | pass |
| `--line` against `--bg` | 1.20:1 | 1.24:1 | n/a | decorative only, see below |
| `--muted` border against `--surface` | 6.54:1 | 7.03:1 | 3.0 | pass |

**Two rules that fall out of those numbers and are not optional:**

1. `--accent` (#CC3333) as text on dark `--bg` is 3.75:1, under the 4.5:1 body floor. Accent-coloured
   text, link text and inline emphasis use `--accent-text`. `--accent` is for fills, 1px borders and
   focus rings only.
2. `--line` is 1.2:1. It is a decorative divider. Any border that is a UI boundary a user must
   perceive (input, select, textarea, checkbox, segmented control, table cell edge in a comparison
   matrix) uses `--muted`, which clears 3:1 in both themes.

**Colour is scarce.** One accent, no secondary brand colour, no semantic green or amber unless a real
state needs it. No large accent-filled sections or accent hero backgrounds (minimalist-ui section 2).

### Typography

- **Everything:** Satoshi (Indian Type Foundry, Fontshare). Weights 400, 500, 700. Self-hosted via
  `next/font/local` from `src/fonts/`. Not a Google font: the woff2 files must be committed.
- **Figures and error strings:** JetBrains Mono, via `next/font/google`. Prices, counts, timings,
  version numbers, and verbatim WordPress error text (`Error establishing a database connection`).
- **Display:** weight 700, `letter-spacing: -0.03em`, `line-height: 1.05` to `1.1`.
- **Body:** weight 400, 16px floor (accessible-and-ethical), `line-height: 1.6`.
- **Eyebrow and meta:** weight 500, `text-xs`, `letter-spacing: 0.06em`, uppercase, `--muted`.
- No serif display face. No Inter, Roboto, Open Sans, Poppins (contract rule 6, minimalist-ui 2).

| Token | Size | Weight | Tracking |
|-------|------|--------|----------|
| `--type-display` | `clamp(2.5rem, 5vw, 4.5rem)` | 700 | `-0.03em` |
| `--type-h2` | `clamp(1.75rem, 3vw, 2.5rem)` | 700 | `-0.02em` |
| `--type-h3` | `1.25rem` | 500 | `-0.01em` |
| `--type-body` | `1rem` | 400 | `0` |
| `--type-small` | `0.875rem` | 400 | `0` |
| `--type-eyebrow` | `0.75rem` | 500 | `0.06em` |

### Grid

12 columns, 24px gutters, `max-width: 1200px`. Alignment does the decorating: column edges, a shared
baseline and the 1px `--line` hairline carry the structure. No decorative hairline grid overlays, no
background pattern, no ambient gradient blobs.

### Spacing Variables

*Density: 3/10 - Spacious. `--space-md` (24px) is also the grid gutter.*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Tight gaps |
| `--space-sm` | `8px` | Icon gaps, inline spacing, min gap between touch targets |
| `--space-md` | `24px` | Standard padding, grid gutter |
| `--space-lg` | `32px` | Section padding |
| `--space-xl` | `48px` | Large gaps |
| `--space-2xl` | `64px` | Section margins |
| `--space-3xl` | `96px` | Hero padding (hero top padding capped at `pt-24` by contract rule 4) |

### Radius

| Token | Value |
|-------|-------|
| `--radius` | `0` |

Shape lock: radius 0 on every element, including buttons, inputs, selects, cards, images, modals,
avatars, tags and badges. No `rounded-full`, no pill tags, no circular avatars.

### Shadow Depths

| Token | Value |
|-------|-------|
| `--shadow` | `none` |

No shadows at any level. Separation comes from a 1px `--line` border and from whitespace. No
`backdrop-filter`, no glass, no gradients, no glows.

---

## Component Specs

All specs below are radius 0, shadow none, and transition 200ms to 250ms on `background-color`,
`border-color`, `color` and `opacity`. Never `transition: all`.

### Buttons

```css
/* Primary */
.btn-primary {
  background: var(--accent);
  color: var(--accent-on);
  padding: 14px 28px;              /* >= 44px tall with a 16px label */
  border: 1px solid var(--accent);
  border-radius: 0;
  font-weight: 500;
  min-height: 44px;
  cursor: pointer;
  transition: background-color 200ms ease, border-color 200ms ease;
}
.btn-primary:hover { background: #B82D2D; border-color: #B82D2D; }
.btn-primary:active { transform: scale(0.98); }
.btn-primary:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* Secondary */
.btn-secondary {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--muted);
  padding: 14px 28px;
  border-radius: 0;
  font-weight: 500;
  min-height: 44px;
  cursor: pointer;
  transition: background-color 200ms ease, border-color 200ms ease;
}
.btn-secondary:hover { border-color: var(--text); background: var(--surface); }
.btn-secondary:active { transform: scale(0.98); }
.btn-secondary:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
```

Labels come only from `src/config/cta.ts`. The primary label never wraps at desktop. No
`translateY` lift on hover (layout-shifting hover is banned). Every button fires `track()` on click.

### Cards

```css
.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 0;
  padding: var(--space-md);
  box-shadow: none;
  transition: border-color 200ms ease;
}
.card:hover { border-color: var(--muted); }   /* only when the whole card is a link */
```

A card is not clickable unless it contains exactly one link, and then the link is the accessible
target. Non-interactive cards get no hover state and no `cursor: pointer`. Never three equal cards in
a row (contract rule 6).

### Inputs

```css
.input, .select, .textarea {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--muted);   /* UI boundary, needs 3:1, --line would be 1.2:1 */
  border-radius: 0;
  padding: 12px 16px;
  font-size: 16px;                  /* 16px floor, also stops iOS zoom on focus */
  min-height: 44px;
  transition: border-color 200ms ease;
}
.input:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-color: var(--text);
}
.input[aria-invalid="true"] { border-color: var(--accent-text); }
```

Form rules (ux rows `Form Labels`, `Inline Validation`, `Focusable Error Summary`):

- Every input has a visible `<label for>`. Never placeholder-only. Severity: High.
- Validate on blur, not on submit only. react-hook-form `mode: "onBlur"` with the zod resolver
  already in `src/app/contact/booking-schema.ts`.
- Inline error under the field, in JetBrains Mono, `--accent-text`, linked by `aria-describedby`,
  with `aria-invalid` on the control.
- On a failed submit render a focusable error summary at the top of the form:
  `<div role="alert" tabindex="-1" aria-labelledby="error-title">` with a heading and one anchor per
  invalid field. Move focus to it on submit failure only, never on blur. Keep the inline errors.
- Required fields are marked in the label text, not by colour alone.

### Modals

```css
.modal-overlay { background: rgb(14 14 16 / 0.6); }   /* no backdrop blur */
.modal {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 0;
  padding: var(--space-lg);
  box-shadow: none;
  max-width: 560px;
  width: calc(100% - 2 * var(--space-md));
}
```

Dialog and Sheet come from shadcn/ui, restyled to these tokens. Never left in default styling.

### Comparison Matrix

From the `comparison-table-focus` landing row, adapted to Swiss and to the brand rules:

- Real `<table>` with `<caption>`, `<th scope>`, and a visible header row. Not a div grid.
- Our column is marked by a 3px `--accent` top rule and a `--surface` fill, plus the brand name in
  its header, so the distinction is never colour alone. `--surface` is the neutral raised token,
  not an accent fill, so the ban on large accent-filled areas still holds.
- Marks are text or Phosphor icons with an `aria-label`, not colour alone. No green checkmarks.
- Cell separators use `--muted`, not `--line`: they are a boundary the reader must follow across.
- Horizontal scroll on the wrapper only, with `role="region"`, `tabindex="0"` and an accessible
  name. The wrapper also needs `contain: paint`: without it an auto-layout table leaks its
  min-content width to the root scroll area and the whole page scrolls sideways even though the
  wrapper clips correctly. Measured at 375px: document scrollWidth 715 with it off, 375 with it on.
- Below 768px the row-header column is `position: sticky; left: 0` with a `--bg` fill.
- Every claim in the matrix is factual and sourced from `src/content/compares/*`. No competitor claim
  we cannot evidence. Pricing shown only when it is in `src/content`.

---

## Style Guidelines

**Style:** Minimalism and Swiss Style (`minimalism-and-swiss-style`), with the
`accessible-and-ethical` row layered on top.

**Keywords:** clean, spacious, functional, whitespace, high contrast, geometric, grid-based,
essential, typographic hierarchy, flat.

**Key effects:** subtle hover 200ms to 250ms, no shadows, no gradients, clear type hierarchy, fast.

### Page Pattern

**Pattern Name:** Trust and Authority + Conversion

- **Section order:** Hero (the problem, stated plainly) > Proof (real outcomes and real captures) >
  Solution overview > Clear CTA path. Comparison pages instead follow: Hero (problem statement) >
  Comparison matrix > Feature deep-dive > CTA.
- **CTA placement:** primary in the hero and after the comparison matrix, plus one in the nav. A
  primary CTA follows its page node intent (contract rule 16).
- **Conversion strategy:** transparent pricing, low-friction booking, real error captures, named case
  studies. No security badges we have not earned, no certification logos we do not hold, no logo
  carousel (we have no client logos to show, and a marquee would be the page's one marquee spent on
  nothing).

### Imagery

- Black and white documentary photography. Natural light. Real hands on real keyboards, a laptop
  showing the WordPress dashboard. One red element allowed only when it is genuinely in the scene.
- Real error captures from `public/screens/` (produced by `scripts/capture-errors.mjs`) shown flat,
  no device frame, no faux-OS window chrome, with a 1px `--line` border.
- No div-built fake screenshots or dashboards (contract rule 6). No pills or labels on images.
- Order of resort for any other visual (contract rule 7): image-generation tool, then
  `public/screens/`, then `https://picsum.photos/seed/letsfixwp-<section>-<n>/<w>/<h>` logged in
  `docs/image-todo.md` with size, aspect ratio and art direction.
- `next/image` with explicit `sizes`, descriptive `alt`, `priority` on the hero image.

### Icons

`@phosphor-icons/react`, regular or bold weight, one weight per page, as the only icon family. Never
Heroicons, Lucide, Feather or emoji. Icon-only buttons carry an `aria-label`.

---

## Motion

Motion intensity 4/10 reads here as near-static. Motion communicates state, never decorates.

**Default, and the answer for almost everything:** a CSS `transition` of 200ms to 250ms on hover and
focus, on `background-color`, `border-color`, `color`, `opacity` and `transform` only.

**The three places `motion` (`import { ... } from "motion/react"`) is allowed, and nowhere else:**

| Component | What the motion communicates |
|-----------|------------------------------|
| Accordion (FAQ, guide steps) | That a panel belongs to the header that opened it. |
| Before and after slider | That the handle is being dragged, and which state is showing. |
| Booking flow | That one step replaced another inside the same form, and which direction. |

Rules:

- Animate `transform` and `opacity` only. Spring defaults stiffness 100, damping 20.
- `useReducedMotion()` collapses every one of the three to its final static state.
- No scroll-triggered choreography: no reveal-on-scroll, no stagger-in, no parallax, no
  `IntersectionObserver` entry animation, no `window.addEventListener('scroll')`.
- No GSAP. The generated `gsap.from(...)` stagger snippet is not used. GSAP and `motion` are never
  mixed in one component tree (contract rule 2).
- Each of the three lives in an isolated `'use client'` leaf; every effect cleans up.

---

## Anti-Patterns (Do NOT Use)

Hard bans, on top of docs/section-contract.md rule 6, which applies in full:

- Hidden contact information. Claims of certifications we do not hold.
- Any radius above 0. `rounded-full`. Pill tags or badges.
- Any box-shadow. Gradients. Glassmorphism, backdrop blur, neon or AI purple. Ambient gradient blobs.
- Pure `#000000` or `#FFFFFF` as a background or as body text. (`#FFFFFF` is allowed only as the
  label on an `--accent` fill.)
- `--accent` used as body-size text in dark mode. `--line` used as a form control border.
- Serif display type. Inter, Roboto, Open Sans or Poppins. Emoji anywhere, including alt text.
- Heroicons, Lucide, Feather.
- Layout-shifting hover: `translateY` lifts, shadow-growth hovers, scale on anything but `:active`.
- `transition: all`. Instant state changes with no transition.
- Faux-OS window chrome, three light grey circles, fake dashboards, device mockups.
- Scroll cues, custom cursors, section-number eyebrows, decorative dots, version labels.
- Three equal cards in a row. More than one marquee per page. More than two consecutive
  image-plus-text splits.
- Invented statistics, invented brands, filler verbs (elevate, seamless, unleash, revolutionize).
- Anything belonging to fixmywp.com: its content, claims, testimonials, address or legal text.
  `scripts/check-content.ts` fails the build on it.

---

## Pre-Delivery Checklist

- [ ] Section logged in `docs/layout-ledger.md` before coding (layout family, eyebrow, marquee, CTA intents)
- [ ] Layout family not already used on this page
- [ ] Radius 0 on every element in the section, buttons and inputs included
- [ ] No box-shadow, no gradient, no backdrop-filter
- [ ] Satoshi everywhere; JetBrains Mono on figures and error strings only
- [ ] Contrast checked in BOTH themes: body 4.5:1, large text and UI boundaries 3:1
- [ ] `--accent-text` (not `--accent`) used for any accent-coloured text
- [ ] `--muted` (not `--line`) used for any form control or table cell border
- [ ] Every input has a visible label; validation on blur; focusable error summary on failed submit
- [ ] Focus visible: 2px `--accent` outline, 2px offset (contract rule 5)
- [ ] Every interactive target >= 44x44px with >= 8px spacing
- [ ] `cursor: pointer` on genuinely clickable elements, and not on static cards
- [ ] Transitions 200ms to 250ms, on named properties, never `transition: all`
- [ ] `motion` used only for accordion, before/after slider, booking flow; no scroll choreography
- [ ] `prefers-reduced-motion` collapses all motion to the final static state
- [ ] Icons from `@phosphor-icons/react` only, one weight per page, `aria-label` on icon-only buttons
- [ ] Every visual real: generated, or from `public/screens/`, or a logged picsum placeholder
- [ ] One `h1` per page, semantic landmarks, skip link present
- [ ] Numbers on screen come only from `src/content` or `getSiteStatus()`
- [ ] Links from `src/config/routes.ts`, CTA labels from `src/config/cta.ts`
- [ ] Responsive at 375, 768, 1024, 1440; no horizontal page scroll; no content under a fixed navbar
- [ ] `npm run check` passes

---

## Override Log

Every line below changes the generated ui-ux-pro-max output. Authority is in the right column, under
the precedence order at the top of this file.

| # | Generated | Replaced with | Reason | Authority |
|---|-----------|---------------|--------|-----------|
| 1 | Palette: primary `#1E40AF`, secondary `#3B82F6`, accent `#EA580C`, bg `#EFF6FF` | `--bg #F6F6F7`, `--surface #FCFCFD`, `--text #111113`, `--muted #5B5B66`, `--line #E2E2E6`, `--accent #CC3333` | `#CC3333` is the confirmed brand accent in `src/config/brand.ts`. The generated blue and orange are a generic home-services palette and belong to no brand. Swiss minimalism wants a near-monochrome canvas and a single accent. | brand anchors; V2.0 brief; `minimalism-and-swiss-style` ("--accent-color: single primary only") |
| 2 | Light theme only; checklist says "Light mode: text contrast 4.5:1" | Light and dark, both designed, dark via `prefers-color-scheme` | taste 6.C requires both themes designed, not one inverted. Contract rule 9 requires AA in both. | taste 6.C; contract rule 9; V2.0 brief |
| 3 | `--accent` used everywhere including as text | Split into `--accent` (fill, border, ring) and `--accent-text` (`#CC3333` light, `#E04F4F` dark) | Measured: `#CC3333` on `#0E0E10` is 3.75:1, under the 4.5:1 body floor. The brief's "accent everywhere" is kept for fills, where white on `#CC3333` is 5.14:1 as the brief states. `#E04F4F` on `#0E0E10` is 4.96:1. | contract rule 9 (accessibility outranks the brief); measured 2026-10-12 |
| 4 | `--color-border #BFDBFE` as the single border token | `--line` for dividers, `--muted` for UI boundaries | Measured: `--line` is 1.20:1 light and 1.24:1 dark. Fine for a decorative hairline, invisible as an input border. `--muted` is 6.54:1 and 7.03:1 on `--surface`, clearing the 3:1 UI-boundary floor. | contract rule 9; measured 2026-10-12 |
| 5 | `On Secondary` and `On Accent` set to `#000000` | `#FFFFFF` on `--accent`; no secondary colour exists | Pure `#000000` is banned, and black on `#EA580C` was a property of the discarded orange. | contract rule 6 |
| 6 | Heading Poppins, body Open Sans, loaded by Google Fonts `@import` | Satoshi 400/500/700 for everything via `next/font/local`; JetBrains Mono via `next/font/google` for figures and error strings | The brief fixes the type stack. `next/font` only (foundation STACK): a CSS `@import` of a font blocks render and defeats the font-display and preload handling `next/font` gives us. Satoshi is a Fontshare face, so the woff2 files are committed to `src/fonts/`. | V2.0 brief; docs/foundation.md STACK |
| 7 | Editorial serif for hero headings (minimalist-ui section 3) | Satoshi 700, tracking `-0.03em` | The brief locks one typeface. Swiss minimalism is a grotesque tradition; a serif display would read as editorial-American, not Swiss. | V2.0 brief overrides minimalist-ui section 3 |
| 8 | Warm monochrome canvas `#F7F6F3` / `#FBFBFA`, warm pastel accents, warm photo grain (minimalist-ui sections 4, 6) | Cool neutral `#F6F6F7` / `#FCFCFD`, one red accent, black and white photography | The brief's token set is cool-neutral and the photography direction is monochrome documentary. The two cannot both hold. | V2.0 brief overrides minimalist-ui sections 4 and 6 |
| 9 | Button radius 8px, card radius 12px, modal radius 16px, input radius 8px, pill badges (`border-radius: 9999px`) | Radius 0 everywhere | Shape lock. `minimalism-and-swiss-style` ships `--border-radius: 0px` as its design-system variable; the brief makes it absolute, badges and inputs included. | V2.0 brief; `minimalism-and-swiss-style`; overrides minimalist-ui section 5 |
| 10 | Four shadow levels, `--shadow-sm` through `--shadow-xl`; card hover grows the shadow; modal uses `--shadow-xl` | `--shadow: none` | `minimalism-and-swiss-style` ships `--shadow: none`. Separation is a 1px border and whitespace. A growing shadow on hover is also a layout-shifting hover, which the generated anti-patterns list bans two sections later. | `minimalism-and-swiss-style`; V2.0 brief; internal contradiction in the generated file |
| 11 | `.modal-overlay { backdrop-filter: blur(4px) }` | Flat `rgb(14 14 16 / 0.6)` overlay | No glass effects in this language, and a blur layer over the whole page costs paint on low-end Android where our emergency traffic lands. | V2.0 brief; contract rule 13 |
| 12 | `.btn-primary:hover { transform: translateY(-1px) }` | Hover changes `background-color` only; `scale(0.98)` on `:active` | Contract rule 5 fixes `:active` at `scale(0.98)`. A translate on hover is a layout-shifting hover, banned in the generated file's own anti-patterns. | contract rule 5; internal contradiction in the generated file |
| 13 | `transition: all 200ms ease` on buttons and cards | Named properties only, 200ms to 250ms | `all` animates layout properties by accident, which breaks "animate transform and opacity only". | contract rule 10 |
| 14 | `.card { cursor: pointer }` on every card | `cursor: pointer` only when the card contains exactly one link | A pointer cursor on a static card promises an interaction that does not exist, and a whole-card click target with no link is not keyboard reachable. | contract rule 9; ux guidance |
| 15 | Motion: GSAP `gsap.from('.grid-item', { stagger, ease: 'back.out(1.4)' })` on load or scroll | CSS transitions by default; `motion` only for accordion, before/after slider, booking flow | The brief rules out scroll-triggered choreography. Contract rule 2 forbids mixing GSAP and `motion` in one tree, and the three components that do need real motion need `motion`, so GSAP cannot be the other half. The generated row's own caveat warns `back.out` overshoot "reads as sloppy on informational UI", which is what this site is. | V2.0 brief; contract rule 2; the row's own caveat |
| 16 | Icons "Heroicons / Lucide / Simple Icons" | `@phosphor-icons/react` only | Foundation fixes one icon family. minimalist-ui section 2 independently bans Lucide, Feather and Heroicons. | docs/foundation.md STACK; minimalist-ui section 2 |
| 17 | Focus ring 3px to 4px (`accessible-and-ethical`), or `box-shadow: 0 0 0 3px #1E40AF20` (generated input spec) | `outline: 2px solid var(--accent)` with `outline-offset: 2px` | Contract rule 5 fixes the ring at 2px with 2px offset. `--accent` against `--bg` is 4.76:1 light and 3.75:1 dark, both clearing the 3:1 focus-indicator floor, so 2px is sufficient and the project stays consistent. A `box-shadow` ring is also unavailable under override 10. | contract rule 5; measured 2026-10-12 |
| 18 | `accessible-and-ethical` target: 7:1 enhanced | AA 4.5:1 body and 3:1 UI as the floor; AAA where it comes free | `--text` is 17.46:1 and 16.35:1, already AAA. `--muted` is 6.21:1 light, and the accent cannot reach 7:1 at any usable red. Contract rule 9 sets AA as the requirement. | contract rule 9 |
| 19 | Page pattern proof section: "Security badges", "logos, certs", logo carousel with pause and prev/next | Real outcomes from `src/content`, real error captures, named case studies; no badges, no certs, no carousel | We hold no certifications and have no client logos to show. Contract rule 6 bans invented brands, and rule 8 allows only numbers that exist in `src/content`. A carousel would also spend the page's single permitted marquee on placeholder logos. | contract rule 6; contract rule 8; contract rule 3 |
| 20 | `comparison-table-focus`: "Your product column highlighted (accent bg or green). Checkmarks green." | Our column marked by a 3px `--accent` top rule and a `--surface` fill plus the brand name in its header; marks are Phosphor icons with visually hidden text; no green | Large accent-filled areas are out (minimalist-ui section 2, and the brief allows one accent only). Colour alone cannot carry meaning, and there is no green in the palette. | V2.0 brief; minimalist-ui section 2; contract rule 9 |
| 21 | minimalist-ui section 7: scroll-entry fade-ins, staggered reveals, ambient drifting gradient blob; section 8.6 "no empty flat backgrounds" | No scroll animation, no ambient layer; alignment and whitespace carry the structure | The brief's motion budget excludes scroll choreography, and a Swiss grid is meant to read as flat and still. Grain or noise, if ever added, goes on a fixed `pointer-events: none` layer. | V2.0 brief; contract rule 6; contract rule 13 |
| 22 | minimalist-ui section 5: faux-OS window chrome for software mockups | Real captures from `public/screens/`, flat, 1px `--line` border | Contract rule 6 bans div-built fake screenshots and dashboards. `scripts/capture-errors.mjs` produces the real thing. | contract rule 6; docs/foundation.md |
| 23 | Header LOGIC line pointed at `design-system/pages/[page-name].md` | `design-system/letsfixwp-v2/pages/[page-name].md` | The generator writes the path without the project slug, but it persists page overrides into the slugged directory. The uncorrected path resolves to nothing. | observed behaviour of `design_system.py` `persist_design_system` |
| 24 | Project slug `fixmywp-v2`, as the brief's `-p` argument | `letsfixwp-v2` | fixmywp.com is a different company that is still trading. The design system is named after this business. | CLAUDE.md; `src/config/brand.ts` |

### Not yet satisfied

Prerequisites this file assumes. Updated after V2.1 (global shell).

| Need | State |
|------|-------|
| `motion` | done. `motion@^14.0.0` in package.json. Not imported anywhere yet |
| `@phosphor-icons/react` | done. `^2.1.10` in package.json, used in the header nav and chat launcher |
| `@radix-ui/react-dialog` | done. `^1.2.0` in package.json, backs the nav panel |
| Satoshi woff2 (400/500/700) | done. `src/fonts/Satoshi-{Regular,Medium,Bold}.woff2`, loaded in `src/lib/fonts.ts` |
| JetBrains Mono | done. `next/font/google` in `src/lib/fonts.ts`, exposed as `--font-jetbrains`. No figures rendered in it yet |
| Token definitions | done. `src/app/globals.css` holds both themes, the `@theme inline` bridge, `.btn-primary`, `.btn-secondary`, `.nav-link` |
| `public/screens/` | still missing. `npm run capture` needs Docker for `@wordpress/env` |
| Photography | still missing. Every hero image is a `docs/image-todo.md` entry until then |
| `docs/image-todo.md` | still missing. Create on the first placeholder |
| Validation on blur | still open. `src/app/contact/BookingFlow.tsx:55` calls `useForm` with no `mode`. Add `mode: "onBlur"` |
| Focusable error summary | still open. Not in `BookingFlow.tsx`. Add the `role="alert" tabindex="-1"` summary described under Inputs |
| Page sections | none built. `src/components/sections/<variant>/` does not exist; page bodies are still unstyled semantic HTML |
