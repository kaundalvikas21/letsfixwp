# QA report: v4-rescue-story

Run on 2026-10-15 against a production build (`npm run build`) served by `next start -p 3400` on this machine.
Every suite was re-run after each fix until it came back clean.

**Headline:** mechanical, accessibility, routing, structured-data and keyboard suites all pass, after four real
defects were found and fixed. One target is missed and not fixable by tuning: Lighthouse performance on the
home page is 69 against a target of 90. The service page is 93. The diagnosis, and the fix that was tried and
measured worse, are at the end.

---

## Defects found and fixed in this pass

| # | Defect | Found by | Fix |
| --- | --- | --- | --- |
| 1 | `aria-valid-attr-value`, critical, on every home width: Radix built `aria-controls="radix-...-content-Before booking"` from the FAQ tab value, and a space makes an invalid IDREF | axe at 375/768/1024/1440 | tabs now carry slug ids (`before-booking`), the display name is a separate field |
| 2 | `color-contrast`, serious: the error-stack card dims to 0.55 as the next card arrives, which took `--muted` body copy to 2.99:1 | axe on the home page mid-scrub | that line is `--text`, which holds about 5.5:1 at the same 0.55 dim |
| 3 | `region`, moderate, at 375: the mobile bottom action bar was page content outside any landmark | axe at 375 | it is a `<nav aria-label="Quick actions">` |
| 4 | "seamless" in a source comment | banned-word grep | reworded |

---

## 1. Dashes

```
$ grep -rnP "[\x{2014}\x{2013}]" src
(no output)
```

Pass. The content check also enforces this on every build (`scripts/check-content.ts` fails on em or en dashes
in `src`), and it ran clean: `ok: 52 match candidates, 173 files scanned, legacy off`.

## 2. Eyebrows

Counted in the browser as short (<26 character), small (<=15px), tracked or muted labels above a heading.

| Page | Sections | Budget `ceil(n/3)` | Found |
| --- | --- | --- | --- |
| Home | 11 | 4 | 2: "Sound familiar?", "Guarantee" |
| Service | - | - | 0 |
| Guide | 5 | 2 | 0 |
| Hub | 3 | 1 | 0 |

Pass.

## 3. CTA wording

```
$ npm run check
ok: 52 match candidates, 173 files scanned, legacy off
```

`scripts/check-content.ts` fails the build if any CTA label string appears outside `src/config/cta.ts`. One
label per intent, and they are the only CTA wording on the site:

```
BOOK: "Fix my site"   CHAT: "Chat with an engineer"   PLANS: "See plans"
QUOTE: "Get a quote"  CHECK: "Get a free site check"
```

The one place a CTA component accepts anything extra is `BookLink`'s optional `icon`, which takes a node and
never words.

## 4. Numbers on screen, and their source

Every numeral rendered on the home page and on a problem page, with where it comes from. Nothing is unsourced.

| Rendered | Source |
| --- | --- |
| "500 Internal Server Error", "502 Bad Gateway", "503 Service Unavailable", "404" | guide titles and `symptoms` in `src/content/guides/*` |
| "500 / 502 / 503 Server Error Fix" | SITEMAP node title |
| "PHP 7.4 to 8" | `src/content/services/update-php-errors.ts` symptom |
| "14-day guarantee" and "Every fix carries a 14-day guarantee" | `brand.guarantee.days`, still a placeholder and marked as one on the page |
| "Booking takes about 2 minutes" | `brand.claims.bookingMinutes` |
| "1", "2" on a guide | ordinals of the safe-checks list, not a claim |
| Prices | none render anywhere: every price in `src/content/pricing.ts` is null, and rule 8 renders nothing for a null |

## 5. Banned patterns

