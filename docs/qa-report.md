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

**Three of those nine moved after this pass and the block is left as the P4 reading rather than
edited in place.** Re-measured at 1440 on 2026-10-21: `guide` is **168** (Task 1 moved the guide
template off `max-w-3xl` onto the `page` spine), `guides-index` is **168** (Task 2), and
`compare-index` is **168** (Task 6). `docs/layout-ledger.md` carries the argument for each. The six
others are unchanged.

## Two defects the sweep caught in this pass's own work

1. **axe `color-contrast`, serious, on a parked `reveal`.** First seen here as four nodes on the guide
   page at 1440, foreground `#717178`, which is no token in the system: it is `--muted` blended with
   `--bg` by a part-finished fade. A view timeline is scrubbed rather than played, so a reader who stops
   scrolling parks the animation wherever they left it, and parked body copy measured 4.03:1 against a
   4.5:1 floor.

   **The repair recorded here at the time was wrong twice, and the record is corrected rather than
   re-stated.** It read: fixed by giving `reveal` its own keyframe that finishes opacity by a third of
   the range and spends the rest on transform alone. (a) That narrowed the failing window and could not
   close it, because a reader can stop inside the first third and a scrubbed park is a state the page
   holds indefinitely. (b) The failing node is not the `--muted` body copy named above: re-measured
   parked, it is the ember `.btn-primary`, whose fill and near-black label composite against the page
   while the section is translucent, so a fix aimed only at muted text would have left the primary CTA
   failing. It reproduced on `/about/`, `/guides/` and the untouched `/compare/wordpress-vs-wix/`.

   **Closed 2026-10-21 by `d4284ff`:** `reveal-rise` animates the translate alone and carries no
   opacity, so no park position at any width can change a contrast ratio. Reproduced on a control
   rebuild and then re-measured on the fixed build in the Tasks 1-8 sweep at the end of this file; the
   control is what distinguishes "fixed" from "never reproduced here".
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

Eleven pages now, the nine from P4 plus two the hub and contact work made load-bearing: an eleven-service hub
(`/wordpress-fix/`, the widest directory, which renders a six-panel problem grid with no lead panel) and a three-service hub
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
hub (11 svc)     168    city           296    compare-index  360
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

# Guides, Knowledge Base, guarantee, About, comparisons, RealScreen and the reveal primitive (Tasks 1-8)

Run on 2026-10-21 against a production build rebuilt from clean at `a2017d8` (`npm run build`,
`route test ok: 99 routes (55 SITEMAP nodes, 37 guides, 3 compares, utility 4)`), served by
`node ./node_modules/next/dist/bin/next start -p 3401`. Not the dev server, and not an existing
`.next`.

This sweep covers the eight tasks of the guides / KB / guarantee plan: the 37 guide pages (Task 1),
the knowledge base index (2), the guarantee page (3), About (5), the comparisons index (6),
`RealScreen`'s PNG dimensions (7), and the `reveal` keyframe and the shared `Promises` block (8).
`docs/layout-ledger.md` carries the design argument for each; this file carries the measurements.

## Instrument, named before the numbers

| | |
| --- | --- |
| Driver | Playwright 1.63.0 against `/usr/bin/google-chrome` 155.0.8059.84, **not** the bundled Chromium |
| Rules | axe-core 4.14.0, injected from `node_modules/axe-core/axe.min.js`, whole document, `resultTypes: ["violations"]` |
| Settle | **1500ms** after every navigation and after every scroll, for the reason in the defects list below |
| Script | a throwaway harness at `scripts/_tmp-audit.mjs` inside the repo tree, deleted after the run. There is still no `npm run` target for axe or Lighthouse, and that is still the right thing to fix next |

Two numbers in `docs/layout-ledger.md` were re-measured here and came back 0.3% to 0.8% off the
figures the implementing tasks recorded: `/guides/` at 375 reads 7,011px against Task 2's 6,992px,
and `/about/` reads 3,426px at 1440 and 5,313px at 375 against Task 5's 3,453 and 5,340. Nothing in
either page's markup changed between the two readings, the deltas are constant across widths on
`/about/`, and the browser is not the same one. **Recorded as an instrument difference, not as a
regression**, and recorded at all because an unexplained 27px is how a real one gets missed.

