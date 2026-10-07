# QA report: v1-incident-console

Run 2026-10-07 against the production build (`npm run build && npm run start`, port 3123), commit `4462b6f`.
`brand.legacy.enabled` is **on** (preview, pending the client's answer), so legacy-gated content is in scope.

**Result: clean.** Every failure found during this pass was fixed and re-verified, except two documented gaps
(home LCP and placeholder imagery), both tied to the picsum placeholders rather than the build.

`rg` is not installed on this machine, so every grep below uses `grep -rnP` with the same patterns.

---

## 1. Dashes

```
$ grep -rnP "[\x{2014}\x{2013}]" src docs
(exit 1, no output)
```
**Pass.** No em-dash or en-dash anywhere in source or docs.

## 2. Eyebrows per page

Counted in the browser: a `font-mono` label whose next sibling is an `h2`.

| Page | Sections | Eyebrows | Max allowed |
| --- | --- | --- | --- |
| `/` | 11 | 2 (Common emergencies, Guarantee) | 4 |
| `/wordpress-fix/emergency/` | 7 | 0 | 3 |
| `/guides/white-screen-of-death/` | 6 | 0 | 2 |
| `/wordpress-fix/` | 3 | 0 | 1 |
| `/pricing/` | 7 | 0 | 3 |
| `/contact/` | 1 | 0 | 1 |

**Pass.** No page exceeds `ceil(sections / 3)`.

## 3. CTA wording

```
$ grep -rn "Fix my site\|Chat with an engineer\|See plans\|Get a quote\|Get a free site check\|See how we fix it" src --include=*.tsx --include=*.ts | grep -v src/config/cta.ts
src/app/contact/page.tsx:19:  description: "... or send a project enquiry. Chat with an engineer any time.",
```
**Pass.** The only hit is a `<meta name="description">` sentence, not a control. Every button and link label renders
from `CTA` in `src/config/cta.ts`; one label per intent (BOOK, CHAT, PLANS, QUOTE, CHECK, plus the HOW text link).

## 4. Numerals rendered, and their source

| Page | Numerals | Source |
| --- | --- | --- |
| `/` | 30 | `brand.legacy.facts.guaranteeDays` |
| | 500, 502, 503 | service title `500 / 502 / 503 Server Error Fix` (SITEMAP) |
| | 7.4, 8 | `services/update-php-errors.ts` symptom: "switched PHP, for example from 7.4 to 8.x" |
| `/guides/white-screen-of-death/` | 1, 2, 3 | ordered-list markers on the safe checks |

**Pass.** Every numeral traces to a content file. No invented statistics, prices, turnarounds or counts.
`getSiteStatus()` returns nulls, so the desk row renders hours instead of a number and no "online" indicator exists.

## 5. Banned patterns

```
$ for pat in h-screen 'addEventListener("scroll"' lucide-react '#000000' '#ffffff' 'Stage 1' Jane Acme elevate seamless unleash; do grep -rniE "$pat" src; done
```

| Pattern | Result |
| --- | --- |
| `h-screen` | clean (`min-h-[100dvh]` used) |
| `addEventListener("scroll"` | clean (Motion `useScroll` / IntersectionObserver only) |
| `lucide-react` | clean (Phosphor only) |
| `#000000`, `#ffffff` | clean |
| `Step 1` | one match: a code comment in `TicketFlow.tsx` explaining that progress uses screen names, never "Step 1 of 4". Not rendered |
| `Stage 1`, `Jane`, `Acme` | clean |
| `elevate`, `seamless`, `unleash` | clean |
| `Inter` as a font | clean. `next/font` loads Geist and Geist Mono only |

**Pass.**

## 6. Layout ledger

Home carries 11 sections, each a different layout family (asymmetric split, logo marquee, vertical tab index,
vertical timeline, bento grid, statement row, uneven pricing columns, asymmetric quote pair, split checklist,
accordion, full-bleed photo panel). Templates add 9 more families, none reused from home.

- Marquees: **1** (platform logos), the page's only one.
- Consecutive image-plus-text splits: max **1**. The timeline's two framed entries are separated by text-only steps.

**Pass.**

## 7. Routes, sitemap and redirects

```
sitemap: 95 urls, duplicates 0, missing trailing slash 0
sitemap paths not 200: none
/supporting/: 404
```

| From | Status | To |
| --- | --- | --- |
| `/fix/` | 308 | `/wordpress-fix/` |
| `/fix/white-screen-of-death/` | 308 | `/wordpress-fix/white-screen/` |
| `/fix/hacked/` | 308 | `/wordpress-security/malware-removal/` |
| `/app/` | 308 | `/contact/` (query preserved: `?problem=hacked` carried through) |
| `fixmywp.com/wordpress-hacked-fix/` | 301 | `letsfixwp.com/wordpress-security/malware-removal/` |
| `fixmywp.com/fix-wordpress-theme/`, `/fix-wordpress-plugin/` | 301 | `/wordpress-fix/plugin-theme-conflict/` |
| `fixmywp.com/wordpress-maintenance-services/` | 301 | `/wordpress-maintenance/care-plans/` |
| `fixmywp.com/testimonials/` | 301 | `/case-studies/` |
| `fixmywp.com/app/` | 301 | `/contact/` |

Internal linking: all **37 guides** link to their parent service and every service links back.

**Pass, with one note.** A legacy URL without a trailing slash takes two hops: `308` to add the slash, then the
`301`. That is Next's `trailingSlash` normalisation running before custom redirects. It is within Google's limits,
but the host-level alternative in `docs/audit.md` (a Cloudflare redirect rule on the old domain) does it in one hop
and is the better production choice.

## 8. Structured data

| Page | Types | AggregateRating | Null values | Offers without price |
| --- | --- | --- | --- | --- |
| `/` | Organization, FAQPage | no | no | 0/0 |
| `/guides/white-screen-of-death/` | Organization, TechArticle, FAQPage, BreadcrumbList | no | no | 0/0 |
| `/guides/wordpress-hacked/` | Organization, TechArticle, FAQPage, BreadcrumbList | no | no | 0/0 |
| `/wordpress-fix/emergency/` | Organization, Service, FAQPage, BreadcrumbList | no | no | 1/1 |

**Pass.** All blocks parse. No AggregateRating anywhere (no real review data). The one Offer omits `price`
entirely rather than emitting null, which is the correct behaviour while `priceFrom` is unset.

---

## Accessibility: Playwright + axe-core

8 pages x 4 widths (375, 768, 1024, 1440) x normal and `prefers-reduced-motion: reduce` = **64 scans**,
tags `wcag2a, wcag2aa, wcag21a, wcag21aa, best-practice`.

**Final result: 0 serious, 0 critical.**

Light and dark: the variation is **dark only** by `MASTER.md` override 1 (Page Theme Lock), so there is no light
mode to test. Contrast was verified against the dark tokens.

### Violations found and fixed

| Violation | Where | Fix |
| --- | --- | --- |
| `link-in-text-block` (serious, 8) | mailto links in the footer, desk status and contact aside | Underlined always, not colour-only |
| `color-contrast` (serious, 3) | ticket progress, upcoming screen names at `text-muted/60` | Raised to `text-muted` (7.67:1) |
| `color-contrast` (serious, 1) | mobile bar BOOK label, mid-animation | The bar now animates transform only; the fading label dipped below AA while opacity was interpolating |
| `scrollable-region-focusable` (serious, 2) | compare table, pricing tables, guide error block | `tabIndex={0}` plus an accessible name on each scroll container |

### Keyboard-only path

At 375 and 1440, tabbing from the top of the home page reaches the hero **Fix my site** in 11 and 9 tabs, Enter
opens `/contact/`, and the four ticket screens complete to **Ticket received** using only the keyboard. Focus moves
to each new screen's heading and is visible at every step (2px accent outline, 2px offset).

Focus is never hidden behind the sticky nav or the mobile bar. The skip link overlaps the nav geometrically but
sits above it (`z-50` against the nav's `z-40`); `document.elementFromPoint` at its centre returns the link itself.

### Screenshots

`docs/qa/` holds 26 PNGs for side-by-side comparison with other variations: all 11 home sections at 375 and 1440,
plus a full-page guide and service page at both widths.

---

## Lighthouse (mobile, simulated throttling)

Median of 3 warm runs per page. Run-to-run spread was wide on a cold cache: the first run after a build scored 79
because the hero placeholder is fetched from `picsum.photos` over the internet by the image optimiser.

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | **91** (89-92) | **100** | **100** | **100** | 3.24s | 0 | 128ms |
| `/guides/white-screen-of-death/` | **97** (96-97) | **100** | **100** | **100** | 2.46s | 0 | 107ms |

**INP: 112ms** (passes the 200ms target). Lighthouse lab runs do not report INP, so it was measured separately with
PerformanceObserver under 4x CPU throttling across 66 real interactions: triage typing, a quick-pick chip, a tab
switch and an accordion. Worst interaction 112ms (pointer events); keyboard 72ms.

### Targets

| Target | Home | Guide |
| --- | --- | --- |
| Performance >= 90 | pass (91) | pass (97) |
| Accessibility 100 | pass | pass |
| Best Practices >= 95 | pass (100) | pass (100) |
| SEO 100 | pass | pass |
| LCP < 2.5s | **fail (3.24s)** | pass (2.46s) |
| CLS < 0.1 | pass (0) | pass (0) |
| INP < 200ms | pass (112ms) | pass |

### Home LCP: why it fails and what was tried

The LCP element is the hero backdrop image (161,504 px², rendered at 25% opacity). Three things were tried:

1. **Pre-tokenised `matchIndex`** (kept): 17KB off the document and no re-tokenising of 52 candidates per keystroke.
2. **`quality={35}` plus `preload` on the backdrop** (kept): it is the LCP element, so it should load early, and at
   25% opacity it needs no detail.
3. **`next/dynamic` on six below-the-fold client islands** (reverted): it made the score *worse* (78). Splitting
   added request round-trips on a throttled connection without reducing total bytes.

A local test image in place of the remote placeholder did not improve LCP either, so the remaining gap is the sheer
painted area of a full-bleed hero image under simulated 4G, not the placeholder host. The real art-directed photo,
served from the project and sized for the slot, is the next lever. Until then this is a known, measured gap.

---

## taste-skill Section 14

Every box ticks except those listed here.

| Box | Status | Why |
| --- | --- | --- |
| Real images used | **cannot tick** | 9 picsum placeholders remain (see below). Image generation is blocked by the Higgsfield plan and the screenshot script needs Docker, which this machine does not have. All are logged in `docs/image-todo.md` |
| Copy self-audit | **cannot tick** | 14 `{{CONFIRM}}` tokens render on purpose: unconfirmed claims, prices, desk hours, support email, FAQ answers and the booking handoff. A production deploy fails until each is confirmed in `brand.ts` |
| No locale / city-name strips | **cannot tick** | The footer carries a row of 8 city links. The V1.12 brief asked for it as internal linking for SEO, so the brief wins |
| Motion isolated in client leaves, memoized | **partial** | Motion is isolated in `'use client'` leaves, but none are wrapped in `React.memo`. Their props come from server components and never change, so memo would add code without changing behaviour |
| Dark mode tested in both modes | **not applicable** | Theme is locked dark by `MASTER.md` override 1, which the Page Theme Lock box explicitly allows |
| No duplicate CTA intent | **judgement call** | Each intent has exactly one label. But once a triage result appears, two "Fix my site" buttons are on screen (hero and result card). Hiding the hero's own BOOK while a result shows would settle it; the owner should decide |

Boxes ticked include: zero em-dashes, page theme lock, one accent used identically, one radius system (8px controls
and 12px cards only), button contrast (4.92:1), no CTA label wrapping, form contrast, hero fits the viewport
(headline 2 lines, subtext 20 words, CTA visible without scrolling, `pt-24`, `min-h-[100dvh]`), eyebrow count,
no split-header, no zigzag run of 3, no logo-wall labels, motion motivated and reduced-motion honoured, one
marquee, nav on one line at 64px, no repeated layout family, no scroll listeners, `useEffect` cleanup everywhere,
empty, loading and error states designed, Phosphor icons only, no AI tells, CLS 0.

## ui-ux-pro-max pre-delivery checklist

| Box | Status |
| --- | --- |
| No emojis as icons | pass (Phosphor only) |
| Consistent icon set | pass (Phosphor `regular`, plus Simple Icons for real brand marks) |
| `cursor-pointer` on clickables | pass |
| Hover states 150-300ms or spring | pass |
| Text contrast 4.5:1 | pass (dark-only; the light-mode box does not apply) |
| Focus states visible | pass (2px accent, 2px offset) |
| `prefers-reduced-motion` respected | pass (verified in 32 of the 64 axe scans) |
| Responsive 375 / 768 / 1024 / 1440 | pass, no horizontal scroll at any width |
| No content hidden behind fixed navbars | pass (`scroll-padding-top: 5rem`) |
| No horizontal scroll on mobile | pass |

---

## docs/image-todo.md summary

Nine placeholders, ready to hand to an image generator. Art direction throughout: low-key real photography, an
engineer at a desk lit by monitor light with one warm red practical light in frame, deep charcoal shadows, no text,
no logos, no neon.

| Slot | Size | Aspect | Art direction |
| --- | --- | --- | --- |
| `hero-console-bg` | 1600x1200 | 4:3 | Engineer at a monitor-lit desk, warm red practical in frame. Renders at 25% opacity behind the triage console, so keep the subject in the right two thirds. This is the home page's LCP element: ship it optimised |
| `bento-guarantee` | 1200x1200 | 1:1 | Same scene, composed for a 2x2 cell with the lower left kept dark for the headline |
| `bento-keyboard` | 1200x1200 | 1:1 | Macro of a laptop keyboard in monitor light, shallow depth of field, dark lower edge for text |
| `final-cta` | 2400x1200 | 2:1 | Same scene, subject off centre so the centred headline and buttons sit on darker space under a 70% scrim |
| `critical-error-on-this-website` | 1600x1000 | 16:10 | **Real capture**, not generated: the WordPress "There has been a critical error on this website." screen. `npm run capture` writes it (needs Docker) |
| `restored-site` | 1600x1000 | 16:10 | **Real capture**: the same site working again after the repair |
| `service-<id>` (32 slots) | 1600x1000 | 16:10 | **Real capture** per service: the WordPress admin or front end showing that service's problem or result |

The browser-frame component swaps each capture in automatically once `public/screens/<slot>.png` exists; guide
pages render no frame at all until the real capture lands.