```
$ for pat in h-screen 'addEventListener("scroll"' lucide-react '#000000' '#ffffff' \
      'from "inter"' '"Step 1' 'Stage 1' Jane Acme elevate seamless unleash; do ...
h-screen                     0
addEventListener("scroll"    0
lucide-react                 0
#000000                      0
#ffffff                      0
from "inter"                 0
"Step 1                      0
Stage 1                      0
Jane                         0
Acme                         0
elevate                      0
seamless                     0   (was 1, in a code comment; reworded)
unleash                      0
```

## 6. Layout ledger

From `docs/layout-ledger.md`, checked against the built pages:

- Home: 11 sections, 11 distinct layout families. No repeat.
- One marquee on the page, in the proof section.
- Image-plus-text layouts: hero, the fix panels, the tiles, the result, the plans rows, the closing banner.
  Never three in a row; the sticky-stack, the marquee-and-quotes, the guarantee, the checklist and the FAQ
  break every run.
- Templates use five further families, none of which appears on the home page.

## 7. Routes

```
$ node qa-routes.mjs http://localhost:3400
sitemap.xml entries: 95 | duplicates: none | without trailing slash: none
sitemap paths not returning 200: none
  /wordpress-fix (no slash) -> 308 /wordpress-fix/
  /guides/white-screen-of-death (no slash) -> 308 /guides/white-screen-of-death/
  /pricing (no slash) -> 308 /pricing/
  /supporting/ -> 404
  /fix/white-screen-of-death/  308 -> /wordpress-fix/white-screen/  200
  /fix/hacked/                 308 -> /wordpress-security/malware-removal/  200
  /fix/malware-removal/        308 -> /wordpress-security/malware-removal/  200
  /fix/   308 -> /wordpress-fix/   200
  /app/   308 -> /contact/         200
```

- 95 sitemap entries, no duplicates, every one trailing-slashed and returning 200. The build's own
  `scripts/route-test.ts` additionally fails if a SITEMAP path has no route or a route has no SITEMAP entry:
  `route test ok: 99 routes (55 SITEMAP nodes, 37 guides, 3 compares, utility 4)`.
- `/supporting/` is 404, as intended: it is a grouping in the diagram, not a page.
- 38 foundation `/fix/*` redirects are permanent and land on the right service, including the renamed
  (`hacked` to `wordpress-hacked`) and folded (`malware-removal`) slugs.
- **Legacy fixmywp.com paths could not be exercised here, by design.** The six rules in
  `src/config/redirects.ts` are host-matched to `fixmywp.com` and `www.fixmywp.com` *and* gated on
  `brand.legacy.enabled`, which is false. On this host they correctly 404. Verified by configuration:
  `/wordpress-hacked-fix`, `/fix-wordpress-theme`, `/fix-wordpress-plugin`,
  `/wordpress-maintenance-services`, `/testimonials` and `/app` each map to a live page with statusCode 301.
  They can only be tested against the old hostname.
- Guide and service backlinks: 37 guides, 32 services, **0 broken links in either direction**. The content
  layer fails the build on an orphan, so this cannot drift.

## 8. Structured data

```
home     types: Organization, FAQPage                                   | clean
service  types: Organization, Service, FAQPage, BreadcrumbList          | clean
guide    types: Organization, TechArticle, FAQPage, BreadcrumbList      | clean
city     types: Organization, Service, FAQPage, BreadcrumbList          | clean
```

No `AggregateRating` anywhere (there are no reviews to aggregate), no null or empty price, no null value of
any kind, every `url`, `item` and `@id` absolute. City pages use `Service` with `areaServed`, never
`LocalBusiness`, because there is no office in the city.

## Accessibility: axe-core

375, 768, 1024 and 1440, plus 1440 with `prefers-reduced-motion: reduce`, on home, service, guide and contact.
The variation is dark-locked, so there is one theme to test, not two.

```
home@375  0 serious/critical, 0 any impact      service@375  0 / 0
home@768  0 / 0                                 guide@375    0 / 0
home@1024 0 / 0                                 contact@375  0 / 0
home@1440 0 / 0
home@1440+reduced 0 / 0                         (service, guide, contact: same at every width)

axe: zero serious or critical violations anywhere
```

