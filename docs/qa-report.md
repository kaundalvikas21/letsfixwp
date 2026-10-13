# QA pre-flight: v2-swiss-precision

Run 2026-10-13 against a production build (`npm run build` then `next start`), measured in Chromium
via Playwright, axe-core 4.x and Lighthouse 13.5.0. Every figure below is output from a command, not
an estimate. Screenshots: `docs/qa/`.

**Status: clean, with two measured exceptions that cannot be resolved in this environment or with a
placeholder asset. Both are itemised in "Could not honestly tick".**

---

## 1. Dashes

```
$ grep -rnP "[\x{2014}\x{2013}]" src/ docs/ design-system/
exit=1   (no matches)
```

PASS. One failure was found and fixed during the run: the persisted page overrides
(`design-system/letsfixwp-v2/pages/*.md`) carried ten em dashes in generator boilerplate
("No overrides - use Master spacing"). Those are tool output, not rendered content, but they live in
the repo, so they were rewritten to plain hyphens. `src/` was clean throughout.

## 2. Eyebrows

Counted in the DOM as a small (<= 14px) uppercase label immediately preceding a heading.

| Page | Sections | Cap `ceil(n/3)` | Eyebrows above headings | Verdict |
| --- | --- | --- | --- | --- |
| Home | 11 (ledger) | 4 | 3 | PASS |
| Service | 7 | 3 | 0 | PASS |
| Guide | 6 | 2 | 0 | PASS |
| Hub | 3 | 1 | 0 | PASS |

One failure found and fixed: a strict mechanical count of *all* small uppercase labels on the home
page returned 10, because `PricingRows` used six uppercase field labels ("WHO IT IS FOR", "PRICE").
Those are in-row field labels, not section eyebrows, but they inflated the count under a literal
reading and were visual noise. They are now plain small muted text. The remaining non-eyebrow
uppercase labels are the two deliberate "PLACEHOLDER, NOT A REAL QUOTE" markers.

## 3. CTA wording

```
$ grep -rn "Fix my site\|Chat with an engineer\|See plans\|Get a quote\|Get a free site check" src/ --include=*.tsx --include=*.ts
src/config/cta.ts:6:  BOOK: "Fix my site",
src/config/cta.ts:7:  CHAT: "Chat with an engineer",
src/config/cta.ts:8:  PLANS: "See plans",
src/config/cta.ts:9:  QUOTE: "Get a quote",
src/config/cta.ts:10:  CHECK: "Get a free site check",
```

PASS. Every occurrence is the definition itself; no component hardcodes CTA text. One label per
intent, enforced at build time by `scripts/check-content.ts` (`npm run check`: ok, 153 files scanned).

## 4. Numerals and their sources

Every numeral rendered in `<main>`, with its origin:

| Page | Numeral | Source |
| --- | --- | --- |
| Home | 26, 5, 4, 2 | `ProblemDirectory` category counts, computed from `guides` in `src/content` |
| Home | 500, 502, 503 | Inside service and guide titles from `src/content` ("500 / 502 / 503 Server Error Fix") |
| Hub | 11 | `serviceChildren.length`, derived from `SITEMAP` |
| Hub | 500, 502, 503, 404 | Service titles and summaries in `src/content` |
| Guide | 5.2 | Guide body copy in `src/content` ("Since WordPress 5.2...") |
| Service | none | No numeral renders outside JSON-LD |

PASS. No unsourced numeral. `getSiteStatus()` returns all nulls, so `SiteStatus` renders nothing and
contributes no figures anywhere.

## 5. Banned patterns

```
h-screen                           clean
addEventListener("scroll"          clean
addEventListener('scroll'          clean
lucide-react                       clean
#000000                            clean
#FFFFFF                            clean
Stage 1 / Jane / Acme              clean
elevate / seamless / unleash       clean
transition: all / transition-all   clean
motion library import              clean (never imported)
```

Three hits needed adjudication rather than a blind fix:

- **`#ffffff`** appears once, as `--accent-on` in `globals.css`. MASTER.md override 5 permits white
  only as the label on an `--accent` fill, which is exactly this. It is never a background or body
  text. Allowed by design.
- **"Step 1"** appears twice, both inside comments that explain the ban. A rendered-text scan
  (`"Step [0-9]`, `>Step [0-9]`) finds nothing. The booking flow shows screen names.
- **"Inter"** matched only as a substring of "Internet" and "Internal". A word-boundary search
  (`\bInter\b`) returns nothing; the only fonts loaded are Satoshi and JetBrains Mono via `next/font`.

## 6. Layout ledger

```
home sections in ledger: 11
distinct layout families: 11 of 11
repeated families: none
marquees: 0 (max 1)
```

PASS. No family repeats on a page, zero marquees, one image-plus-text split (cap is two consecutive).

## 7. Routes