## The page list

Ten routes, chosen to cover every template this plan touched plus two it did not:

| Name | Route | Why |
| --- | --- | --- |
| home | `/` | Untouched by this plan; the control for "did a shared primitive break something" |
| about | `/about/` | Task 5 |
| compare-index | `/compare/` | Task 6 |
| compare-wix | `/compare/wordpress-vs-wix/` | Untouched child of the index; reproduced the reveal bug for Task 6 |
| guides-index | `/guides/` | Task 2 |
| guarantee | `/legal/guarantee/` | Task 3 |
| guide-capture | `/guides/white-screen-of-death/` | Task 1 and Task 7: the one guide whose banner is a real capture |
| guide-nocapture | `/guides/php-fatal-error/` | Task 1: the photograph fallback, and no `errorText` either |
| hub | `/wordpress-fix/` | Eleven services, the widest directory on the site |
| service | `/wordpress-fix/white-screen/` | Shares `RealScreen` with the guides (Task 7) |

## Method: the audit is taken parked, not at rest

`.reveal` runs on `animation-timeline: view()` with `animation-range: entry 5% entry 40%`. That is a
**scrubbed** animation: its state is a function of scroll position, so a reader who stops inside the
range leaves the section parked there for as long as they stay. Sampling at rest, or at one fraction
of the document, is not a weak version of this test. It is a different test.

For every `.reveal` on every page the harness computes the exact scroll offset that puts that
element at **entry 8%, 14% and 30%** of its own range, and parks there, as well as at **0, 15%, 45%,
80% and 100%** of the document. Duplicates are collapsed, offsets outside the scrollable range are
dropped, and axe runs on the whole document at each one after a 1500ms settle.

That is **499 park positions** across ten routes and four widths:

| Route | 375 | 768 | 1024 | 1440 | Parks |
| --- | --- | --- | --- | --- | --- |
| `/` | 5 | 5 | 5 | 5 | 20 |
| `/about/` | 12 | 14 | 14 | 14 | 54 |
| `/compare/` | 8 | 8 | 8 | 8 | 32 |
| `/compare/wordpress-vs-wix/` | 11 | 11 | 11 | 11 | 44 |
| `/guides/` | 8 | 8 | 8 | 8 | 32 |
| `/legal/guarantee/` | 5 | 5 | 5 | 5 | 20 |
| `/guides/white-screen-of-death/` | 17 | 19 | 15 | 15 | 66 |
| `/guides/php-fatal-error/` | 20 | 22 | 20 | 19 | 81 |
| `/wordpress-fix/` | 14 | 14 | 12 | 12 | 52 |
| `/wordpress-fix/white-screen/` | 26 | 26 | 23 | 23 | 98 |
| | | | | | **499** |

Plus, per route, **two widths under `prefers-reduced-motion: reduce`** (375 and 1440), each audited
at rest and again at 45% of the document, and **one run at 1440 with JavaScript disabled**.

## Results

**axe-core, violations of any impact, over all 499 parks: 0.** 40 further runs under reduced motion:
0. Every impact level, whole document, not a section scope.

| Check | Result |
| --- | --- |
| axe-core, violations of any impact, 499 parks x 10 routes x 4 widths | **0** |
| axe-core under `prefers-reduced-motion: reduce`, 375 and 1440, at rest and at 45% | **0** |
| Exactly one h1 | pass, all 10 routes at all 4 widths. Also checked over HTTP on all 95 sitemap routes: exactly one `<h1>` on every one |
| No horizontal page scroll | pass, all 10 routes at all 4 widths |
| No computed `border-radius` in `main` other than 0 or 14px | pass, all 10 routes at all 4 widths, no exceptions found |
| **No element at partial opacity at any park** | pass. Across all 499 parks, no `.reveal` or `.rise-in` was ever measured between 0 and 1. That is the guarantee Task 8 bought, not a sample of it |
| Reduced motion collapses to the final state | pass. Every `.reveal`/`.rise-in` reports `opacity: 1` and `transform: none`: 5 elements on `/about/`, 4 on `/compare/`, 4 on `/compare/wordpress-vs-wix/`, 4 on `/guides/`, 3 on `/legal/guarantee/`, 5 on `/guides/white-screen-of-death/`, 6 on `/guides/php-fatal-error/`, 5 on `/wordpress-fix/`, 9 on `/wordpress-fix/white-screen/`, 0 on `/` (which uses Motion, not the CSS primitives) |
| Nothing in `main` at `opacity: 0` with JS disabled | pass on nine routes. **The home page reports 27**, see below |
| No `{{` token on screen | pass. Checked over HTTP on all 95 sitemap routes: 0 |
| Every guide renders a banner | pass. All 37 checked over HTTP: 4 serve a real capture from `public/screens/`, 33 serve the parent service's photograph, 0 serve nothing |
| Every sitemap route returns 200 | pass, 95 of 95 |