After the three fixes above, **zero violations of any impact** at every width tested.

## Keyboard and focus

```
page content whose focus ring is covered by the fixed bar: none
skip link: {"text":"Skip to content","z":"60","top":8,"onTop":true} -> painted above the bar: true
hero BOOK reached by keyboard: true
screens walked: Problem > Your site > Contact > Confirm | confirmation reached: true
focus ring on a control: 2px rgb(255, 90, 54)
```

The skip link sits at the top of the viewport where the fixed 64px bar also sits, so it was checked by hit
testing rather than geometry: at `z-index: 60` against the bar's 40 it is painted above it, and
`document.elementFromPoint` at its centre returns the link itself.

The full keyboard-only path works: Tab to the hero's BOOK, Enter, then the four booking screens filled and
advanced with the keyboard alone, ending on the "Ticket ready" confirmation.

## Screenshots

`docs/qa/` holds this run: one per home section (`v4-home-01-hero-title` through `v4-home-11-final-cta`), the
service and guide templates full-page, and the home page at 375. The v2 and v3 captures from earlier runs are
still there for side-by-side comparison.

## Lighthouse (mobile, simulated throttling)

| Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/wordpress-fix/white-screen/` | **93** | **100** | **100** | **100** | 2.7 s | 0 | 180 ms |
| `/` | **69** (67, 69, 69 over three runs) | **100** | **100** | **100** | 5.2 s | 0 | 360-430 ms |

Accessibility, best practices and SEO hit their targets on both pages. CLS is 0 on both. INP is not produced
by a Lighthouse navigation run; TBT is reported in its place, and the interaction work is in the same place
the TBT is.

**The home page misses Performance >= 90 and LCP < 2.5s.** What was measured:

- The real LCP element is the hero photograph, which paints at **1.27s** in a throttled Playwright run.
  Lighthouse's simulated 5.2s is the critical path, not the paint: 752KB total with three font files and the
  client islands for three scroll scenes, 52 problem tiles, Radix and Motion.
- **Fixed during this pass:** the display font carried an unused `wdth` axis. Dropping it took Bricolage
  Grotesque from **129KB to 75KB** and its load from 3.59s to 2.43s, which moved the score from 72 to 74.
- **Fixed during this pass:** the guarantee mask photograph (76KB) now loads only from 768px up. Below that
  the words take the solid ember fill, which is the same state a browser without `background-clip: text`
  already gets.
- **Tried and reverted:** `next/dynamic` on all eight below-the-fold islands. Measured **worse**: 74 to 65,
  TBT 300ms to 390ms. The extra chunk requests and deferred hydration cost more on a throttled connection
  than the bytes they save. This is the second time this repo has measured that result; v3 recorded the same
  regression.

What would actually move it, in order of effect and cost:

1. Cut the initial tile count. The problem grid renders all 52 tiles with 20 image-backed cards; rendering
   the first 24 and revealing the rest on filter would cut DOM and main-thread work materially.
2. Drop Geist Mono (29KB, one request) in favour of a system mono stack. It is used only for error strings.
3. Accept 69 on this page. It is the heaviest page on the site by design, and the template pages, which are
   what search traffic lands on, score 93.

None of these are style fixes, so none were applied without a decision.

## taste-skill Section 14

Every box ticked except where noted.

Could not honestly tick:

- **"Dark mode tokens defined and tested in both modes."** This variation is dark-locked by brief: one
  designed theme, one measured contrast table. Not a miss, a documented decision.
- **"Real images used (gen-tool first, then Picsum-seed, then explicit placeholder slots)."** All photography
  is real, but the error screens and the restored-site capture are night-frame stand-ins because
  `public/screens/` is empty and Docker is not available in this environment. Logged in `docs/image-todo.md`.
- **"Marquee gets pause plus previous and next controls."** It has pause, hover stop, focus stop and a static
  row under reduced motion. No previous and next: nothing in it is reachable only by stepping, every logo
  carries its own title, and the set renders at once under reduced motion. Flagged rather than assumed.

Ticked, with the evidence above: zero em-dashes; page theme lock; one accent; shape lock (no non-14px radius
anywhere in `main` on any page); button contrast; no CTA label wraps; form contrast; hero fits the viewport;
hero top padding; hero stack discipline; eyebrow count; no split-header; zigzag cap; no duplicate CTA intent;
logo wall under the hero with real SVG marks and no category labels; copy self-audit; motion motivated; one
marquee; nav on one line at 64px; no layout family repeated; no `window.addEventListener('scroll')`; reduced
motion wrapped everywhere; `min-h-[100dvh]` and never `h-screen`; every effect cleans up (verified live: a
client-side route change leaves 0 pin-spacers and 0 stray transforms, and returning rebuilds exactly 4).

## ui-ux-pro-max pre-delivery checklist

- [x] No emojis as icons: one set site-wide, Phosphor duotone.
- [x] `cursor-pointer` on clickable elements.
- [x] Hover states with transitions in the 150-300ms band.
- [x] Text contrast 4.5:1 minimum: measured per token pair in the MASTER table, and axe reports zero contrast
      violations at four widths.
- [x] Focus states visible: 2px ember ring at 2px offset, measured on a control.
- [x] `prefers-reduced-motion` respected: every scene and micro-interaction measured in its reduced state.
- [x] Responsive at 375, 768, 1024, 1440: no horizontal scroll at any width on any page tested.
- [x] No content hidden behind fixed bars: checked by hit testing, including the skip link.
- [ ] "Light mode text contrast": not applicable, the variation is dark-locked.

## Image to-do, ready to hand to a generator

Full detail in `docs/image-todo.md`. Summary of every placeholder, its size and its direction:

| Slot | Where | Size | Aspect | Art direction |
| --- | --- | --- | --- | --- |
| `white-screen-of-death` | error card 1 | 1600x1000 | 16:10 | A browser showing a completely blank white page. `npm run capture` (needs Docker) |
| `critical-error-on-this-website` | error card 2, fix pan "Diagnose" | 1600x1000 | 16:10 | The WordPress line "There has been a critical error on this website." `npm run capture` |
| `error-establishing-database-connection` | error card 3 | 1600x1000 | 16:10 | The WordPress line "Error establishing a database connection". `npm run capture` |
| `illustration-google-deceptive-site-warning` | error card 4 | 1600x1000 | 16:10 | Chrome's red "Deceptive site ahead" interstitial. Not reachable from the capture script: needs a real screenshot of the interstitial or an illustration of it |
| `restored.png` | the result section, fix pan "Verify" | 1600x1000 | 16:10 | The same site loading normally. `npm run capture` writes it beside the error captures. **Produce this one first:** it is the only section whose entire content is one image |
| `booking.png` | fix pan "Describe" | 1600x1000 | 16:10 | A screenshot of /contact/ once the v4 booking flow is styled |
| `quote.png` | fix pan "Approve" | 1600x1000 | 16:10 | A fixed-price quote waiting for approval |
| Night photography | hero, closing banner, tiles, plans rows | 1600x1000+ | 16:10 and 4:3 | A phone lighting up with an alert on a dark desk; an owner's face lit by a laptop; an engineer's hands at a keyboard. **Each frame needs a real light source in it**: the darkest frames in the current library (mean luminance 13 to 28) render as black panels behind the site's scrim, which is why the closing banner uses the brightest one and mirrors it |

---

# Inner page templates: craft pass (P4)

Verified against a production build (`npm run build` then `next start`), not the dev server. Nine pages
covering all five inner templates and all three container widths: service with a real capture, service
falling through to a photograph, hub, guide, compare, city, city hub, guides index, compare index.

## Automated sweep

Script: a throwaway Playwright plus axe-core runner in the session scratchpad, the same ad-hoc approach that
produced the numbers above. Nothing was committed; there is still no `npm run` target for axe or Lighthouse.

Nine pages x four widths (375, 768, 1024, 1440), plus each page again at 1440 under
`prefers-reduced-motion: reduce` and again with JavaScript disabled. Asserted on every run:

| Check | Result |
| --- | --- |
| axe-core, violations of any impact | 0 |
| Exactly one h1 | pass |
| No horizontal page scroll | pass |
| Targets: 44px for controls, WCAG 2.5.8's 24px for links | pass |
| No border-radius inside `main` other than 14px | pass |
| **No element in `main` at `opacity: 0` while in the reading area, with JS disabled** | pass |
| Reduced motion: every `.reveal` and `.rise-in` at opacity 1, transform none | pass |
| Every h1 and h2 within a page sharing one left edge | pass |

The JS-disabled opacity check is the regression guard this pass exists to pass, and the reason the motion
system is CSS-only: it is the test that would have caught the blank hero line recorded in the `hero-word`
comment in globals.css.

Heading left edges, measured at 1440 and matching the three documented container widths exactly:

```
service+capture  168    guide          360    cityhub        296
service+photo    168    compare        168    guides-index   296
hub              168    city           296    compare-index  360
```

## Two defects the sweep caught in this pass's own work

1. **axe `color-contrast`, serious, four nodes, guide page, 1440 only.** Foreground `#717178`, which is no
   token in the system: it is `--muted` blended with `--bg` by a part-finished fade. A view timeline is
   scrubbed rather than played, so a reader who stops scrolling parks the animation wherever they left it,
   and parked body copy measured 4.03:1 against a 4.5:1 floor. Fixed by giving `reveal` its own keyframe
   that finishes opacity by a third of the range and spends the rest on transform alone.