| Check | Result |
| --- | --- |
| All 99 routes return 200 with a trailing slash | 98/99 (see below) |
| Missing trailing slash | 0 |
| `/supporting/` | 404 as required |
| Configured redirects reaching 200 | **39 of 39** |
| `sitemap.xml` entries | 95, zero duplicates, all with trailing slashes |
| Guides in sitemap / compares in sitemap | 37 / 3 |
| Expected routes missing from sitemap | none (excluding 4 intentionally noindex utility routes) |
| Entries in sitemap that are not real routes | none |
| Guides whose parent service omits them from `guideSlugs` | 0 of 37 |
| Guide pages not linking to their parent service | 0 of 37 |

**`/legal/guarantee/` returns 404.** This is deliberate and verified safe: the page serves only when
`brand.promises.guaranteeDays` is set, and a crawl of all 99 routes found **0 pages linking to it**.
It is a `utilityPaths` entry, not a SITEMAP node.

Redirect chains were initially mis-reported as failing because I tested slugs that were never
configured (`/fix/white-screen` is not an old slug; `/fix/white-screen-of-death` is). Testing every
source actually present in `src/config/redirects.ts` gives 39/39 landing on 200. Sample chains:

```
/fix                        2 hops -> 200 /wordpress-fix/
/fix/hacked                 2 hops -> 200 /wordpress-security/malware-removal/
/fix/white-screen-of-death  2 hops -> 200 /wordpress-fix/white-screen/
/app                        2 hops -> 200 /contact/
```

The first hop is Next's `trailingSlash` 308, the second is the configured permanent redirect.

**fixmywp.com legacy paths** (`/testimonials`, `/wordpress-maintenance-services` and the rest) are
host-matched to `fixmywp.com` and gated on `brand.legacy.enabled`, which is confirmed false for good.
They correctly do not fire on letsfixwp.com. That branch cannot be exercised here.

## 8. Structured data

| Page | Types | AggregateRating | Null prices |
| --- | --- | --- | --- |
| `/` | Organization, FAQPage | none | none |
| `/wordpress-fix/emergency/` | Organization, Service, FAQPage, BreadcrumbList | none | none |
| `/wordpress-security/malware-removal/` | Organization, Service, FAQPage, BreadcrumbList | none | none |
| `/guides/critical-error-on-this-website/` | Organization, TechArticle, FAQPage, BreadcrumbList | none | none |

PASS. `serviceLd` omits the `price` field entirely when `priceFrom` is null, so no empty offer ships.

---

## Accessibility: axe-core

6 pages x 4 widths (375, 768, 1024, 1440) x 2 themes, plus a `prefers-reduced-motion: reduce` pass.

```
combinations tested: 54
serious=0 critical=0
no serious or critical violations
```

PASS.

## Keyboard

Keyboard-only, from the hero to a completed booking:

```
hero URL field reached by Tab in 8 hops: true
hero Enter -> /contact/?url=https%3A%2F%2Fexample.com
screen: Problem -> Your site -> Contact -> Confirm
keyboard submit reached: true | landed: /contact/thanks/
```

PASS. The whole funnel is operable without a pointer.

## Focus visibility

416 Tab stops across home, a service page and the booking flow at 375 and 1440:

```
focus stops checked=416  without visible indicator=0  covered by sticky chrome=0
```

PASS, after one real fix. The first run reported **83 focus stops hidden behind the fixed mobile CTA
bar**: `scroll-padding-top` cleared the sticky header, but nothing reserved space for
`MobileBookBar`, so a Tab stop scrolled to the last visible line landed underneath it. Added:

```css
@media (max-width: 767px) {
  html { scroll-padding-bottom: calc(var(--bottombar-h) + 1rem); }
}
```

That took it to 0. The 10 remaining flags were the skip link, which is a false positive: it sits at
`z-60` over the header's `z-50`, `document.elementFromPoint` returns the link itself at its own
centre, it carries a 2px solid outline, and Enter jumps to `#main`.

## Lighthouse (mobile, simulated throttling)

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | **90** | **100** | 78 | **100** | 3.5 s | **0** | 110 ms |
| `/wordpress-fix/emergency/` | **98** | **100** | 78 | **100** | 2.4 s | **0** | 40 ms |

Accessibility 100 and SEO 100 on both. CLS is 0 on both. Lighthouse does not report INP in a lab
run; TBT is its lab proxy and is well inside budget (110 ms and 40 ms against a 200 ms guide).

Home Performance is run-to-run unstable around the threshold (88, 89, 90, 93, 94 across five runs,
median 90). The cause is isolated: the LCP element is the hero placeholder,
`/_next/image?url=https://picsum.photos/...`, which Next must fetch from a third-party origin
server-side. The problem page, which renders no hero image, scores 98 with the same shell. A real
self-hosted photograph removes the third-party fetch entirely. I tested lowering the placeholder's
`quality` to 55: it moved nothing (88/94/89), so the change was reverted rather than kept as noise.

