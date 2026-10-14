# QA report: v3-bento-ops

Run on 2026-10-14 against a production build (`npm run build`) served by `next start` on this machine.
Re-run after every fix until the mechanical, accessibility, route, structured-data and keyboard suites came back clean.

**Headline:** all mechanical, accessibility, routing, structured-data and keyboard checks pass. Two numbers miss
their target and both are explained below: Lighthouse Best Practices (78, entirely because the test server is
plain HTTP) and home Performance (86 to 91 across runs, against a target of 90).

Six real defects were found and fixed during this pass. They are listed first, because they are the point of the exercise.

---

## Defects found and fixed

| # | Defect | Where | Fix |
| --- | --- | --- | --- |
| 1 | **Typing in the booking form moved focus to the heading after one character**, making the form unusable by keyboard or screen reader. `screensFor(type)` returned a new array on every render, so the focus effect re-ran on every keystroke. | `src/app/contact/BookingFlow.tsx` | Memoised the screen list, so the effect only runs on a real screen change. |
| 2 | **Two unstyled foundation sections** ("Site down or hacked right now", "What we do") still rendered after the closing CTA on the home page, duplicating the bento and the footer. | `src/app/page.tsx` | Removed. The home page is now the 11 v3 sections the ledger describes. |
| 3 | **axe serious: colour contrast.** Accent-green labels sat on `--surface-2` at 4.31:1, under the 4.5:1 minimum. | service, city, about, hub and guides-index tiles | Those tiles became `--surface` cards with a hairline, where the same green measures 4.89:1 light and 10.21:1 dark. |
| 4 | **axe serious: label/content mismatch.** The nav search trigger's `aria-label` did not contain its visible "Ctrl K" hint. | `src/components/sections/v3/ProblemSearch.tsx` | Dropped the `aria-label`; the button is named by one screen-reader-only string, and the visible copy is `aria-hidden`. |
| 5 | **Focus parked under the fixed mobile bar.** Tabbing to anything in the bottom ~76px at 375px left the focused control behind the action bar. | `src/app/globals.css` | `scroll-padding-top: 6rem` and `scroll-padding-bottom: 6.5rem` on `html`, so focus and anchor targets clear both bars. |
| 6 | **Every service and guide OG image drew a red bar** from `brand.accent` (`#CC3333`), against this variation's one-accent green lock. | `src/lib/og.tsx` | The OG card now uses the v3 palette. `brand.accent` is the company red and stays out of v3. |

Two smaller corrections: the guide template had the same "bullet list" layout family twice (contract rule 3), so
"What usually causes it" became bordered cause tiles; and the content integrity check only enforced the
service → guide link, so a guide its parent did not list could ship orphaned. Both directions are now enforced in
`src/content/index.ts`.

---

## 1. Dashes

```
$ rg -n "[\u2014\u2013]" src docs/*.md    # em dash, en dash
(no output)
```

Clean. `npm run check` also fails the build on any em or en dash in `src/`, so this is enforced, not just observed.

## 2. Eyebrows

Counted from `docs/layout-ledger.md` and confirmed in the rendered pages.

| Page | Sections | Allowed `ceil(n/3)` | Used | Which |
| --- | --- | --- | --- | --- |
| Home | 11 | 3 | 3 | "What we fix", "Prevent the next one", "Security" |
| Service | 9 | 3 | 0 | |
| Guide | 8 | 2 | 0 | |
| Hub, city, compare, contact, standalone pages | 3 to 6 | 1 to 2 | 0 | |

Pass. The ledger previously showed the arithmetic with the section index as the denominator; corrected to the
page's section count.

## 3. CTA wording

`scripts/check-content.ts` fails the build if any `CTA` label string appears outside `src/config/cta.ts`. It passes:

```
$ npm run -s check
ok: 52 match candidates, 166 files scanned, legacy off
```

One label per intent, all five from `src/config/cta.ts`: BOOK "Fix my site", CHAT "Chat with an engineer",
PLANS "See plans", QUOTE "Get a quote", CHECK "Get a free site check". No second wording for any intent.

## 4. Numbers and their sources

Every numeral rendered inside `<main>`, collected from the DOM.

| Page | Numeral | Source |
| --- | --- | --- |
| Home | `52` ("See all 52 problems") | `matchIndex.length`, built from `src/content` |
| Home | `6`, `6` (screen-reader "6 of 6 questions shown") | `faqs.length`, six questions referenced out of the service content files |
| Home | `14`, `14` (guarantee card) | `brand.guarantee.days`, currently the **placeholder** guarantee and labelled as one on the page |
| Home | `500` ("critical error notices and 500 errors") | the HTTP status named by the service `500 / 502 / 503 Server Error Fix`; the sentence itself is authored in `Bento.tsx` |
| Problem (service) | none | every `priceFrom` and `typicalTurnaround` is null, so nothing renders |
| Problem (guide) | `1`, `2` | ordered-list positions of the safe checks |