2. **The h1 was being faded in**, which holds back the paint of the page's LCP element. Removed from every
   template; the headline now paints at once and everything else rises under it.

## Performance

Measured with a Chrome DevTools trace at Slow 4G and 4x CPU throttling, **not** a Lighthouse simulated run,
so these are not directly comparable with the Lighthouse table above. Recorded as the instrument says.

| Page | LCP | CLS |
| --- | --- | --- |
| `/wordpress-fix/white-screen/` | 810 ms | 0.00 |
| `/guides/white-screen-of-death/` | 765 ms | 0.00 |

Both are well inside the 2.5s LCP and 0.1 CLS budgets. The one change expected to move LCP is `RealScreen`
taking a real `sizes` per call site instead of one hardcoded `60vw`: the service page had been preloading
the 1080w candidate into a 432px box. A like-for-like Lighthouse re-run against the 2.7s figure above has
not been done, because chrome-launcher cannot reach a browser from this WSL shell; the next pass that can
run Lighthouse should redo that row rather than trust the trace numbers as a substitute.

The home page was not touched and its 69 stands as the documented decision above.

# Hub pages and contact: cadence pass (P5)

Verified against a production build (`.next` deleted, `npm run build`, then `next start -p 3400`), not the
dev server, and not against an existing `.next`: a stale build gave one false reading earlier in this pass
and every number below was taken after a clean rebuild.