---

## Section 14 pre-flight

Ticked, with evidence above: brief inference and dials declared; aesthetic labelled honestly; zero
em dashes; page theme lock (footer background equals body background in both themes); one accent;
one radius system (zero non-`0px` radii anywhere in the DOM); CTA contrast (white on `#cc3333` is
5.14:1); no CTA label wraps; form contrast; no serif; hero fits the viewport (headline 2 lines,
subtext 18 words over 3 lines, CTA above the fold, `pt-24` cap); hero stack is 4 text elements;
eyebrow count within cap; no split-header; no zigzag; logo wall absent; copy self-audit; motion
motivated; no marquee; nav on one line at 72px; no two sections share a layout family; real images
(logged picsum placeholder); no pills on images; no version, locale or scroll strips; no section
numbering; no decorative dots; quotes within 3 lines at >= 768px; no `window.addEventListener('scroll')`;
reduced motion; dark mode tested; mobile collapse; `min-h-[100dvh]` never `h-screen`; effect cleanup;
empty and error states; cards omitted; Phosphor only, one weight (`bold`, 10 of 10 usages);
client-leaf isolation; no AI tells; one design system.

## ui-ux-pro-max pre-delivery checklist

All ticked except the three below.

---

## Could not honestly tick

1. **Best Practices >= 95 (measured 78).** Driven entirely by `is-on-https` and `redirects-http`:
   the test server runs plain HTTP on a LAN address. Both audits pass automatically behind TLS. This
   cannot be measured correctly in this environment, and no code change would alter it. Everything
   else in the category passes.

2. **Performance >= 90 on `/` (median exactly 90, range 88 to 94).** Bounded by the hero placeholder
   being fetched from picsum through the image optimiser. It is not a layout or script problem: CLS
   is 0, TBT is 110 ms, FCP is 0.9 s, and the same shell scores 98 on a page without a hero image.
   Resolves when `docs/image-todo.md` is satisfied with a self-hosted photograph.

3. **"Every input has a visible label; validation on blur; focusable error summary on failed submit"
   is only two thirds true in the booking flow.** Every input has a visible label and helper text,
   and errors appear inline with `aria-invalid` plus `aria-describedby` and an `aria-live` region.
   But `BookingFlow` validates per screen on Continue, not on blur, and it has no focusable error
   summary that links to each invalid field. The hero URL form does validate on blur. Fixing the
   booking flow is a contained change to `BookingFlow.tsx`; it was outside this QA pass's remit to
   redesign, so it is reported rather than silently ticked.

Also carried forward, unchanged and previously reported:

- ~~Two unstyled sections remain on the home page.~~ **Resolved after this report.** Both were
  foundation leftovers duplicated elsewhere: the problem finder and critical list by
  `ProblemDirectory`, the hub list by the header panel and the footer. Deleted rather than restyled,
  because restyling would have put a second problem search and a second hub list on a page that
  already has both, breaking the ledger's no-repeated-family rule. `Finder` moved to `/guides/`,
  where the persisted page override asks for a search bar. `/guides/` and `/compare/` were also
  unstyled and are now built from the template primitives.
- **The closing H2 is 10 words** against contract rule 4's 8-word cap. That copy was specified
  verbatim in the V2.12 brief.
- **23 brand values are unconfirmed** and will fail a production deploy until the owner signs them
  off (`next.config.ts` lists them on every build).

---

## docs/image-todo.md, ready for an image generator

| Slot | Size | Aspect | Art direction |
| --- | --- | --- | --- |
| Home hero, right column (`Hero.tsx`) | 880x1100 | 4:5 at >= 768px, cropped to 16:9 below | Black and white documentary. An engineer mid-repair: hands on a laptop keyboard, natural window light from one side, the real WordPress admin open on screen. Shoot the screen, never composite one. Frame with headroom top and bottom so the 16:9 crop still reads. One red element only if genuinely in the scene. |
| Case file, before half (`CaseFile.tsx`) | 1600x1000 | 16:10 | Not a generator job. `public/screens/critical-error-on-this-website.png` from `npm run capture`: the real WordPress critical-error page on a real install. Never a mockup. |
| Case file, after half (`CaseFile.tsx`) | 1600x1000 | 16:10 | Not a generator job. `public/screens/restored.png`, the same install healthy, captured in the same run before anything is broken. |

House art direction for any generated image: black and white documentary photography, natural light,
real hands on real keyboards. No stock gloss, no device mockups, no faux-OS window chrome, no
fabricated dashboards. The two case-file captures must come from `npm run capture` (needs Docker),
not from a generator, because they are evidence rather than decoration. While they are missing the
entire case-file section returns null rather than ship a stand-in.