### The one real finding: the home page with JavaScript disabled

**27 elements inside `main` on `/` sit at `opacity: 0` when JavaScript is off.** Traced back to the
components by their class strings, they are four Motion islands: `ErrorPanels` (13: four panels and
their nine inner spans), `PracticeRows` (5 rows), `QuotePair` (2 figcaptions plus 2 wrappers),
`RestoredOverlay` (its h2 and lead), and 3 further `motion-reduce:opacity-100!` spans, which is 27. Each carries a
`motion-reduce:opacity-100!` escape, which covers `prefers-reduced-motion` and does nothing at all
for a page with no JS.

Three things about it, in order of importance:

1. **It is not from this plan.** `git diff --name-only 9d47e39~1..HEAD` touches no file under
   `src/components/sections/` and not `src/app/page.tsx`. The home page was never in scope for any
   of the eight tasks.
2. **It is why the template motion system is CSS-only**, which `globals.css` and the P4 entry above
   both already say. The nine inner-template routes score 0 on exactly this check, and that is the
   whole argument for `rise-in` and `reveal` being `@utility` rules rather than client islands.
3. **The earlier passes never covered it.** P4 and P5 ran this check over nine and eleven *inner*
   pages and recorded "pass"; neither list included `/`. The row above is not a regression against
   those results, it is the first time the check has been pointed at the home page. Left as a
   finding rather than fixed: the home page's islands are out of scope here, and a JS-disabled
   reader is not the reduced-motion reader those classes were written for.

## Performance: CLS on the guide with a capture (Task 7)

Measured with a Chrome DevTools trace over CDP, `PerformanceObserver` on `layout-shift` installed
before navigation, `hadRecentInput` excluded, the document scrolled to the end in 400px steps and
2000ms of settle. **Not** a Lighthouse simulated run, so these are not comparable with the
Lighthouse table earlier in this file.

| Route | `<img>` attrs | CLS @375 | CLS @1440 | CLS @375 throttled | CLS @1440 throttled |
| --- | --- | --- | --- | --- | --- |
| `/guides/white-screen-of-death/` (capture) | 2736x1536 | 0 | 0 | 0.0255 | 0.0011 |
| `/guides/php-fatal-error/` (photo fallback) | 1600x1000 | 0 | 0 | 0.0072 | 0.0023 |
| `/wordpress-fix/white-screen/` (shares `RealScreen`) | 2736x1536 | 0 | 0 | 0.0236 | 0.0214 |

"Throttled" is 150ms / 1.6Mbps / 4x CPU. Unthrottled reproduces Task 7's reported **0** exactly, on
all three routes at both widths; under throttling the worst figure on the site's money page is
**0.0255**, a quarter of the 0.1 budget. Both columns are recorded because the single figure Task 7
published is only true of the unthrottled instrument, and a reader of that number should know which
one it was.

Rendered `<img>` attributes re-derived from the served HTML and the IHDR chunks on disk: `2736x1536`
where a capture exists and `1600x1000` on the `Photo` fallback arm, which is the catalogue
photographs' real size. No route still carries the old hardcoded 1600x1000 over a capture.

## Control run: the reveal fix, reproduced before it was measured gone

A sweep that measures only the post-state cannot tell "fixed" from "never reproduced here", and a
zero taken with an instrument that has never produced a one is not evidence. So the pre-Task-8
keyframe was put back **on disk**, the site rebuilt, and the same harness run against it.

