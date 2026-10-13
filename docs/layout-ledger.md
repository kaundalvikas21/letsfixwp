# Layout ledger

One row per section, recorded before coding (docs/section-contract.md rule 3). One table per page per variant.

<!-- Template:
## <variant> / <page>

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
-->

## v2-swiss-precision / global shell

Chrome, not page sections: these render on every route, so each layout family here is spent for the
whole variant and no page section may reuse one.

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| S1 | SiteHeader | Sticky bar, 72px, wordmark left / nav right | no | no | BOOK (md and up) |
| S2 | SiteNav panel | Full-width dropdown panel under the bar | yes (1: "What we fix and build") | no | none |
| S3 | MobileBookBar | Fixed bottom bar, under 768px only | no | no | BOOK |
| S4 | ChatLauncher | Docked square launcher, bottom right | no | no | CHAT |
| S5 | SiteFooter | Multi-column link tree (still unstyled) | no | no | CHAT, CHECK |

Eyebrows so far: 1. Marquees: 0. Consecutive image-plus-text splits: 0.

## v2-swiss-precision / home

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | Left-aligned text with tall right image, 7/5 of 12 | no | no | BOOK (form submit), CHAT (text link) |
| 2 | FactStrip | 4-column fact strip, one top border, no cards, no icons (2x2 below 768px) | no | no | none |
| 3 | ProblemDirectory | Grouped directory columns, 3 at lg / 2 at md / disclosure items below 768px | yes (1: "Problems we fix") | no | none |
| 4 | HowItWorks | Horizontal verb row, 4 columns, one rule above all four (vertical list, verb left, below 768px) | no | no | none |
| 5 | ComparisonMatrix | Comparison matrix, real table, our column highlighted, sticky row header + wrapper scroll below 768px | no | no | BOOK |
| 6 | CaseFile | Before/after compare slider (8) plus short narrative (4); stacked below 768px | yes (2: "Case file") | no | none |
| 7 | PricingRows | Horizontal pricing rows, not cards; divide-y between rows, native disclosure per row | no | no | BOOK x2, PLANS |
| 8 | Quotes | Single oversized quote, second smaller quote offset to column 6 | no | no | none (text link to reviews) |
| 9 | Safeguards | Definition list in two columns (dl/dt/dd) | yes (3: "Your site is safe with us") | no | none |
| 10 | Faq | Two-column FAQ: heading plus CHAT left, disclosure group right | no | no | CHAT |
| 11 | ClosingCta | Typographic closing statement plus the hero's URL form | no | no | BOOK |

Eyebrows on this page: 3 section eyebrows of a permitted ceil(11 / 3) = 4.
A strict mechanical count of uppercase micro-labels is 10, because PricingRows uses six uppercase
field labels and Quotes carries two placeholder markers. See the V2.12 pre-flight report.
Marquees: 0.
Image-plus-text splits in a row: 1. Layout families spent: left-text / tall-right-image, 4-column fact strip,
grouped directory columns, horizontal verb row, comparison matrix, before/after slider plus narrative, horizontal pricing rows, single oversized quote, two-column definition list, two-column FAQ, typographic closing statement.
Below 768px the hero's right column becomes a full-bleed 16:9 band under the form.
The hero draws no bottom border: the strip's top border is that single rule between them.
The strip renders only confirmed promises, so it shows 3 of its 4 slots until `brand.promises.guaranteeDays` is set.
The directory groups guides by SITEMAP hub (contract rule 16). Hubs with no guides are not problem
categories and render nothing, so 4 of 6 hubs appear: 26, 5, 4 and 2 problems.
HowItWorks quotes brand.promises for its Approve and Repair copy, so those claims sit under the
same production gate as the fact strip rather than being a second, separate promise.
ComparisonMatrix draws every cell in our column from brand.promises for the same reason, and its
guarantee row is omitted while brand.promises.guaranteeDays is null: an empty cell in our own
column would read as a no. The other three columns are categories, never named companies.
Its scroll wrapper carries `contain: paint`; removing that makes the whole page scroll sideways.
CaseFile renders null until public/screens/critical-error-on-this-website.png and restored.png both
exist (`npm run capture`, needs Docker). It is built and verified but does not appear on the page yet.
PricingRows reads priceFrom, typicalTurnaround, whoItsFor and deliverables from src/content/services.
Every priceFrom is null, so the price cell shows "On quote" (the quoteFlow promise restated); every
typicalTurnaround is null, so that column renders nothing at all. The care plan's included-fix line
is driven by brand.promises.carePlanIncludedFix and is absent while that is null.
Quotes renders the placeholders in src/content/testimonials.ts, each carrying a visible "Placeholder,
not a real quote" marker, which is what that file requires of any variation that renders them.
brand.promises.testimonials blocks a production deploy until real consented quotes replace them.
The lead quote holds 3 lines from 768px up; at 375px it wraps to 6, because 25 words cannot fit
three lines of oversized type in 327px at any readable size.
Safeguards renders one pair per registered brand promise; a null promise renders no pair, so the
guarantee pair and its link to /legal/guarantee/ are both absent while guaranteeDays is null.
That page now reads brand.promises.guaranteeDays and 404s while it is null, so the link can never
point at a dead route. Verified both ways: with a guarantee set, the pair renders and the page 200s.
Faq composes all six answers from registered brand promises and feeds the same array to faqLd(),
so the FAQPage JSON-LD can never drift from what the page shows. A null promise drops its question.
ClosingCta reuses HeroUrlForm with location="home:closing" and chat={false}: one component, one
label, one CTA label, one validation rule, because it is the same intent.
SiteFooter is theme locked to --bg with a single --line top rule (taste 4.11). Its guarantee link
is gated on brand.promises.guaranteeDays and the email is plain text until it is confirmed.