No numeral without a source. No invented statistic anywhere. Prices are absent because `src/content/pricing.ts`
is still all null, which is the intended "render nothing" behaviour.

## 5. Banned patterns

```
h-screen                             0 hits
window.addEventListener("scroll"     0 hits
lucide-react                         0 hits
#000000                              0 hits
#ffffff                              0 hits
Step 1 / Stage 1                     0 hits
Jane / Acme                          0 hits
elevate / seamless / unleash         0 hits
```

`--on-accent: #ffffff` was a real hit at the start of this pass and is now `#fcfcfd`, which keeps button labels at
4.89:1 on the accent. The only `Inter` import is `Inter_Tight` as the body face, which is the permitted pairing,
not Inter as a default.

## 6. Layout ledger

No layout family repeats on any page. Zero marquees sitewide (the variation has none by design). No page has
two consecutive image-plus-text splits, let alone three. The one duplicate found (guide: two bullet lists) was fixed.

## 7. Routes

```
sitemap.xml: 95 urls, 95 unique
  guides in sitemap: 37 | compares: 3
  all 95 sitemap paths fetched; non-200: 0
  /pricing (no slash) -> 308 /pricing/
/supporting/ -> 404
/fix                             308 -> ... -> /wordpress-fix/ (200)
/fix/white-screen-of-death       308 -> ... -> /wordpress-fix/white-screen/ (200)
/fix/hacked                      308 -> ... -> /wordpress-security/malware-removal/ (200)
/fix/malware-removal             308 -> ... -> /wordpress-security/malware-removal/ (200)
/app                             308 -> ... -> /contact/ (200)
/app?problem=... -> /contact/?problem=white-screen-of-death
```

- All 95 sitemap URLs are unique, absolute, trailing-slashed and return 200: 55 SITEMAP nodes + 37 guides + 3 compares.
- Legal pages are deliberately out of the sitemap.
- `/supporting/` is 404: it is a grouping in the diagram, not a page.
- Old paths redirect permanently and land on the right page. Note they take **two hops** when the old URL has no
  trailing slash, because `trailingSlash: true` normalises first and only then matches the redirect. Both hops are
  308, so this is correct but costs one extra round trip on legacy links.
- `/app` keeps its query string.
- Guide and service cross-linking verified in the rendered HTML, and now enforced at build time in both directions.

**Not tested:** the fixmywp.com legacy redirects. `brand.legacy.enabled` is `false` and the file carries an explicit
instruction not to flip it without written approval, so the twelve host-matched 301s (2 hosts x 6 paths) are dead
code today. The table is present and correct by inspection; it cannot be exercised without enabling the flag.

## 8. Structured data

Home and three problem pages, parsed and walked:

| Page | Types | Nulls | AggregateRating | Price fields |
| --- | --- | --- | --- | --- |
| `/` | Organization, FAQPage | none | none | none |
| `/wordpress-fix/emergency/` | Organization, Service, FAQPage, BreadcrumbList | none | none | none |
| `/guides/white-screen-of-death/` | Organization, TechArticle, FAQPage, BreadcrumbList | none | none | none |
| `/wordpress-maintenance/care-plans/` | Organization, Service, FAQPage, BreadcrumbList | none | none | none |

Every block parses. No `AggregateRating` anywhere (there are no real reviews, so claiming one would be false).
No null values. No `price` without a published price: the `Offer` carries only its `url` until `priceFrom` exists.

---

## Accessibility: axe-core 4.14

7 pages x 4 widths (375, 768, 1024, 1440) x 2 themes, plus a `prefers-reduced-motion: reduce` pass on home and
contact. Tags: wcag2a, wcag2aa, wcag21a, wcag21aa.

**Zero serious or critical violations** (58 page scans). Two serious issues existed at the start of this pass and
are fixed (defects 3 and 4 above).

### Keyboard and focus

- 25 tab stops audited at 375px and 1440px: **every stop has a visible focus ring, none is covered** (hit-tested
  with `elementFromPoint`, not just geometry), none is scrolled out of view.
- Keyboard-only path works end to end: Tab to the hero "Fix my site" → Enter → `/contact/` → pick a problem with
  Space → Continue → type the site → Continue → type name and email → Continue → Confirm → submit →
  **"Ticket ready"**, with focus landing on the success heading.
- Reduced motion: the bento, tabs, toggles and accordion all render their final state with no movement.

## Lighthouse (mobile, simulated slow 4G)

Run with Lighthouse 12 against the Playwright Chromium. Three repeat runs on home to show the spread.

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 86, 89, 90, 91 (median ~89) | **100** | 78 | **100** | 3.0 to 3.3 s | **0** | 200 to 360 ms |
| `/wordpress-fix/emergency/` | **96** | **100** | 78 | **100** | 2.6 s | **0** | 110 ms |