```css
/* control build only, reverted after the run */
@keyframes reveal-rise {
  0% { opacity: 0; transform: translateY(12px); }
  33% { opacity: 1; }
  100% { opacity: 1; transform: translateY(0); }
}
```

Verified in the served CSS chunk before the run, not just on disk:
`@keyframes reveal-rise{0%{opacity:0;transform:translateY(12px)}...`. It had to be a rebuild;
`page.addStyleTag` cannot override a running animation's keyframes (defect 3 below).

Same ten routes, same park method, 1500ms settle, at **768 and 1440**, the two widths this failure
has been reproduced at before. **252 parks, 11 axe `color-contrast` violations, all serious, over
142 nodes:**

| Route | Width | Park `scrollY` | Nodes | What failed |
| --- | --- | --- | --- | --- |
| `/about/` | 768 | 54 | 14 | `#what-we-do`, its lead, the twelve directory strings |
| `/about/` | 1440 | 255 | 14 | the same nodes |
| `/compare/wordpress-vs-wix/` | 768 | 239 | 31 | the comparison table, headers and cells |
| `/compare/wordpress-vs-wix/` | 1440 | 72 | 31 | the same table |
| `/compare/wordpress-vs-wix/` | 1440 | 852 | 3 | **`.btn-primary[href$="contact/"]`** in the closing band |
| `/guides/white-screen-of-death/` | 768 | 1391 | 5 | the FAQ `summary > h3` rows |
| `/wordpress-fix/` | 768 | 369 | 23 | the eleven-service directory |
| `/wordpress-fix/` | 768 | 2030 | 1 | a `.font-semibold` link |
| `/wordpress-fix/white-screen/` | 768 | 569 | 10 | the lead panels' labels and body |
| `/wordpress-fix/white-screen/` | 768 | 585 | 5 | the same panels, one park later |
| `/wordpress-fix/white-screen/` | 1440 | 218 | 5 | the same panels |

Five of the ten routes reproduced it. The five that did not are `/` (which carries no `.reveal` at
all), and `/compare/`, `/guides/`, `/legal/guarantee/` and `/guides/php-fatal-error/`, whose park
offsets at these two widths did not happen to land a failing node in range. **That is the argument
for the control in one line:** the same five clean routes, measured only post-fix, would have read
as proof of a fix that had never been tested.

**The ember `.btn-primary` is in the list.** Task 6 said the failing node was the primary button and
not the `--muted` body copy the original diagnosis named, and Task 8 repeated it; it is confirmed
here independently. A repair aimed only at muted text would have left the site's primary CTA
failing.

### The two runs side by side

| | Control (old keyframe rebuilt) | Shipped (`a2017d8`) |
| --- | --- | --- |
| Routes | 10 | 10 |
| Widths | 768, 1440 | 375, 768, 1024, 1440 |
| Parks | 252 | **499** |
| axe violations of any impact | **11, all serious, 142 nodes** | **0** |
| Distinct partial `.reveal` opacities observed | **21**, from 0.067 to 0.967 | **none: not one element between 0 and 1, at any park, at any width** |

The second row of that last line is the guarantee rather than a sample of it. With no opacity
channel in the keyframe there is no scroll position that can produce a partial composite, so the
result is not "we did not find one" but "there is nothing to find".

## Instrument defects, and the earlier evidence in this file they invalidate

These are not incidental. Two of them mean that clean results recorded earlier in this very plan
were taken in conditions that **structurally could not surface the bug they were meant to catch**.
Recorded here so the next audit does not repeat them.

1. **Auditing at rest is the one state in which a parked-contrast bug cannot appear.** `.reveal`
   runs on `animation-timeline: view()`, which is scrubbed: the element's state is a function of
   scroll position, and at `scrollY = 0` every below-fold section sits at its `0%` keyframe (axe
   skips an element at opacity 0 as not visible) while every above-fold one is past its range and
   fully arrived. There is no scroll position at rest in which a partially-arrived section is also
   measurable. **The clean axe results Tasks 1, 2, 3 and 5 recorded were taken at rest or at a
   single fraction of the document**, and they are true statements about the state they sampled and
   evidence of nothing about the parked state. Task 6 found the failure by sweeping scroll offsets;
   Task 8 closed it. Park deliberately, inside the range.