## v2-swiss-precision / templates (P1)

Templates share one furniture set in `src/components/templates/parts.tsx`. None of these families is a
home-page family: the home page keeps the hero split, the fact strip, the grouped directory, the verb
row, the comparison matrix, the before/after slider, the pricing rows, the oversized quote, the
two-column definition list, the two-column FAQ and the typographic closing statement.

| Template | Layout families used | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- |
| Service | Stacked bands, 8/4 body grid with sticky rail, symptom checklist, labelled steps | no | no | node intent + CHAT |
| Guide | Stacked bands, mono error block, caution panel, ordered checks | no | no | BOOK, CHECK, CHAT |
| Hub | Stacked bands, two-column service rows | no | no | node intent + CHAT |
| City | Stacked bands, service rows, remote-delivery definition list | no | no | QUOTE + CHAT |
| CityHub | Stacked bands, four-column city index | no | no | QUOTE + CHAT |
| Compare | Stacked bands, verdict definition list, neutral 3-column criteria table | no | no | compares intent + CHAT |
| Free site check | Lead magnet: benefit hero, covers checklist, minimal form | no | no | CHECK (submit) + CHAT |
| Case studies | Composed empty state | no | no | CHAT |
| Pricing | Grouped compact index, price column | no | no | BOOK + CHAT |
| About | Stacked bands, how-we-work definition list | no | no | node intent + CHAT |

Zero eyebrows across every template, so the eyebrow cap is a home-page concern only.

The compare table is deliberately NOT the home comparison matrix: no highlighted column, no accent
top rule, no marks, because on that page we are not one of the two options being compared.

The service rail needs the body grid to be its containing block. Scoping it to the hero block gave it
126px of travel against a 3000px article, which is not sticky in any useful sense; the body and the
rail now share one grid and the card pins at nav height through the whole article.

## v2-swiss-precision / booking (P2)

| Screen | Contents | Validation |
| --- | --- | --- |
| Problem | Searchable select over matchProblem() plus "Something else"; textarea; budget and timeline on the project tab | description required when no service is picked; budget and timeline required for project |
| Your site | Site address, host (optional), access method (secure link is the default) | site address parsed with the one shared rule |
| Contact | Name, email, phone (optional), preferred contact method | phone required only when phone is the chosen method |
| Confirm | Summary, price or "Quote before work begins", guarantee line when set, handoff | whole booking re-parsed before submit |

Progress is the four screen names with aria-current="step", never "Step 1 of 4": contract rule 6 bans
numbered step labels, and the ui-ux-pro-max Progress Indicators row suggests exactly that, so the row
is overridden here.

Two tabs on /contact/ are real links (routes.book() and routes.quote()), not a JS tablist, so each is
a shareable server-rendered URL and switching never destroys the other tab's draft.

State is a reducer mirrored into sessionStorage under booking-draft, so Back and a reload are both
lossless. The draft is cleared only after a successful submit.

src/lib/booking.ts holds the handoff adapter. The email adapter is the default and needs no account;
Razorpay, Stripe Checkout or Cal.com drop in behind the same interface once
brand.promises.bookingProvider names one.

