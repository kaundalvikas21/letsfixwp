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
| 1 | Hero | single-column document header with mono error block | no | no | none |
| 2 | Capture | device frame (renders only when the capture exists) | no | no | none |
| 3 | What you are seeing | bullet list | no | no | none |
| 4 | What usually causes it | cause tiles (bordered, 2 columns at sm) | no | no | none |
| 5 | Safe things to try first | numbered steps with a warning note | no | no | none |
| 6 | When to call us | prose with inline CTA row | no | no | BOOK (parent service), CHAT, CHECK |
| 7 | Questions | plain disclosure list | no | no | none |
| 8 | More errors | link rows | no | no | none |

## v3 / hub template (/<hub>/)

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | 7/5 title block beside a typographic index panel (hub icon over its service titles) | no | no | node intent, CHAT |
| 2 | Which of these is your site doing | varied-span bento of symptom cards (bentoSpans) | no | no | none |
| 3 | Most urgent problems | ranked list in one panel, severity badge per row | no | no | none |
| 4 | Not sure which one | left-aligned prompt band, one button | no | no | CHAT |

Eyebrow budget: 4 sections, ceil(4 / 3) = 2 allowed, 0 used. No marquee. No two consecutive image-plus-text splits: the hero is the only split, and it carries no photograph.

Row 2 reads the real intent mix of each hub. Measured: wordpress-fix 11 fix; wordpress-security 3 fix, 1 project; woocommerce 1 fix, 3 project; wordpress-maintenance 3 plan, 1 project; wordpress-performance-migration 3 project; wordpress-development 6 project. `symptoms` is empty on every non-fix service (serviceSchema refine), so a card shows its first three symptoms when it has them and otherwise its `summary` plus `whoItsFor`. The heading follows: "Which of these is your site doing?" only when at least one card has symptoms, "Pick the work that fits" when none does. Row 3 renders only when the hub has guides (4 of 6 do: maintenance and development have none). It ranks by `Guide.urgency` and shows the urgency in words plus an icon (`UrgencyBadge`), never colour alone. The hero drops the photograph: `hubPhotos` reuses six frames and several are dark, against the bright-daylight direction in MASTER. Row 4 replaces a closing band that repeated the node title and both hero buttons.

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
| 1 | Hero | document header | no | no | none |
| 2 | Which one fits | three verdict cards | no | no | none |
| 3 | Side by side | real comparison table | no | no | none |
| 4 | Closing | split band | no | no | collection intent, CHAT |

## v3 / standalone pages

| Page | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- |
| /free-site-check/ | lead magnet: preview panel left, form card right | no | no | CHECK (form submit), CHAT |
| /case-studies/ | composed empty state card | no | no | BOOK, CHAT |
| /pricing/ | grouped price list by hub (not the home tier cards) | no | no | BOOK, PLANS, CHECK, CHAT |
| /about/ | narrow document with link rows and fact tiles | no | no | BOOK, CHAT |
| /guides/ | grouped tile index | no | no | BOOK, CHAT, CHECK |
| /compare/ | link rows | no | no | BOOK, CHAT |
| /wordpress-development/cities/ | link rows | no | no | QUOTE, CHAT |

The booking form (src/app/contact/BookingFlow.tsx) is shared by /free-site-check/ and /contact/, so it carries one
v3 style: 12px inputs on --line-strong, 44px targets, a step progress bar, and inline errors under each field.

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