2. **`page.screenshot({ fullPage: true })` does not scroll.** Playwright captures beyond the
   viewport over CDP while `scrollY` stays 0, so every below-fold `view()`-timeline section is
   captured at its `0%` keyframe. **Every full-page capture committed in this plan before Task 6
   round 2 therefore shows below-fold `reveal` sections as absent**, and since Task 8 removed the
   opacity channel the same mistake now shows them as *present but offset by 12px*, which is much
   easier to mistake for correct. Scroll the document to the end before capturing: everything past
   its range holds its final state under `animation-fill-mode: both`. Residual artifact of doing
   so, and worth expecting: the fixed nav composites partway down the stitched image.
3. **`page.addStyleTag` cannot override a running animation's keyframes.** Chromium does not
   re-resolve a running CSS animation's keyframes from a stylesheet added after it started; the
   transform values measured identical with and without the injection. **A control run needs a real
   rebuild with the old rule on disk**, which is what the control run above is.
4. **A 300ms settle samples Motion's `whileInView` mid-flight.** At 300ms the home page reports
   `color-contrast` serious on the two `QuotePair` `figcaption`s, foreground around `#7c7c84`,
   which is `--muted` part-way through that component's spring. It is a frame, not a park, and it
   does not reproduce once the wait outlasts the animation. **Wait 1500ms.** Re-derived for this
   sweep: the home page at 768 and 1440,
   seven scroll fractions each, settling 300ms gives **2 serious `color-contrast` violations**, both
   on `figure > figcaption > .text-muted`, foreground `#66666d`; the identical 14 samples settling
   1500ms give **0**. The foreground differs from the `#7c7c84` Task 8 measured, which is the point:
   it is a different frame of the same spring, so the figure a 300ms audit reports is not even
   stable between runs.
5. **`npx tsx` resolves Windows-side on this machine**, so a temp script under the WSL scratchpad
   path dies with `ERR_MODULE_NOT_FOUND`. Keep throwaway scripts inside the repo tree, run them
   with `node` directly, and delete them after. Same reason a harness cannot `import` `playwright`
   from outside the project.
6. **`node_modules/.bin/next` is a Windows shim and is unreachable from WSL.** Use
   `node ./node_modules/next/dist/bin/next start`.

One more, from this sweep rather than from the brief: **`--muted` body copy has very little
headroom over the darker surfaces in this system.** The `QuotePair` false positive measured 4.44:1
while part-way through a legitimate fade. Nothing is failing today, but any future opacity applied
to a `--muted` block will fail for the same reason the `reveal` fade did.

## What this sweep did not measure, and why

A gap named is worth more than a figure guessed.

- **Lighthouse.** Still not runnable here: `chrome-launcher` cannot reach a browser from this WSL
  shell, which P4 and P5 both record. The 2.7s / 5.2s LCP figures in the Lighthouse table near the
  top of this file are from 2026-10-15 and have not been re-taken since Task 1 changed the guide
  template or Task 7 changed what box `RealScreen` reserves. **The next pass that can run
  Lighthouse owes that table a re-run**; do not read the CDP trace numbers above or below as a
  substitute, they are a different instrument.
- **A before-and-after CLS delta for Task 7.** Only the post-state exists, here and in Task 7's own
  report. Producing a true before figure means rebuilding with the hardcoded 1600x1000 on disk, the
  same way the reveal control was produced. It was not done, so the verdict on Task 7 rests on the
  mechanical argument that the reserved box now carries the image's real ratio, plus a measured
  post-state of 0.
- **The 33 guides on the photograph fallback were not each audited.** Two were (`php-fatal-error`
  by name, plus the hub and service pages that share the components). All 37 were checked
  mechanically for a banner and a single h1 over HTTP, which is the claim the plan makes.
- **Keyboard walkthrough.** Not re-run in this sweep; the P4/P5 result stands and nothing in Tasks
  1 to 8 changed a focus order except `/compare/`'s row anchor, whose `label-content-name-mismatch`
  exposure is covered by axe above and argued in `docs/layout-ledger.md`.
- **Legacy fixmywp.com redirects.** Still host-matched and still untestable from this host, exactly
  as the Routes section above records.