The Continue and submit buttons carry distinct React keys. Without them React reconciles them into
one <button> node and flips type="button" to type="submit" mid-click, submitting a screen early.

## v2-swiss-precision / live chat (P3)

`src/lib/chat/providers.ts` holds four vendor adapters (Crisp, Intercom, Tawk, Chatwoot). Each knows
only how to inject its script, open its panel, hide its own bubble and attach our context. Nothing
else in the codebase names a vendor.

`src/lib/chat/index.ts` picks one from `NEXT_PUBLIC_CHAT_PROVIDER` plus `NEXT_PUBLIC_CHAT_ID` (and
`NEXT_PUBLIC_CHAT_BASE_URL` for a self-hosted Chatwoot). Set them in `.env.local`: a shell variable
passed to `npm run build` is NOT inlined, which was measured, so the env file is the supported path.

The vendor script is never in the critical path. It loads on the first launcher click, or earlier in
a requestIdleCallback once the page is interactive. Measured with a provider configured: zero vendor
requests at `load`, first request at +225ms once the browser went idle.

Context attached to the session: page path, problem slug (prop or ?service=/?guide=), and the site
URL only when the visitor typed it (?url= or their own booking draft). Never a guessed URL.

Fallback: when no provider is configured, or the script is blocked or times out at 8s, openChat()
dispatches CHAT_FALLBACK_EVENT and the launcher opens a native <dialog> carrying BOOK and
brand.email. Escape closes it and focus returns to the launcher, both verified.

getSiteStatus() still returns nulls. Crisp and Chatwoot expose operator availability over REST,
Intercom exposes admin away status and Tawk has no public endpoint, but all of them need a server
API key the owner has not issued. No "online" indicator renders anywhere until one does.

Launcher clearance, measured: bottom 820 against a bar top of 835 at 375px and 767px, a 15px gap,
including on /contact/. It never overlaps the booking form's buttons at 375, 768 or 1280.

## v2-swiss-precision / collection indexes (post-QA)

| Page | Layout families | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- |
| /guides/ | Search hero (Finder), single directory band with hairline-separated groups | no | no | BOOK, CHAT, CHECK (no-match only) |
| /compare/ | Stacked bands, two-column comparison rows | no | no | compares intent + CHAT |

Both were foundation leftovers missed by P1, which briefed the guide and compare *item* templates but
not the two collection indexes. `/guides/` follows its persisted override
(design-system/letsfixwp-v2/pages/guide.md: "Hero with search bar > Popular categories > ... > CTA").

`Finder` lives on /guides/ and nowhere else. It was on the home page until the home directory section
made it redundant; two free-text searches on one page would split the problem_search signal between
them, and the duplicate hub list did the same to internal links. Both were deleted from the home page
rather than restyled.

The guide groups sit inside ONE band separated by hairlines, not one band each: sixteen full bands
for groups of two or three guides left the page mostly air.

## v2-swiss-precision / imagery placed on service pages

| Where | Family | Source | Alt |
| --- | --- | --- | --- |
| Home hero, right column | Tall 4:5 image beside left-aligned text | `/site_images/hero-console-bg.jpg` | Written, describes the screen |
| 32 service pages | Same 7/5 hero: h1, summary and CTA left, 4:5 photograph right | `/site_images/services/<photo>.jpg` via `servicePhotos` | Empty, the photograph is decorative |
| 6 hub pages | Same 7/5 hero: h1 and lede left, 4:5 photograph right, no CTA | `/site_images/services/<photo>.jpg` via `hubPhotos` | Empty |
| 37 guide pages | In-body 16:10 figure, 1px `--line` border, renders nothing today | `/screens/<slot>.png`, absent | Written, kept for the capture |

The 7/5 hero family is now spent three times: home, service and hub. That is deliberate reuse of one
family across page *types*, not repetition within a page, which is what contract rule 4 counts. The
service and hub heroes replaced a bare h1 block, so no section was added.

`RealScreen` carries both shapes behind a `hero` flag: the 4:5 box above, the bordered in-body figure
below. Captures keep the figure, which is the shape a screenshot wants.

Every photograph is 16:10 and the hero box is 4:5, so the crop keeps only the middle half of the
width. `photoFocus` in `src/content/service-photos.ts` holds the frames whose subject sits outside
that middle half; `emergency` is held left or the laptop and hands crop out entirely.

The photographs repeat on purpose, eleven across thirty-two services, grouped by the kind of work
(racks for every migration, store for every storefront). A page is never framed in browser chrome
around a photograph, which would read as a screenshot the contract bans.