Eleven pages now, the nine from P4 plus two the hub and contact work made load-bearing: a six-service hub
(`/wordpress-fix/`, which renders the problem grid with no lead panel) and a three-service hub
(`/wordpress-performance-migration/`), and `/contact/`.

## Automated sweep

Script: the same throwaway Playwright plus axe-core runner in the session scratchpad, extended with those
pages. Still nothing committed and still no `npm run` target for axe or Lighthouse.

Eleven pages x four widths (375, 768, 1024, 1440), plus each page again at 1440 under
`prefers-reduced-motion: reduce` and again with JavaScript disabled.

| Check | Result |
| --- | --- |
| axe-core, violations of any impact | 0 |
| Exactly one h1 | pass |
| No horizontal page scroll | pass |
| Targets: 44px for controls, WCAG 2.5.8's 24px for links | pass |
| No border-radius inside `main` other than 14px | pass |
| No element in `main` at `opacity: 0` while in the reading area, with JS disabled | pass |
| Reduced motion: every `.reveal` and `.rise-in` at opacity 1, transform none | pass |
| Every h1 and h2 within a page sharing one left edge | pass on ten, **reported on `/contact/`**, see below |

Heading left edges at 1440, unchanged from P4 for the nine pages it measured:

```
service+capture  168    guide          360    cityhub        296
service+photo    168    compare        168    guides-index   296
hub (6 svc)      168    city           296    compare-index  360
hub (3 svc)      168    contact        232
```

