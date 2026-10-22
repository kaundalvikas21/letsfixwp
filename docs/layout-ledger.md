# Layout ledger

One row per section, recorded before coding (docs/section-contract.md rule 3). One table per page per variant.

<!-- Template:
## <variant> / <page>

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
-->

## v3 / global shell (every page)

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 0 | SiteShell: floating glass pill nav (md+), top bar + fixed bottom action bar (<768px), problem command palette | shell (not counted against page layout families) | no | no | BOOK (nav, bottom bar, palette footer with the highlighted problem's slug), CHAT (bottom bar icon, palette no-match) |

## v3 / home

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | split with overlapping offset image (6/6 at lg, image overlaps next section by 48px) | no | no | BOOK, CHAT |
| 2 | Built on | static logo grid (4x2, 2 columns under 768px; no marquee in v3) | no | no | none |
| 3 | What we fix | bento grid, 7 cells (4x3 at lg, 2 columns at md, 1 column below) | yes ("What we fix") | no | none (cells link to problem pages; cell 7 opens the problem palette) |
| 4 | Four moves | tabbed showcase (Radix Tabs, sliding pill; panel = text 5 / image 7 at md, stacked below; tabs scroll-snap under 768px) | no | no | none |
| 5 | Prevent the next one | interactive toggle comparison (radio pill toggle with sliding thumb; card = content left, photo right at md) | yes ("Prevent the next one") | no | BOOK or PLANS, following the toggle |
| 6 | Pricing | pricing tiers with billing toggle (3 tiers, care plan centre at 1.04 with accent ring; scroll-snap cards under 768px, care plan first) | no | no | PLANS (care plan), BOOK (one-time fix), BOOK with service=malware-removal (cleanup) |
| 7 | Quotes | masonry of quote cards (CSS columns 2 at md, 3 at xl; heights by content; no carousel) | no | no | none (third card links to case studies) |
| 8 | Security | grouped icon list (3 groups x 2 items; group label 3 cols, items in 2 columns; one soft divider between groups) | yes ("Security") | no | none |
| 9 | Guarantee | centered manifesto card (large numeral, H2, one sentence, text link). Renders nothing until brand.guarantee is set | no | no | none (text link to /legal/guarantee/) |
| 10 | FAQ | searchable accordion inside a card (labelled filter input above 6 Radix accordion items; filtered-out items leave with layout animation; composed empty state) | no | no | CHAT (empty state only) |
| 11 | Final CTA | gradient panel (the one gradient on the site, static radial green mesh; centred) | no | no | BOOK, CHAT |

Note for section 2: the hero photo hangs 48px into it at lg, so its first row needs at least 48px of clear space on the right half.

Eyebrow budget for this page: 11 sections, so ceil(11 / 3) = 3 eyebrows allowed, and 3 are used (sections 3, 5 and 8).
Two unstyled foundation sections ("Site down or hacked right now", "What we do") sat after the final CTA until the
QA pass; they duplicated the bento and the footer and were removed, which is what brings the page to 11 sections.

## v3 / service template (/<hub>/<service>/)

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | split with a content-height portrait photo frame | no | no | node intent, CHAT |
| 2 | Lead statement (summary, then "Who this is for") with the conversion rail: in flow under 1024px, sticky beside the lead column from lg | lead column with conversion rail | no | no | node intent, CHAT (rail, lg only) |
| 3 | Does your site show this? (fix intent only) | icon-marked tick list | no | no | none |
| 4 | What we do | bento grid, spans varied per item count | no | no | none |
| 5 | What you get | tinted outcome panel, statement stack | no | no | none |
| 6 | Errors we fix here | link rows | no | no | none |
| 7 | Questions | plain disclosure list | no | no | none |
| 8 | Related | chip row | no | no | none |
| 9 | Closing | split band (text left, buttons right) | no | no | node intent, CHAT |

Eyebrow budget for this page: 9 sections on a fix page, so ceil(9 / 3) = 3 eyebrows allowed, and 0 are used.
A plan or project page drops row 3 and runs 8 sections, so ceil(8 / 3) = 3 allowed, and 0 used. No row repeats a
layout family. Marquee is `no` on every row: v3 has no marquee anywhere. Only row 1 is an image-plus-text split,
so the 2-consecutive-splits limit is never approached.

Hero carries no subtext: the shortest service field is 25+ words, over the contract's 20-word hero cap, so
service.summary renders as the lead statement below the hero.

Row 2 carries `whoItsFor` as a definition row under the summary, which is why row 3 is now fix-only. Before this
pass a ternary showed `symptoms` on the 15 fix services and `whoItsFor` on the other 17, so each field was dead
on the pages of the other intent; `whoItsFor` is written for all 32 and now renders on all 32.

Row 1's photo frame takes its height from the title block at lg (`lg:h-full lg:min-h-[26rem]`) rather than a
fixed ratio, which is what keeps it off the hub hero's `aspect-[4/3]` box. Its resting elevation is `shadow-card`:
`--shadow-lift` is the hover shadow in MASTER and the frame is not interactive.

Row 3 is the page's only icon-marked list, which is why row 5 stopped being a tick list: deliverables are
outcomes and now carry the weight of a panel instead.

The conversion rail (`FactRail` in `src/components/templates/parts.tsx`) is one DOM node at every width, not two.
From lg it is the sticky rail beside the lead column, carrying the page title, its CTA pair, then the guarantee
and the gated brand claims. Under 1024px the same node falls into normal flow between Related and the closing
band as a reassurance panel: CSS hides the title and the CTA pair there, because the global fixed bottom bar is
the persistent CTA below lg, so what appears is the guarantee and the claims and nothing else. It is still row 2's
layout family rather than a row of its own, because it is the same node in the same component with the same
content; what changes is where the grid puts it. `typicalTurnaround` and `priceFrom` are null on all 32 services,
so no number is shown; a fact row appears automatically if either is ever filled in (contract rule 8).

## v3 / guide template (/guides/<slug>/)

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | document header with the urgency badge and the diagnostic panel | no | no | none |
| 2 | Capture | device frame (renders only when the capture exists) | no | no | none |
| 3 | What you are seeing, with the conversion rail beside the whole body column | lead column with conversion rail | no | no | node intent, CHAT (rail, lg only) |
| 4 | What usually causes it | cause tiles with an inline cause-to-check diagram | no | no | none |
| 5 | Safe things to try first | numbered procedure with a warning note | no | no | none |
| 6 | When to call us | prose with inline CTA row | no | no | BOOK (parent service), CHAT, CHECK |
| 7 | Questions | plain disclosure list | no | no | none |
| 8 | More errors | link rows | no | no | none |

Eyebrow budget for this page: 8 sections, so ceil(8 / 3) = 3 eyebrows allowed, and 0 are used. A guide with no
capture in public/screens/ drops row 2 and runs 7 sections, so ceil(7 / 3) = 3 allowed, and still 0 used. No row
repeats a layout family. Marquee is `no` on every row. This template carries no photography at all, so it has zero
image-plus-text splits and the 2-consecutive-splits limit cannot be reached.

Row 1 replaces the bare mono strip with `DiagnosticPanel` (`parts.tsx`): the literal message on `--surface-2` at
12px with a 1px accent left rule, labelled so it is clear the text is what WordPress prints rather than our words.
`errorText` is optional and 17 of the 37 guides have none (measured: 20 have it, 17 do not), so on those the panel
carries the guide's first symptom in plain type instead, under its own label, and row 3 then lists `symptoms`
from the second onwards. Nothing is printed twice and the panel is never an empty box. Every guide has at least
four symptoms, so the shortest list row 3 can show is three. A 1px rule, not a thick one: the craft floor refuses a
coloured left border above 1px.

Row 3 reuses `FactRail` rather than adding a second rail: one DOM node, sticky beside the body column from lg with
the guide title and its CTA pair, and in flow after row 8 below lg with the guarantee and the gated claims only,
because the fixed mobile bar is the persistent CTA there. The template's container widens from `max-w-3xl` to the
shared `page` width to make room for it; the body column stays at `lg:col-span-8` and every text block keeps a
68ch measure, so the reading line does not get longer.

Row 4 adds `CauseFlow` (`parts.tsx`): an inline SVG, geometry only and no words, showing several causes converging
on one failure and the same short set of safe checks leading out of it. It is `aria-hidden` and sits in a `figure`
whose visible `figcaption` states the same relation as a sentence, so the information is text for a screen reader
and the cause tiles and row 5's procedure remain the actual content.

Row 5 keeps bare numerals on an `<ol>`: `safeChecks` is an ordered procedure of 2 to 3 items, and contract rule 6
bans the words "Step 1", not an ordered list.

Breadcrumbs come from `nodeCrumbs(routes.guides)` plus the guide itself, instead of a hand-written Home and
Knowledge Base pair, so the crumb titles follow SITEMAP and the trail inherits the shared 44x44 target.

## v3 / hub template (/<hub>/)

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | single-column title block with lead and CTA pair, no visual | no | no | node intent, CHAT |
| 2 | Which of these is your site doing | varied-span bento of symptom cards (bentoSpans) | no | no | none |
| 3 | Most urgent problems | ranked list in one panel, severity badge per row | no | no | none |
| 4 | Not sure which one | left-aligned prompt band, one button | no | no | CHAT |

Eyebrow budget: 4 sections, ceil(4 / 3) = 2 allowed, 0 used. No marquee. No image-plus-text splits at all.

Row 2 reads the real intent mix of each hub. Measured: wordpress-fix 11 fix; wordpress-security 3 fix, 1 project; woocommerce 1 fix, 3 project; wordpress-maintenance 3 plan, 1 project; wordpress-performance-migration 3 project; wordpress-development 6 project. `symptoms` is empty on every non-fix service (serviceSchema refine), so a card shows its first three symptoms when it has them and otherwise its `summary`, `whoItsFor` and the first three `deliverables`. The heading follows: "Which of these is your site doing?" only when at least one card has symptoms, "Pick the work that fits" when none does. Row 3 renders only when the hub has guides (4 of 6 do: maintenance and development have none). It ranks by `Guide.urgency` and shows the urgency in words plus an icon (`UrgencyBadge`), never colour alone. The hero drops the photograph and carries no visual (contract rule 4 allows text plus CTA): the old hub photographs were reused frames, several dark, against the bright-daylight direction in MASTER, and an index panel only repeated the grid. `hubPhotos` is removed, so hubs carry no photo data. Row 4 replaces a closing band that repeated the node title and both hero buttons.

## v3 / city template (/wordpress-development/cities/<city>/)

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | narrow document header | no | no | QUOTE, CHAT |
| 2 | Local context | prose column | no | no | none |
| 3 | What <city> clients ask for | link rows | no | no | none |
| 4 | How working with us runs | three labelled fact tiles | no | no | none |
| 5 | Questions | plain disclosure list | no | no | none |
| 6 | Closing | split band | no | no | QUOTE, CHAT |

## v3 / compare template (/compare/<slug>/)

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | document header with lettered A/B chips | no | no | none |
| 2 | Which one fits | verdict bento (2-up when the verdicts are near-equal length, odd last card spans the row) | no | no | none |
| 3 | Side by side | real comparison table, lettered and ruled column heads | no | no | none |
| 4 | Closing | split band | no | no | collection intent, CHAT |

Four sections, so ceil(4 / 3) = 2 eyebrows allowed and 0 used. No image-plus-text split. The rows are free prose with
no yes/no field, so the table carries no tick or cross icons (that would mean inventing data); A and B are told
apart by a letter plus a coloured rule, never by colour alone. Breadcrumbs already come from the shared primitive.

## v3 / standalone pages

| Page | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- |
| /free-site-check/ | lead magnet: preview panel left, form card right | no | no | CHECK (form submit), CHAT |
| /case-studies/ | composed empty state card | no | no | BOOK, CHAT |
| /pricing/ | scope and outcome: three unequal tier cards, outcome rows per tier, a real comparison table, a disclosure FAQ and a split closing band | no | no | BOOK, PLANS, QUOTE, CHECK, CHAT |
| /about/ | company document: a hub bento, ruled engagement rows, a grouped practice list, a city chip row and a closing band, with the shared rail beside the body | no | no | BOOK, CHAT |
| /guides/ | urgency-grouped error cards under a search panel, then a service chip row and a closing prompt band | no | no | BOOK, CHAT, CHECK |
| /compare/ | stacked full-width comparison cards, each with A/B chips, summary and the criteria compared | no | no | BOOK, CHAT |
| /wordpress-development/cities/ | link rows | no | no | QUOTE, CHAT |

The booking form (src/app/contact/BookingFlow.tsx) is shared by /free-site-check/ and /contact/, so it carries one
v3 style: 12px inputs on --line-strong, 44px targets, a step progress bar, and inline errors under each field.

/guides/ is one page of four blocks, which is why its single layout-family cell reads as a list: a document header
holding the search panel, the catalogue, the chip row and the closing band. Four blocks, so ceil(4 / 3) = 2
eyebrows allowed and 0 used, no marquee, no image-plus-text split anywhere on it.

The catalogue groups by `Guide.urgency`, not by parent service: urgency is the only ranking signal in the guide
data and someone reading this page may be down right now. Measured distribution: 20 critical, 13 high, 4 standard.
Each group is a labelled subsection of the one catalogue block (three groups of the same card, as the home page's
security section is three groups of the same row), so the page does not use one layout family three times. The
parent service stays on every card as a plain secondary label, and the chip row that follows links all 17 services
that have guides, which is where the old per-group "How we fix these" links went. Cards carry the error text and
the first symptom as well as the title, so an error can be recognised without opening it; the mono error line sits
at the card foot with `mt-auto`, so it lines up across a row and a card without error text simply ends sooner.
Groups run two up (two equal cards a row is allowed; rule 6 bans three), and an odd last card spans the row rather
than leaving half a row empty, which is the rule the hub grid already follows. No bento: the cards are uniform in
shape, and Task 2 found that manufacturing asymmetry over uniform content only invents cells the text cannot fill.

The search is the site's own command palette (`SearchTrigger` from `ProblemSearch`, wired at shell level), in a
panel at the top of the page, not a second filter written for this page: the override asks for a prominent search
and for help controls to stay in consistent places, and a page-local field would split the problem_search signal
between two inputs. Its empty state is the palette's own composed no-match state with CHAT. Without JavaScript the
trigger does nothing, and the whole catalogue is still on the page underneath it, so the page degrades rather than
breaking.

/pricing/ is one page of six blocks: a document header, the three tier cards, the outcome rows, the comparison
table, the FAQ and the closing band. Six blocks, so ceil(6 / 3) = 2 eyebrows allowed and 0 used, no marquee, and
no image-plus-text split anywhere, because the page carries no photography at all. Nothing is logged to
image-todo: the page is not waiting on a photograph, and its one visual decision is typographic.

The page has no prices. Every `priceFrom` is null on all 32 services and every value in src/content/pricing.ts is
null, so the old 32-row list had an empty right-hand column on every row. Rule 8 renders nothing for a missing
number, and the whole page is built so that the number is the only thing missing: the price slot states that the
work is quoted before it starts, and prints `From <price>` the moment src/content/pricing.ts publishes one. No
figure here is invented, derived or placed as a placeholder. MASTER.md:222-225 asks for a monthly/annual toggle;
rule 8 wins while both plan prices are null, because a toggle between two blanks is worse than no toggle, and
`PlanPrice` already encodes exactly that: it renders itself, toggle included, only when both prices are published.

Tiers come from `Service.intent`, which is the taxonomy the content already has: 15 fix, 3 plan, 14 project
(measured 2026-10-22, no `info` service exists). Each tier is shown through the service that is its entry point,
named on the card and in the table column, so no card claims to cover all 15 or all 14 at once: `emergency` for
the fix tier, `care-plans` for the plan tier, `website-design` for the project tier. The fix tier is called
"One-time fix", the home page's own wording, rather than "emergency fix", because 15 services sit under it and
`email-not-sending` and `elementor-issues` are not emergencies. Rule 6 bans three equal cards in a row and the
cards follow the home precedent for that: the centre tier is ringed in the accent and scaled 1.04 at md, with
`md:order` putting the care plan first in DOM order where the cards scroll. The ring never carries that emphasis
on its own (rule 9): the card always shows a badge, reading "Ongoing", which is simply what a care plan is, and
"Best value" only once `planIsBestValue` is set, because a ranking needs published prices behind it. It keeps
`shadow-card` at rest;
`--shadow-lift` is MASTER's hover shadow (MASTER.md:99,204) and using it at rest was a review finding on Task 1.

All 32 services stay on the page as links, grouped under their tier instead of under their hub, and each row now
carries its first deliverable, which is the outcome that row is selling, plus its own `priceFrom` and
`typicalTurnaround` when either is published. Hub grouping and `hubLead` move off this page: the hub pages
themselves lead with that paragraph, and the tier is what someone comparing prices is actually choosing between.

The comparison table is the one MASTER asks for between the cards and the FAQ, and `deliverables` is its data.
Rows are criteria, so each cell is real written content: whoItsFor, the `whatWeDo` verbs in the order the work
happens, the full deliverables list, and how the work is billed. That last row reads per the anchor and nothing
wider: "Per month" is what care-plans.summary calls the plan, and an annual option is named only once
`planAnnual` is published, so the page never states a billing option no content backs. Typical turnaround is a row that appears only
once an anchor publishes one. It does not repeat the price: the cards carry the price slot, and repeating it here
would be a second treatment of the same gated value.

The FAQ reuses the mechanism from the home `Faq` section rather than new copy: seven questions referenced by
service id and exact question text, resolved from the content files, so rewording a question fails the build
instead of letting the two drift. It renders through `Faqs` (parts.tsx), the plain disclosure list, and emits
`faqLd` beside the page's `breadcrumbLd`. Two pricing questions in the content are left out, for a reason each:
care-plans "What is the difference between Basic, Pro and Business?" names three tiers this page does not
itemise, and maintenance-woocommerce "Where can I see plan prices?" answers "ask us", which on the page someone
opened to see prices is the page deflecting the question it exists to answer.

Four strings in the service content used to say this page lists plan tiers, plan prices or hour blocks, which it
does not and cannot while that data is null. They render on three service pages, not here, so the fix was in the
content: care-plans deliverable 5 and its tier FAQ, maintenance-woocommerce "Where can I see plan prices?" and
support-hours "Do unused hours expire?" were each reduced to the minimum statement that is certainly true, with
no causal explanation and no new promise attached, so none of them turns false when real prices land. Two
consequences here: the care-plans deliverable is no longer circular, so it needs no exclusion and renders in the
comparison table like any other (the card shows the first four of five, so it appears in the table only), and
support-hours "Do unused hours expire?" became a usable pricing question and is now one of the seven.

`PlanCompare` is not reused: it is a two-mode fix-versus-plan toggle built around two photographs, and this page
needs a three-way comparison and carries no imagery, so the table carries it instead.

No `FactRail` here, and so no second treatment of `brand.guarantee`: the rail is one DOM node built for a page
whose body runs in a lead column, and this page is full-width cards and a full-width table. The guarantee stays
on the service and guide templates, where the rail already renders it with its placeholder disclosure.

/about/ is a company page, not a team page. There are no people, names, roles, bios or headshots anywhere in the
repo, so nothing here describes a person, and the SITEMAP title (`About / Team`) is now `About`, which is also
what the footer and the breadcrumb print. Six blocks: a document header, the hub bento, the engagement rows, the
practice list, the city chips and the closing band, so ceil(6 / 3) = 2 eyebrows allowed and 0 used. Marquee is
`no`. The page carries no photography, so it has zero image-plus-text splits and the 2-consecutive limit cannot
be reached; the three frames now referenced by nothing are all `tone: "red"`, which MASTER.md:39 locks out of v3,
so none of them is a candidate and nothing is logged to image-todo.

No two blocks share a layout family: cards (the hub bento), full-width label rows (the engagement list), a
grouped icon list two items to a group (the practice list), a pill chip row (the cities) and a split band
(closing). The rail is not a sixth family; it is the one `FactRail` node, in the aside beside the body column
from lg and in flow below it, which is the arrangement the service and guide templates already use.

Block 2 replaces the `LinkRows` of the six hubs, which was the third appearance of that divided-row pattern
across the in-scope pages and showed `hubLead` only as a one-line summary. The cards print the whole paragraph
and `bentoLayout` sizes them: measured on the six real `hubLead` lengths (217 to 262 characters) the ratio is
1.21, under the 1.4 uniform threshold, so this grid is a plain 2-up of three rows rather than invented
asymmetry, which is the finding Task 2 recorded. Spans map through a literal class record, because Tailwind v4
never sees a computed `md:col-span-${n}`. The whole card is the link, with the title as its accessible name and
the hub-page fallback for browsers without `:has()` so focus is never invisible.

Block 3 fixes a live rule 6 violation. `remoteDelivery` has exactly three items and they rendered as three equal
bordered cards in a row, which rule 6 bans outright. They are now full-width rows, a phase name in a label
column and the sentence beside it, so the page has no row of three cards at all and block 2 keeps the card
family to itself. Phase names only (Meetings, While we work, Handover): no "Step 1" or "Stage 2" label, and no
numerals, because the three phases are not a procedure the reader performs. The same three items still render as
three equal cards in `CityTemplates.tsx`, on the eight city pages, which is outside this page's scope and is
left for the fix wave.

Block 4 is the security practice, now read from `src/content/notices.ts` rather than hardcoded: six items in
three groups, each item either a claim gated in `brand.claims` or a published deliverable. The home page's
`Security` section renders the same data in its own three-column group layout; this page renders it as a
grouped two-up icon list in the body column, and the icons are the one thing the two share (`practiceIcons` in
`parts.tsx`), because icons are not content.

Block 5 is coverage, from the eight real city files, as a row of pill links to the city pages under
`citiesLead`, which states that the work is remote. No `LocalBusiness` JSON-LD and no address: there is no
office in any city, which is the decision `CityTemplates.tsx:32-34` records and nothing here contradicts it. No
count is printed; eight links are their own quantity, and a count framed as an achievement is rule 8.

The rail carries `brand.guarantee` with the placeholder disclosure `FactRail` already renders, and the CTA pair.
It carries no claim `points`: block 4 is the full practice on this page, and the rail would print the same
promises a second time in shorter words.

## v3 / contact (/contact/)

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Intro column + form card | 5/7 split, intro left, tabbed flow card right | no | no | CHAT (intro) |
| 2 | Booking flow | named-screen wizard inside the card (Problem, Your site, Contact, Confirm) | no | no | BOOK or QUOTE or CHECK on the last screen |
| 3 | Success | confirmation state replacing the flow, with handoff and CHAT | no | no | CHAT |

Two flows share the page: Emergency ticket (routes.book) and Project enquiry (routes.quote, type=project), each
keeping its own sessionStorage draft. /free-site-check/ runs the same component in "check" mode.
Progress is shown by screen name only, never "Step 1 of 4". The generated booking override suggests red/orange/green
step colours; the v3 colour lock wins, so every screen uses the single accent.
/contact/thanks/ was deleted: the success screen is now part of the flow, so the redirect target was dead.

## v3 / live chat

Our own launcher (`src/components/sections/v3/ChatProvider.tsx`), never the vendor's bubble, which is hidden by
CSS the adapter injects. Fixed bottom right, 24px insets, 44px tall, label from md up; hidden under 768px where the
bottom bar already carries chat, and hidden on /contact/ and /free-site-check/ so it cannot sit on a submit button.
The vendor script loads on first launcher click, or on requestIdleCallback after the window load event, never in
the critical path. Blocked or missing script falls back to a dialog with BOOK and the support address.
No provider is configured (NEXT_PUBLIC_CHAT_PROVIDER), so nothing third-party is requested and no presence dot renders.