**Accessibility 100 and SEO 100 on both pages. Two targets are missed:**

**Best Practices 78 on both pages** fails on exactly two audits, `is-on-https` and `redirects-http`. The test server
is plain HTTP on a LAN address. Nothing in the application causes this, and both audits pass on any HTTPS
deployment. Treat Best Practices as untested rather than failed; it cannot be measured honestly from here.

**Home Performance ~89 against a target of 90**, with LCP 3.0 to 3.3 s against the contract's 2.5 s budget. The
problem page passes comfortably at 96. What the trace shows for home:

- LCP element is the hero photograph. It is only **20 KB** as served (webp, 750w), so this is not image weight.
- Script evaluation is **1.1 s** and total main-thread work 2.6 s. Lighthouse reports **140 KiB of unused JavaScript**.
- Eight images load on the home page (about 100 KB in total), competing with the hero on a throttled connection.

One change was made during this pass: the below-the-fold client islands (bento motion, steps tabs, plan toggle,
pricing, FAQ accordion) now load as separate chunks via `next/dynamic` instead of during first hydration. That cut
TBT from ~360 ms to ~200 ms and lifted the problem page from 93 to 96, but home still sits on the 90 line because
LCP dominates. All five islands were re-tested after the split and still work.

Remaining levers, in order of expected effect: replace the stand-in photographs with correctly sized daylight
shots (see the image list below), reduce the number of images above the first scroll, and trim the motion library
off the critical path entirely.

### A finding Lighthouse does not report: font-driven layout shift

Lighthouse reports **CLS 0** on both pages. A throttled Playwright run on this machine measures **CLS 0.320** on
home and 0.100 on the problem page. The cause is specific and worth recording:

```
normal            CLS 0.320
fonts blocked     CLS 0.000
images blocked    CLS 0.320
```

Fonts, not images. `document.fonts` shows `display Fallback` with status **`error`**: `next/font` builds its
metric-matched fallback with `src: local("Arial")`, and this Linux container has no Arial, so the adjusted fallback
never loads. Text paints in an unadjusted system font and reflows when Cabinet Grotesk arrives.

On any device that has Arial or a metric-compatible substitute, which is the overwhelming majority of real
visitors, the adjusted fallback loads and this shift does not occur, which is consistent with Lighthouse's 0.
**It is a measurement artifact here, but it is also a genuine worst case** for a visitor on a device without Arial.
If you want it gone unconditionally, the options are `display: "optional"` on the display font (headings render in
the fallback on a cold first paint) or a hand-tuned `@font-face` fallback with explicit `size-adjust`. Neither was
applied, because both trade away something real and the choice belongs to the owner.

## Screenshots

`docs/qa/` holds 27 PNGs for side-by-side comparison with the other variations, following the naming used on main:

- `home-01-…` to `home-11-…`, each in `-light` and `-dark` (one per home section, in page order)
- `home-full-375-light.png` (whole page at 375px)
- `problem-service-emergency-{light,dark}.png` and `problem-guide-white-screen-{light,dark}.png` (full page)

---

## Section 14 pre-flight (taste skill) and the ui-ux-pro-max pre-delivery checklist

Every box below is ticked except the ones listed under "cannot be ticked".

Ticked, with the evidence already given above: brief inference and dials declared in MASTER.md; design system
chosen and labelled; zero em-dashes; one theme per page with both designed; one accent used identically; one
corner-radius system (20px cards, 12px inputs, pill buttons); CTA contrast and no CTA wrapping; form contrast,
labels, helper text and inline errors; hero fits the viewport with a 2-line headline and `pt-24` maximum; eyebrow
count at or under the cap; no split-header; no zigzag repetition; no duplicate CTA intent; logo wall is logos only,
under the hero, real Simple Icons SVGs; bento has 7 cells for 7 items with 4 carrying image, tint or fill; copy
re-read; motion justified and reduced-motion honoured; no marquee; nav on one line at 60px; no two sections sharing
a layout family; long lists use the right component; real images only, no div-built screenshots; no pills on images,
no photo credits, no version labels, no micro-meta-sentences, no decoration strips, no floating sub-text, no scoring
bars, no locale strips, no scroll cues, no section-number eyebrows; the only dot is the live chat presence dot,
which renders only on real vendor data; no `border-t`+`border-b` on every row; content density sane; quotes capped
at three lines; motion actually ships at MOTION_INTENSITY 6; no `window.addEventListener('scroll')`; reduced motion
wrapped everywhere; dark mode tokens defined and tested; mobile collapse explicit; `min-h-[100dvh]` never
`h-screen`; the one `useEffect` listener has cleanup; empty, loading and error states all present; icons from one
allowed library (Phosphor duotone); motion isolated in client leaves; no AI tells; one design system.