### Two instrument limits the two new pages exposed

Both were read as findings first and checked in the browser before being called instrument limits.

1. **Touch targets on `/contact/`: eight 16x16 `INPUT`s at every width.** The booking flow's radios are
   16px by design and each is wrapped in a `<label>` measuring 293x50 or 293x70 at 375, which is what a
   visitor taps. The check walked inputs directly and never looked at the label. The check now measures the
   associated label for a radio or a checkbox; the page was not changed. This is why the row above reads
   pass: on the raw-input reading it never could, on any form page.
2. **The spine check cannot pass on `/contact/`, and the page is not misaligned.** It reports three distinct
   heading left edges: 232 / 695 / 256 at 1440, 16 / 41 / 40 at 375. The h1 is on the spine at 232, "Problem"
   is inside the form card (232 + 1px border + 24px padding, and at 1440 the card is the right-hand column,
   hence 695), and "What we promise" is inside the promises panel (232 + 24px padding). Both panels have
   their own left edge on the spine; their headings are inset by their own padding, which is what a card
   does. The check assumes a single-column page with no panelled headings, which is true of the other ten and
   cannot be true of a two-column page with a form card. Left as-is rather than taught to ignore panels,
   because a check quietly widened to pass is worth less than a result that needs one line of explanation.

Nothing else in the sweep flagged, so nothing in Task 1, Task 2 or the action-bar change introduced a
regression the sweep can see.

## The action bar change, measured

At 375 on the production build:

| Route | Bar | `body` padding-bottom | `html` scroll-padding-bottom | Gap below footer | Visible chat triggers |
| --- | --- | --- | --- | --- | --- |
| `/contact/` | none | 0px | 32px | 0px | 1 (the page's own, was 2) |
| `/wordpress-fix/` | 73px | 76px | 104px | 76px (the bar's own space) | 3 (hero, closing band, bar) |
| `/free-site-check/` | 73px | 76px | 104px | 76px | 2 (the page's own, bar) |

With the mega menu open on `/wordpress-fix/` at 375 the bar unmounts and `body` still holds 76px, so the
reservation does not move behind the overlay. At 1440 the bar is absent on all three and padding is 0 on all
three, unchanged.

## Performance

Measured with a Chrome DevTools trace over CDP at 150ms / 1.6Mbps and 4x CPU throttling, **not** a
Lighthouse simulated run, so these are not comparable with the Lighthouse table earlier in this file. Same
instrument and the same caveat as P4: chrome-launcher still cannot reach a browser from this WSL shell.

| Page | LCP 1440 | CLS 1440 | LCP 375 | CLS 375 |
| --- | --- | --- | --- | --- |
| `/wordpress-fix/` | 1024 ms | 0.001 | 1716 ms | 0.009 |
| `/wordpress-performance-migration/` | 1272 ms | 0.002 | 1260 ms | 0.010 |
| `/contact/` | 1024 ms | 0.008 | 1732 ms | 0.000 |

All inside the 2.5s LCP and 0.1 CLS budgets. `/contact/` at 375 measures 0.000, which is the width the
action bar change affects: releasing 76px of `body` padding on that route shifts nothing, because the
padding is gone before first paint rather than removed after it. The 0.008 on `/contact/` at 1440 is the
largest CLS figure here and no before-figure exists for it, so it is recorded rather than attributed.

A like-for-like Lighthouse re-run is still owed, for the same reason P4 records.