**Boxes that cannot be honestly ticked:**

1. **"Core Web Vitals plausibly hit."** LCP is 3.0 to 3.3 s on home under simulated slow 4G, against a 2.5 s
   budget. CLS and INP are fine (CLS 0 per Lighthouse, TBT 200 ms). Partially ticked: the problem page passes.
2. **"Real images used."** They are real photographs, but nine of the ten placements are stand-ins from the v1
   set that are off this variation's daylight art direction, and four are waiting on captures that need Docker.
   Listed below.
3. **"Premium-consumer palette check"** and **"serif discipline."** Not applicable: this is not a premium-consumer
   brief and the variation uses no serif.
4. **"Redesign mode detected and audit performed."** Not applicable: this is a new variation on a clean branch,
   not a redesign of an existing page.
5. **Light-mode contrast on the pre-delivery checklist** is ticked for every pair in use, but note the one
   documented exception in MASTER.md: accent-green text on `--surface-2` is 4.31:1 and is therefore barred from
   small text. That rule is now also observed in the templates, which was defect 3.

Two further things block a production deploy by design, and are not QA failures:

- **14 unconfirmed values** in `src/config/brand.ts` (support email, currency, GST, seven claims, chat provider,
  booking provider, guarantee). `next.config.ts` fails a production build until each is confirmed.
- **Two placeholder testimonials** and a **placeholder guarantee**, both visibly marked on the page and both
  failing a production build.

---

## Image to-do, summarised for an image generator

House direction: bright daylight lifestyle-tech photography, natural window light, clean desks, neutral and green
tones, **no red**. Real screens only: photograph a screen, never composite one. All ten placements currently show a
real photograph from the v1 set; only `drafting` matches the daylight direction.

| # | Placement | Size | Aspect | Art direction |
| --- | --- | --- | --- | --- |
| 1 | Home hero, right column | 1600x1200 | 4:3 at every width | A laptop on a clean light desk by a window, daylight from one side, a healthy WordPress site on screen. Calm, uncluttered, a plant or coffee at most. Keep the subject in the left two thirds so nothing important falls in the 48px that overlaps the next section. Decorative, empty alt. |
| 2 | Home bento, "Hacked and malware" (2x2, behind a scrim) | 1600x1600 | about 1:1 | Daylight: a laptop by a window with a security scan finished clean on screen. |
| 3 | Home bento, "White screens and fatal errors" | 1600x1000 | 16:10 in a device frame | The real WordPress critical-error page. Produced by `npm run capture` (needs Docker); the cell swaps to it automatically once `public/screens/critical-error-on-this-website.png` exists. |
| 4 | Home bento, "WooCommerce checkout and payments" (1x2, behind a scrim) | 1000x1600 | about 1:2 portrait | Daylight: a shop owner checking new orders on a phone at a counter. Portrait frame. |
| 5 | Home steps, "Describe" | 1600x1000 | 16:10 in a device frame | A screenshot of `/contact`, first screen, once the page is final. Save as `public/screens/booking.png`. |
| 6 | Home steps, "Approve" | 1600x1000 | 16:10 in a device frame | A fixed-price quote awaiting approval. **Blocked:** no such screen exists in the product yet; quotes are a reply, not a page. |
| 7 | Home steps, "Fix (before)" | 1600x1000 | 16:10 in a device frame | The same critical-error capture as #3. |
| 8 | Home steps, "Verify (after)" | 1600x1000 | 16:10 in a device frame | The same site loading normally, captured before anything is broken. `npm run capture` now writes this as `public/screens/restored.png`. |
| 9 | Home compare, "One-time fix" | 1600x1200 | about 4:3, half card | Daylight: an engineer's hands on a laptop, the site loading normally again on screen. |
| 10 | Home compare, "Care plan" | 1600x1200 | about 4:3, half card | Daylight: a calm, tidy desk with a WordPress dashboard showing everything up to date. |

Service and hub heroes reuse the same eleven photographs through `servicePhotos` and `hubPhotos`. Reshooting about
six daylight frames would cover every service and hub as well as rows 2, 4, 9 and 10 above.

Image generation was attempted first, as contract rule 7 requires: the Higgsfield account has 0 credits
(checked 2026-10-13; one 4:3 image costs 0.25).

---

## How to re-run

```
npm run build          # type check, content check, route test
npx next start -p 3123 # then point the suites at it
```

The suites used here are Playwright scripts driving `axe-core` (injected from `node_modules`), `fetch` for the
route and sitemap checks, and `lighthouse` with `chrome-launcher` pointed at the Playwright Chromium
(`~/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`). `lighthouse`, `chrome-launcher` and `axe-core` were
added as devDependencies for this pass.
