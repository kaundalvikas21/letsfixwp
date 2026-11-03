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

## Page rhythm (every route)

The header is `fixed` and 64px tall, so a page that starts at the top of the document starts underneath it.
Every page but the home page was carrying `py-8 md:py-12` on its shell, which is 32 and 48: less than the
header on both counts, so the first 32px of every stacked page and the first 16px of every desktop one were
behind the bar. The breadcrumb is what lives there, which is why it looked welded to the header on every
service, guide, hub, city, compare and utility page on the site, 98 routes of 99.

`pageY` in `src/components/templates/parts.tsx` is the one place that number lives now: `pt-24 pb-8
md:pt-28 md:pb-12`. 96 and 112 are the same 32 and 48 those pages were always asking for, with the 64 they
have to clear added on. Thirteen literals became one constant, so the next page cannot quietly reintroduce
it. `LegalPending` was its own case at `py-16`, exactly the header's height, which put its h1 flush against
the bar with no gap at all; `/preview/` was the same.

Measured after, as the first painted element's distance below the header, across 13 inner routes at three
widths: 48px at 1440, 48px at 1024, 32px at 375, one value per width with no outlier. The home page is the
deliberate exception at -40px stacked and 159px at 1440: its hero is full-bleed and the bar is transparent
over it, which is the design.

One thing the whole-document audit caught that section-scoped runs had been missing for the entire build:
the command palette's trigger carried `aria-label="What is it doing?"`, which is also its visible label from
lg up. A name that merely repeats the visible text trips WCAG 2.5.3 Label in Name, and axe reported
`label-content-name-mismatch` at serious impact on every page of the site. The label was load-bearing,
though: below lg the span is `display:none` and the button is the icon alone, so removing it outright would
have left it with no name. It names itself from its own contents now, with an `sr-only` copy for the
icon-only case and only that case. axe is 0 on whole documents at home, service, guide and contact.

## v4 / global shell (footer)

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| F | SiteFooter: the whole sitemap in balanced columns, then a brand and disclaimer bar | balanced CSS columns (not counted against a page's layout families) | no | no | none (CHAT only through the floating trigger, which is the shell's) |

Footer measurements (production build): 912px at 1440, 1402px at 768, 2484px at 375. Eight blocks, six hubs
plus Company and Legal, 43 list links and 6 hub headings. At 1440 the blocks flow into four 246px columns on
a 40px gap with the deepest and shallowest column ending 171px apart; at 768, two columns 40px apart; at 375,
one. axe 0 violations at all three, no horizontal scroll.

It was a four-up grid, which dealt the eight blocks into two rows of four. The first hub has eleven children
against its row-mates' four, four and three, and a grid row is as tall as its tallest cell, so that row left
about 250px of nothing under each of the other three. CSS columns balance their own height, so the blocks
flow and the voids close; `break-inside-avoid` on each block is what keeps a heading in the same column as
its own links.

The links were 17px tall, on `py-0.5`, which is a real miss against the contract's 44px target on the one
block of the site that is almost entirely links. They are 36px now, on a 38px pitch, measured as 43 of 43
at or above 36 with none below. 36 is not 44, and the reason is written in the component: 44 across these
links adds about 900px to the footer on a phone, and at 2484px it is already the longest thing on the page
there. That is the trade, taken deliberately rather than missed.

Two things in the bar at the bottom. The disclaimer was right-aligned against the brand line under a 46ch
cap, where it broke across two lines mid-phrase, on "WordPress Open / Source project"; it is one line at
1440 now, left-aligned with its own measure and `text-pretty`. And the floating chat trigger, which is the
shell's and sits bottom-right over whatever is beneath it, was landing on top of that sentence on every page
of the site: the footer carries 112px of bottom padding at md so the button ends up in air. Measured as no
overlap at 1440, 768 and 375.

Headings are 15px in `--text` against the links' 14px in `--muted`; the two were both 14px and told apart by
weight alone, which is not a hierarchy across eight headings and fifty links. Links take a 2px nudge and a
colour change on hover, which is DESIGN.md's Hover Earns It rule being satisfied rather than broken: every
one of them goes somewhere.

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
| 1 | Hero | 7/5 title block with photo | no | no | node intent, CHAT |
| 2 | Lead + body column with sticky conversion rail (lg) | lead column with sticky rail | no | no | node intent, CHAT (rail) |
| 3 | Symptoms (fix) or Who this is for (plan/project) | tick list, or prose | no | no | none |
| 4 | What we do | verb-labelled tile pairs | no | no | none |
| 5 | What you get | two-column tick list | no | no | none |
| 6 | Errors we fix here | link rows | no | no | none |
| 7 | Questions | plain disclosure list | no | no | none |
| 8 | Related | chip row | no | no | none |
| 9 | Closing | split band (text left, buttons right) | no | no | node intent, CHAT |

Hero carries no subtext: the shortest service field is 25+ words, over the contract's 20-word hero cap, so
service.summary renders as the lead paragraph below the hero.

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
| 1 | Hero | 7/5 title block with photo and lead paragraph | no | no | node intent, CHAT |
| 2 | What we do here | link rows | no | no | none |
| 3 | Most urgent problems | two-column tile list | no | no | none |
| 4 | Closing | split band | no | no | node intent, CHAT |

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
| 4 | Promises panel | tinted panel under the intro (icon list, no border, no shadow), left column row 2 | no | no | none |

### The left column was 350px beside a 1000px form

Measured at 1440: the intro column ended at y=518 while the form panel ran to 1265. Half the page's most
important screen was empty, and the only thing in that column besides the headline was a chat trigger that
rendered as a word inside a sentence.

Three things changed, and the booking flow, its fields and `ContactTabs` were not touched.

- **The grid is three children, explicitly placed.** `lg:grid-rows-[auto_1fr]` with the form at
  `col-start-6 row-span-2` and the promises panel at `col-start-1 row-start-2 self-start`. The explicit rows
  are load-bearing: with auto rows the browser splits the spanning form's height across both of them, which
  pushed the intro down and stretched the panel to the form's own bottom edge with its lower half empty,
  which is the same defect in a tinted container. `auto 1fr` pins row 1 to the intro's own height and lets row 2 absorb the
  rest, so the panel hugs its content 56px under the intro.
- **Document order is intro, form, panel**, so the phone gets the form second rather than after a screen of
  reassurance: at 375 the card starts at y=556 inside an 812px viewport. The panel carries no interactive
  element, so reading order differing from the lg visual order costs no tab stop. Left column now runs 168 to
  917 against the form's 168 to 1265: shorter than the form on purpose, and nothing was invented to fill it.
- **CHAT is the house `btn-secondary`**, 44px with the global 2px ember focus ring, under a plain
  "Rather talk first?" line instead of inside it. Label still from `cta.ts`.

The panel's four sentences are **verbatim** `confirm(...)` descriptions from `brand.ts` (reproduced in
PRODUCT.md under Brand Commitments), each gated on its claim being truthy, because `brand.claims` holds
booleans and numbers rather than sentences and no new claim wording may be authored. Four of the eight:
`sameDay` and `bookingMinutes` are landing-surface speed claims and read as sales talk beside a form someone
is already filling in, `vetted` and `checkTurnaround` answer other pages' questions, and all eight would run
the column past the form's height. `first-letter:uppercase` is the only change made to the strings, which is
presentation, not wording. The panel is `bg-surface-2` with no border and no shadow, so the form keeps the
only card surface on the page and stays the primary element at all three widths.

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

## v4 / budgets (branch `v4-rescue-story`, design-system/letsfixwp-v4/MASTER.md)

Budgets recorded ahead of the first page section so they cannot be overspent:

| Budget | Limit | Used |
| --- | --- | --- |
| Pinned scroll scenes per page | 2 (sticky-stack, horizontal pan) | 0 |
| Marquees per page | 1 (logo marquee, CSS only) | 0 |
| Eyebrows per page | ceil(sections / 3), hero included | 0 |
| Consecutive image-plus-text splits | 2 | 0 |

Planned page order for home, from the funnel pattern: hero > the break (sticky-stack of error screens) >
the fix (horizontal pan) > the result (zoom-parallax on a restored capture) > proof > final CTA.
Each scene is its own layout family, so none may repeat on the page. The zoom-parallax scrubs without
pinning, which is what keeps the page inside the 2-pin budget.

## v4 / global shell (every page)

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 0 | NavBar: 64px bar, full-screen mega menu, fixed bottom action bar under 768px | shell (not counted against page layout families) | no | no | BOOK (bar at md and up, menu footer, bottom bar), CHAT (menu footer, bottom bar icon) |

The bar carries no link list, so the menu is the only route to the rest of the site: the six SITEMAP
hubs with their services, plus Pricing, Free site check, Guides, Comparisons, Case studies, About and
Contact in the menu footer. BOOK shows in the bar from md up only, because under 768px the bottom bar
already carries it; the bottom bar unmounts while the menu is open.

The menu expands a category on hover or focus at md and up, with the links absolutely positioned in
the right half so the category list never moves. Under 768px each category is a disclosure: the six
headings fit on one screen and nothing is open until one is tapped.

That phone behaviour was wrong at first and was reported from the browser, not caught here. Every
category used to be expanded at once, on the reasoning that a phone has no hover. Measured, that put
32 links and 2,152px inside a 563px scroller, so a visitor who tapped the hamburger saw one category
and eleven of its sub-items with the other five categories buried below them. Fixed: 6 headings
visible, 0 sub-links, scrollHeight equal to clientHeight, the sixth category on the first screen.

A second defect came with the fix and was caught by the same measurement: a tap fires pointerenter and
focus before click, so the row was already active by the time the toggle ran and the first tap read as
"close". Hover is now mouse-only (`e.pointerType === "mouse"`) and the focus handler sits on the
pointer-only heading link, which a phone cannot reach because it is `display: none` there. Measured
after: first tap expands (5 links), second collapses, and the previously open category closes. Radix Dialog supplies the focus trap, Escape and the focus
return to the Menu button. Measured: 40 tabs, none leaving the dialog; focus ring 2px ember at 2px
offset; no horizontal scroll at 375, 768, 1024 or 1440.

## v4 / home

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | kinetic type with bleeding image (type on columns 1 to 8, night photograph on 7 to 12 and off the right edge, --bg scrim between them) | no | no | BOOK, CHAT |
| 2 | Funnel stage one, the break | expanding screen panels, 4 across (stacked below md) | no | no | BOOK (on the heading line) |
| 3 | Funnel stage two, the fix | scroll-driven rail, 5 panels on one line, bleeding to the edge | no | no | BOOK (on the heading line) |

Sections 4 and up are still v3 components until they are rebuilt, so their rows stay in the v3 tables.
Budgets used so far: 0 pinned scenes of 2. Section 2 gave its pin back when the sticky-stack became the panel
row, section 3 gave the other one back when the horizontal pan became a rail, and the restored-site scene
always scrubbed without pinning. 0 marquees, 0 eyebrows on this stretch, 2 image-plus-text layouts, never
consecutive.

Section 2 measurements (production build). "Seeing one of these?" and BOOK sit on the heading's line at the
far end of the spine rather than under the row: measured at 1440 the heading starts at x=168 and the button
ends at x=1272, both blocks on a bottom edge of 609. The heading otherwise ran the full width with nothing
beside it. Below md they stack, and the DOM order stays heading, ask, screens, so the question still comes
after the heading and before the thing it is asking about.

At 1440 the row is a 107 / 748 / 107 / 107 grid, 480px tall, on the page spine; at 768 it is 68 / 479 / 68 / 68; below md it turns and runs down the page, 343px wide with
rows of 74 / 297 / 74 / 74, so every closed panel still clears the 44px target. Section height 977px at 1440
and 949px at 375, no horizontal scroll, axe 0 violations at 1440, 768 and 375.

This replaced the GSAP sticky-stack: 4 cards, 3 pin-spacers, a 3952px scene that scrolled the same four
screens past the visitor one at a time. The content is unchanged, down to the guide each line is read from.
What changed is that the visitor picks the screen that is theirs instead of waiting for it to arrive, which
is what the section is for, and the page gets back a pin budget and about 3000px of height. StickyStack.tsx
was deleted with it; the page's one remaining pinned scene is the horizontal pan in section 3.

The open panel takes 7 shares against 1 each for the closed ones, 4 against 1 when stacked: seven at 375
would leave closed rows 34px tall and squeeze the open one to 182px, too narrow to set an error message in.

A panel opens on hover on a real pointer, not on click. Click stays for touch, where pointerenter only fires
on the tap anyway, and focus stays for the keyboard, so tabbing the row still walks through the screens. This
is the opposite call to the one the plans rows make, where hover was removed because a mouse crossing the
section collapsed whatever the visitor was reading; here it is what the owner asked for, and the cost is
lower because the panels sit above a question rather than above a price.

Motion: one `grid-template-rows`/`grid-template-columns` value on the list, 640ms on `--ease-spring`, the
stiffness 100 / damping 20 spring sampled into a CSS `linear()` in globals.css. It is the curve the hero words
and the FAQ panels already settle on, so the panel opens the way everything else on this page arrives, and it
is a real spring rather than a bezier approximating one. One property on one element rather than a growth
factor on each of four children.

The two lines in the strip each have their own clip box and travel their own full height, so they come up
from under the edge of the strip rather than appearing on the spot, and they arrive on separate clocks. That
staging is the fix for a reveal that read as jerky.

The name is two or three words set `whitespace-nowrap`, so no opening width can drag it through a re-flow; it
goes first, at 420ms for 420ms. The sentence under it wraps, and while the panel was widening it re-wrapped on
every frame. Its delay is now the width's own duration to the millisecond, 640ms, so it never begins while
the box it wraps into is still changing size.

Measured on one hover of the white-screen panel, which carries the longest line: at 150ms the panel was 331px
and the sentence was laid out over **four** lines, at 350ms it had settled to two, and it did not reach any
visible opacity until 800ms, by which point the panel had been at its full 748px for a frame and the line
count had been stable for 450ms. The whole re-wrap happens where nobody can see it. The error's own words keep
their own wait for the same reason. The chip wears `--shadow-card`, the house inset highlight and soft drop,
so the mark sits on the strip rather than being pasted onto it. Panels arrive 55ms apart the first time the row crosses 20% into view, never on mount, because
the row sits below the fold. Under reduced motion the list has transition-property none, the panels are
opacity 1 with animation none, and every swap is instant.

Each panel carries its own name and the line explaining it, inside the frame under the icon, rather than in a
strip below the row: the panel is the thing being chosen, so what it is should be on it. Closed, only the icon
is left, centred, 44px at 14px radius like every chip on the site. Three layout facts hold that together and
each one was a real defect first: the words are taken out of the flex track with `position: absolute` when
closed, because a zero-width box still wraps its text one character per line and that grew the strip on the
white-screen panel from 112px to 432px of scrim over what is meant to be a blank white screen; the strip takes
p-3 and no height floor when stacked, because a 44px chip in 32px of padding is 76px and a closed row only
gets 74px at 375, which cut the chip in half; and the screen area carries no padding when closed, because
`flex-1` and `min-h-0` let a box shrink but padding does not shrink with it, and 40px of it plus a 68px strip
overflowed the same 74px row. A fourth: the open panel hung its chip from the top of its strip while the
closed ones centred theirs in a strip of the same height, so the four marks sat on two different lines across
the row; they are all centred at md now. Measured after: strips 112px at 1440 with every chip 0px off the
middle of its 107px sliver and all four mid-heights on the same pixel, 57px up from the panel floor; 68px
closed and 126px open at 375, with nothing clipped.

Each panel is one stretched button with aria-expanded rather than a Radix tab, the same shape the plans rows
use: the accessible name stays the screen's name while the line explaining it is content rather than part of a
label that would read out as a paragraph. Focus opens a panel as well as clicking it, so tabbing through the
row reveals each screen in turn.

Contract rule 10 reserves animation for transform and opacity, so the track-list transition is this section's
recorded exception, the second on the site after the FAQ's accordion height.

Each panel is the screen itself. All four slots were filled by the owner on 2026-10-19. The deceptive-site
panel is a real screenshot of Chrome's interstitial, dropped into the slot docs/image-todo.md had open for it:
Google cannot be made to flag a site on demand, so that one is never produced by `npm run capture`. The other
three carry designed graphics of their errors rather than captures of them, and all three slots are ones
`scripts/capture-errors.mjs` can write, so a capture run would overwrite them.

They render with `fill` rather than a declared 1600x1000, because a hand-supplied screen is whatever shape it
was. The sizes hint is 48rem, not the 72rem container: the open panel is 748px at its widest and all four
share one hint, so 72rem had every one asking for a 1200w variant, three of them to fill a 107px sliver. The
section's images now weigh 76KB of webp at 1440 and 40KB at 375.

A sliver crops to the left edge, not the middle: all four graphics set their words across the centre, so a
107px centre crop landed halfway through one and read as broken rather than as a glimpse of a screen. The
left edge is the quiet part of all four. The white-screen panel used to be the one that read as itself at
sliver width, a strip of blinding white among three dark ones; with a graphic behind it that is gone, and all
four slivers are dark now.
Its panel then stops setting the quoted words, since the capture is already showing them rather than having
them printed on top. The other three have no capture yet, so they are plain dark panels carrying
the error's own words in mono, and for the white screen a plain white one, which is also the one panel that
reads as itself at sliver width. Never a div-built browser window. The label strip is solid
--bg. It was flat --scrim at 0.72, chosen so it could hold --on-photo over a blank white screen as well as a
dark one, and it did: over white that lands on #4C4C4D, where --on-photo measures 7.55:1. What it could not
survive was the graphics themselves. All four set their own caption across the bottom third, exactly where
the strip sits, so "White Screen of Death" and "Failed to connect to MySQL database" ghosted through it beside
our own name for the same screen. Opaque hides whatever falls behind, takes --on-photo to 17:1, and happens
to cover the "Diagnose & Fix" button baked into the critical-error graphic, which was a non-functioning
control sitting inside a clickable panel. The explaining line is --on-photo at full strength, told apart from
the name by size and weight rather than by colour: --muted on that same surface measures 3.40:1, and a
reduced opacity is what the MASTER rules out for muted copy. One
Phosphor icon per
screen, since four identical warning marks would carry no information in the one place a closed panel has
room for a mark. The section opens on the critical error
rather than the white screen: it is the screen the fix scene and the result section already follow, and it
opens with words instead of a white slab.

Hero measurements (1440 unless stated): h1 72px, leading 1.1 (79.2px), tracking -0.04em (-2.88px), opsz 72;
two lines at every width from 320 to 1440; "today." in ember on --bg at 6.30:1; the clip mask keeps 0.16em
(11.5px) of descender room so the y in "today" is whole at rest; rightmost text at 62% of the viewport, with
the scrim opaque to 68%, so every word sits on solid --bg; CTA above the fold at 320, 375, 414, 480, 640,
768, 1024, 1280 and 1440; one preload and one image request for the LCP photograph; reduced motion renders
both lines at opacity 1 with no transform from the first paint.

Section 3 measurements (production build). The section is 761px tall at 1440 and 689px at 375, on the page
spine with the heading at x=168 and BOOK at the far end of its line. The rail bleeds to the container edge at
x=144 while the first card stays on the spine at x=168, so the card after the fold is visibly cut off, which
is the affordance that it scrolls. scrollWidth 2256 against a 1152 viewport. Five cards, all 464px, equal
because of the 29rem floor. No horizontal page overflow at 1440, 768 or 375. axe 0 violations at all three.

The row walks sideways as the page scrolls past it, and the page keeps scrolling vertically the whole way.
What is driven is `scrollLeft`, not a transform, and that is the whole reason it composes: a transform would
be a second position on top of the one the rail already has, so a swipe and the scroll would each move the
row and the two would add up into somewhere unreachable. Sharing one value means the browser clamps it, the
scrollbar agrees with it, and a swipe simply takes over. The mapping runs through a spring at the contract's
stiffness 100 and damping 20, so the row eases toward where the scroll says it should be rather than arriving
in wheel-sized steps.

The two numbers that are the whole feel of it are the window the travel is mapped onto, 0.33 to 0.78 of the
section's crossing. Mapped across the full crossing it was already 219px along by the time the cards reached
the bottom of the screen, so the first card slid away before anyone had read it. Measured at 0.33/0.78: the
rail sits at 0 with card one on the spine at x=168 while the cards come up the screen, starts at 272 once
they are mid-viewport, and reaches its full 1104 as they leave the top, with card five's right edge at 1272
inside the 1296 viewport edge. It travels about one and a half times the page's own speed through that
window.

Touch the rail and the drive stops for good: measured, one ArrowRight moved it to 40 and a further 400px of
page scroll left it at 40. Without the pin there is not enough page scroll to walk 1104px of row at a reading
pace, so the drive gets it moving and the visitor's own hand gets the rest. The one thing a scroll-linked
rail must never do is carry a card away from someone in the middle of reading it. Under reduced motion
nothing is driven at all and the rail is scrolled only by hand.

It was a pinned GSAP scene that converted 1528px of vertical scroll into the same sideways move, and the
content is unchanged. What went is the scroll hijack. Traced through the old section in 100px steps, the
shape of it was: 278px of cards rising into place, then 1528px of scrolling during which nothing moved
vertically at all, then the whole band scrolling away. Scrolling the page now moves the page.

A scrollable region needs a name and a tab stop of its own, or a keyboard visitor can reach the cards and
never the scrolling: role="region", aria-label and tabIndex 0, confirmed as the activeElement after focus,
with the house 2px ember ring. The native scrollbar is hidden because the cut-off card already says the same
thing without a grey rule under the row. No scroll-snap: the drive sets scrollLeft on every frame and
snapping would fight it for the last few pixels of every one.

The page has no pinned scene left: 0 pin-spacers at every width, where the budget allowed 2. It is also
1423px shorter, 11,257 to 9,834, and this section alone went from 2184px to 761px. ScrollTrigger is no longer
imported anywhere; GSAP itself stays for the guarantee heading. The skip link before the scene went with the
pin, since there is no longer a hijacked scroll to skip.

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 4 | Funnel stage three, the action | masonry of problem tiles (dense grid, critical tiles span two rows) | no | no | CHAT (empty state only; every tile is a link to its problem page) |

Section 4 measurements (1440): 52 tiles from matchIndex, 20 of them critical and image-backed, 5 chips
(Everything plus the four hubs that actually have problems: Care plans and Development have none, so they
are not offered). Chips are real buttons with aria-pressed, 44px tall, 14px radius; the search input is
labelled, 50px tall, and runs the same matchProblem() the rest of the site uses, re-ranking the grid best
first. "white screen blank page" returns 14 tiles with the white screen guide first; a query that matches
nothing renders the composed empty state with CHAT. On an image tile both lines use --text over the flat
--photo-scrim, which measures 5.6:1 against the brightest possible photo (--muted would be 2.55:1 there).
Under 768px: one column, critical tiles first and twice as tall, no horizontal scroll. Critical-first is
sorted in the data, not with CSS order, so the reading order and the tab order stay the same.

Layout-family note: resolved in section 5, which replaced the v3 Quotes masonry. The page now has exactly
one masonry.

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 5 | Proof | logo marquee plus large quote pair | no | yes (the one on the page) | none (text link to the case studies) |

Section 5 measurements (1440): one marquee on the page, 8 logos plus an aria-hidden second copy for the
seam, 42s linear. Pause button 44px with aria-pressed, label switching between Pause and Play; measured
stopped after the click, and hovering the track pauses it too. Reduced motion: animation none, second copy
hidden, pause button hidden, one static wrapped row, quote lines at opacity 1 from the first paint. Quotes
are one column under 768px, two above, no horizontal scroll at either. The link goes to /case-studies/,
which is what the old /testimonials path means (contract rule 16).

This section replaced the v3 LogoGrid and the v3 Quotes masonry, and both files were deleted; the home page
now runs v4 from the hero down to the proof, with v3 sections from the bento onward.

Contract rule 9 asks a marquee for pause plus previous and next controls. This one ships pause (plus hover
and focus stop and a static row under reduced motion) and no previous and next, because nothing here is
reachable only by stepping: the logos are decorative, each carries its own title, the whole set is in the
DOM twice, and reduced motion lays the set out at once. Previous and next would be controls that move
decoration. Flagged rather than assumed, so it can be overruled.

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 6 | The result | zoom-parallax image | no | no | none |

Section 6 measurements (1440): scale 0.7 on entry, 0.855 at mid, 0.999 when the section is centred, which
paints the image from 773px to 1104px wide inside a box that never changes size, so nothing below it moves.
Scale only: the transform matrix carries no translation. Radius 14px. The heading sits above the image and
the sentence below it, with nothing over the image, so no text depends on a scrim. Reduced motion:
`transform: none` and the image at full width from the first paint. No horizontal scroll at 375.

Scroll-scene budget for the page is now spent as planned: two pinned (the break, the fix) and this one
scrubbed without pinning.

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 7 | Choose how you want help | expanding rows (one open at a time) | no | no | BOOK (one-time fix), BOOK with service=malware-removal (cleanup), PLANS (care plan) |

Section 7 sits in the slot the v3 Pricing section held, after the plan comparison, and replaced it; both
Pricing.tsx and PlanPrice.tsx were deleted. The page order gets revisited when the rest of the v3 sections go.

Section 7 measurements (1440): three rows, the first open; open row 445px tall against 88px for the closed
ones. Hovering row 3 moves aria-expanded to false,false,true; focusing row 2 moves it to false,true,false;
closed panels carry `hidden`, so nothing inside them is focusable, and tabbing on from an open row header
lands on that row's CTA. Open row is bordered in ember, radius 14px. On touch, tapping a row opens it, and
the row headers are 101 to 128px tall. No price renders anywhere, because every price in
src/content/pricing.ts is still null and rule 8 says a null value renders nothing rather than a placeholder.

Nothing in this section animates: the page's motion budget is spent on the three scroll scenes, and a height
transition is neither transform nor opacity (contract rule 10). The open row simply changes.

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 8 | Guarantee | text mask reveal | yes ("Guarantee") | no | none (text link to /legal/guarantee/) |

Eyebrow budget: 2 used of the 2 the page allows at its current section count (sections 2 and 8).

Section 8 measurements (1440): the words render at 136px Bricolage 800 with the photograph clipped into
them, and the plain sentence below carries the same words as real text, so the masked line is aria-hidden
and never announced twice. Reduced motion: solid ember fill, no image, measured as color and
-webkit-text-fill-color both rgb(255, 90, 54) with background-image none. 48px on mobile, no horizontal
scroll. The link goes to /legal/guarantee/.

Two things the first build got wrong and the screenshot caught. `background-blend-mode: screen` reports as
applied in getComputedStyle but Chromium does not blend a background that is clipped to text, so whole
letters were disappearing into the page; the luminance floor is now a flat ember veil layered under the
photograph, at which the darkest possible letter pixel measures 3.56:1 on --bg (large text needs 3:1) and
the brightest 8.37:1. The number is brand.guarantee, never the 30 days in brand.legacy.facts.

This section replaced the v3 GuaranteeCard, which was deleted.

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 9 | How we work on your site | divided practice rows (icon rail, promise, sentence) | no | no | none |

Section 9 measurements (1440, dev server): five rows on a 20px / 304px / 716px grid with 32px gutters, the
icon rail at x=168, the promise at x=220 and the sentence at x=556 capped to 58ch (580px), each row 81px
tall between hairlines, section 700px. At 768 the sentence column is 332px and wraps to two lines, 106px
rows. At 375 the grid collapses to 20px / 311px, the sentence sits under the promise at the same x=48, rows
are 119px, no horizontal scroll. Heading 48px / w800 / -1.92px at the spine (x=168), 30px at 375. axe 0
violations at 1440 and 375, detector clean.

It was a two-column checklist until this pass. Five items in two columns leaves an empty sixth cell at the
bottom right, which is a planning error rather than whitespace, and the two short columns hugged the left
half under a heading that runs the full width. Rows carry the promise left and its one sentence right, so
each line reads across the whole spine and the five read as one set. Hairlines do the grouping, not cards:
there is no elevation here to communicate. Promise and sentence used to share 15px and were told apart by
weight alone, which is not a hierarchy under a 48px heading; the promise is now 17px.

Motion (PracticeRows, the one client island in this section): the five rows arrive 55ms apart the first time
the list crosses 20% into view, opacity 0 to 1 and translateY 14px to 0 over 500ms on cubic-bezier(0.23, 1,
0.32, 1). What it communicates: five separate promises rather than one block of reassurance to skip. Sampled
against the production build at 1440, from the frame the list enters: row 1 at 0.36/8.9px while rows 2 to 5
are still at 0/14px, then 0.89/1.5, 0.77/3.2, 0.51/6.8, 0.11/12.4, 0/14 across the five, settled by about
750ms. once: true, so it never replays. Under reduced motion all five are opacity 1 with no transform from
the first paint, carried by motion-reduce:opacity-100! and motion-reduce:transform-none! rather than by
hydration, so a blocked bundle cannot leave the section blank.

Hover: the row's own hairline is replaced by an ember one that scales from scale-x 0 to 1 from the left over
260ms on the same curve, measured at 0.969 after 120ms and back to 0 on leave. It is the fix scene's ember
rail, one row wide, travelling in the reading direction. It says "this line" without claiming the row is a
link, which it is not (DESIGN.md's Hover Earns It Rule). Tailwind v4 gates every hover: variant behind
(hover: hover), so a tap on a phone does not fire it. Transform only, 1px tall, sitting on the hairline
rather than beside it, so the row does not grow by a pixel.

Still deliberately quiet in content: no image, no card, no call to action. It sits after the guarantee, which
is what "quiet after the loud section" asks for; the v3 Security section it replaced sat before it, and has
been deleted.

Each line is a claim gated in brand.claims, which is what {{CONFIRM}} means in this repo: a production
deploy fails until the owner confirms all five, and setting one to false removes its line rather than
softening the wording. The five are vetted engineers, fixed price agreed first, backup before any change,
your own login, and access removed when the job is done.

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 10 | Questions people ask first | category rail left, accordion right (two columns) | no | no | none |

Section 10 measurements (1440, production build): the section runs on the page spine at x=168 and the block
is a 224px / 768px grid with a 48px gutter, the three categories down the left and the two questions of the
open one on the right. At 768 the grid is 224px / 448px; below md it stacks, the rail still vertical, rows
343px wide, section 710px tall, no horizontal scroll. Each rail row is exactly 48px, which is what lets the
pill be positioned by index rather than by measuring the DOM.

It was a wrapping row of pills above the questions inside a max-w-4xl section. That was the last block on the
page still at max-w-4xl, so its heading sat at x=296 while every heading above and below it sat at x=168; the
width the section gets back goes to the rail rather than to longer question rows, because a question with its
chevron 1100px away reads as two separate things. At 375 the pills also wrapped to a ragged two lines, which
a vertical rail ends.

Motion: the pill behind the active category slides on translateY, 240ms on cubic-bezier(0.23, 1, 0.32, 1),
measured at 85.3px of its 96px travel after 100ms. What it communicates: three categories are one list being
pointed at, not three separate buttons. It is --surface-2 rather than an ember fill, so no label is ever
mid-travel under a colour it cannot be read on; the active label carries the ember instead, at 5.47:1 on that
surface. The pill sits at -z-10, so the 2px ember focus ring draws over it. Switching category plays the
`rise` keyframe on the panel, 320ms, because Radix mounts only the open category. Under reduced motion the
keyframe is none and the pill's transition-property is none, so both swap instantly.

Radix Tabs is orientation="vertical", which matches what the rail looks like: Up/Down and Home/End move the
selection, measured by pressing ArrowUp and then Home and watching aria-selected and the pill follow. Each
question is a plain button with aria-expanded and its own region, now labelled by that button's id rather
than unnamed; collapsing removes the region from the accessibility tree. The chevron turns 180 degrees and
goes from --muted to ember, on hover as well as when open, which is the first thing that told a sighted
visitor these rows open at all. axe 0 violations at 1440, 768 and 375. FAQPage JSON-LD carries all six
questions, including the four sitting in closed categories.

The six are referenced from the service pages by id and exact wording, so rewording a question in the
content file fails the build here instead of letting the two drift apart. This replaced the v3 Faq and
FaqAccordion, both deleted.

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 11 | Closing statement | full-viewport closing statement | no | no | BOOK (magnetic), CHAT (plain text) |

Section 11 measurements (production build, after the third pass): a full-width banner, 549px tall at 1440
and 1920, 492px at 768 and 435px at 375, with the photograph edge to edge. The section carries no
min-height and no viewport unit: its height is the content plus 128px of padding above and below at
desktop, 80px at mobile. The headline is 128px at 1440 and 1920, 69px at 768 and 48px at 375, one line at
every one of them, leading 0.9, left edge on the same 168px measure as every other section. It ran at 112px
in a 461px band before: it is the last thing the page says and the only line on it, so it is set at the
scale that earns, filling 825px of the spine rather than 594px of it.

It is also the only authored moment in the section, which is why it sits outside CtaReveal rather than
taking that block's 14px nudge with everything else: it rises out of a clip box of its own, the same move
the error row's labels and the FAQ's answers make, so the closing line arrives in the page's own vocabulary.
Spring stiffness 100 and damping 20.

One trap is worth writing down, because it cost a pass and it is invisible in code review. The line starts
at translateY(100%) inside an overflow-hidden box, so it is entirely clipped, and an IntersectionObserver
measures what is left after an ancestor clips it: nothing. With `whileInView` on the inner span its ratio
is zero for exactly as long as it is hidden, so it is never told to appear, and the measurement came back
`opacity 0` at every width with the closing line simply absent from the page. The trigger belongs on the
clip box, which is doing the clipping rather than being clipped and therefore sees the viewport honestly.
The reduced-motion override is `transform-none`, not `translate-none`, for the related reason: Motion
writes a real `transform` where Tailwind's own utilities write `translate`. BOOK is 56px tall at 14px radius with a 40x40 chip at 14px holding the
arrow; the magnet pulls to [8, 4] and the chip moves 2px on hover while the label stays put. Reduced
motion renders the block at opacity 1 with no transform. No horizontal scroll, no console errors.

Both lines sit on the flat `--photo-scrim`, so both are `--text`: over the brightest pixel a photograph can
hold that measures 5.6:1, while `--muted` there would be 2.55:1.

Three versions preceded this one, and the reasons are worth keeping. The first was centred in a 900px
viewport-height void with a 44px button under 72px type and no image, which was the only composition on the
page that did not match the others. The second put the photograph on the right half like the hero; it read
well but still left a screen of empty page. The third is this banner, which also fixed the spaciness: a
`min-h` of 40rem was still padding the content with 186px top and bottom, so the min-height came out
entirely.

Two full-bleed attempts failed before `emergency` was chosen: behind the flat scrim a night frame with no
light source in it renders as a black panel (luminance table in docs/image-todo.md). `emergency` is the
brightest real scene in the library and is mirrored, because its light sits in its left fifth and the type
sits on the left.

`BookLink` gained an optional `icon` prop for the chip. It takes a node, never words: the label still comes
from `src/config/cta.ts` and nothing else may set it.

## v4 / taste-skill Section 14 pre-flight

Run against the production build with every section scrolled through. Failures only:

1. **Shape Consistency Lock fails**, and only inside the three v3 sections still mounted: 20px radii in
   what-we-fix (7 elements) and four-moves (4), pill radii in four-moves (5) and prevent (3). Every v4
   section is 14px; the page passes the lock the moment those three are rebuilt.

Deliberate deviations, recorded rather than silently passed:

- **"Dark mode tokens tested in both modes"**: this variation is dark-locked by brief, so there is one
  designed theme and one contrast table, not two.
- **"Real images used"**: real photography everywhere, but the error screens and the restored-site capture
  are still night-frame stand-ins because public/screens/ is empty (docs/image-todo.md).
- **Marquee previous/next**: pause plus hover and focus stop, no previous and next. Reasoning in the
  section 5 notes above.

Checks that passed and are worth keeping measured: zero em-dashes on the page; 2 eyebrows against a budget
of 5 for 14 sections; nav 64px on one line; exactly one marquee; one accent; one BOOK label; no CTA label
wraps; no decorative dots, scroll cues, version labels or locale strips; no window scroll listeners; no
h-screen; no section-number eyebrows; no console errors.

## v4 / GSAP scenes, pinning and cleanup

Both pinned scenes were verified on the production build:

- **Sticky-stack**: while pinned, cards 1 and 2 are `position: fixed; top: 0px`, which is the viewport top.
  Their bounding rects read 36px and 6px down only because they are scaled to 0.92 and 0.99 by the scrub;
  corrected for scale, both sit at 0.
- **Horizontal pan**: the pinned wrapper is `position: fixed; top: 0px` with a rect top of 0.
- **Cleanup on route change**: home has 4 pin-spacers (3 from the stack, 1 from the pan). After a
  client-side navigation to /pricing/ there are 0 pin-spacers, 0 leftover .stack-card elements and 0
  elements carrying an inline transform; scrolling the new page throws nothing. Going back rebuilds exactly
  4, not 8, so no context leaks and no triggers are registered twice.

## v4 / home, as built after removing the last v3 sections

The three sections that still carried the v3 design were not just unstyled, they were duplicates of v4
sections already on the page, so they were removed rather than rebuilt:

| Removed (v3) | Already said by (v4) | Evidence |
| --- | --- | --- |
| "What we fix" (bento, 7 category cells linking to hubs) | Problem tiles, section 4 | the tiles are every problem the matcher knows, filtered by the same SITEMAP hubs the bento's cells linked to |
| "From broken to fixed in four moves" (Describe, Approve, Fix, Verify) | The fix pan, section 3 | the same process, as Diagnose, Back up, Repair, Verify, Harden |
| "Fix it once, or keep it fixed" (one-time fix vs care plan toggle) | Choose how you want help, section 7 | both read the same content: `emergency.deliverables` and `care-plans.deliverables.slice(0, 4)` |

Deleted with them: Bento, BentoMotion, Steps, StepsTabs, PlanCompare, PlanToggle, PillRadio, and the three
files left orphaned once nothing mounted them (v3 Hero, v3 SiteShell, MobileNav). What stays in
`sections/v3/` is infrastructure the v4 page and the contact pages import, not v3 design: ChatProvider,
ChatPresence, Photo and ProblemSearch (the contact pages use its `ProblemItem` type).

Final page: 11 sections, 17810px tall, down from 14 sections and 20270px. Every section is v4, and the
taste-skill Section 14 shape lock now passes with no non-14px radius anywhere in main, which was the one
real failure in the previous audit.

| # | Section | at |
| --- | --- | --- |
| 1 | Hero | 0% |
| 2 | Sound familiar (sticky-stack) | 5% |
| 3 | Here is what we do next (pan) | 27% |
| 4 | Pick your problem (tiles) | 41% |
| 5 | We repair sites running on (marquee and quotes) | 65% |
| 6 | Same site. Working again. | 69% |
| 7 | Choose how you want help | 75% |
| 8 | Guarantee | 81% |
| 9 | How we work on your site | 84% |
| 10 | Questions people ask first | 86% |
| 11 | Let's fix it. | 90% |

## v4 / page templates (P1)

The template layer was already built to this structure for v2 and v3, so this pass converted it to the v4
visual language rather than rebuilding it: 14px everywhere (the only remaining pills on the site, the booking
progress bar, its list markers and the contact tabs, went with it), the Bricolage display scale with opsz and
-0.04em tracking, and density-3 section spacing. Every template was checked on the production build.

| Template | Path | Layout family | On a home section? |
| --- | --- | --- | --- |
| Service | /<hub>/<service>/ | lead column with a sticky conversion rail at lg | no |
| Guide | /guides/<slug>/ | single-column troubleshooting document, measured for reading | no |
| Hub | /<hub>/ | lead block over full-width service rows | no |
| City hub and city | /wordpress-development/cities/ and /<city>/ | local prose column with a service panel and a remote delivery strip | no |
| Compare | /compare/<slug>/ | verdict-by-scenario cards over a real table | no |
| Free site check | /free-site-check/ | lead magnet preview beside a minimal form | no |
| Case studies | /case-studies/ | composed empty state | no |

Measured on the build, all nine pages: 200, h1 at 56px, no non-14px radius anywhere in main, no console
errors, and the right structured data per type. Service carries Service plus FAQPage plus BreadcrumbList;
guide carries TechArticle plus FAQPage; city carries Service with areaServed (never LocalBusiness, because
there is no office in the city); compare carries Article; every page carries BreadcrumbList.

Two brief items that needed real work rather than restyling:

- The service hero now shows a **real capture** of one of its own guides' errors when that file exists
  (`hasScreen`), and the service's night frame only until then.
- The service page carries **one testimonial, and only a real one**: the quote renders from
  `src/content/testimonials.ts` filtered on `!placeholder`, so while both entries are placeholders the
  section does not exist. Placeholders stay on the home page, where they are visibly marked as such.

Two deviations, both deliberate:

- **No hero subtext on the service template.** The brief asks for 20 words; of 32 services only 7 have a
  first sentence that short (min 15, max 33 words), so the summary stays as the lead paragraph under the
  hero instead of a subtext that would exist on 7 pages and not 25.
- **Guide H1s keep their imperative voice.** The brief asks for "the exact error phrase"; all 37 guides
  already share one voice ("Fix X", "Remove X", "Get back into X"), and the literal error already appears
  directly under the H1 in a Geist Mono block exactly as WordPress prints it.

Thin-content check: three service pages shared an identical H1 with their own guide (white screen, critical
error, database connection), which is two indexable pages competing on one phrase. Fixed on the service
side, since the guide voice is consistent across all 37: those three service H1s now name the engagement
("The WordPress white screen of death, fixed by an engineer"). Duplicate H1s across the 69 service and guide
pages: 0. Duplicate summaries or meta descriptions: 0.

## v4 / booking flow (P2)

`design-system/letsfixwp-v4/pages/booking.md` persisted. Like the templates, the flow was already built to
this brief for v3, so this pass converted it to v4 (14px on every control, including the last pills on the
site: the progress bar, its list markers and the two tabs) and then verified every rule in the brief against
the production build by walking the flow in a browser rather than reading the code.

| Brief rule | Measured |
| --- | --- |
| Four screens, named, never "Step 1 of 4" | Problem, Your site, Contact, Confirm; no "step N of N" string on the page |
| Problem prefilled from ?service= and ?guide= | `?service=white-screen` lands on the white screen service, prefilled |
| Site URL prefilled from ?url= | `?url=https://example.com` arrives in the field |
| Searchable select plus "Something else" | `matchProblem()` over the same index the site uses everywhere, with a textarea fallback |
| Access, never passwords | "Send me a secure link after booking" is the default and the first option; the screen says the form never asks for a password |
| Labels above inputs, helper text | every input, textarea and select is labelled (checked through `element.labels`) |
| Inline errors, announced | 2 inline errors on an empty Contact screen, with "2 details need attention on this screen." in the aria-live region |
| Focus moves to the new heading | after Continue, `document.activeElement` is the H2 of the screen that just arrived |
| Back never loses data | the name typed on Contact is still there after Back and Continue |
| 44px targets | 0 interactive targets under 44px across the flow |
| Confirm screen | summary of every answer, "Quote before work begins.", the guarantee line with its placeholder marker |
| Success screen | "Ticket ready", three lines (reference, engineer replies with a fixed price, secure link), CHAT, and the email stub |
| Project enquiry tab | `?type=project` selects it: service, description, 5 budget buckets, 4 timelines, then Contact and Confirm |

`booking_step` and `booking_complete` fire at every transition and on success; `src/lib/track.ts` has no vendor
yet, so they are typed and called but go nowhere until one is chosen. The payment and scheduling handoff is an
adapter in `src/lib/booking.ts` with branches for Razorpay, Stripe and Cal.com; while `brand.bookingProvider`
is unconfirmed the handoff is the copy-the-ticket state seen on the success screen, because `brand.email` is
also still `{{CONFIRM support email}}` and there is nothing honest to link to.

## v4 / live chat (P3)

The adapter was already built to this brief for v3, so this pass moved it out of the variation folder and
verified every rule on the production build. `src/components/sections/v3/` no longer exists: the launcher and
the presence component are now `src/components/chat/`, `Photo` is `src/components/Photo.tsx`, and the v3
problem palette was deleted after moving the one thing still used from it, the `ProblemItem` type, next to
`MatchCandidate` in `src/lib/match-problem.ts`. Nothing on this branch imports from a v3 path any more.

| Brief rule | Measured |
| --- | --- |
| Provider-agnostic adapter, NEXT_PUBLIC_CHAT_PROVIDER | `src/lib/chat/` with a row each for crisp, intercom, tawk and chatwoot; the table is a dynamic import, so an unconfigured site never ships it |
| Never in the critical path | loads on the first click of our launcher, or from `requestIdleCallback` after the load event, with an 8s timeout for a request an extension leaves hanging |
| Zero third-party code while unconfigured | 0 non-localhost requests on the home page, measured |
| Our own launcher, variation style | 44px, ember, Phosphor ChatCircle, `aria-label` CHAT and the visible label from md up |
| Never covers the mobile bottom bar or a submit button | hidden under md, where the bottom bar carries chat, and hidden on /contact/ and /free-site-check/, where a form owns the bottom right |
| Hide the vendor bubble | each provider ships its own hide-bubble CSS, injected before the script can paint |
| Context into the session | path, problem slug and the site URL the visitor typed, if they got that far |
| getSiteStatus() and presence | only a vendor that really reports presence returns anything; with none configured no "online" text renders anywhere on the site, measured |
| Fallback | the launcher opens a dialog with BOOK and the support address, which links to /contact/ while brand.email is unconfirmed |
| Keyboard | launcher focusable, Enter opens, Escape closes, focus returns to the launcher, measured |

`cta_chat_open` fires with its location from every entry point (launcher, nav, bottom bar, menu, section CTAs);
`src/lib/track.ts` still has no vendor, so the call is typed and made but goes nowhere.

## v4 / header refinement

The bar was a wordmark and two buttons with a thousand pixels of nothing between them. Three additions, all
inside the V4.1 spec (64px, transparent over the hero, --bg at 90% with blur after 8px, wordmark left, BOOK
and Menu right) and all measured on the production build:

- ~~**A scroll-progress rail**: 2px ember along the bottom edge, `scaleX` bound to `scrollYProgress`.~~
  **Removed 2026-10-19** at the owner's request, together with the horizontal pan's rail. Its case was that
  the home page ran to about 18,000px with two pinned scenes making the native scrollbar misreport it; the
  page is nearer 12,000px with one pinned scene now, so the case had thinned anyway.
- **A mark on the menu buttons**: two level rules on Menu, the same two crossed on the menu's own Close.
  Measured `rotate: 45deg` and `-45deg` on the crossed pair.
- **An ember underline on the wordmark**, `scale: 0 1` at rest to `scale: 1` on hover and on focus-visible.

One idea was built and then removed: the Menu rules morphing into the cross. Radix already exposes the state,
so it cost nothing to build, but the full-screen menu covers the trigger the instant it opens, so the morph
animated where nobody could see it. The two marks are now a matched pair instead.

The middle of the bar stays empty on purpose. There is no link list to put there: the mega menu holds the
navigation, and the alternative, inventing nav links that duplicate it, is what the density-3 language is
meant to avoid.

Measured after the change: header still 64px at 375 and 1440, Menu button 114x44, axe on the header 0
violations at both widths, no console errors, and reduced motion drops the transitions
(`transition-property: none`) while leaving every state correct.

### Mega menu: the panel jumped on open (reported, then measured)

Reported from the browser: on a pointer, the sub-menu appeared cramped beside the category headings for
about half a second after the menu opened, then snapped to the right-hand column. Verified by sampling the
DOM every frame through the opening rather than by reading the code:

```
  44ms  li.transform=matrix(1, 0, 0, 1, 0, 24)   panel x=426 y=88 w=234
 452ms  li.transform=matrix(1, 0, 0, 1, 0, 2.36) panel x=426 y=66 w=234
 719ms  li.transform=matrix(1, 0, 0, 1, 0, 0.25) panel x=426 y=64 w=234
 785ms  li.transform=none                        panel x=701 y=64 w=451
```

Cause: a CSS transform makes an element the containing block for its absolutely positioned descendants. The
reveal animated each row's `y`, so for the length of that animation the panel's `absolute right-0 w-[44%]`
resolved against the 52%-wide row instead of the full-width list, and the frame Motion wrote
`transform: none` it jumped to its real place.

Fix: the reveal animates a wrapper inside the row, never the row itself, so no ancestor of the panel is ever
transformed. Measured after:

```
  22ms  li.transform=none  wrapper.transform=matrix(1, 0, 0, 1, 0, 23)  panel x=701 y=64 w=451
 603ms  li.transform=none  wrapper.transform=matrix(1, 0, 0, 1, 0, 0.3) panel x=701 y=64 w=451
 670ms  li.transform=none  wrapper.transform=none                       panel x=701 y=64 w=451
```

The panel is in its final place on the first frame, and the rise still plays. Nothing else moved: the
stagger still cascades (wrapper opacity 0.42, 0.24, 0.07, 0, 0, 0 at 150ms), hovering categories 4, 6 and 2
switches to panels 3, 5 and 1 at a constant x=781 w=451, keyboard focus still opens the matching panel, row
tops stay at [64,130,197,263,330,396], and the phone disclosure is unaffected: 6 categories, 0 sub-links, no
scroll, and a tap still expands exactly one.

## v4 / page templates: craft pass (P4)

Refined in place across all five inner templates (Service, Hub, Guide, Compare, City and City hub, ~95 of
99 routes). Every section's order, copy and layout family is unchanged, and nothing a visitor reads today
changes meaning. What changed is the craft.

**The bundle finding that decided the motion system, written down so it is not re-argued.** The working
assumption was that the inner templates ship no animation library, so reusing MaskRise, CtaReveal or
Magnetic would add Motion to 95 routes. That is false. NavBar is a `'use client'` leaf that statically
imports `motion/react` for the scroll backdrop, SiteShell renders it from the root layout, and the motion
chunk (147,989 bytes raw, 49,055 gzip) is referenced in 99 of the 100 prerendered HTML files. Motion is on
every route's critical path already; reusing those components would have cost a few hundred bytes.

The reason this pass is still CSS-only is different and better. MaskRise, CtaReveal and PracticeRows all
server-render `opacity: 0` as an inline style and need hydration to clear it, and `motion-reduce` only
rescues reduced-motion visitors. This project has already paid for that once: see the `hero-word` comment in
globals.css, where a blocked bundle left the headline blank. On 95 pages whose entire value is readable body
copy, that is the failure the contract calls worse than no reveal. CSS scroll-driven animation has no such
state: inside `@supports (animation-timeline: view())`, a browser without view timelines renders the page
exactly as it rendered before this pass.

| Primitive | Motion | Spec | Communicates |
| --- | --- | --- | --- |
| Lead, hero CTA row, guide error text | CSS, time-based | `rise-in`: the existing `rise` keyframe, 600ms on `--ease-spring`, inline animationDelay 70 / 140ms. Server components, no observer: all are above the fold on every inner route | Hierarchy: the headline is already there, and the things that act on it arrive under it |
| Section, closing band | CSS, view timeline | `reveal`: `reveal-rise` on `animation-timeline: view()`, `animation-range: entry 5% entry 40%`, fill both. Anything already in view at load is past the range and paints at its final state | Hierarchy: each section is its own answer, met one at a time |
| FAQ disclosure | CSS, native | `.faq-row::details-content` block-size 0 to auto, 300ms `--ease-spring`, `content-visibility` with `allow-discrete`; `interpolate-size: allow-keywords` on html. Chevron CaretDown 0 to 180 over 240ms, ember when open | Feedback: the question opened |
| LinkRows hover | CSS | the ember hairline from PracticeRows, scaleX 0 to 1 from the left over 260ms on cubic-bezier(0.23, 1, 0.32, 1), replacing the row's own hairline rather than sitting beside it. `(hover: hover)` gated | Feedback: this row, and it is a door |
| LinkList, Breadcrumbs | CSS | transition-colors 200ms / 150ms on hovers that previously snapped | Feedback: the control answers the pointer |
| btn-secondary hover | CSS | `--shadow-lift` over 200ms. It had no hover state at all, so CHAT was dead under the pointer on every page of the site. No ember border: it would compete with the primary standing beside it | Feedback: the secondary is operable, the same as the primary |
| Service reading rail | IntersectionObserver, no library | `ReadingRail`: one tick per rendered `h2[id]`, the reader's own in ember, with the section's name under it. rootMargin `-96px 0px -55% 0px` clears the 64px header. aria-hidden and non-interactive, so it is not a second landmark and has no keyboard surface; a screen reader already has the heading outline | Orientation: where you are in a seven-section page, and the rail is still with you |

**Two things the audit caught that the plan had wrong, both recorded because they are easy to reintroduce.**

1. **Never put `rise-in` on an h1.** The first build faded the headline in on every template. The h1 is the
   LCP element on every inner route, and an element at `opacity: 0` is not painted, so fading it in holds
   the page's largest paint back by the length of the animation. The headline is now the already-visible
   default that everything else rises under, which is also what the craft floor asks for.
2. **A view timeline is scrubbed, not played, so a reader who stops scrolling parks it mid-animation.** With
   a straight opacity ramp that left body copy resting at part opacity, and `--muted` at 0.55 over `--bg`
   measures 4.03:1, under the 4.5:1 this system holds itself to. Axe caught exactly that, four nodes on the
   guide page at 1440 and only at 1440. `reveal` therefore uses its own keyframe, `reveal-rise`, which
   finishes the opacity by a third of the way in and spends the rest on transform alone. The worst a parked
   reveal can now do is sit mid-slide while fully legible.

**Motion exception, the third on the site.** `block-size` on `::details-content` is animated outside
transform and opacity. Same reasoning as the two already recorded: ErrorPanels animates its grid track
width, FaqTabs animates the answer's height, and an accordion cannot reveal an answer without one. One
property, on one pseudo-element, behind `@supports`.

**Open tension, recorded rather than resolved.** The craft floor asks for one authored moment rather than
one identical entrance on every section, and DESIGN.md says motion here is "motivated case by case; nothing
else moves". A single `reveal` on every `Section` is in tension with both. It is in because in-view reveals
were asked for explicitly, and it is held to one 12px beat so it reads as the page settling under the reader
rather than each section performing. The quieter alternative, if this ever grates: drop `reveal` from
`Section` and keep it only on the four closing bands, which leaves the reading rail as the single authored
moment.

**No JS was added to any route but the service template.** ReadingRail is the only new client code in the
pass; the other ~60 routes gain zero bytes.

### Page rhythm, inner templates

`Section` was `mt-14 md:mt-20` (56 / 80) with `mt-6` between a heading and its own body. 56px of separation
against 24px of internal gap let adjacent sections merge at 375. It is `mt-16 md:mt-24` now (64 / 96),
exactly half the home page's 128 / 192 between-section value: the same system at half density, which is what
a seven-section reading document wants and what eleven full-bleed scenes do not. The heading-to-body gap
stays at 24, so the ratio is 2.67 stacked and 4.0 at desktop. Closing bands moved to `mt-20 md:mt-28` with
`pt-10 md:pt-12`, so the page's last beat still out-ranks a section.

`h2` carried no `opsz` at all, on a variable display face where every other string on the site sets it to
match its own size: h1 steps 34 / 48 / 56 and all eight home headings step 30 / 48. A 24px heading at
Bricolage's default optical size rendered as a visibly different face from the h1 above it. It is
`text-[1.625rem]` with `'opsz' 26`, stepping to `2rem` with `'opsz' 32`, leading 1.15. It is deliberately
**not** converted to the home's 30 / 48: an inner h2 is subordinate to a 56px h1 and must not shout across a
seven-section page. The same omission was closed on the service lead (20 / 24), the FAQ question and
LinkRows title (18) and the service blockquote (18 / 20).

### Container widths: three, on purpose

Measured at 1440 as the h1's left edge, container minus `px-6`, and verified identical for every heading
within each page:

| Template | Container | Left edge | Why |
| --- | --- | --- | --- |
| Service, Hub, Compare | max-w-6xl | x=168 | A rail, a directory of full-width rows, a 3-up grid over a table. The page spine. |
| City, City hub, ~~guides index~~ | max-w-4xl | x=296 | Prose plus a 3-up strip. **The guides index left this row in Task 2** and is on the spine at x=168. |
| ~~Guide, compare index~~ Case studies | max-w-3xl | x=360 | Reading documents. Body copy is capped at 68ch regardless, so a 6xl guide would hold a 694px text column in a 1104px container under a 1104px h1. Strictly worse. **Both named pages have since left this row**: the guide in Task 1, the compare index in Task 6, each for a reason recorded in its own entry. `/case-studies/` is the only route still on this width. |

The x=168 spine rule is an **intra-page** rule, and both bugs it has caught were intra-page: a section whose
heading sat at x=296 while every heading above and below it sat at x=168. On a guide every heading then sat
at x=360, consistently, and nothing was out of line with anything. (**Re-measured 2026-10-21:** the guide,
the guides index and the compare index are all at x=168 now, and `/about/` and `/legal/guarantee/`, which
this table never listed, were `max-w-3xl` and are on the spine too. Five of the site's surfaces have come
onto one left edge over Tasks 1, 2, 5 and 6. Counted on disk afterwards, the narrowings that remain are
`/case-studies/` at 3xl, both city templates and `/pricing/` at 4xl, and `/contact/` and
`/free-site-check/` at 5xl, each of which holds a form or a strip rather than a reading column.) The widths were left alone deliberately:
changing a container on 95 routes is the highest-risk act available in a craft pass and it is how both of
those bugs were introduced. Recorded here so the next pass reads three widths as a system, not as drift.

### Also fixed in this pass

- **`RealScreen`'s sizes were wrong in both of its call sites, on the LCP image.** The component hardcoded
  `(min-width: 1024px) 60vw, 100vw`, but its service box is 432px (col-span-5 of a 12-column grid on a
  1104px inner container with 48px gutters) and its guide box is 720px (max-w-3xl less px-6). At 1440 the
  service page preloaded the 1080w candidate into a 432px box, a 2.5x over-fetch on the LCP element of the
  template that carries the search traffic. `sizes` is a required prop now and each call site passes its
  real box.
- **The FAQ summary was a 28px tap target.** `py-4` sat on the `details`, not on the `summary` that is
  actually the click target, so every question on 95 routes was a 28px row inside a 60px box. The padding
  moved onto the summary: same rendered height, a target you can hit.
- **Breadcrumb links were 20px tall**, the smallest target on the site and one axe does not flag. `py-1.5`
  takes them to 32px, clearing WCAG 2.5.8's 24px floor. Deliberately not the contract's 44: a 44px row of
  14px crumbs reads as a second nav bar under the real one, and the same trade is already recorded for the
  footer. Vertical padding only, so the first crumb stays on the spine.
- **The compare table's scroll container had no tab stop**, so a keyboard visitor could not reach the second
  half of it (axe `scrollable-region-focusable`, serious, at 375). It is `tabIndex={0}` with `role="region"`
  and a name now, the same treatment the home page's fix rail has.
- **LinkRows titles had no measure.** The summary was capped at 70ch and the title was not, so on a 1104px
  hub row a short title sat with its chevron 1104px away: the same defect recorded for the FAQ pills. The
  title is capped at 70ch, matching the summary beneath it.
- **FAQ questions were not headings.** `<summary>` set them as display type, so one piece of content had a
  real outline on the home page's FaqTabs and a flat one on 95 template routes. They are `<h3>` now;
  `<summary>`'s content model permits heading content intermixed with phrasing.
- **The FAQ chevron was a second vocabulary for one gesture:** CaretRight turning 90 here, CaretDown turning
  180 on the home page. It is CaretDown and 180 now. LinkRows keeps CaretRight, which makes "go there" and
  "open this" two different marks on purpose rather than by accident.
- **`whatWeDo` left an orphan tile.** The list holds 3 to 5 steps in a two-up grid, so an odd count stranded
  the last one beside a hole. An odd last step spans both columns.
- **`btn-primary` and `btn-secondary` had no reduced-motion branch** on their press scale, the one motion in
  the button system that was missing one.

### Noted, not changed

`src/components/Finder.tsx` is unmounted: zero importers across src, scripts, docs and design-system, and
the only reference is a passing mention in a TileGrid comment. Its own docstring claims it lives on the
knowledge base index, which does not import it. It is also the last component carrying `border-muted` and
square corners. Left in place because deleting working code is outside a design pass, and recorded here so
nobody spends a pass converting a component with no users.

Geist Mono is still 29KB for error strings only. `RealScreen` passes `preload` straight to next/image while
`Photo` hand-rolls `loading` and `fetchPriority` from the same prop name: two mechanisms, one concept. The
guide's safe-check ordinals are a 32px box carrying the 14px shape lock, which at that size reads as a
squircle. The four closing bands have four different heading ids for one thing. `prose` is exported from
parts.tsx and used only by LegalPending while six call sites inline the identical two classes.

## v4 / hub pages: cadence and directory (P5)

Six hub routes (`/wordpress-fix/`, `/wordpress-security/`, `/wordpress-performance-migration/`,
`/wordpress-maintenance/`, `/wordpress-development/`, `/woocommerce/`), one template,
`src/components/templates/HubTemplate.tsx`. The contact page's entry for the same pass is under
**v3 / contact** above, where the rest of that page is recorded; this section covers the hubs and the one
shell change the pass made.

### Layout families, per section

| # | Section | Family | Full bleed | Changed |
| --- | --- | --- | --- | --- |
| 1 | Hero | h1 on the whole 1104px spine, then a 6 / empty / 5 lead-and-photograph split under it | no | yes, the headline was inside the 7/5 split and read as a service page's opening |
| 2 | Service directory ("What we do here") | divided full-width rows, two columns from md up: 368 / 620 / 20 at 1440, one stacked column at 375 | no | yes, new `split` variant on `LinkRows` |
| 3 | Problem grid ("Most urgent problems") | 2-up card grid, optionally one full-width lead panel | no | yes, sort order and the lead panel |
| 4 | Closing band | hairline over a heading-left, buttons-right row | no | yes, copy |

The directory is the reason the pass existed. Eleven stacked title-over-paragraph rows read as one block of
text, so the summary moved into a column of its own and the titles became a single scannable column on the
spine with the summaries answering across the gutter. `LinkRows` is one grid with three cells now and
`split` only re-places them, so the five existing call sites render exactly what they rendered before. The
title column is `minmax(0,18rem)` at md and `minmax(0,23rem)` at lg, a measure rather than a fraction: a
23rem column at 768 would leave the summary at 38ch, under what a sentence needs.

### Rhythm: 128 / 64 / 112 at desktop, 80 / 64 / 80 stacked

Measured on a production build, `margin-top` of each section at 1440 and at 375:

| Interval | 1440 | 375 | Why |
| --- | --- | --- | --- |
| Hero to directory | 128px | 80px | The directory is what the page is for, so it opens at the home page's between-section value, not the reading document's |
| Directory to problem grid | 64px | 64px | These are the errors the services above fix, not a third subject, so the grid sits close under them |
| Problem grid to closing band | 112px | 80px | The last beat still out-ranks a section, as on every other template |

The inner-template baseline recorded under **P4** is `mt-16 md:mt-24` on every `Section`, which is right for
a seven-section guide and wrong here: a hub is three or four beats, and running them all at one interval
leaves the page with no cadence at all. Stacked, every interval stays at or above the 64 that P4 set as the
floor, because at 375 anything less merges two sections into one.

**tailwind-merge only resolves a conflict within the same modifier.** The middle interval shipped at 96px
for one commit while a code comment above it asserted 64. `className="mt-16"` on a component whose base is
`mt-16 md:mt-24` leaves `md:mt-24` standing: the two classes do not conflict, because one is bare and one is
`md:`. The built class string was `reveal md:mt-24 mt-16`, and nothing in the source read as wrong. Write
both modifiers (`mt-16 md:mt-16`), and check an overridden responsive utility in the built HTML rather than
in the JSX.

### Urgency drives order and weight, and is never printed

`guide.urgency` sorts the problem grid (critical, high, standard) and decides whether the first panel takes
the full 1104px. The word itself came out of the row entirely. It could not be made to read well on any hub:
on `/wordpress-fix/` all six guides are `critical`, so it said nothing; on `/wordpress-security/` it printed
"Critical" on four of five panels; and on `/wordpress-performance-migration/` it labelled three of four
panels "Standard" directly under a heading reading "Most urgent problems", which contradicts the heading. A
ranked list under that heading does not need every row to restate its rank.

The lead panel is gated on `topGuides.length > 2 && topGuides[0].urgency === "critical" && !!topGuides[0].errorText`.
**The `errorText` half of that gate is a silent dependency on content order**: reorder or reword the guides
so the worst one carries no error string and the lead panel disappears with no warning and no failing check.
It is in because a 1104px box holding one 18px line reads as a broken state rather than as weighting, which
is what gating on urgency alone gave the fix hub. Today only `/wordpress-security/` qualifies, measured:
1104px lead panel there, 544px panels on the other three hubs that render the grid.

`/wordpress-fix/` therefore renders a uniform 2x3 grid with no lead panel, **deliberately**. All six of its
guides are equally critical, so widening one because it happens to carry an error string would be emphasis
the data does not support, and six panels fill a 2x3 grid with no tile stranded beside a hole. The monotony
this pass existed to remove was the section cadence, and that is what the 128 / 64 / 112 interval ships.

### Motion

No new motion was invented. Each primitive is the one already recorded under **P4**, and all of it is CSS.

| Element | Primitive | Communicates |
| --- | --- | --- |
| Hero lead, hero button row | `rise-in`, 600ms on `--ease-spring`, inline delay 70 / 140ms | The headline is already there, and what it means and the buttons that act on it arrive under it |
| Directory, problem grid | `reveal` on `animation-timeline: view()` | Each section is its own answer, met one at a time |
| Directory row hover | ember hairline, scaleX from the left over 260ms, `(hover: hover)` only | This row, and it is a door |
| Problem panel hover | border and shadow to `--line-strong` / `--shadow-lift` over 200ms | The panel is a door too, but a quieter one than the row |
| Closing band | `reveal` | The page's last beat arrives with the reader |

The h1 carries nothing, for the reason P4 records: it is the LCP element and an element at `opacity: 0` is
not painted.

Reduced motion: `rise-in` resolves to `animation: none`, so the lead and the buttons are simply present;
`reveal` is inside `@media (prefers-reduced-motion: no-preference)`, so under `reduce` no view timeline is
created and every section renders at its final state; the hover hairline and chevron nudge carry
`motion-reduce:transition-none`. Verified at 1440 under `prefers-reduced-motion: reduce` on a production
build: every `.reveal` and `.rise-in` at opacity 1 and transform none.

### The mobile action bar does not render on /contact/

The fixed bottom bar under 768px (`NavBar`, recorded under **v4 / header refinement**) carries BOOK and a
chat icon. BOOK navigates to `/contact/`, so on `/contact/` itself the bar sat a no-op button and a second
chat trigger on top of the one form the page exists for. It is suppressed there: `NavBar` compares
`usePathname()` against `routes.contact` and, on every route that keeps the bar, marks the header with
`data-action-bar`.

That attribute is what reserves the bar's space, so the space goes with the bar. The reservation used to be
a `pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-0` on `body` in the root layout plus
`html { scroll-padding-bottom: 6.5rem }` in globals.css, neither of which can see the route. Both are now one
`@media (width < 48rem)` block keyed on `html:has(header[data-action-bar])` and `body:has(...)`, so
`/contact/` releases 76px of bottom padding and goes back to the desktop 2rem scroll padding instead of
gaining dead space on a phone. The marker sits on the header rather than on the bar itself because the bar
unmounts while the mega menu is open: measured, `body` holds 76px of padding with the menu both closed and
open, so nothing shifts behind the overlay.

Measured at 375 on a production build: `/contact/` has no bar, `padding-bottom: 0px`,
`scroll-padding-bottom: 32px`, no gap below the footer, and one chat trigger rather than two.
`/wordpress-fix/` has a 73px bar, 76px of padding and 104px of scroll padding, unchanged.

**`/free-site-check/` keeps its bar, deliberately.** It runs the same `BookingFlow` in `check` mode, but the
bar's BOOK is a real navigation there, to the paid booking flow, which is the escalation that page exists to
offer. The duplicate-trigger argument is weaker too: the chat launcher is already hidden under md on both
form pages, so the only other trigger on the page is a word inside a sentence. Nothing about the bar is
wrong on that route, so nothing changed.

### Correction to the contact entry above

That entry's claim that CHAT is "the house `btn-secondary`" is right about the contact page and should not be
read as a claim about the site. Counted, and counted wrong twice before this line settled: 25 `ChatButton`
call sites, **18** with `btn-secondary`. The seven that do not are `/free-site-check/`, `/pricing/` and
`BookingFlow`'s success screen, where CHAT is still a bare word inside a sentence; `CtaPair` in
`src/components/Cta.tsx`, which has zero importers; `Finder.tsx` and `CommandPalette`, which give CHAT
`btn-primary` because no other call to action sits beside it there; and the home page's `FinalCta`, a
deliberate large underlined text link beside the primary. Two of those seven ship on no route at all, so
the count flatters the problem: `CtaPair` has no importers and `Finder.tsx` is mounted nowhere.

The number is recorded here and deliberately **not** repeated in a code comment, because it was written
into one as a count twice and was wrong both times. A figure that changes whenever anyone adds a CHAT
does not belong next to the markup it describes. A later pass should take the three sentence-inline ones;
they were out of scope here, and
`CtaPair` in `src/components/Cta.tsx`, which pairs the two the same way, has zero importers.

### Deliberately not done

- **No change to the five existing `LinkRows` call sites.** `split` is opt-in for that reason.
- **No guide counts, badges or "N problems" anywhere.** The content has no count that is true across hubs.
- **The heading "Most urgent problems" stays.** As a superlative over the guides a hub actually has it stays
  true even when the most urgent one is only `high`. "Problems we see most" would be an invented statistic.
- **The container width is untouched.** The hub stays at `max-w-6xl`, x=168, the spine P4 recorded.
- **`sizes="432px"` on the hub hero photograph over-declares by about 14% at 1024.** Exact at 1440, on a
  non-LCP image, and costs one candidate step. Left.
- **`Section`'s baseline interval was not changed** to fit the hub. The hub overrides it at both modifiers;
  the other ~90 routes keep 64 / 96.

## v4 / guide template: the 37 money pages (Task 1)

`GuideTemplate` is the search-traffic surface: 37 routes, one per error. This pass changed what the page is
made of, not what it says. **It supersedes two rows of the tables above**: the template table's "Guide /
single-column troubleshooting document" and the container table's "Guide, compare index | max-w-3xl". The
guide no longer runs at `max-w-3xl`. (At the time of writing the compare index still did. It no
longer does either: Task 6 moved it to the `page` spine, and the container-table row is corrected
above.)

| Layout family | Eyebrows | Marquee | CTA intents | Client islands |
| --- | --- | --- | --- | --- |
| Split header (error, then the picture of it) over a lead column with a sticky rail at lg | 0 | 0 | BOOK, CHAT, CHECK | `ReadingRail` only |

### The container is `max-w-6xl` now, and the reading measure did not move

The old entry's argument against a wide guide was "a 694px text column in a 1104px container under a 1104px
h1". That argument is against a **wide single column**, and it is right. It is not an argument against a
wider container, because the column the text sits in is set by the grid, not by the container: the document
runs in `lg:col-span-8` of the same 12-column grid the service page uses, which measures **720px at 1440**,
which is exactly what `max-w-3xl` less `px-6` held. Measured on the production build: lead column 720px,
rail 336px, every heading at x=161 (the 15px scrollbar off the x=168 spine), and paragraphs still capped at
`68ch` inside it, with the symptom and safe-check lists now capped at 68ch too (they were running the full
720px, which is 88 characters).

So the page gained the right-hand 336px and lost nothing of the measure. What fills it is the service
page's rail family: card, BOOK, CHAT, and `ReadingRail`'s ticks. **That is a family repeat across the site
and it is deliberate**: contract rule 3 forbids a family repeating *within one page*, and a visitor reading
a guide is not looking at a service page. It is also the only place on this page where conversion sits
above "When to call us", which is the order a Read surface wants: comprehension first.

Three container widths are still three on purpose; this changes which bucket the guide is in, from
"reading document" to "page spine", because it now has a rail like the other spine pages.

### Every guide has a banner, which is what the pass was for

All 37 guides declare an `image.slot` and 4 captures exist, so `RealScreen` returned `null` on 33 of them
and those pages had no image at all. The guide now uses the fallback the service hero already uses: the
real capture when the file exists, otherwise `servicePhotos[g.parentService]` through `Photo`, in the same
`p-2` frame in the same column, so the banner is one shape across all 37. One **shape**, not one height: the
photograph's box is 16:10 because that is the photographs' own ratio (1600x1000), so the frame crops
nothing, while the four captures measure 2.13, 1.78, 1.66 and 1.78 and each keeps its own. An earlier
version of this entry claimed one height; it was wrong, and the code comment that claimed it has been
corrected too. The photograph carries **no alt**: `g.image.alt` describes the capture that does not exist on those pages, and lending it to a stock
frame would describe the wrong picture.

**The fallback is a banner, not the picture the page should have, and the gap is still 33 of 37.**
Re-counted from disk for this entry: 37 guides declare an `image.slot`, `public/screens/` holds four
PNGs, so 33 guides show their parent service's night frame. Several guides share one service, so a
reader moving between siblings sees the same frame more than once; `docs/image-todo.md` carries the
slot list, the sizes and the art direction, and `npm run capture` (which needs Docker, unavailable
here) writes them. Three statements in that file still read "still empty" or "also empty" for `public/screens/`,
which has not been true since 2026-10-19. The capture arm emits a real `<link rel=preload as=image>`; the
photo arm is `loading=eager` with `fetchpriority=high`, which is what `Photo` has always done. Neither
fades, and neither does the h1.

`sizes` is `(min-width: 1152px) 336px, (min-width: 1024px) 30vw, 100vw`. Measured on the production build:
the cell is 336px from 1152 up, 288px at 1024, full width below, and the image inside it is 16px narrower
than the cell because the frame holds it in `p-2`. The hub photograph's recorded 14% over-declaration at
1024 is the same shape of error; the middle condition costs one media query and keeps a 2x tablet a
candidate step cheaper. At 1440 the page fetches the 384w candidate into a 320px box and at 375/2x the 750w
into a 343px one, which are the right candidates in both cases.

The first version of this pass declared 432px, because the banner was `col-span-5` of a 7/5 header. That was
the wrong structure, for a reason a screenshot caught: the header ran 7/5 over a body that runs 8/4, so the
banner and the rail card beneath it shared a right edge, were 431px and 335px wide, and the right column
stepped 96px sideways between the two. **The page is one 8/4 grid now**, header and body, which is what puts
the banner and the card on one left edge. The alternative was moving the body to 7/5, which was rejected on
the measure: a 648px reading column is under the 68ch cap, so the measure would have become
container-bound rather than `ch`-bound, which is the one thing constraint 8 forbids. Measured after the
change at 1440: banner and card both `left: 929, width: 336`, 48px apart, h1 720px wide on the same spine as
the 720px reading column. At 1024: both `left: 697, width: 288`, 48px apart. At 375 the aside is
`display: none` and nothing moved.

### The error string is the anchor, and it is sized to itself

20 of 37 guides have `errorText`. It was a 14px mono line under the h1; it is now a 16px mono plate on
`--surface-2` with `px-5 py-4`, in the header's left column with the banner beside it. Two details that are
not decoration: it **wraps** (`[overflow-wrap:anywhere]`) instead of scrolling, so a 90-character file path
inside a 648px column does not create a scrollable region with no tab stop (the defect this ledger already
records against the compare table), and it is `w-fit max-w-full`, because "502 Bad Gateway" in a 648px box
read as an empty panel with a few characters in the corner.

### Headings: 22 / 26, this page only

The shared inner `h2` is 26 / 32 and five templates render it. The guide sets its own step one below that,
22 / 26 with `opsz` to match, as a scoped descendant override on the `<article>`
(`[&_h2]:text-[1.375rem] …`) rather than as a new prop on `Section`: `Faqs` renders its own `Section` and
would have needed the prop threaded through it, and a concurrent task imports `Section`. Against 17px body
26px is a 1.53 ratio, which scans without shouting, and the heading is no longer the loudest thing on a
page that now also carries an error plate, a banner and a rail. `impeccable detect` raises its
`design-system-font-size` advisory on `1.375rem`; it raises the same advisory on the shipped `1.625rem`,
because DESIGN.md's ramp documents the home page's scale and the template layer has always run its own.

### The sibling heading was broken English

`More ${parent.title.toLowerCase()} errors` rendered "More wordpress critical error fix errors": the
parent's title is a service name, not a noun phrase you can interpolate into a sentence. It reads **"Other
errors we fix"**, which is the heading the service page already gives the same list of guides, so it is not
a new claim. The rows now carry `symptoms[0]` as their summary, the same way the service page's guide rows
do, so the section is scannable instead of a list of bare titles.

### Measured, production build, `next start` on the LAN address

axe-core 4.14: **0 violations of any impact** on `/guides/502-bad-gateway/` at 375, 768, 1024 and 1440 under
`prefers-reduced-motion: reduce`, on `/guides/php-fatal-error/` at 1440 and 375, and on
`/guides/white-screen-of-death/` at 375 and at 1440 with motion enabled. No horizontal scroll at any of the
four widths. Under `reduce` the h1, the error plate and every section render at their final state (`rise-in`
resolves to `animation: none`, `reveal` lives inside a `no-preference` block) and the h1 carries no
animation at all, which is why it is the one element that can be the LCP without a repaint.

### Deliberately not done

- **No facts list in the rail.** The service rail's `typicalTurnaround` / `priceFrom` dl renders nothing:
  both are `null` on all 32 services. Contract rule 8 says a null renders nothing, so the right amount of
  code for it here is none.
- **No hero CTA row.** The rail carries BOOK and CHAT at lg, the global action bar carries them under 768,
  and "When to call us" carries them everywhere. A fourth pair above the fold would make an informational
  page open with a sales pitch.
- **No closing band.** The service page's closing split is a third CTA family; the guide ends on its
  siblings, which is where a reader who is not ready to book should be sent.
- **`items-center` on the header, with the whitespace that implies.** On the 17 guides with no `errorText`
  the left column holds only the h1, so there is about 79px of slack above and below it against a 273px
  banner. At density 3 that is the system working, not a hole: the alternative was inventing a subtitle.
- **The "hairline" under the FAQ heading is the letter Q.** Recorded because it cost an investigation and
  should cost nobody another one. The FAQ heading "Questions" appears to be underlined on every template,
  including the untouched `/wordpress-fix/white-screen/`, while no other heading is. It is not a decoration:
  computed `text-decoration-line` is `none` on the heading and on every ancestor, `elementsFromPoint` finds
  nothing at that pixel, and it survives changing the id. It is **Bricolage Grotesque's capital Q**, whose
  tail is a long horizontal stroke that runs along the baseline under the letters that follow it. Probed on
  the production build at 26px in the live page: "Q" alone draws the line, "O" alone does not, "Questions"
  draws it, "Oestions" does not, and the same string in `system-ui` does not. Nothing to fix; the typeface
  is doing what it was drawn to do, and "Questions" is the only heading on the site that starts with a Q.

## v4 / knowledge base index (/guides/, Task 2)

One route, and the entry point to all 37 guide pages. **It amends the container table's "City, City
hub, guides index | max-w-4xl | x=296" row**: the city templates keep `max-w-4xl`, the guides index
does not. It kept x=296 while the 37 guide pages it opens moved to the `max-w-6xl` spine in Task 1,
so the index was narrower than every page it linked to. It runs on bare `page` now, x=168, which is
the same left edge as the guides, the hubs and the services.

| Layout family | Eyebrows | Marquee | CTA intents | Client islands |
| --- | --- | --- | --- | --- |
| Lead-and-instrument header (7/5), one grouped column-flow index, closing band | 0 | 0 | BOOK, CHAT, CHECK | `Finder` only |

### What it was

**Seventeen** near-identical sections, one per parent service that has guides, each a 32px `Section`
heading over one to four 14px chips in a 2-up grid, closed by the sentence "How we fix these:
`<service>`" in ember underline. 5,711px at 1440 and 8,002px at 375, measured.

**Seventeen, not sixteen.** The brief for this pass said sixteen and the first version of this entry
repeated it without checking. 32 services exist, 17 of them have at least one guide, and both the old
page and the new one render exactly `services.map(s => ({s, gs: guidesFor(s.id)})).filter(x => x.gs.length)`.
Derived from `src/content`: group sizes are 2,4,1,1,4,2,2,4,2,1,3,3,1,1,3,1,2 in page order, which is
17 numbers summing to 37, and counted in the built HTML the directory renders 17 `h3` and 54 links. No search, no filter, and the hierarchy
inverted the whole way down: the headings were the loudest thing on the page and the guide titles,
which are the content, were the quietest.

### What it is: two ways in, not seventeen sections

1. **`Finder`**, mounted for the first time. Free text in, the top three matches out, each resolving
   to a service so BOOK always has a target.
2. **One directory**, all 37 guides grouped under the 17 services that fix them, in a **column
   flow** (`columns-1 md:columns-2 lg:columns-3`) rather than seventeen stacked sections. The service
   title is now itself the link, which keeps all seventeen internal links to the service pages and
   loses seventeen repetitions of a sentence.

Three layout families, none repeated within the page. The closing band is the hub template's, which
is a cross-page repeat and deliberate: contract rule 3 forbids a family repeating *within* a page.

**Column flow, not a grid.** Seventeen groups of one to four rows (sizes sorted:
1,1,1,1,1,1,2,2,2,2,2,3,3,3,4,4,4) have four different heights spread unevenly, and a grid would leave
holes; the flow packs them and `break-inside-avoid` keeps a service with its
guides. The flow is column-major, so tab order and reading order are the same order. The groups
carry no border and no surface, because three bordered boxes in a row is three equal cards; a
hairline down each group's left edge says where it starts and ends instead.

### The error string is on the row, and that decision was made twice

The first version of this page gave the 20 guides that carry `errorText` a two-column ruled list of
their own above the index, mono-led, with the guide title answering underneath. It read well at
1440 and it was wrong: it put 20 of the 37 guides on the page twice, and it cost **1,712px at 375**
for links that were already below it. Measured, that version was 3,675px at 1440 and 8,161px at 375,
which is a `<main>` of 2,763px and 5,601px: *taller than the page it replaced* on a phone, where the
page it replaced measured 5,442px.

So the quoted line moved onto the row it belongs to, under the title, in 14px mono on `--muted`. The
titles are phrased for search ("WordPress 502 bad gateway") and the strings are what is actually on
the visitor's screen ("502 Bad Gateway"), so the two are not redundant on any of the 20. 17 guides
have no `errorText` and render a title and nothing else, which is contract rule 8 working.

`line-clamp-2` with no `block` beside it (both set `display`, and the plain utility silently kills
the clamp), and `[overflow-wrap:anywhere]` so a 90-character line wraps rather than making a
scrollable region with no tab stop. Same two details as the guide page's error plate, same reasons.

### Measured, production build

| | Before | After | Change |
| --- | --- | --- | --- |
| Document height, 1440 | 5,711px | 2,921px | -49% |
| Document height, 375 | 8,002px | 6,992px | -13% |
| `<main>` height, 1440 | 4,799px | 2,009px | -58% |
| `<main>` height, 375 | 5,442px | 4,432px | -19% |
| Unique guide URLs in the HTML | 37 | 37 | unchanged |

The footer measures 912px at 1440 and 2,484px at 375 and is the same on both sides of the change, so
the `<main>` figures are the honest ones (at 375 the 76px the action bar reserves on `body` comes out
too). The phone improves least because a one-column index of 54 targets at 44px has a floor the
desktop does not: the 37 guide links and the 17 service links **are** the page.

Spine, measured at 1440: the h1 and both h2s at x=168, which is `max-w-6xl` less `px-6` and the same
edge the hubs, the services and the guides sit on.

### `Finder` went from unmounted to mounted, and was converted to v4 on the way

It had zero importers. Its own docstring said it lives on the knowledge base index, and the index was
the one page with no way to search it. It was also the last component in the repo still carrying v2's
square corners and `border-muted`:

| Before | After | Why |
| --- | --- | --- |
| `border border-muted`, no radius | `rounded-[14px] border border-line-strong` | 14px is the shape lock; `--line-strong` (3.36:1) is the only hairline weight allowed to identify a control, and `--muted` is a text colour, not a border token |
| `focus-visible:border-text` | the global 2px ember ring at 2px offset | A border that changes colour is not a focus indicator; `globals.css` already ships the house ring |
| `min-h-14` (56px) | `min-h-12` (48px) | Still over the 44px floor, and 56px read as a form field on a page that is not a form |
| Result row link was bare inline text | `inline-flex min-h-11 items-center` | It was a ~22px target in a 46px row |
| `border-t` on the list plus `border-b` on every row | `divide-y divide-line border-y border-line` | The house `LinkRows` treatment, and one hairline per boundary rather than two |
| No-match box: `border border-muted p-4`, square | `rounded-[14px] border border-line bg-surface p-5 shadow-card` | It is a card, so it is the card |
| No hover state on the control | `hover:border-text/50` | A control with one static boundary gives the pointer nothing back. White at 0.50 is **deliberately above `--line-strong`'s 0.36**: it is the same boundary getting brighter, not a second token, and the resting state is still the one the contrast table covers. Pointer only, and it carries the input's existing 200ms colour transition |
| BOOK per result: `btn-primary` | `btn-secondary` | Three ember fills stacked in one answer, under a header that already carries one, is the page shouting at someone who has just started typing. The row's own link is what they asked for; BOOK is the escalation beside it, and it still carries the service and the guide |

**The live region is mounted from first render**, and only its contents are conditional. It used to
be `{show && <div aria-live="polite">...}`, so the region and its first content arrived in the same
mutation: a region a screen reader has not been observing yet, which can swallow the first answer,
the one the visitor is actually waiting for, while every answer after it announces normally. That is
why it reads as working and why axe cannot see it, the attribute being correct and the timing not.
The `mt-6` stays conditional with the contents so an empty region takes no space.

`Finder`'s own `ChatButton` is untouched and stays `btn-primary`: it sits in the no-match card as the
only action there, which is exactly when a primary is right. **One line of the P5 entry is now
stale**: its CHAT census listed `Finder.tsx` among the call sites that "ship on no route at all".
`CtaPair` still has zero importers; `Finder` does not. No count is restated here, for the reason P5
gave and commit cee284a acted on: a figure that moves whenever anyone adds a CHAT does not belong
beside the markup it describes.

**Why a client island on a page that ships almost no JS.** Constraint 6 asks for a stated reason.
Free-text scoring against 52 candidates' titles, error strings and symptoms is not something CSS can
do, and the ranked answer has to arrive while the visitor types. The index itself is plain
server-rendered anchors, so **all 37 guide URLs are in the HTML with no interaction in the way** and
nothing a crawler needs depends on hydration. The payload is `matchIndex` plus a title-and-path map,
which is the same shape `/contact/` already ships to `BookingFlow`.

**It filters on a production build**, which is the only place it can be checked: the Windows dev
server does not hydrate from WSL, so dev-server behaviour proves nothing here. Measured on
`next start`: "blank white page after update" returns the white-screen guide, its service and the
after-update guide; "502" returns "WordPress 502 bad gateway" first; "zzzzqqq" returns the no-match
card with CHAT and CHECK.

### JSON-LD

A `CollectionPage` whose `mainEntity` is an `ItemList` of all 37 guides, built in
`collectionLd` (`src/components/JsonLd.tsx`) from `src/content`, so the list cannot claim the page
holds something it does not render. `numberOfItems: 37`. No `HowTo` and no `AggregateRating`: there
is no complete how-to and no review data. `breadcrumbLd` still emits from `Breadcrumbs`.

### Motion

| Element | Primitive | Communicates |
| --- | --- | --- |
| Hero lead | `rise-in`, inline delay 70ms | The headline is already there; what it means arrives under it |
| Search control | `rise-in`, inline delay 140ms | The instrument arrives after the sentence that explains it |
| Index, closing band | `reveal` on `animation-timeline: view()` | Each section is its own answer, met one at a time |
| Group heading, guide row, service link | colour to `--accent-text` over 200ms | This row is a door |

Nothing on the h1. Under `prefers-reduced-motion: reduce`, `rise-in` resolves to `animation: none`
and `reveal` lives inside a `no-preference` block, so every element renders at its final state;
measured at 1440 with 0 elements in `main` at `opacity: 0`. With motion enabled exactly one element
is parked at 0 at load, the below-fold closing band, which is what a view timeline does before its
range starts and what every `reveal` on the site has always done; verified to resolve to opacity 1
and no transform once scrolled to.

### Measured, axe-core 4.14

0 violations of any impact at **375, 768, 1024 and 1440**, and at 1440 under
`prefers-reduced-motion: reduce`. One h1 at every width, no horizontal scroll at any width, and no
computed border radius inside `main` other than 0 or 14px.

### Deliberately not done

- **No filter chips and no tabs over the index.** The home page's `TileGrid` already owns that
  pattern and it needs a client island to hold the state; 37 rows under 17 named groups with a
  search box above them does not.
- **No hub level in the directory.** The services already arrive in SITEMAP order, which runs hub by
  hub, so the clusters are there without a fourth heading level to carry them.
- **No guide counts, no "N articles", no urgency printed on a row.** Same ruling as the hubs: the
  content has no count that stays true, and a rank restated on every row contradicts itself.
- **`urgency` is not used on this page at all.** It sorts the hub grids; here the SITEMAP order is
  the one a visitor can predict, and re-sorting 37 rows by severity inside seventeen groups of one to
  four would reorder nothing visible in most of them.
- **The 44px floor was kept on all 54 directory links**, which is the single largest cost at 375.
  The crumb and footer deviations recorded above would have allowed 24px here and saved roughly
  370px on a phone; a knowledge base index is what the page is *for*, not orientation furniture, so
  it keeps the contract's figure.

---

## v4 / guarantee (/legal/guarantee/, Task 3)

One route, reached from the footer's "Legal" column and from the home page's guarantee section. It
was **broken rather than boring**: the page returned a bare `<article>` with no container and no
classes, so its text started at x=0 and the first lines sat under the fixed 64px header with the
wordmark drawn over the h1, and it printed the raw `{{CONFIRM support email}}` token to screen
twice, once as a `mailto:` and once as the visible link text.

| Layout family | Eyebrows | Marquee | CTA intents | Client islands |
| --- | --- | --- | --- | --- |
| Reading column with a standing answer card (7/5 at lg) | 0 | 0 | BOOK, CHAT | none |

### The container is the whole of the first fix

`page` + `pageY` from `parts.tsx`. `pageY` is `pt-24 pb-8 md:pt-28 md:pb-12` and exists precisely to
clear the 64px bar, so the overlap needed no new value. Measured on the production build at 1440:
the breadcrumb lands at y=112 under a header whose bottom edge is y=64, and the crumb, the h1, the
summary and the "What we promise" h2 all sit at x=168, the same left edge as the hubs, the services
and the guides. One heading is deliberately off that edge: the card's own h2 is at x=865, inset by
the card's padding inside the right-hand column, which is the panelled-heading case `docs/qa-report.md`
already records against `/contact/` and is not a misalignment.

### 7/5, and the three shapes it is not

Left seven columns are the guarantee's own column and are where the owner's real terms land, so the
page needs no relaying when they arrive; the measure is capped at `max-w-[60ch]`, never by narrowing
the container (constraint 8). Right five columns are one `card` holding the way out, `lg:sticky
lg:top-24` so it clears the bar and stays with a reader the moment the left column grows past a
screen. It does nothing today on a 1,677px page, which is the point of putting it there now.

- **Not `max-w-3xl`.** That is the fault this plan opens with, and this page holds less content than
  the guides the complaint was written about.
- **Not `ServiceTemplate`'s 8/4 lead column plus `ReadingRail`.** The rail is several stacked blocks
  arguing a service; there is one question here and one answer to it.
- **Not the home page's `Guarantee` section** (masked type over a photograph). The link lands on the
  page that explains; the section is the page that announces. They share the number, the notice
  wording and the accent, and nothing else.

### The token, and the route to a human that does not depend on it

`const hasEmail = !brand.email.includes("{{")` at module scope, the same guard `/contact/` and
`SiteFooter` carry. The `mailto:` and the visible address render only inside it, so with the token
unset the email line is **not in the DOM at all**. Re-measured on this build at 375 and 1440:
`document.body.innerText` contains no `{{` on this route or on any of the nine others swept in
`docs/qa-report.md`. The card's BOOK and CHAT both work with `brand.email`, `brand.chatProvider` and
`brand.bookingProvider` all unset, which is the config's current state, so the way out never
depended on the address.

### Still a placeholder, and still marked as one

`brand.guarantee.summary` prints verbatim and still reads `Placeholder: one sentence on what the
guarantee covers and how to claim it.` Above it, in the home section's words and the same dashed
`--line-strong` box, "Placeholder guarantee, not a real offer. Replace before launch." It sits
**between the h1 and the summary** so the caveat is read before the sentence it qualifies. `14`
comes from `brand.guarantee.days` and appears once, in the h1. `robots: { index: false }` and the
`notFound()` when `brand.guarantee` is unset both stay.

### The fix round: no fall-through to fixmywp.com

The first version fell back to `brand.legacy.facts` when `brand.guarantee` was unset. That guarantee
belongs to fixmywp.com, a different and still-trading company; `brand.ts` says so in writing and
CLAUDE.md forbids reusing its content on any variation. Commit `3d1f794` removed the branch. The
behaviour that remains is a strict superset of the 404 that was there before: the page still 404s
when no guarantee is set, and the only path removed is the one the spec forbids.

### Motion

| Element | Primitive | Communicates |
| --- | --- | --- |
| h1 | none, ever | It is the LCP element; `globals.css` records why nothing fades it |
| Summary line | `rise-in`, inline delay 70ms | The one sentence the guarantee says today arrives under the headline |
| Answer card | `rise-in`, inline delay 140ms | The way out arrives after the thing it is a way out of |
| "What we promise" | `reveal` on `animation-timeline: view()` | A below-fold section met as the reader reaches it |
| Placeholder notice | none | A caveat that performs is a caveat competing with itself |

Transform only since Task 8 (see its entry). Under `prefers-reduced-motion: reduce`, `rise-in`
resolves to `animation: none` and `reveal` lives inside a `no-preference` block, so every element
renders at its final state: re-measured at 375 and 1440 on this build, 0 elements in `main` at
`opacity: 0` with JS disabled, and every `.reveal`/`.rise-in` at opacity 1 and `transform: none`
under reduce.

### Measured, production build

Document height 1,677px at 1440 and 3,758px at 375; `<main>` 766px and 1,198px. axe-core 4.14: 0
violations of any impact at 375, 768, 1024 and 1440 over 20 park positions, and 0 under reduced
motion. One h1 at every width, no horizontal scroll, no computed radius in `main` other than 0 or
14px. Full figures in `docs/qa-report.md`.

### Deliberately not done

- **No guarantee terms.** Not one clause, not one condition. User decision 2 and constraint 1. The
  page is thin because its content is genuinely unconfirmed, and a page that invents terms to look
  finished is the one outcome worse than a thin one.
- **No `AggregateRating`, no `Review`, no `HowTo`.** No review data, and this is not a procedure.
  The only JSON-LD here is the `BreadcrumbList` that `Breadcrumbs` emits; `/legal/` sits outside
  SITEMAP (`routes.utilityPaths`), so the trail is built by hand rather than walked.
- **No second legal link in the body.** A visitor here is mid-decision, so the page may not end by
  sending them to another policy document. Terms sits last in the card, after BOOK and CHAT.
- **Four of `brand.claims`, not eight.** `fixedPrice`, `backupFirst`, `ownLogin`, `accessRemoved`
  are the protection claims and answer "what protects me"; `sameDay`, `bookingMinutes`, `vetted`
  and `checkTurnaround` are speed claims and answer something else. They were a local array here
  until Task 8 made them one source; see its entry.

---

## v4 / about (/about/, Task 5)

One route, and the only page whose subject is the business rather than a service, an error or a
policy. **It amends the container table's `max-w-3xl` row for `/about/`**: the page runs on the bare
`page` spine now, x=168, the same left edge as the hubs, the guides and the knowledge base, with
every measure capped in `ch` instead.

| Layout family | Eyebrows | Marquee | CTA intents | Client islands |
| --- | --- | --- | --- | --- |
| Masthead over a full-width photographic band, ruled hub directory, left-rail progression, closing band | 0 | 0 | BOOK, CHAT | none |

### What it was

47 lines in a `max-w-3xl` column: h1, one sentence, a `LinkRows` of the six hubs, a
`dl.grid.sm:grid-cols-3` over the three `remoteDelivery` entries, a CTA pair. **No image anywhere**,
on the one page whose whole job is to make a stranger trust a remote team, and the three-card grid
was not a taste call: three equal cards in a row is banned outright by contract rule 6.

### Four families, none repeated within the page

1. **Masthead over a full-width photographic band.** The words run the full 1104px spine and the
   photograph runs under them at the same width. Deliberately none of the site's four split headers
   (hub 6/5, guide 8/4, knowledge base 7/5, guarantee 7/5): nothing sits beside this picture, because
   it is not an illustration of a product or an error, it is the only evidence on the page of who
   does the work. 16/9 stacked so a phone gets a band and not a postcard, 2/1 from md.
2. **Ruled hub directory**, `LinkRows`. Same six rows and the same data as before, but **`split` is
   new on this call site**: the old page rendered the default stacked row, six title-over-paragraph
   blocks that read as one block of text in a narrow column. `split` puts the titles in one
   scannable column on the page spine with the summaries answering across the gutter from md up,
   which is the shape that variant was built for and the one the hub template already uses.
3. **Left-rail progression** for `remoteDelivery`, which replaces the three-card grid.
4. **Closing band**, the hub template's. A cross-page repeat and a deliberate one: rule 3 forbids a
   family repeating *within* one page.

### The engagement is a rail, and it is never numbered

`Meetings`, `While we work`, `Handover` are one engagement in order, not three peers, so they are
read **down a rail** instead of across a row of cards: a hairline on the group's left edge, each
entry meeting it on a short ember tick, label over sentence. The order carries the sequence and is
the only thing that does. No numbers, no "Stage 2", which rule 6 bans alongside the cards it also
bans. The tick is a 1px rule, not a dot: it joins an entry to the rail rather than decorating it.

### The counts are computed, and nothing else is claimed

`services.length` and `guides.length` are read from `src/content` at build time, so the sentence
under "What we work on" cannot drift from what the site holds. **No years in business, no team size,
no client volume, no number of sites fixed, and no testimonial**: `src/content/testimonials.ts` is
entirely placeholders and `brand.legacy.facts` belongs to fixmywp.com, a different and still-trading
company. Nothing on this page is asserted about the world.

### The banner's `sizes`, and why it is declared

The band is the inner container and nothing else: **1104px** from 1152 up (`max-w-6xl` less the 24px
`md` gutters), `calc(100vw - 48px)` while the container is still under its max at md, and
`calc(100vw - 32px)` below md where the gutter is 16px. Measured on the build: 1104px box taking the
`w=1200` candidate at 1440, 976px taking `w=1080` at 1024, 343px taking `w=384` at 375. Left at the
`100vw` default it would have over-fetched by a whole candidate step at every width, on an eager
image that is the page's largest paint. Real alt text rather than `decorative`, because here the
photograph is content.

`servicePhotos["hire-developer"]` (`terminal`): hands at a keyboard under one warm light, which is
the Imagery section's own direction almost word for word. The fix hub's `emergency` frame was tried
first and is cold and mostly a dark mass at this crop, which on a dark page reads as a hole.

### The first section refused `reveal`, and the reason has since been removed

**Corrected 2026-10-21 (Task 4). The paragraphs below are history and the exception they argue for
is retired; the live behaviour is in the last paragraph of this subsection.** The history is kept
because it is why the final fix is the shape it is, and because the reasoning in it must not be
tried a third time.

*As built in Task 5:* written out rather than built with `Section`. A view-timeline reveal is
**scrubbed**, so a section parked inside the first third of its range at load sits at part opacity,
and `--muted` at part opacity is under 4.5:1. The 2/1 banner puts "What we work on" within a few
pixels of the fold at **768**, where it parked exactly there: axe reported a serious
`color-contrast` failure on the heading, the lead and all twelve directory strings. With the reveal
off that section, 0 violations at every width tested.

*And the standing fragility it named:* the same sweep found
`/guides/critical-error-on-this-website/` failing the identical way at **820px** on the build of the
day. `@keyframes reveal-rise` already finished its opacity at 33% of the range for exactly this
reason (recorded in `globals.css`), which narrowed the window without closing it, because a reader
can stop inside the first third. This entry then said closing it meant dropping opacity from the
keyframe entirely, leaving `reveal` as a 12px slide, and that it belonged in its own pass.

**That pass shipped: `d4284ff`, Task 8, recorded under "v4 / reveal without opacity, and one source
for the promises" at the end of this file.** `reveal-rise` is the translate alone and carries no
opacity, so no park position at any width can change a contrast ratio, and the exception here has no
subject left. **"What we work on" carries `reveal` again**; the section is still written out rather
than built with `Section`, for the smaller remaining reason that `Section` wraps its children in one
`mt-6` div and this one has two blocks with their own spacing. Two further corrections Task 6 and
Task 8 proved against what this entry originally assumed: the failing node was the ember
`.btn-primary`, not the `--muted` body copy named above, so a fix aimed only at muted text would
have left the primary CTA failing; and clean axe results taken at rest cannot see this class of bug
at all, which is recorded as an instrument defect in `docs/qa-report.md`.

### JSON-LD

`AboutPage` with `mainEntity: { "@id": ".../#organization" }`, pointing at the Organization the root
layout already emits rather than declaring a second one. No `AggregateRating`, no `Review`, no
`numberOfEmployees`: there is no review data, and a headcount is a claim about the world rather than
something `src/content` can prove. `breadcrumbLd` still emits from `Breadcrumbs`.

### Motion

| Element | Primitive | Communicates |
| --- | --- | --- |
| Lead sentence | `rise-in`, inline delay 70ms | The headline is already there; what it means arrives under it |
| CTA pair | `rise-in`, inline delay 140ms | The buttons that act on the sentence arrive after it |
| "What we work on", "How working with us runs", closing band | `reveal` on `animation-timeline: view()` | Each section is its own answer, met one at a time |

Nothing on the h1 and nothing on the banner: both are the page's largest paints. "What we work on"
was static until Task 8 for the contrast reason above; it carries `reveal` with the other two now,
and the three `.reveal` elements on this page are re-measured on the current build.

### Measured, production build, axe-core 4.14

0 violations of any impact at **375, 768, 1024 and 1440**, and at 375 and 1440 under
`prefers-reduced-motion: reduce`. A wider sweep at 390, 430, 600, 700, 800, 820, 900, 1100, 1152,
1280 and 1600 is also 0. One h1 at every width, no horizontal scroll at any width, and no computed
border radius inside `main` other than 0 or 14px. Document height 3,453px at 1440, 4,052px at 768,
3,569px at 1024, 5,340px at 375.

### Deliberately not done

- **No `brand.claims` tick list.** `/contact/` and `/legal/guarantee/` both render the same four
  `confirm(...)` sentences and a reviewer has already flagged the duplication; this page would have
  been the third copy. The page does not need them, and the right move is to extract the existing two
  before adding a third, not to add one and leave three.
- **No testimonial and no logo wall.** Every entry in `src/content/testimonials.ts` is a placeholder
  nobody said, and there is no permission for a client logo.
- **No "where we work" or city strip.** The cities index exists and says the same thing better.
- **No second image.** One photograph that is actually about the work beats two that are mood.

---

## v4 / comparisons index (/compare/, Task 6)

One route, parent of three compare pages. **It empties the container table's "Guide, compare index
| max-w-3xl" row**: the guide left it in Task 1 and the compare index leaves it here, so neither
page named in that row runs at `max-w-3xl` any more. `/case-studies/` is now the only route still
on that container, and the next pass over it should decide whether the width survives at all. This
page is on the bare `page` spine, x=168, with the lead capped at 62ch.

| Layout family | Eyebrows | Marquee | CTA intents | Client islands |
| --- | --- | --- | --- | --- |
| Masthead with a measured `dl`, split ledger of pairings, closing band | 0 | 0 | BOOK, CHAT | none |

### The masthead is 7/5, and the second column is counted rather than decorated

The page carries no photograph (see below), so with an h1 and one sentence the top of it was two
lines of type in a 1104px field. The right five columns now hold a two-row `dl`, hairline-ruled,
bottomed on the lead's last line with `lg:self-end`: **Criteria compared 27** and **Scenarios
answered 14**, both `reduce`d out of `compares` at build rather than written, so they cannot drift
from what the ledger below renders. Two rows and vertical, so it is not a 3-up stat strip. It
answers what an index is actually asked: whether there is anything behind three links.

### The row link is the heading, stretched

The anchor is the `h3` and nothing else, pulled over the whole row by its own
`after:absolute after:inset-0`, with `relative group` on the `li`. The obvious shape, one anchor
wrapping the row, gives that anchor an accessible name computed from its entire subtree: about forty
words, measured off `Accessibility.getFullAXTree`. Naming it with `aria-labelledby` off the heading
fixes the length and **immediately breaks WCAG 2.5.3**, because the name then no longer contains the
row's own visible text: axe `label-content-name-mismatch`, serious, 3 nodes, at all four widths,
measured. Only an anchor whose content *is* its visible label satisfies both. Hit area is still the
whole row, there is still one tab stop per row, and `group-hover` on the `li` keeps the ember rule
and the caret answering a hover anywhere in it. **Worth knowing before building another row like
this one:** `LinkRows` has the same shape and the same exposure.

### What it was

32 lines in a `max-w-3xl` column: h1, one sentence, a `LinkRows` of the three compares with each
one's `seo.description` as the summary, a CTA pair. No image, no JSON-LD, and no contrast anywhere
on a page whose whole subject is contrast. The data it was throwing away: `c.a` and `c.b`, five to
ten `rows[].criterion` per comparison, and three to five `verdictByScenario` entries.

### The unit is a split, which is how three items avoid being three cards

Three items plus rule 6's "no three equal cards in a row" is the whole design problem of this page,
and the escape is not a card made slightly wider than its neighbours. Each comparison is one
**full-width entry in one ruled list**, and the entry itself is the split: left column is the
pairing, `c.a` and `c.b` at the same size and the same weight with a hairline seam and the word
"vs" between them; right column is every criterion that comparison is built on, across a vertical
hairline. Three of those stack down the page as rows, so there is no row of three anything.

They are also visibly unequal without being made unequal: "Monthly care plan vs Pay-as-you-go
support hours" wraps to four lines where "WordPress vs Wix" takes two, and the criteria run 8, 9
and 10 deep. The rhythm comes from the content, not from a span override.

**Deliberately not `CompareTemplate`'s family.** The child owns "verdict-by-scenario cards over a
real comparison table". A parent rendering its child's layout with a thinner version of the child's
data reads to a visitor as the same page twice and to a crawler as thin content. Rule 3 is
per page, so this is a judgement rather than a rule, and it is the brief's judgement: the index
shows *what is compared*, the comparison page shows *how the two answer it*.

### Everything on screen, and where it is from

| On screen | Source |
| --- | --- |
| "Comparisons" (h1) | SITEMAP node title |
| The lead sentence | Unchanged from the previous page. Says no winner is declared, because the files declare none |
| "What each comparison covers" (h2) | Written here. Names what the right column of every entry is |
| The two names in each entry | `c.a`, `c.b` |
| "N scenarios, each with the verdict for it." | `c.verdictByScenario.length`, a count of entries in the file |
| Every criterion string | `c.rows[].criterion`, in file order, all of them |
| "Want this answered for your site?" (h2) | Written here |
| CTA labels | `cta.ts` via `BookLink` and `ChatButton`; `/compare/` is intent `info`, so BOOK is primary |

Nothing is summarised, no criterion is invented, and no side is characterised. The criterion titles
are the one part of the comparison that belongs to both sides at once, which is why they are the
only body text the index shows: printing `rows[].a` against `rows[].b` would be the child's table,
and printing one of them would tip a page that is deliberately neutral.

### No photograph, and that is the honest answer

`src/content/photos.ts` is a fixed catalogue of real frames: desks, cables, racks, keyboards,
screens, an engineer at night. Every one of them is about *work being done on a site*. This page is
about a decision taken before any of that work exists, between two pieces of software or two ways
of paying. `drafting` (a hand sketching a wireframe) is the nearest miss and is already the face of
the design services; putting it here would make it decoration, which rule 7 exists to prevent. Rule
7 requires every visual to be real. It does not require a visual, so there is none, and the page
carries no `sizes` arithmetic because it loads no image.

### JSON-LD

`collectionLd`, reused from the knowledge base index rather than a new `itemListLd`: it already
emits `CollectionPage` with an `ItemList` as `mainEntity`, which is exactly the shape asked for,
and the names and URLs are read from `src/content` so the list cannot claim the page holds
something it does not render. `breadcrumbLd` still emits from `Breadcrumbs`. No `Product`, no
`Review`, no `AggregateRating`: there is no review data and neither side of any pairing is a thing
this business sells.

### Motion

| Element | Primitive | Communicates |
| --- | --- | --- |
| Lead sentence | `rise-in`, inline delay 70ms | The headline is already there; what it means arrives under it |
| Masthead `dl` | `rise-in`, inline delay 140ms | What is behind the links arrives after what the page is, the same 70ms beat again |
| Closing band | `reveal` on `animation-timeline: view()` | The page's last beat arrives as the reader reaches it |
| Entry hover | `LinkRows`' ember rule, scale-x on the row's own hairline, `hover:hover` only | This row is a destination |

Nothing on the h1, which is the LCP element.

**Corrected 2026-10-21 (Task 4).** This paragraph used to end "and **nothing on the ledger
section**", for the same measured reason `/about/`'s first section gave: a view-timeline reveal is
scrubbed, a section parked in the first third of its range sat at part opacity, and `--muted` at
part opacity is under 4.5:1. The pairings heading lands **429px** down at 1440, re-measured on the
current build, which is well inside the fold and exactly where a reader parks it. (It was ~350px
before the masthead gained its second column in round 2.) Task 8 (`d4284ff`) took opacity out of
`reveal-rise` entirely, so a park can no longer change a contrast ratio and the exception is
retired: **"What each comparison covers" carries `reveal`**, and this page holds two `.reveal`
sections, that one and the closing band. See "v4 / reveal without opacity, and one source for the
promises" at the end of this file.

### Measured, production build, axe-core 4.14

0 violations of any impact at **375, 768, 1024 and 1440**, each audited after scrolling to 45% of
the document, and 0 at 375 and 1440 under `prefers-reduced-motion: reduce`. One h1 at every width,
no horizontal scroll at any width. Document height 2,318px at 1440, 2,404px at 1024, 3,048px at 768,
4,936px at 375.

### Two things the 45% park does not catch, and both matter site-wide

**A `fullPage` screenshot does not scroll, so every below-fold `reveal` is captured at opacity 0.**
Playwright captures beyond the viewport through CDP while `scrollY` stays at 0, and a `view()`
timeline is driven by scroll position, so the section is in the captured area and genuinely
transparent in it. The closing band is absent from any such capture of this site. **Scroll the
document to the end before capturing**: everything past its range holds its final state under
`animation-fill-mode: both` and resolves to opacity 1 in one capture. Residual artifact of doing so:
the fixed nav composites at its scrolled position, partway down the stitched image.

**Parking a band inside its own entry range fails `color-contrast` on the ember button.** Not at
45% of the document, which is nowhere near it. Swept across every scroll position where the band
sits strictly between 0.02 and 0.999 opacity (axe skips a band at exactly 0 as not visible), the
same serious failure appears on `/compare/` @768 at 0.251 and @1440 at 0.495, on **`/about/`** at
0.174 and 0.625, on **`/guides/`** at 0.183 and 0.550, and on the untouched **`/compare/wordpress-vs-wix/`**
at 0.191 and 0.132. Identical nodes every time. It is the `reveal` primitive, not this page, and it
was left for the pass that owns the primitive; **that pass is Task 8 (`d4284ff`), which reproduced
this same failure on a control rebuild and then removed its cause.** Two corrections to what the
earlier entries assumed:
the opacity ramp finishing at 33% of the range narrows this window but does not close it, because a
reader can stop inside the first third; and the failing node is `.btn-primary`, where the ember fill
and its near-black label composite together, so a fix that only protects `--muted` copy leaves the
primary CTA failing.

### Deliberately not done

- **No scenario strings on the index.** `verdictByScenario[].scenario` is the most persuasive copy
  in the files, and showing it here would put 14 sentences on the parent that the three children
  already carry, with the verdict beside each of them. The count of them is enough to set the
  expectation; the sentences are the reason to click.
- **No new export in `parts.tsx`.** The entry is used three times on one page and nowhere else, so
  it stays local. 18 files import that module, 6 of them the templates under
  `src/components/templates/`, and Task 8 adds to it. (The brief said "five templates"; counted on
  disk it is six, so the standing ruling is if anything stronger than it was stated.)
- **No change to `CompareTemplate.tsx` or `src/content/compares/`.** Out of scope, and the index now
  depends on the shape of those files, so the next change to them should be read against this page.
- **The lazier version was available and refused.** `LinkRows` with `split` and the criteria joined
  into one comma string per row would have been a two-line diff reusing an existing primitive. It
  would also have been the page that is already there, with a longer summary.

---

## v4 / RealScreen sized from the PNG header (Task 7)

No layout family, no page and no section: one component in `parts.tsx` that four guide pages and
every service page with a capture render, so it is recorded here because it changes what box those
pages reserve before their largest image decodes.

### The bug

`RealScreen` hardcoded `width={1600} height={1000}` for every capture, a 1.600 box. Re-derived from
the IHDR chunks on disk, the four real captures are:

| File | Pixels | Ratio |
| --- | --- | --- |
| `critical-error-on-this-website.png` | 1829x860 | 2.127 |
| `error-establishing-database-connection.png` | 2848x1600 | 1.780 |
| `illustration-google-deceptive-site-warning.png` | 892x537 | 1.661 |
| `white-screen-of-death.png` | 2736x1536 | 1.781 |

Not one of them is 1.600, so `next/image` reserved a box of the wrong shape on all four and
re-ratioed it when the image decoded, moving the LCP element of four guide pages and of the service
pages that share the component.

### The fix, and why it is 25 lines of `node:fs` and no dependency

`src/lib/png-size.ts` exports `pngSize(path)`, which opens the file, reads 24 bytes, and returns the
big-endian uint32 at offset 16 and 20. A PNG's IHDR is at a fixed offset: 8 signature bytes, a
4-byte length, the 4-byte chunk type, then width and height. `RealScreen` is a Server Component that
already stats the same file with `existsSync`, so this is one extra synchronous 24-byte read at build
time.

It is its own module rather than another export of `parts.tsx` so `scripts/check-content.ts` can
import it without pulling in `next/image`. **No export of `parts.tsx` changed and the signature is
still `{ slot, alt, sizes, preload }`**, so every call site is untouched.

**It never throws.** An open or read failure, a short read, a missing signature, a chunk type that
is not `IHDR`, or a zero dimension all return the old 1600x1000, and the fd closes in `finally`. The
chunk-type check came in the fix round (`1453f2d`): without it the doc comment described a
validation the code did not perform, which is a comment that will mislead the next reader rather
than a bug today.

### The runnable check

Two `assert.deepEqual` lines in `scripts/check-content.ts`, where `npm run check` already lives:
`public/screens/white-screen-of-death.png` must report 2736x1536, and `package.json` must report the
1600x1000 fallback. One asserts the parser reads a real header, the other that a non-PNG cannot
break the build. `npm run check` is in the build chain, so a capture replaced by one of a different
size fails loudly instead of silently re-ratioing a page.

### Measured on this build

| Route | `<img>` attrs | Rendered box |
| --- | --- | --- |
| `/guides/white-screen-of-death/` | `width="2736" height="1536"` | 320x180 at 1440, 327x184 at 375 |
| `/wordpress-fix/white-screen/` | `width="2736" height="1536"` | 416x233 at 1440, 327x183 at 375 |
| `/guides/php-fatal-error/` (no capture) | `width="1600" height="1000"` | 320x200 at 1440, the `Photo` fallback arm, untouched by this change |

CLS figures are in `docs/qa-report.md`. The honest reading of them is in that file too: only the
post-state was measured, here and in Task 7's own report, so the verdict rests on the mechanical
argument that the reserved box now has the image's real ratio, not on a before-and-after delta.

### Deliberately not done

- **`Screen` and `Photo` untouched.** `Photo` draws the catalogue frames, which really are 1600x1000,
  so there is nothing to read.
- **No `sizes` change at any call site.** `GuideTemplate` and `ServiceTemplate` pass their own
  already and keep working unchanged; the box's ratio moved, its width did not.
- **No caching and no async.** 24 bytes per capture at build time, four captures on the whole site.
  A memo would be more code than the read it saves.

---

## v4 / reveal without opacity, and one source for the promises (Task 8)

Two shared-file cleanups that three earlier tasks asked for. No page changed shape, so there is no
layout family here; what changed is a utility every one of the 99 routes renders, and a block of
copy two routes were each holding their own copy of. Commits `d4284ff` (8a) and `a2017d8` (8b);
`git diff --stat 1453f2d..a2017d8` re-derived for this entry: **8 files, 102 insertions, 85
deletions.**

### 8a. `reveal-rise` is the translate alone

```css
@keyframes reveal-rise {
  from { transform: translateY(12px); }
  to { transform: translateY(0); }
}
```

`.reveal` runs on `animation-timeline: view()` with `animation-range: entry 5% entry 40%`, which is
**scrubbed, not played**: a reader who stops scrolling inside that range leaves the animation parked
at whatever the scroll position holds, indefinitely. While the keyframe carried an opacity channel
that park was a composite, and a composite is a contrast ratio nobody designed. Three entries in
this file argued about how to narrow the window. There is no window now: a translate cannot change a
contrast ratio at any scroll position, at any width, on any route, and transform only is a strict
subset of what contract rule 10 allows.

**The first repair is kept in the comment above the keyframe in `globals.css` and in the Task 5 and
Task 6 entries above, deliberately.** It read `0% { opacity: 0 } 33% { opacity: 1 } 100%`, on the
theory that finishing the fade in the first third made the failing window small enough to be gone.
A smaller window is not a closed one. The reasoning must not be tried a third time, so it is
recorded rather than deleted.

**What the motion now communicates:** the page settling under the reader, not each section
performing. That was already the whole of the motion past the first third of the range, and the
12px travel is unchanged. **Reduced motion:** unchanged and still the final state immediately -
`.reveal` lives inside a `@media (prefers-reduced-motion: no-preference)` block, so under `reduce`
every element reports `animation-name: none`, `transform: none`, `opacity: 1`.

**Two local workarounds are retired.** `/about/`'s "What we work on" and `/compare/`'s "What each
comparison covers" each refused `reveal` because a park left them under 4.5:1. The exception has no
subject now, so both carry `reveal` again and both comments record the history instead of asserting
a reason that no longer holds. Re-counted on the current build: `/about/` renders three `.reveal`
sections, `/compare/` two. The two entries above are corrected in place.

**The failing node was never the one the first repair was aimed at.** It is the ember
`.btn-primary`, whose fill and near-black label both composite against the page while the section is
translucent. A fix that protected only `--muted` body copy would have left the site's primary CTA
failing at every park. Recorded here because the diagnosis, not the keyframe, is the part that was
wrong twice.

### 8b. The four promises come from one place

`src/content/notices.ts` gains `promises`: four `[brand.claims.*, sentence]` pairs beside
`remoteDelivery`. `parts.tsx` gains `Promises`, which renders the tick list and keeps the per-claim
truthy gate, because an unconfirmed claim is `null` and must then render nothing (rule 8).
`/contact/` and `/legal/guarantee/` both drop their array, their markup and their `CheckIcon`
import.

These sentences are what the company promises a paying customer. Two hardcoded copies can silently
diverge, and a promise that reads differently on two routes is a real problem rather than an untidy
one. Checked for this entry: the four strings in `notices.ts` are byte-identical to the
`confirm(...)` descriptions in `src/config/brand.ts` less their `claim: ` prefix, and byte-identical
to what both pages held before. All four claims are truthy today, so both pages render all four, as
they did.

`compact` is the only prop besides `className` and it carries all four differences between the two
call sites at once: `text-sm` on the row, `mt-0.5` against `mt-1` on the tick, and the `max-w-[60ch]`
measure that only the reading column needs. The class strings are assembled in the original order
rather than alphabetised, so the rendered `class` attributes are identical and not merely
equivalent. Verified against the served HTML on this build: `/contact/` renders
`<ul class="mt-4 grid gap-3">` / `<li class="flex gap-3 text-sm">` / `<span class="block
first-letter:uppercase">`, `/legal/guarantee/` renders `<ul class="mt-5 grid gap-3">` /
`<li class="flex gap-3">` / `<span class="block max-w-[60ch] first-letter:uppercase">`.

Not folded into `TickList`: that takes bare strings and applies neither the claim gate nor
`first-letter:uppercase`, and widening it would change every one of its current callers.

### Measured, and measured against a control

A sweep that only measures the post-state cannot tell "fixed" from "never reproduced here", so the
old keyframe was rebuilt on disk, the bug reproduced, and the fixed build measured with the same
harness. Both runs, the park method, and the instrument defects that made the earlier clean results
meaningless are in `docs/qa-report.md` under "Guides, Knowledge Base, guarantee, About, comparisons,
RealScreen and the reveal primitive (Tasks 1-8)". The short version: with the opacity channel back
on disk the failure reproduces on this build; with it gone, no element on any of ten routes was ever
measured below opacity 1 at any park position, at any width, which is the guarantee itself rather
than a sample of it.

### Deliberately not done

- **`.reveal` was not deleted.** If the owner later finds a 12px scrubbed settle imperceptible, the
  honest follow-up is deletion, not a restored fade: a fade is the one thing that cannot come back
  while the timeline is scrubbed.
- **The travel was not lengthened and the range was not narrowed.** Either would make the
  per-section entrance louder, which the utility's own comment and the craft floor both refuse, and
  neither affects the guarantee.
- **`LinkRows` was not widened to take a `ReactNode` title**, which Task 6 routed here. `LinkRows`
  wraps the whole row in one `<Link>`; `/compare/`'s row deliberately makes the anchor *be* the h3
  and stretches it with `after:absolute after:inset-0`, because wrapping the row gave the link a
  forty-word accessible name and the obvious repair (`aria-labelledby` off the heading) breaks WCAG
  2.5.3 `label-content-name-mismatch`. Passing that heading in as a `ReactNode` would nest its
  anchor inside `LinkRows`' own. What the two genuinely share is one hairline `<span>` class string,
  which is not worth an export's surface area. (Task 8's report justified this with "`LinkRows` is
  imported by 18 files, 6 of them templates". **Re-counted from disk: 18 files import the `parts`
  module and 6 of those are under `src/components/templates/`, but `LinkRows` itself is imported by
  five, `about/page.tsx`, `CityTemplates`, `GuideTemplate`, `HubTemplate`, `ServiceTemplate`. The
  ruling stands on the accessibility argument; the figure was the module's, not the component's.**)
- **`brand.legacy.facts`' other three readers** (`JsonLd.tsx`, `SiteFooter.tsx`, `Plans.tsx`) are
  untouched. They are a separate removal pass the owner has not authorised.

### /about/ masthead, revised 2026-10-21: the type moved onto the photograph

The first version of this header was two boxes stacked: the h1, the lead and the CTA pair in flow,
then a separate `aspect-[16/9] md:aspect-[2/1]` frame under them holding the photograph. The owner
asked for the words to sit on the picture instead, which is what a masthead actually is.

**Layout family:** unchanged in name, masthead over a full-width photographic band, but it is now
one box rather than two. The header is the page's only `relative isolate` element: photograph and
scrim both at `-z-10`, type in normal flow above them. That is `FinalCta`'s shape exactly, and
`FinalCta`, `RestoredOverlay` and `ProblemTiles` are the three places this site already puts type
over photography. Nothing new was invented for it.

**The scrim is the existing token, not a gradient.** `bg-photo-scrim` is `rgb(12 12 14 / 0.66)`,
flat, and the variation bans gradients everywhere except the hero legibility scrim and the guarantee
mask. The lead changed from `--muted` to `--on-photo` in the same move and that was not cosmetic:
muted over this scrim measures 2.55:1 and would have failed outright the moment it moved onto the
picture.

**Measured, in the browser, on the production build**, compositing the 0.66 scrim over the actual
served image and taking the brightest pixel rather than an average:

| Width | Band box | Contrast under the type | Worst pixel anywhere in the band |
| --- | --- | --- | --- |
| 1440 | 1104x384 | 6.58:1 | 6.58:1 |
| narrow | 453x260 | 6.23:1 | - |

The 1440 row is the one that matters: the worst pixel in the whole band is the same 6.58:1 as the
worst under the type, so the guarantee does not depend on where the words happen to fall. axe 0
violations of any impact at 375, 768, 1024 and 1440, each run twice, once under reduced motion.

**Height comes from content plus padding, never from an aspect ratio.** This is the one thing the
two-box version could not have survived. At 375 a 16/9 band is 211px, and the h1, the sentence and
the two buttons need more than 300px, so an aspect-driven box would have had type overflowing the
frame it is supposed to sit inside. `md:min-h-[24rem]` is the opposite guard, holding enough frame
open at desktop that the photograph still reads as a photograph once the type stops filling it.
`justify-end` sits the words on the lower third, so the frame's upper two thirds stay picture.

**Motion unchanged and still answers rule 10 in one sentence:** the h1 is never faded because it is
the LCP candidate, and the lead and the CTA pair arrive 70ms and 140ms behind it, which is the same
beat the hub, the knowledge base and the guarantee headers run. Reduced motion renders the final
state. Nothing animates on the photograph itself.

**Deliberately not done:** no `aspect-ratio` on the band, for the reason above. No gradient scrim, no
second hue, no blur layer. The `bannerSizes` string is unchanged, because the box is still the full
1104px spine and the arithmetic that produced it did not move.

## v4 / pricing

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Masthead over a photographic band | type on photography, the /about/ pattern | no | no | BOOK, CHAT |
| 2 | Three ways to work with us | ruled split ledger (reused from /compare/) | no | no | BOOK, BOOK+service, PLANS |
| 3 | What you are agreeing to | two-column tick grid (`Promises`) | no | no | none |
| 4 | Everything we quote on | grouped column directory (reused from /guides/) | no | no | none (32 service links) |
| 5 | Questions about price | FAQ disclosure list | no | no | none |
| 6 | Closing band | the site's shared closing band | no | no | BOOK, PLANS |

**The page had no prices and still has none.** All 32 services carry `priceFrom: null`, all four
entries in `src/content/pricing.ts` are `null`, and all 32 `typicalTurnaround` values are `null`,
verified by grep on 2026-10-21. What it replaced was a service directory with a price column that
never rendered, under a lead sentence apologising for the absence. It read as boring because it had
nothing to say, which is not a layout problem.

The page is built on what is confirmed instead: `brand.claims.fixedPrice` as the offer, the three
engagement modes with their real `deliverables`, the four `brand.claims` commitments through the
shared `Promises` component (its third call site), the 32-service catalogue, and four FAQs lifted
from service content. `priceFaqs` resolves each one by exact question match and **throws at build
time** if a service stops carrying it, so the page cannot quietly diverge from its sources.

**The masthead's h1, lead and `seo.description` are gated on `brand.claims.fixedPrice`**, through one
`MASTHEAD` constant, with a fallback that asserts nothing about how pricing works. That claim is
wrapped in `confirm(...)` and is therefore NOT yet confirmed by the owner, despite what an earlier
brief and an earlier version of this page's comment both said. Every other page on the site risks one
sentence on that boolean; this page stakes its headline, its lead and its meta description on it at
once, which is why it is the one place gated rather than asserted.

**Price slots.** `from()` mirrors `Plans.tsx`'s helper exactly (`p && ...`, a null renders nothing),
and the catalogue row is a declared `grid-cols-[minmax(0,1fr)_auto]`. Publishing a price fills the
slot without relaying the page: measured in a scratch build at 2px of total movement, the row name
not moving and no row changing height. The `auto` track takes its width from the title, so the
longest catalogue title narrows from 504 to 403px without rewrapping. Note the two explicit tracks
always generate the `gap-x-4` gutter, so about 16px sits after every title even while every price is
null; it is invisible, but it is not zero.

### Touch targets, and what a clean axe run does not cover

Nine heading links shipped at 22 to 28px and were corrected to exactly 44px: three engagement-mode
names and six hub labels, measured at 1440 and 375 as 44px each (`One-time fix` 135x44,
`Hacked site cleanup` 222x44, `Care plan` 105x44, `Fixes` 46x44, `Security` 74x44, `Care plans`
93x44, `Speed and migration` 182x44, `Development` 116x44, `WooCommerce` 135x44). The fix is
`inline-flex min-h-11 items-center`, which this ledger already recorded once this plan and which
`/guides/` already carried on the identical element.

**axe's default ruleset has no target-size rule.** Every "0 violations" figure in this plan is
therefore silent on contract rule 5, and these nine passed 32 clean axe samples while failing it.
This is the second thing a clean axe run has been found not to cover, after the parked-contrast case.
Target sizes must be measured, not inferred from a green sweep.

### A third documented sub-44 exception: inline links inside a sentence

Sweeping every interactive element in `main` turned up one more, which neither the implementer nor
the reviewer had flagged: `CheckLink` with no `className` renders a bare inline anchor **18px** tall.
Three call sites do this inside flowing sentences: `src/app/pricing/page.tsx:371`,
`src/app/guides/page.tsx:150` and `src/components/templates/GuideTemplate.tsx:168`, the last of which
puts it on all 37 guide pages. 39 routes in total.

**Ruling: not a defect, and deliberately not changed.** WCAG 2.5.8 Target Size (Minimum) explicitly
exempts a target that is inline in a sentence of text, and a 44px line box inside a running paragraph
would break the paragraph. This is the same class of trade already written down twice in this file,
for the 32px breadcrumb and the 36px footer link. The difference was that those two carried written
reasons and this one did not, so it is recorded here now rather than left for the next pass to
rediscover and either "fix" or quietly accept.

### Deliberately not done

No invented price, range, turnaround, discount or saving. No `Offer` or `OfferCatalog` in the
JSON-LD, because an Offer with no price is not a truthful one: the page emits `CollectionPage` with
an `ItemList` of the 32 services and `faqLd` over the four real FAQs, both referencing the existing
Organization by `@id`. No `AggregateRating` and no `Review`, because there is no review data. The
three engagement-mode labels are duplicated with `Plans.tsx` and no content file holds them, because
they name a mode rather than a service; moving them into `src/content/` is real debt and was out of
scope here.

### Guarantee heading: the finished state is now what the server sends

Reported by the owner as "every page refresh or visit reveal animate to display". The report was
accurate and the cause was worse than a replaying animation: the heading did not exist until
JavaScript had run.

`GuaranteeHeading` is an SVG whose `viewBox` is measured from `getBBox()` after Bricolage resolves,
and it carried `style={{ visibility: "hidden" }}` until that measurement arrived. The server
therefore shipped `<svg style="visibility:hidden">`, so with JS disabled, failing, or merely slow,
the only trace of the section's headline was the `sr-only` span in the `h2`. Confirmed in the served
HTML before the fix.

The second half was quieter and would have survived a naive fix. `@utility guarantee-fill` is
`fill: url(#guarantee-photo)` from md up, and that `<pattern>` is only rendered once the same
client-side measurement has happened. An SVG paint reference that resolves to nothing paints
nothing, so simply removing the `visibility` would have left the desktop heading blank anyway. The
rule now carries the SVG paint fallback, `fill: url(#guarantee-photo) var(--accent)`.

Measured on a production build, `h2#guarantee`:

| | viewBox | fill | result |
| --- | --- | --- | --- |
| JS off, 1440 | fallback `0 -128 900 170` | `url(#guarantee-photo) rgb(255,90,54)` resolving to ember | visible, solid ember |
| JS off, 375 | fallback | ember | visible, solid ember |
| JS on, 1440 | measured `-10 -128.87 928.12 173.44` | pattern present | photograph through the letters |
| JS on, 375 | measured | ember, no pattern (the 76KB frame stays off phones) | as designed |

axe 0 violations at 1440 and 375 with the stylesheet guard asserted first.

**The draw still replays on every visit, by the owner's explicit decision.** Offered the choice
between removing the animation, throttling it to once per visitor, and keeping it as it is, they
chose to keep it. The change is only that the words are on screen whether or not it runs. An
unmeasured heading paints at the fallback `viewBox`, about 9px wider than its box and
`overflow-visible`, and the measured `viewBox` corrects it on the next frame; slightly off-scale for
one frame is the trade against invisible for everyone without JS.

**Related, still open and not fixed here:** the audit's finding of 27 nodes at `opacity: 0` with JS
disabled on the home page. `PracticeRows` is one of them and ships
`style="opacity:0;transform:translateY(14px)"` from the server with only a `motion-reduce` escape.
This entry fixes the guarantee heading, which was `visibility: hidden` rather than `opacity: 0` and
was not in that count. The 27 remain unowned.

### The guarantee draw had never run. ScrollTrigger was never registered.

Follow-up to the entry above, reported by the owner: the animation still did not play on reaching
the section. Correct, and the cause is older than either of these two passes.

`GuaranteeHeading` builds its timeline with
`gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", once: true } })`, and
`ScrollTrigger` **is imported and registered nowhere in `src/`**. `grep -rn "ScrollTrigger" src/`
returned nothing; the only hit anywhere is the lowercase config key on that one line. GSAP drops a
config key belonging to an unregistered plugin in silence: no error, no warning, no console notice.
The timeline therefore had no trigger at all and played the instant it was built.

Measured on a production build before the fix, at `scrollY` 0 with the section's top 6772px below a
900px viewport: wipe `scaleX` already 1, `stroke-dashoffset` already 0, outline opacity already 0.
Every visitor has always arrived at a heading that finished animating while it was seven screens
away. The effect that the component's own 20-line docstring describes has never been seen.

The fix is `import { ScrollTrigger } from "gsap/ScrollTrigger"` and `gsap.registerPlugin(ScrollTrigger)`
inside the `useGSAP` callback, not at module scope: this file is still evaluated on the server for
the initial HTML, and registration is idempotent so the repeat costs nothing.

Measured after, same build, same viewport:

| Moment | wipe scaleX | dashoffset | outline opacity |
| --- | --- | --- | --- |
| At top, section 6772px below the fold | 0 | 900 | 1 |
| 250ms after reaching it | 0 | 365 | 1 |
| 950ms | 0.39 | 0 | 1 |
| 2.15s | 1 | 0 | 0 |

Outline draws, fill wipes in behind it, outline fades. `once: true` keeps it to one play per load,
which is per visit, which is what the owner asked for.

**The no-JS fallback from the previous entry is unaffected**, and was re-checked after this change:
with JavaScript disabled the fill still resolves to solid ember through the paint fallback and the
heading is still visible, because the clip path that hides the fill is only attached once the
client-side measurement exists.

**Worth carrying forward:** a GSAP config key for an unregistered plugin fails silently. Nothing in
`npm run check`, `lint`, `tsc` or `build` catches it, and axe cannot see it either. The only way this
surfaced was measuring the animation's own state at a scroll position where it should not yet have
run. `scrollTrigger` is used exactly once in this repo, so there is nothing else to audit today, but
a second use would fail the same way.

## v4 / one masthead, and link rows become card grids (Task 9)

Two things the owner asked for, and they turned out to be one change each rather than seven: every
inner page's header becomes the photographic band `/about/` already proved, and every stacked list
of links becomes a grid of cards. Both were already duplicated across the codebase, so both
collapsed into a primitive in `src/components/templates/parts.tsx`.

### What the layout families are now

| Template or page | Was | Is |
| --- | --- | --- |
| Service, `/<hub>/<service>/` | 7/5 title block with photo | masthead over a photographic band, capture figure under it on the four services that have one |
| Hub, `/<hub>/` | full-width h1 over a 6 / empty / 5 lead and photo split | masthead over a photographic band |
| Guide, `/guides/<slug>/` | 8/4, the error plate left and the picture right | masthead over a photographic band, the error plate on the band |
| Compare, `/compare/<slug>/` | h1 and lead, no picture at all | masthead over a photographic band |
| City hub and city | bare h1, no picture at all | masthead over a photographic band |
| `/about/`, `/pricing/` | the same band, hand-written twice | the shared `PageMasthead`, same output |

| Section | Was | Is |
| --- | --- | --- |
| Service, "Errors we fix here" | link rows, in the reading column | icon-led error card grid, on the full spine |
| Guide, "Other errors we fix" | link rows, in the reading column | icon-led error card grid, on the full spine |
| Hub, "What we do here" | ruled split rows | card grid, up to four across |
| `/about/`, "What we work on" | ruled split rows | card grid, two across |
| City hub, the city directory | link rows | card grid, two across |
| City, "What <city> clients ask for" | link rows | card grid, two across |

`LinkRows` had no caller left and was deleted with them. The ledger's standing refusal to widen it
to take a `ReactNode` title (recorded under `/compare/`) is unaffected and now moot: the replacement
is a separate primitive, which is what that entry said the sanctioned route was.

### Rule 3, which the move actually tripped

The service page already spends a 2-up grid on "What we do", and the guide page spends one on its
cause tiles. A 2-up card grid for the errors in the same reading column would have been the same
layout family twice on one page. So that one section leaves the eight-column well and runs the full
1104px spine, four across, which is a different family and not a second helping of the first. It is
the only section on either template that sits outside the reading column.

Two consequences, both accepted:

- **It leaves `data-rail-scope`,** so its heading is no longer a tick on `ReadingRail`. That is
  correct rather than tolerated: the rail is where you are in the reading document, it is `lg`-only
  and sticky inside that grid, and by the time this grid is on screen the rail is not. Both
  templates still have well over the three `h2[id]` the rail needs before it renders at all.
- **Its h2 still starts on the page's one left edge,** because the spine and the eight-column well
  share a left edge. The x=168 rule is untouched by the break-out.

### The h1 is inset from the h2s now, on every route

Measured at 1440 on `/wordpress-fix/white-screen/`: the h1 sits at x=225 and every h2 in flow at
x=161. The 64px is the band's own `lg:p-16`, so the headline is inside a box and the headings under
it are on the spine.

This is not new and it is not a drift. `/about/` and `/pricing/` have shipped exactly this since the
masthead was built, and the x=168 rule it appears to bend is a rule about headings **in flow**: a
headline inside a bordered, photographed box is not on the same edge as the page because it is not
on the page, it is in a frame. What changed is only that it is now true of 99 routes rather than 2.
Worth stating plainly so the next craft pass does not read it as a regression and "fix" it by
stripping the band's padding, which would put the type hard against the photograph's edge.

### Columns are a ceiling, not a count

Measured from the content, not guessed: a service lists 1, 2, 3 or 4 errors; a guide has 1 to 3
siblings; a hub holds 3, 4, 4, 4, 6 or 11 services; there are 8 cities and each city highlights 3 or
4 services. A grid that always opened four wide put a single card in a quarter of the spine with
three empty cells beside it, which reads as a layout that failed rather than as one door. So
`LinkCards` takes `cols` as a maximum and opens `n` wide below four.

**Three is never a column count.** Contract rule 6 bans three equal cards in a row, and sets of
three are common here, so three runs two across with the last card taking the full width. That is
the odd-trailing pattern `ServiceTemplate`'s "What we do" tiles and the hub's problem grid already
use, for the same reason.

### Contrast, and why it holds for every frame

Measured in the browser on the production build, compositing the flat `--photo-scrim`
(`rgb(12 12 14 / 0.66)`) over the actual served image and taking the **brightest pixel in the whole
band**, not an average:

| Band | Box at 1440 | Worst pixel anywhere | `--text` against it |
| --- | --- | --- | --- |
| Service, `/wordpress-fix/emergency/` | 1104x384 | rgb(95, 95, 94) | 5.61:1 |

That figure is the floor for every band on the site and it is tone-independent: this scrim
composites a blown-out white pixel to rgb(95, 95, 95), so no photograph in the catalogue, and no
photograph that replaces one later, can drive the band below 5.6:1. Which is the whole argument for
rolling one component out rather than measuring five headers. `--muted` is still banned on these
bands at 2.55:1; `PageMasthead` sets the lead to `--on-photo` and gives the caller no way to change
it.

### Motion: nothing new

No Motion, no GSAP, no client island. The band runs the existing `rise-in` utility and the grids
inherit `Section`'s existing `reveal`. The h1 is never faded, on any of the five templates, for the
reason `globals.css` already records: it is the LCP element on all 99 routes.

One change to the beat. `rise-in` delays now step 70ms per element that **actually renders** rather
than per slot, because the service and city bands carry a headline and buttons and no lead, and a
fixed "buttons at 140ms" left them waiting out a beat nothing filled.

### Deliberately not done

- **No viewport full-bleed.** The owner chose the contained band. Edge-to-edge would have cost the
  all-soft 14px shape lock, which is binding spec.
- **No second accent and no status hue**, including the "success green for resolved" line in the
  generated `design-system/letsfixwp-v4/pages/guide.md`. Three urgency levels are told with three
  Phosphor shapes in one ember, never with colour, which is also what keeps them off rule 6's
  colour-only-indicator ban.
- **No photo on the cards.** The catalogue holds 15 frames against 32 services and 37 guides, so a
  picture per card would have been the same desk eleven times. The mark is the error's own urgency
  and its own literal string instead.
- **The captures were not made the band.** A screenshot behind type is a screenshot nobody can read,
  and the scrim that makes the type legible is the thing that would hide it. They sit under the
  band, held to `max-w-3xl`: at the band's full 1104px a capture was taller than the band above it
  and read as a second hero.
- **Two pre-existing `grid-cols-3` rows are still three equal cards in a row**, which rule 6 bans:
  `CityTemplates.tsx`'s remote-delivery strip and `CompareTemplate.tsx`'s verdict-by-scenario cards.
  Found during this pass and left alone: neither is a link list and neither is a header, so both are
  outside what was asked for. They need their own pass.

### The one content change: the daylight frame is off the bands

`drafting` is the catalogue's only `daylight` frame and v4's Imagery section rules it off direction.
`/pricing/` had already rejected it by name on tone, in its own words: even under the scrim it was
the brightest thing on a dark-locked page and read as a stock photograph pasted into the system.

That was survivable while it sat in a 432px column beside the type. It is not once the photograph
*is* the band, and the mapping put it on three service pages, the development hub and **every city
page** (a city takes its first highlighted service's frame, and that is `website-design` on most of
them). So four entries in `src/content/photos.ts` moved to the nearest frame on direction, chosen on
tone rather than on subject:

| Service or hub | Was | Is |
| --- | --- | --- |
| `website-design` | `drafting` | `terminal`, hands on a laptop with an editor open, warm low light |
| `redesign` | `drafting` | `workspace`, a tidy desk with a curved monitor under a floor lamp |
| `elementor-issues` | `drafting` | `night-desk` |
| hub `wordpress-development` | `drafting` | `final-cta`, a dark home office with one monitor glowing |

No asset was added or removed. `drafting` stays in the catalogue, now used by nothing on this
branch, because v3 lists it as its first choice and the file is shared.

### Worth carrying forward: `transition-transform` does not cover `translate-x` on Tailwind v4

The card's caret travels 2px on hover. Written the way the rest of the site writes it,
`transition-transform duration-200 group-hover:translate-x-0.5`, it **jumped** those 2px instead of
travelling them, and nothing in `tsc`, `lint`, `build` or axe can see that. Measured in the browser
on the production build with the pointer held on a card:

```
getComputedStyle(svg).transform          none
getComputedStyle(svg).translate          2px
getComputedStyle(svg).transitionProperty color, transform
```

Tailwind v4 emits `translate-x-*`, `scale-*` and `rotate-*` as the standalone `translate`, `scale`
and `rotate` properties, not as `transform`, so a transition that names `transform` never covers
them. The fix is to name the property that actually changes: `transition-[color,translate]`.

**This was already known on the branch for one of the three.** `Faqs` in the same file carries the
note verbatim for `rotate` ("Tailwind v4 writes rotate-180 to the standalone `rotate` property, so
naming `transform` transitions nothing and the caret snaps while the colour fades. Measured in the
browser") and uses `transition-[rotate,color]`. `ProblemTiles` half knew it too, which is why its
reduced-motion cancels are `scale-100!` and `translate-none!` rather than `transform-none`. What
nobody did was carry the finding from `rotate` across to `translate` and `scale`.

**Three places on the branch still name the wrong property** and therefore still snap rather than
move. All three are home-page sections, outside what this pass was asked for, and all three are one
word each: `ProblemTiles.tsx:42` and `:46` (`transition-transform` with `group-hover:scale-105`) and
`ProblemTiles.tsx:55` (`transition-transform` with `group-hover:translate-x-0.5`). The deleted
`LinkRows` had it too, which is how long it had been shipping unnoticed.

## v4 / CTA marks, two CTAs per band, and nothing under the hero (Task 10)

Three asks, and the first two turned out to be one file each because the CTAs were already
centralised and the bands already were by Task 9.

### Every CTA wears its own mark

`src/components/Cta.tsx` now carries a `CTA_ICON` map, one Phosphor icon per intent, and renders it
inside a chip unless the call site passes `icon={null}`. The map:

| Intent | Label | Mark | Why that one |
| --- | --- | --- | --- |
| BOOK | Fix my site | `WrenchIcon` | a wrench repairs |
| CHAT | Chat with an engineer | `ChatCircleTextIcon` | a speech bubble talks to a person |
| PLANS | See plans | `ListChecksIcon` | a checklist is what a care plan is |
| QUOTE | Get a quote | `ReceiptIcon` | a receipt is what a quote becomes |
| CHECK | Get a free site check | `MagnifyingGlassIcon` | a magnifier looks the site over |

**Not an arrow on all five.** Five arrows say "forward" five times, which is decoration rather than
meaning. Every mark is `aria-hidden`: the label beside it already says what the button does, and the
accessibility tree still reads exactly "Fix my site", not "Fix my site wrench" (verified in the
rendered tree).

Three call sites pass `icon={null}`, all of them CTAs set in running text rather than as buttons:
the home page's final `ChatButton`, and the inline `CheckLink` in the knowledge base, the pricing
page and the guide rail ("Nothing down right now? Get a free site check"). A chip inside a run of
underlined text reads as a bullet that wandered in.

### The hover, and the trap it walked into

The chip is the only thing on a button that moves, and it answers the MASTER's own motion line for
the closing CTA: **the button is a door, not a label.** The label never moves, because a label that
slides is a label you re-read.

It lives in `globals.css` as `@utility cta-chip` plus two rules on the button utilities, so a chip
cannot be given a hover the button does not know about:

```
@media (hover: hover) { .btn-primary:hover .cta-chip, .btn-secondary:hover .cta-chip { translate: 2px } }
```

Written in plain CSS the property and the transition are the same word, which is what makes the
Tailwind v4 trap recorded under Task 9 hard to repeat here. `FinalCta`'s bespoke chip was walking
straight into it and has been corrected: `transition-transform` with `group-hover:translate-x-0.5`
moved nothing, so the home page's largest CTA had been snapping its 2px since it shipped.

Two smaller things the marks exposed:

- **`btn-secondary` had no `gap`.** It never showed while these buttons were label-only.
- **Padding is `:has`-driven**, `padding-inline: 1.25rem 0.5rem` when a chip is present, so the chip
  sits flush with the inner edge. The button does not need to know whether it was given an icon.

Measured on the production build with the pointer held: chip `translate: 2px` under
`transition: translate 0.15s`, 28x28 at the 14px radius, button still 44px tall, shadow lifted.

### Two CTAs on every band

| Band | Before | Now |
| --- | --- | --- |
| Service, hub, city, `/about/`, `/pricing/` | primary + CHAT | unchanged |
| Guide | none, just the error plate | primary + CHAT, the same pair the rail carries |
| Compare | none | primary (node intent) + CHAT |
| City hub | a pair at the foot of the directory, below fourteen rows | moved onto the band |

Two, never three, and always the same shape: the high-commitment action and the low-friction one. A
third choice is what makes a visitor choose nothing. The guide band is the one that gains most: the
reader arrived from a search for that exact string, so the band answers "is this my error" with the
plate and then offers the two ways out, all above the fold.

Hero element counts still clear contract rule 4. The guide band is the fullest at four: h1, error
plate, two buttons.

### Nothing under the hero

The owner's third note: the banner image is the hero's background and nothing after the hero should
read as another banner. The `RealScreen` capture that Task 9 parked directly under the band was
exactly that, so:

- **Guide template:** the capture moved into "What you are seeing", under the symptom list. That is
  where a picture of an error belongs and where a reader trying to recognise their screen is already
  going. Held to the reading measure.
- **Service template:** the capture is gone. The guide it links to carries the same shot, so nothing
  is lost from the site; `hasScreen` and the `capture` lookup went with it.

Four guides have a real capture and 33 do not, and `RealScreen` still renders nothing at all until
the PNG exists, so the other 33 are untouched.

### 21st.dev: searched, nothing installed

The catalogue's CTA buttons are glow halos, pearl sheens, star bursts and glassmorphism wrappers.
Every one of those is on this variation's anti-pattern list (no ember glows, no gradients, no
complex shadows, no 3D), and the one close match, an animated-arrow button, is the pattern
`FinalCta` already ships by hand. Installing one would have meant stripping it back to what the site
already had, so the house chip was generalised instead.

## v4 / one closing band, and a row wipe ported from a reference (Task 11)

### The closing band is one component now

Nine pages carried the band's markup byte for byte: the same section class string, the same heading
measure, the same `shrink-0 flex-wrap gap-3` pair. `ClosingBand` in `parts.tsx` is the only copy.

| | |
| --- | --- |
| Already had one, now share it | service, hub, city, compare template, `/about/`, `/pricing/`, `/guides/`, `/compare/` |
| **Gained one** | **the 37 guides**, the city hub, `/legal/guarantee/` |
| Deliberately still without | `/` (its own centred `FinalCta` family), `/contact/`, `/free-site-check/`, `/case-studies/` |

The id is `closing` on every page now, where it had been `about-closing`, `hub-closing`,
`city-closing` and five more. Nothing anchored to the old ones, checked across `src` and `docs`.

**Three findings from doing it:**

- **The 37 guide pages had no closing CTA at all.** They ended on the grid of sibling errors, which
  is a set of doors to more reading rather than a way out. "When to call us" and the rail both carry
  the pair higher up, but the rail is `lg`-only and sticky inside a grid the reader has scrolled
  past by then. This was the largest gap in the consistency the owner asked for, and it was on the
  37 money pages.
- **The city hub lost its pair in Task 10** when it moved onto the band, leaving the foot of a
  fourteen-row directory with nothing after it.
- **`/case-studies/` was left alone, against the owner's "add it to these three".** Its composed
  empty state already ends on a centred pair of the same two buttons, about 100px above where the
  band would sit, on a page under one screen tall. Two identical pairs that close together is worse
  than the inconsistency. Flagged rather than built.

### The row wipe, ported from shopdev.studio

The owner asked for the hover on that site's "WHAT WE BUILD" rows, on "How we work on your site".
Their recipe, read off their stylesheet: a `::before` panel at `translateX(-102%)` to `0` over
650ms, a `.capability-sweep` gradient scaling in over 800ms, the heading to the brand colour, a
large outlined numeral whose `-webkit-text-stroke` fills with the brand colour, and an arrow
rotating 45 degrees.

**What came across, and what the variation refused:**

| Their move | Here |
| --- | --- |
| Panel wipes in from the left, 650ms | **Ported.** Same duration, same direction |
| Gradient sweep in the brand colour | **Refused.** Gradients are banned outside the hero scrim and the guarantee mask. An ember fill under a row would also read as a selected state rather than a hover |
| Heading to brand colour | Already ours: the ember rail under the row says the same thing |
| Outlined `01`–`04` numerals filling with the accent | **Refused.** Numbered rows are a step label, which contract rule 6 bans outright |
| Arrow rotating 45 degrees | **Refused.** An arrow claims the row is a link. Theirs are `<a>`; ours are five promises and link nowhere |
| Preview image scaling on hover | **Refused.** These rows have no image, and the catalogue has no honest frame for "a vetted engineer" |

The panel is flat `--surface`, one step up from the page, which reads as a reading highlight rather
than as a claim that the row is clickable. That distinction is the whole reason the port is
defensible under DESIGN.md's Hover Earns It rule.

**Two implementation notes that are not obvious:**

- **`scale-x` from the left, not `translateX(-102%)`.** For a flat fill the two are the same
  picture: either way one solid edge crosses the row left to right. What `scale` avoids is the
  panel's resting position. Translated fully left it sits in the gutter beside the row and needs
  `overflow-hidden` to stay out of sight, and that would clip the ember rail, which is deliberately
  one pixel outside the box. At `scale-x-0` there is nothing to hide.
- **The row keeps no horizontal padding.** The reference pads its rows 8px, which would move the
  words off the page's one left edge. The fill is bled `-inset-x-3` instead, so the highlight has an
  edge without the text moving. Measured: the h2 and the row's first column both start at x=161.

### The rail had been snapping since it shipped

`PracticeRows`' ember rail is `scale-x-0` to `scale-x-100` under `transition-transform`. Tailwind v4
writes `scale-x-*` to the standalone `scale` property, so the transition covered nothing and the
rail appeared at full width instantly. Now `transition-[scale]`, and measured in the browser:
`getComputedStyle(span).transitionProperty` reads `scale`, resting `scale: 0 1`, hovered `scale: 1`,
the neighbouring row unchanged.

That is the fourth instance of this trap, after the three recorded under Task 9. The file's own
header comment had even written down the cause ("unlike Tailwind's scale-* utilities, which write
`scale`") while the rail three lines below it named `transform`.

**One mistake worth recording, because the fix was backwards before it was right.** Both overlays
first shipped with `motion-reduce:scale-100!`, copied from `ProblemTiles`, where that cancel is
correct: there the hover scales an image **up** from a resting 100, so forcing 100 removes the
movement. Here the resting state is `scale-x-0` and the hover **is** the 100, so forcing it pinned
every row permanently highlighted under reduced motion. The cancel is gone; reduced motion drops the
transition and keeps the hover, which is a state change arriving instantly rather than a movement.

### Also found while reading the reference, not built

Their process list draws an accent hairline across a row when its disclosure opens
(`:has([aria-expanded="true"])`). Our FAQ would take it as one CSS rule on `details[open]`,
transform-only, no client code. The owner chose the row wipe alone this pass; this is the one other
thing on that site worth having.

Their closing CTA's per-line mask reveal and its marquee were both rejected before being offered:
the site already runs `MaskRise`, and a second marquee would break the one-per-page budget.

## v4 / the index numerals, and a CTA on every page (Task 12)

### The numerals, built after being refused once

Last pass this was turned down on contract rule 6, which bans step labels. The owner asked again,
so it is built, with the one change that removes the thing rule 6 is actually protecting against.

Ported from the reference verbatim in behaviour: `color: transparent` over a 1px
`-webkit-text-stroke` in the muted tone, the stroke colour going to the accent on hover over 400ms.
Theirs runs 48 / 42 / 28px; ours runs 36 / 28, a step down because this section's own heading is
48px and a 48px numeral beside it competes rather than indexes.

**The numeral is `aria-hidden` and the list stays a `<ul>`.** That is the whole mitigation and it is
not cosmetic. These five are promises and nothing about them runs in an order; a screen reader
announcing "zero one, vetted engineers" would assert a sequence the page does not have, which is
what rule 6 exists to stop. Sighted readers get what the reference gives its own readers, a
typographic anchor on the left of each row. Verified in the rendered accessibility tree: the
practices region reads the five titles and their sentences, with no numeral in it.

**The fallback is the part worth keeping.** `-webkit-text-stroke` is non-standard, and
`color: transparent` without it renders the numeral invisible rather than plain. So the solid muted
numeral is the base rule and the outline is applied only inside
`@supports (-webkit-text-stroke: 1px currentColor)`. No engine can fall into a blank column.

Written as CSS in `globals.css` rather than as utilities, because `-webkit-text-stroke-color` is not
a Tailwind property and the transition has to name it exactly. That is the same trap this file has
now recorded five times; in plain CSS the property and the transition are the same word.

Measured on the production build: resting stroke `rgb(163 163 173)` on all five, hovered row's
stroke `rgb(255 90 54)` with the other four unchanged, transition
`-webkit-text-stroke-color 0.4s`. Tabular figures, so 01 through 05 hold one width and the icons
beside them stay on a line. 36px at desktop, 28px at 500px, no horizontal scroll.

The row grid gained a column: `[2rem, 1.25rem, 1fr]` stacked and
`[3.25rem, 1.25rem, 17rem, 1fr]` from md, so the numeral takes the spine's left edge and the icon,
title and sentence each move one column right.

### Every public route now carries a CTA section

| | |
| --- | --- |
| **Gained one** | `/legal/terms/`, `/legal/privacy/` (both via `LegalPending`), `/case-studies/` |
| Already had one | every other public route, all through `ClosingBand` |
| Deliberately without | `/` (its own `FinalCta`), `/contact/` and `/free-site-check/` (they are the form), `/preview/` (`robots: noindex`, internal) |

**`LegalPending` was the real find.** Terms and privacy render a stub reading "This page is being
prepared. Until it is published, **write to us** with any question about it." They were the only
public routes on the site with no call to action at all, so that sentence invited an action and
then offered no way to take it. The band is on the stub itself, so both pages get it from one
place, and it will keep working if a third legal stub is ever added.

**`/case-studies/` is resolved rather than doubled.** It was the page flagged last pass as the only
centred CTA block and the only 20px CTA heading, and adding a band under it would have put the same
two buttons on screen twice within one view. Its empty state gave up its own button pair and kept
the "Read the guides instead" link, which is what an empty state owes a reader; the offer moved to
the band, where it is on every other page. One CTA section per page, one shape.

### Closing band heading size, corrected

`ClosingBand` was rendering at 26px on the 37 guide pages and 32px on the other eleven that share
the identical component. `GuideTemplate` carries `guideHeadings`, a scoped `[&_h2]` descendant
override that steps every heading down for the reading document, and it sat on the `<article>`.
That was the same thing while every section was in the reading column; two are not any more, since
"Other errors we fix" and the closing band both moved to the full spine.

The override now sits on the reading column, which is what its own comment always described.
Measured on a guide page after the change: `symptoms` `causes` `call-us` at 26px, `related-guides`
and `closing` at 32px, matching every other page on the site.

## v4 / two CTA blocks that did not read as CTA blocks (Task 13)

The owner named two: the guide's "When to call us" and a closing band headed "WordPress emergency
fix". They fail for opposite reasons, which is why they needed opposite fixes.

### The closing band: right treatment, wrong words

`ServiceTemplate` passed `s.title` and `GuideTemplate` passed `parent.title` into the band's
heading, so 69 of the site's pages ended on:

> **WordPress 500, 502 and 503 error fix**  `[Fix my site]` `[Chat with an engineer]`

A product name standing next to two controls. It labels the block; it asks the reader nothing. Every
other closing band on the site asks something, and that is the thing that makes the block read as
the offer rather than as a caption:

> "Want a price for your site?" · "Cannot see your error here?" · "Not sure which one you need?"

`CLOSING_ASK` in `src/config/cta.ts` now holds one question per intent, which is the whole set,
because a page's intent already chooses its primary button and can choose the sentence above it too.
In `cta.ts` rather than in the templates because it is CTA wording and that file owns CTA wording.

| Intent | Heading | Example route |
| --- | --- | --- |
| BOOK | Want this fixed on your site? | `/wordpress-fix/emergency/`, all 37 guides |
| PLANS | Want us to look after your site? | `/wordpress-maintenance/care-plans/` |
| QUOTE | Want a quote for this? | `/wordpress-development/hire-developer/` |

The city page was the same class of fault and was not named: "A WordPress team for Chennai" is a
statement, not an ask. It is now "Want a WordPress team for Chennai?", which keeps the city in the
heading and turns it into a question.

**Verified on the production build**, one route per intent plus a guide and a city page: five
headings, five questions, each matching its page's primary button.

### "When to call us": right words, no treatment

The opposite problem. The heading is already an invitation; what was missing was anything to mark
the block off. It rendered as a paragraph, a link, two loose buttons and a footnote, stacked in the
reading column, visually identical to "What usually causes it" directly above it.

Its body now sits in `card`, which is the site's existing shape for an offer inside a reading page,
the same one the guarantee's answer card and both conversion rails use. Nothing new was invented.

**The h2 stays outside the panel**, which matters for two reasons: it belongs to the document
outline, and `ReadingRail` derives its ticks from `h2[id]` inside the reading column, so moving the
heading in would have cost the section its tick.

### What was deliberately not changed

- **The guide page still has four CTA moments**: the hero band, this card, the sticky rail and the
  closing band. That reads like a lot written down, and it is the ordinary shape of a long reading
  page: top, middle, persistent and end. The complaint was never that there were too many, it was
  that one of them did not look like one.
- **The rail card's heading stays the parent service's name.** It reads as a label there because it
  is one: that line is a link to the service page, not the heading of an offer.

## v4 / the two CTA blocks as panels, and a terminal field in the footer (Task 14)

### Which skills were applied, and which were set aside

The owner named four. `high-end-visual-design` wants `rounded-full` pills, `rounded-[2rem]`
squircles, radial mesh gradients, `backdrop-blur-2xl` glass and blur-based scroll reveals. Every one
of those is an anti-pattern in this variation, and contract rule 1 puts the taste-skill's hard bans
and this project's locks above a skill's house style. What was taken from it is the part that is
system-agnostic: nested depth, the trailing-icon button (already shipped as `cta-chip`), a hairline
separating argument from action, and heavier padding.

`ui-styling` is shadcn/Tailwind token guidance, and CLAUDE.md maps those token names away from this
project explicitly. `apple-design` is gesture and spring physics, which neither of these two static
blocks has. Both were read and not applied; saying so here so the next pass does not re-litigate it.

### Both blocks are panels now

| | Was | Is |
| --- | --- | --- |
| `ClosingBand`, 12+ pages | a top hairline with a heading on one side and buttons on the other | a `--surface` panel at the 14px radius with `--shadow-card`, `p-8 md:p-12` |
| Guide "When to call us" | a flat `card` with four stacked blocks | a panel with the argument and the action split by a hairline |

The closing band read as a divider that happened to have controls near it. The lit top edge inside
`--shadow-card` is what makes the panel work: MASTER calls that 5% white inset the main device of
this variation, and at this size it is the difference between a panel and a grey rectangle.

Both now open on the same mark, a 40px ember rule above the heading. That is the existing house
tick from the about page's rail and the practice rows, used as punctuation rather than decoration,
and it is what makes the two blocks read as one family.

**The "When to call us" action row does not split.** `md:flex-row ... justify-between` was tried
first and the reading column is 704px with 64px of panel padding, so two buttons and the
free-site-check sentence never fit on one line: the split only made the buttons stack and left the
sentence beside the gap. One wrapping row puts the sentence under the buttons where it has to go
and opposite them in any container wide enough, which this one is not.

### The footer's terminal field: built, then removed

The owner asked to port `previews.shaders.com/sections/terminal-ascii-footer`. Reading its source
rather than its screenshot changed what "port" could mean. It is not a shader file; it is a TresJS
scene: a 3D blob with rim lighting and dispersion, post-processed into ASCII in three greens, under
a `bg-gradient-to-t` fade, on 2.5MB raw / 705KB gzipped of Three.js. Four of this variation's own
rules rule that out (3D effects, gradients outside two named places, one accent, and the perf
budget on a footer that renders on all 99 routes), so what was built was the idea instead: a field
of terminal glyphs from the reference's own ramp `@#8960543271`, as real text in Geist Mono, flat
rather than faded, measured at 8% so a footer link still cleared 6.57:1.

**The owner then asked for it to be removed, and it is gone.** `SiteFooter.tsx` is byte for byte
what it was before; the `ascii-field` utility is out of `globals.css`.

**Worth carrying forward, because the removal is also a bug fix.** The verification sweep reported
`0 axe violations over 112 runs` and, in the same pass, **horizontal page scroll on five routes**
(`/`, `/legal/guarantee/`, `/legal/terms/`, `/case-studies/`, `/wordpress-development/cities/chennai/`).
Those are the short pages. The field was 160 glyphs of `white-space: pre` at 13px with 0.24em
tracking, far wider than any viewport, held in by `overflow: hidden` on an `inset-0` absolute
layer. On a page tall enough the footer contained it; on a short page it did not, and the document
grew sideways.

Two things to take from that:

- **A decorative layer that is wider than its container is a layout risk even behind
  `overflow: hidden`**, because the clip depends on the container having the size you assumed. A
  texture should be built from a tile that cannot exceed the box, not from one long line trimmed.
- **axe does not catch horizontal scroll.** It reported zero violations on exactly the routes that
  were scrolling sideways. The overflow assertion in the sweep is a separate check and it earned
  its place; contract rule 12 asks for it by name.

## v4 / a shader behind the home page's closing CTA (Task 15)

`@paper-design/shaders-react`'s `NeuroNoise`, behind `FinalCta` and nowhere else.

### Why only the home page

Measured before anything was written, by installing the package and building a throwaway import:
the shader **code-splits to its own chunk and that chunk is referenced only by the route that uses
it**. Confirmed on the real build: `grep` for the chunk across `.next/server/app` returns
`index.html` and nothing else. Total client JS moved 1626KB to 1650KB raw.

That is cheap enough for one page and not for ninety-nine. `ClosingBand` does the same job on about
99 routes, so putting it there would mean a WebGL context and a render loop on every page of the
site against a 200ms INP budget. `FinalCta` is the home page's own CTA family, which MASTER already
treats as distinct, and it is one context on one route.

This is the opposite call from Task 14's footer, and the difference is the number: that port was
705KB gzipped of Three.js on all 99 routes, this is a 12KB chunk on one.

### What the pasted component asked for, and what it got

| Asked | Here |
| --- | --- |
| `next-themes` + a `resolvedTheme` branch | dropped; this variation is dark-locked and has no second theme |
| `lucide-react` `ArrowUpRight` | dropped; Phosphor is the one icon set, and this button already had its arrow |
| shadcn `Button`, `text-foreground`, `text-muted-foreground` | dropped; CLAUDE.md maps those names away from this project. The section's own `BookLink` and `ChatButton` are unchanged |
| `rounded-xl`, `shadow-lg/5` | dropped; 14px shape lock, two shadow tokens |
| `mask-l-from-30%` | dropped; that is a gradient, and this variation allows two |
| `colorBack`/`colorMid`/`colorFront` as literals | read from the tokens at runtime (below) |
| `speed={1}` | `0.32`, and `0` under reduced motion |

### Colours come from the tokens

A WebGL uniform cannot read a CSS variable, and the obvious shortcut is pasting `#FF5A36` into the
props, which puts the accent in two places and breaks silently the next time a token moves. The
values are read off `document.documentElement` and handed to the shader instead.

Only `colorMid` is ember. `colorBack` is `--bg` and `colorFront` is `--surface-2`, so the accent
reads as filaments through a dark field rather than a wash competing with the primary button, which
is what the one-accent lock requires.

`useSyncExternalStore`, not `useState` in an effect. Two reasons, and `Magnetic` two files over made
the same call: writing state from an effect body is the cascading render
`react-hooks/set-state-in-effect` rejects outright, and a `useState` initializer reading the tokens
would render the shader on the client's first pass while the server rendered nothing, which is a
hydration mismatch. The server snapshot is `null`, so both agree on the first frame.

### The photograph came out

`FinalCta` was a mirrored `emergency` frame under the flat scrim, chosen because it is the brightest
real scene in the library and its light fell away from the type. That reasoning was sound and is
kept here because the change is one line to reverse. The two cannot both be the background: a
photograph under a flowing field is two backgrounds competing, and the scrim that makes either
legible flattens both. The scrim itself is untouched, so the section's contrast guarantee does not
depend on what is behind it.

### WebGL is not assumed

The library throws `Paper Shaders: WebGL is not supported in this browser` as an **uncaught promise
rejection**, which no error boundary catches because it is not a render error. That is not
hypothetical: the browser these changes were checked in has no WebGL, and so does any visitor on a
driver blocklist, with hardware acceleration off, or behind a privacy setting that disables the
context.

So support is probed on a detached canvas before the component mounts. Where WebGL is missing the
component renders nothing, the section falls back to the `--bg` layer and the scrim already beneath
it, and the console stays clean. Verified both ways here: with the guard absent the error appears
and the canvas sits at its default 300x150 painting black; with it present there is no canvas, no
error, and the section is a complete design.

**Not verified: how it actually looks.** This browser cannot run WebGL, so the field itself has
never been seen rendering. Everything around it is checked, the fallback included. The shader's own
appearance needs a real browser.

### Asked and declined: the shader on every closing band

Raised straight after Task 15 and settled the same way, written down so it is not re-opened.

`ClosingBand` is a server component rendering on about 99 routes. Counted from the source at the
time:

| Routes | Client islands today |
| --- | --- |
| 6 hubs, 3 compares, 8 cities + the city hub, `/about/`, `/compare/`, `/case-studies/`, `/legal/terms/`, `/legal/privacy/` | **none at all** |
| 32 services, 37 guides, `/legal/guarantee/` | one, `ReadingRail`, and it is `lg`-only |
| `/pricing/`, `/guides/` | one each (`ExpandingRows`, `Finder`) |

Putting the shader in the band would make roughly **23 routes that currently download and execute
no JavaScript** open a WebGL context and run a GPU loop, for decoration behind a button, and would
give the 69 service and guide pages a second always-on island where their only one is desktop-only.

Three further reasons, none of them about bytes:

- MASTER's motion table ends "Nothing else moves", and that sentence is what the rest of the table
  is worth.
- `FinalCta` reads as the page's finale **because** nothing else on the site does this. Spending the
  effect everywhere spends that.
- A render loop on every route is a battery cost on exactly the phone belonging to someone whose
  site is down at the time.

The bands keep the panel, the ember tick and the scroll reveal from Tasks 13 and 14. The shader
stays on the home page alone.

## v4 / the closing band, second pass (Task 16)

Asked for after the shader was declined on the inner bands: make the band itself better, SaaS-grade,
and interactive, without the WebGL. It is still one component, so all ~99 routes move together.

### A grid, not a flex row

It was `flex ... justify-between`, which let the **heading** set where the buttons sat: a 24ch
question and a 28ch one put them in two different places, so the band looked subtly different on
every template. On a 12-column grid the actions sit on one column edge on all 99 routes, which is
the point of there being one component at all.

**Six and six, not seven and five.** Five was tried first and measured wrong: at 1440 the panel's
inner width is about 1008px, a five-column track is ~395px, and the widest pair the site ships
(BOOK at ~150px beside CHAT at ~243px, plus the gap) needs about 405. The buttons wrapped into a
stack on every page. Six gives ~480 and the pair holds one line at every intent, with
`md:flex-nowrap` to say so rather than leave it to luck. Verified on the build: both buttons report
the same `top`.

### The one interaction, and why it is allowed

Reaching for the button is the only thing anyone does in this section, so it is the only thing the
section answers. On hover or focus of either control:

| | |
| --- | --- |
| The ember rule above the heading | `scale-x` 0.1 to 1, running out to exactly the heading's measure |
| The panel's own edge | `--line` to `--line-strong` |

Nothing else, and both properties named rather than `all`.

This is not a hover on a non-interactive panel, which the Hover Earns It rule forbids: the trigger
is the control inside it, and what it communicates is feedback, the section acknowledging the hand
going for the thing it asked for.

**`:focus-visible` gets the identical pair**, so a keyboard reader sees what a pointer user sees.
The hover arm alone sits behind `(hover: hover) and (pointer: fine)`, or a tap would leave the band
lit with nothing to clear it. Both confirmed in the built stylesheet.

**260ms on `--ease-spring`**, inside the 300ms that interface feedback has to stay under, and the
rule starts at `scale: 0.1` rather than 0: a mark that grows out of nothing reads as an effect,
where one that is already there reads as a mark. Measured on the build: 27px at rest, 271px held,
which is the heading's own cap to the pixel.

### Skills, again

`emil-design-eng` applies here almost unchanged and most of it was already in place: custom curves
over the CSS defaults, `:active` scale on press, hover gated behind `(hover: hover) and (pointer:
fine)`, named properties rather than `all`, transitions rather than keyframes for anything
interruptible. The one thing it changed was the duration, down from a first draft at 420ms.

`ui-styling` is shadcn token guidance, which CLAUDE.md maps away from this project, and
`ui-ux-pro-max` chooses palettes and styles that are locked here. `apple-design` is gesture and
spring physics; this band has no gesture. Read, not applied.

## v4 / semantic icons on inner sections (Task 17)

Three text-only sections now carry a mark each, so they can be scanned instead of read.

### The rule all three follow

**An icon is keyed to a field that already exists in the content, never chosen per string at the
call site.** `src/content/icons.ts` holds three maps and nothing else does:

| Map | Keyed on | Entries | Renders in |
| --- | --- | --- | --- |
| `hubIcon` | hub id | 6 | the about page's "What we work on" cards |
| `verbIcon` | `service.whatWeDo[].verb` | 36 | "What we do" on all 32 service pages |
| `deliveryIcon` | `remoteDelivery[].label` | 3 | "How working with us runs" on the 8 city pages |

Picking a mark inline beside each tile is how a site ends up with three different icons for "Back
up" on three different pages. A map is checkable, is identical everywhere that content appears, and
**fails the build** when the content grows a value it does not cover, which is the same integrity
guard `photos.ts` uses for frames.

### Choices worth stating

**Near-synonyms get different marks on purpose**, because they sit in the same list as each other:
`Fix` is the wrench and `Repair` the toolbox, `Measure` the gauge and `Optimize` the lightning,
`Maintain` the cycle and `Update` the up-arrow. Two identical icons in one four-step list would say
the two steps were the same step.

`Test` and `Verify` do share `SealCheck`. That is the single exception and it was checked rather
than assumed: no service lists both verbs, so the two never appear together. If one ever does, split
them.

**The about page's own "How working with us runs" was left alone.** The same three entries run down
a rail there, where each already meets the rail on a short ember tick. Adding an icon would be a
second mark on one line. The city page renders the same three as cards with nothing to mark them,
which is why only that one gained icons.

### About the reference

The owner offered a competitor's plans page. Only its **icon grammar** was read: it runs Font
Awesome and reaches for wrench, shield, save, repeat, clock, cog, users and star for the same
categories this map lands on, which was useful confirmation that the semantic families are the
obvious ones. Not one word of its copy, claims or structure was taken, and CLAUDE.md's rule about a
trading competitor's content is intact.

Worth noting for anyone who repeats the exercise: that page carries **five SVGs in total, all
social links in the footer**, so the "icons" are an icon font and a DOM inspection for `<svg>` finds
nothing. The vocabulary is in the `<i class="fa ...">` class names.

### Build guard, second time

`scripts/check-content.ts` failed this pass on `src/components/templates/CityTemplates.tsx:108`,
"hardcoded internal path, use routes.ts". The offender was a slash-wrapped route written inside a
JSX comment. It is the second time this session the content guard has caught prose rather than code
(the first was a CTA label quoted in a doc comment), and both times it was right to: the cheap fix
is to name routes in prose rather than as paths inside comments.

## v4 / "Everything we quote on", redesigned (Task 18)

The pricing page's 32-service directory. It was six bare headings over 32 identical text rows with
hairlines between them, which reads as a sitemap rather than as a catalogue of work.

### What changed

| | Was | Is |
| --- | --- | --- |
| Each hub group | a heading and a divided list, on the page background | a panel on the site's card tokens, `p-5 md:p-6` |
| The hub heading | a text link | the hub's own mark from `content/icons.ts` beside the label |
| Group scale | nothing | a count, right-aligned, read off the list it sits above |
| A service row | title, colour change on hover | title, a caret, and the site's row hover |

The marks are the `hubIcon` map built in Task 17, so the six areas carry the same icon here as on the
about page. That is the point of the map existing.

The count is derived from the filtered list in the same expression that renders it, so it cannot
drift from what is underneath it. It is a count of rows on screen, not a claim, so contract rule 8
has nothing to say about it.

### The column flow survived, and that was the point of checking

`md:columns-2` is unchanged, and the reasoning in the original comment is why: the six groups hold
11, 4, 4, 3, 6 and 4 services, so a two-column **grid** aligns its tracks by row, lets the
eleven-row Fixes group set the height of the row beside it, and leaves roughly 360px of hole under
Security at 1440. A column flow balances by height instead. Making the groups into cards does not
change that arithmetic, so the cards went inside the existing flow rather than replacing it with
the grid that was already rejected once.

`break-inside-avoid` was already on each group and still keeps a card whole.

### The row hover

The same idiom the practice rows use, not a new one: the row's own hairline is replaced by an ember
one growing from the left, so nothing thickens and nothing moves. The caret travels 2px and goes
ember with the title.

`transition-[scale]`, never `transition-transform`, because Tailwind v4 writes `scale-x-*` to the
standalone `scale` property. Behind `[@media(hover:hover)]`, or a tap leaves a row lit with no way
to clear it.

Measured on the build, pointer held on the first row: hairline `scale: 1`, caret
`rgb(255 90 54)` and `translate: 2px`, title `rgb(255 90 54)`, and the row below it still
`scale: 0 1` with a muted caret.

### Held

Rows are still 51px against the 44px floor, so a 32-link directory still needs no target exception.
The hub heading keeps its `min-h-11` box. The caret and the hairline are both `aria-hidden`, so the
accessibility tree reads one clean link per service and the hub link with its count. One column at
500px, no horizontal scroll.

### Skills

The brief named four. What actually applied was `emil-design-eng`, and mostly as confirmation:
named properties over `all`, a custom curve, hover gated behind a media query, sub-300ms feedback.
`high-end-visual-design` contributed the panel-over-flat-list idea and nothing else, since its
pills, mesh gradients and glass are all anti-patterns here. `ui-ux-pro-max` and `apple-design` had
nothing to add to a static directory with one hover.

## v4 / the empty figure in "What you are seeing" (Task 19)

A defect introduced in Task 12, when the guide capture moved out of the hero and into the symptoms
section. It was wrapped like this:

```tsx
<figure className="mt-6 max-w-[68ch]">
  <RealScreen slot={g.image.slot} ... />
</figure>
```

`RealScreen` returns `null` while its PNG does not exist. The wrapper did not. So:

- **33 of the 37 guides rendered an empty `<figure>` carrying a live `mt-6`**, which is a stray
  element and 24px of dead space under the symptom list on every one of them.
- **The four that do have a capture rendered a `<figure>` inside a `<figure>`**, since `RealScreen`
  is itself one.

Fixed by giving `RealScreen` an optional `className` and rendering it directly, with no wrapper:
margin and measure now travel with the thing that may or may not exist. Verified on the build: a
guide with no capture reports 0 `<figure>` elements, one with a capture reports exactly 1, carrying
both the component's bezel classes and the caller's `mt-6 max-w-[68ch]`.

`RealScreen` has one caller, so the bug could not be anywhere else. Checked rather than assumed.

**Worth carrying forward:** a component that can return `null` should own its own outer spacing. A
caller that wraps it in a positioned or margined box has written an element that renders when the
content does not, and nothing in `tsc`, `lint` or the route test can see it: the page is valid HTML
and returns 200. It took looking at the markup to find.

### What is actually missing, and why it stays missing

33 guides have no capture file. `docs/image-todo.md` now lists the position: **31 of the 33 carry an
`illustration-` slot prefix**, which is the content declaring they were never screenshots of a real
error but drawings of one, so `scripts/capture-errors.mjs` cannot make them. **Only two**,
`stuck-in-maintenance-mode` and `too-many-redirects`, are browser states the script could reach, and
Docker is unavailable on this machine (checked again).

The parent service's photograph is deliberately **not** used as a stand-in here: it is already the
masthead band at the top of the same page, so it would put one picture on screen twice.

## v4 / `npm run capture` on Windows (Task 20)

The owner ran it and got `spawnSync ...\node_modules\.bin\wp-env ENOENT`. Two separate things, and
the second is the one that matters.

### The crash: a shim that does not exist on Windows

`@wordpress/env` **is** installed. npm writes three shims for it:

```
node_modules/.bin/wp-env       a POSIX shell script
node_modules/.bin/wp-env.cmd   Windows
node_modules/.bin/wp-env.ps1   PowerShell
```

The script named the extensionless one, which Windows cannot execute, so the run died before Docker
was ever reached.

**Naming `wp-env.cmd` would have been the wrong fix**: it breaks every other platform, and `.cmd`
needs `shell: true` on current Node since the CVE-2024-27980 change, which would then put
`sh -c "<php>"` through a shell with its own opinions about quotes. `@wordpress/env`'s real entry,
`bin/wp-env`, is a plain `#!/usr/bin/env node` script, so it is handed to `process.execPath`
instead: one path, identical on every platform, no shell involved.

### The preflight, because the next failure was no clearer

Docker is still not running on this machine, and without a check that surfaced several calls later
as a container error that reads like a bug in the script. There is now a `docker info` probe before
anything is created, which exits with what is actually wrong and where to read about it.

### What a working run would actually produce

Two files. Not thirty-three.

`docs/image-todo.md` has the detail: **31 of the 33 guides without a capture carry an
`illustration-` slot prefix**, which is the content declaring they were never screenshots of a real
error but drawings of one. `capture-errors.mjs` breaks a real WordPress and photographs the result,
so it cannot make those at all. Only `stuck-in-maintenance-mode` and `too-many-redirects` are
browser states it can reach.

So installing Docker to run this is worth doing for two guides, and the other 31 need the rule 7a
image-generation route or an illustrator. Worth knowing before anyone spends an afternoon on it.

## v4 / the reference's section reveal, ported to all 99 routes (Task 21)

The owner gave gotechark.com as the reference and asked for its text-section animation, on every
page, as it is.

### What the reference actually runs

Measured off the shipped page and the theme's own assets, not guessed:

| | |
| --- | --- |
| Library | **WOW.js** (`wow.min.js`) over animate.css keyframes. Not GSAP. |
| Trigger | `new WOW({ boxClass: 'wow', animateClass: 'animated', offset: 0, mobile: true, live: true })`: one class, the first time a box crosses the viewport's bottom edge, never replayed. |
| Granularity | The whole element. No SplitText, no char, word or line split anywhere on the page. |
| Keyframe | `fadeInUp`: `opacity 0 -> 1` with `translate3d(0, 100%, 0) -> 0`. Also `fadeInLeft` and `fadeInRight` at ±100% X on two headings. |
| Duration | `.animated { animation-duration: 1s; animation-fill-mode: both }`, no custom timing function, so the browser default `ease`. |
| Stagger | By hand, `data-wow-delay="0.2s"` and `"0.4s"` on sibling elements. |
| Smooth scroll | **None.** `ScrollSmoother.min.js` is enqueued and never initialised; there is no Lenis and no Locomotive. GSAP and ScrollTrigger are there for the pinned panel sequence and the `duration: 9, ease: "none"` marquees, not for the text. |

So "smooth animate like the reference" is this reveal and nothing else. No smooth-scroll layer was
added here, because the reference does not have one running either, and contract rule 6 bans the
scroll listener one would need.

### What was ported and what was not

Kept: the trigger (first entry, once), the 1s length, and the stagger, so a section's children rise
in reading order rather than the block sliding as a slab.

Changed, both deliberately:

- **70ms between children, not 200 and 400.** The site's mastheads already run 70, and 400ms between
  a heading and its own sentence reads as two arrivals rather than one settling. Capped at 280ms from
  the fifth child on, or a nine-child section has the reader waiting 560ms for a paragraph that was
  on screen when the first one moved.
- **14px, not `translate3d(0, 100%, 0)`.** 100% is the element's own height, so on a 600px grid the
  reference's own keyframe is a 600px slide: a different animation on every block and a very long one
  on the tall ones. 14px is what `rise` already uses, and it is the same distance everywhere.

### Why this let opacity back in

The old `reveal` was a view timeline, and Task 12's note explains at length why it had to drop
opacity: a scrubbed animation parks wherever the reader stops, and axe measured serious
`color-contrast` on /about/, /guides/ and /compare/wordpress-vs-wix/ at those park positions, the
ember `.btn-primary` compositing against the page while its section was translucent.

A played animation has no park state. There is no scroll position at which it can be caught part
way, so the fade is safe in a way it never was on a timeline. Re-measured with axe-core on all three
of those routes after walking the full page: **zero `color-contrast` violations**, nothing left
translucent. Do not put a view timeline back here without reading this paragraph and that one.

### The hydration mismatch, and why nothing is written to the DOM

The first build of this ran the reveal the obvious way: the script set `data-in` on a section when it
came into view and `data-rv` on the ones it had already seen, and CSS keyed a keyframe off
`[data-in]`. It worked in the browser and reported a hydration mismatch on all nine home sections in
`next dev`.

The reason is the thing that makes the script worth having. It runs before React hydrates, by design,
so the start state is painted rather than flashed. Every attribute or class it adds to a
server-rendered element in that window is one React then finds on an element it thought it knew, and
React does not patch those up. The old version also added `reveal-js` to `<html>`, which is the same
fault on the element every theme script touches.

So the rule now is that the script writes nothing React can see. The animation is handed to the Web
Animations API, which is a running effect rather than a document change, and the already-watched set
is a `WeakSet` rather than the `data-rv` marker. `<html>` carries `suppressHydrationWarning` for the
one class that must be added, the standard arrangement for a script that has to run this early.

That moves the 14px / 1000ms / 70ms spec out of the stylesheet and into `layout.tsx`, because a WAAPI
animation cannot be started from CSS without a class or attribute to toggle, which is exactly what
caused the mismatch. `--ease-spring` is still read off the stylesheet with `getComputedStyle`, so the
curve keeps one definition. What stays in CSS is the half that has to: the `opacity: 0` start state,
applied by that one class, plus the reduced-motion guard.

Reduced motion is now checked in both places on purpose. The stylesheet keeps an untouched section
visible and responds to a mid-session change without a reload; the script checks `matchMedia` before
animating, because a WAAPI fill would otherwise override the stylesheet on a section that had already
come into view. Verified both: zero running animations and every child opaque under `reduce`.

### The start state is applied by a script that cannot fail to arrive

`.reveal-js` is set by an inline script, first child of `<body>` in `app/layout.tsx`, not by the
bundle. The hidden state exists only once code the HTML parser has already run says so, so a blocked
or slow bundle leaves all 99 pages fully readable rather than blank. No `IntersectionObserver`, no
`Element.prototype.animate`, or a curve the browser will not parse, and the class comes straight back
off, so an old browser gets the static page rather than an empty one. This is the same reasoning that kept `rise-in` and `hero-word`
out of Motion: `MaskRise` and `CtaReveal` ship `opacity: 0` in the server HTML and wait for
hydration, which is the one thing a page of body copy must not do.

The `MutationObserver` beside it is the reference's `live: true`, and it is not optional here. Next
soft-navigates, so without it a second page's sections would mount after the sweep had finished and
sit at opacity 0 for good. Verified: clicking through to a guide picks up all six of its sections.

### Where it is applied

One level per section, never nested, so nothing animates twice. `Section` in `parts.tsx` covers every
inner route (h2 at 0ms, its content block at 70ms, which is the reference's own heading-then-body
beat; delay is the child's index, capped from the fifth on), `ClosingBand` carries it already, and nine home sections were tagged. Two home sections were
left alone on purpose: `Hero` is above the fold and has `HeroWords`, and `FinalCta`'s direct children
are its absolute shader and scrim layers, which a transform would lift out of place. `FinalCta`
already runs `MaskRise` and `CtaReveal`.

`Faq`'s `JsonLd` moved outside its `<section>`: `reveal` staggers by child position, and a
`display: none` script holding slot one put the heading a beat behind the only two things on screen.

### Checks

`npm run build` (99 routes), `npx tsc --noEmit`, `eslint`, `npm run check` all clean. In Chrome at
1440 and at phone width: no horizontal scroll, h1 stays at opacity 1 throughout (it is the LCP
element on every one of these routes and an element at opacity 0 is not painted), every section
fires on a reader-paced scroll, none left hidden, no console errors. Under
`prefers-reduced-motion: reduce` every child is opaque with `animation-name: none` from the first
paint, and no section writes a single attribute, so `next dev` reports no hydration mismatch.

A jump that skips a section entirely, an anchor link or a restored scroll position, leaves it hidden
until the reader scrolls back to it, at which point it reveals. That is exactly WOW.js's behaviour on
the reference and it self-heals, so it is left as is.

## v4 / the reference's reveal, dropped to element level (Task 22)

Task 21 ported gotechark.com's reveal at section level. The owner asked again, for every component
on every page. This is the granularity pass, and the measurement is what shaped it.

### What the reference actually runs, across the whole site

| Effect | Mechanism | Where |
| --- | --- | --- |
| **Element reveal** | WOW.js `{offset:0, mobile:true, live:true}` over animate.css `fadeInUp` | everywhere |
| Pinned panel sequence | GSAP ScrollTrigger, `pin: true`, `scrub: 3`, desktop >=1200 | home only |
| Number counters | jQuery `.animate()` on a scroll handler, 850ms `swing` | two pages |
| Carousels | Swiper | 8 to 43 nodes per page |
| MotionPath orbit | GSAP MotionPathPlugin, `duration: 9`, `repeat: -1` | /about-us/ only |
| Custom cursor | TweenMax 0.016s lerp loop | one slider |
| Image hover zoom | CSS `scale(1.1)`, `transition: all .3s` | card images |
| Sticky header | CSS keyframe `top: -50% -> 0` | global |
| Scroll cue | CSS keyframe `MoveUpDown` | hero |

`wow fadeInUp` appears **67 times on /wordpress-websites/, 314 on /portfolio/, 23 on /about-us/, 4
on /services/**. Everything else is one or two pages. The reference reads as uniformly animated
because of the one effect, at a granularity we did not have.

It has **no smooth-scroll layer**: `ScrollSmoother.min.js` is enqueued and never initialised, no
Lenis, no Locomotive. animate.css ships 88 keyframes; three are used.

### Why `.reveal` had to change meaning

It meant "observe this container, animate its direct children". Measured on the running build, the
list items worth animating sit **3 to 6 levels below** their nearest `.reveal` ancestor: section,
heading, `mt-6` wrapper, `ul`, `li`. Marking the inner `ul` as well double-animates, because the
wrapper rises and the items rise inside it, multiplying opacities and summing translates.

So `.reveal` on a container now means **each direct child is observed and animated on its own
entry**, and `.reveal-self` marks a lone element. Both collect into one selector,
`.reveal > *, .reveal-self`. A grid of twenty cards costs one class on the `ul`.

**One owner per ancestor chain.** A deeper marker always means the ancestor gives its own up. The
check that catches every instance, run on five routes, must return empty:

```js
[...document.querySelectorAll('.reveal, .reveal-self')].filter(n => n.parentElement?.closest('.reveal, .reveal-self'))
```

A `:has()` exclusion was considered and rejected: a browser that drops the selector parks the
wrapper at opacity 0 forever, which is the exact failure the inline-script design exists to prevent.

### No stagger, and that is the ported behaviour

The element is its own trigger now, so there is nothing left to stagger: siblings in a row cross the
viewport edge together and rise together. The reference is the same. It hand-writes `data-wow-delay`
and does it **once** across 67 `wow` nodes on /wordpress-websites/. The 70ms ladder stays where the
reference keeps its own, above the fold, in `rise-in` on the masthead. The `Math.min(k,4)` cap and
the index arithmetic are gone.

### The cascade finding, which decided the whole shape

A WAAPI animation created with `fill: both` sits in the **animation origin**, which outranks author
normal declarations *and inline styles*, and it never leaves its after phase. Probed on the running
build against a `TileGrid` tile: after the reveal finished, writing `style.transform =
translateX(120px)` set the attribute and `getComputedStyle` still reported the identity matrix.

So every Motion and GSAP island on the site would be permanently frozen if a sweep selector reached
it: `TileGrid`'s layout projection, `ZoomImage`, `Magnetic`, the `LogoMarquee` track, the `FaqTabs`
pill, `GuaranteeHeading`'s stroke draw. **Never sweep.** Placement is by hand, and these are banned
as targets:

- anything inside a Motion or GSAP island
- an `absolute`/`fixed` layer, or an element an absolutely positioned descendant resolves against
- an ancestor of a `position: sticky` element, which would otherwise stick to the transform
- children of a clipping container, which an `IntersectionObserver` reports as never intersecting
  and which therefore stay hidden for good
- a `<script>`, an `sr-only` node, anything inside an `<svg>`
- an image or figure in the first viewport, or one that preloads

### Two prohibitions this pass appears to break, and does not

**The view timeline ban stands.** The failure was the scrub, not the animation: a reader who stops
mid-range parks at arbitrary opacity, and axe measured serious `color-contrast` on /about/, /guides/
and /compare/wordpress-vs-wix/ at those positions. This is the same played animation as Task 21,
with a different target and a larger count.

**`LinkCards`' refusal of a per-card entrance is retired,** for the same reason, and its comment now
says so rather than being deleted. Both of its bans still stand on their own terms: no view timeline,
no delay ladder.

### Opacity finishes at 30%

A played animation has no park state but it is not instantaneous either, and `docs/qa-report.md`
records this site's own instrument catching two serious `color-contrast` violations at a 300ms
settle that were gone at 1500ms. One section at a time that window sat mostly above the reader's
eye; at element level a scrolling reader always has something in flight. The fade now finishes in
300ms while the travel takes the full second.

**Bug found while verifying this, worth not repeating:** written as
`[{opacity:0,...},{opacity:1,offset:0.3},{transform:'none'}]`, every element faded in and then
straight back out to invisible. A property missing from the last keyframe does not hold its previous
value; WAAPI synthesises an implicit one from the element's underlying style, which here is the
`opacity: 0` start state. Measured on /pricing/: 58 targets, 58 still hidden after a full scroll.
Opacity is written on all three keyframes.

### The reduced-motion arm is nested inside the hide rule

They used to be two blocks 17 lines apart. Widen one and not the other and a reduced-motion visitor
gets 130 invisible elements on all 99 routes, with nothing in the build, tsc, eslint or check able to
see it. It is also `!important` now, because a normal declaration loses to a running or filled
animation: a visitor who turns the setting on mid-session would otherwise keep every reveal in
flight along with its offset.

### Where the markers went

`parts.tsx` reaches all 99 routes: `reveal` off `Section` and `ClosingBand`'s `<section>`, onto the
heading (`reveal-self`) and the inner grid; `reveal` on the `ul` in `TickList`, `Promises`,
`LinkCards`, `Faqs`; `reveal-self` on `LinkList`'s chip row, which is orientation furniture rather
than content. Then the hand-rolled lists in the five templates, and `about`, `compare`, `guides`,
`pricing`.

**Skipped deliberately:** the `columns-*` flows on /guides/ and /pricing/, because a transform on a
column-fragmented box is under-specified across engines. /pricing/ is marked one level in instead, on
the `break-inside-avoid` card's own list. /guides/ gets its heading and lead only.

**The home page took no markup edit and improved anyway.** Its nine sections keep `reveal` on the
`<section>`; the script now watches their children individually, so a heading fires when the heading
crosses rather than when the section does. Going deeper would mean reaching into nine Motion and
GSAP islands, which the cascade finding forbids. The reference has the same shape: 4 `wow` nodes on
its /services/, 314 on its content directories.

### The three extras

**Image hover zoom was already shipped, and was quietly broken.** The only image inside an
interactive element is `ProblemTiles`, which already had the effect. But it was written
`transition-transform ... group-hover:scale-105`, and Tailwind v4 emits `scale-105` as the standalone
`scale` property, so the transition covered nothing and **the zoom snapped instead of easing over
500ms**. The file's own comment documents this trap for the reduced-motion cancel and then walks
into it for the transition.

Grepping every caller rather than the one line found eight in total, all snapping:
`ProblemTiles` (both images, and its caret), `Proof`'s arrow, `NavBar`'s wordmark underline,
`compare/page` (hairline and caret), `ExpandingRows`' caret, `MegaMenu`'s caret. All eight fixed to
name the real property. `FaqTabs` is not a victim: it writes an inline `transform`, so
`transition-transform` is correct there.

**The count-up was skipped, and the reasons are worth keeping.** There is one honest call site on
the whole site, the `<dl>` on /compare/. Everywhere else the numbers are inline in running sentences
(`The 6 areas below hold 55 services`) or single digits. Beyond that: contract rule 6 bans invented
statistics and a count-up prints about fifty of them on the way to the real one; `toLocaleString`
is a no-op because no number on any of the 99 routes reaches four digits; two of the three sites
would reflow their paragraph as the digit count changes; and it would need a fourth rule-10
exception, because it animates text content.

**The sticky-header slide-in was redirected.** The reference's header becomes sticky partway down and
slides in from `top: -50%`; ours is `fixed` from the first pixel and never leaves, so there is no bar
to slide. The thing that does arrive is the blurred backdrop panel, which faded in on opacity alone
at 8px of scroll. It now also slides, `useSpring(useTransform(scrollY, [0,8], [-64,0]))` through the
site's one spring, -64 being the bar's own height. Transform, not `top`: `top` is not
compositor-animatable and would relayout a full-width fixed overlay every frame at first paint on all
99 routes. Watch for one thing: the panel carries `backdrop-filter`, and a filter inside an animating
transform samples its backdrop in the shifted space, so a restored scroll position could ghost.

### Measured

Production build, Chrome, 1440 and 375.

- **Nesting:** zero on home, /pricing/, /about/, a service page, a guide, /compare/wordpress-vs-wix/.
- **axe `color-contrast`, two settles per scroll stop (200ms and 1500ms)** on /about/,
  /compare/wordpress-vs-wix/ and /guides/white-screen-of-death/, walking in 40% viewport steps:
  **zero violations at both settles**, and no `.btn-primary` ever sampled between 0.02 and 0.999.
- **Targets:** 58 on /pricing/ (was 9), 23 on home, 21 on a hub, 28 on a service page at 375.
  Nothing left hidden after a reader-paced walk on any of them.
- **LCP** is still the masthead `<img>` on /pricing/, a service page and
  /guides/white-screen-of-death/, where the `RealScreen` figure is deliberately unmarked and sits at
  opacity 1. **CLS 0.**
- **Animations:** 58 on /pricing/, all `finished` rather than running, so the fill persists without
  ongoing compositor work.
- **No DOM writes** (`[data-in],[data-rv]` is empty everywhere) and **no hydration mismatch** in
  `next dev`, under both motion settings.
- **Reduced motion:** every target opaque from first paint, `document.getAnimations()` empty.
- **Soft navigation:** 21 targets on the next page picked up by the `#main` MutationObserver.
- **Islands intact:** `TileGrid` tiles and the marquee track are not markers' children, and the
  marquee runs in view and pauses off it, as before.
- **Hover zoom** now reports `transition-property: scale` over 0.5s, where it reported `transform`
  and snapped.
- No horizontal scroll at 375 or 1440; no-JS leaves every page fully visible.

## v4 / side rays in the home hero (Task 23)

The owner asked for reactbits.dev's `SideRays` in the hero. First brief said the left side; the
owner then supplied a reference image of a broad soft beam entering a **top-right** corner and
confirmed that corner, which is also the safer one here: the headline sits on the left at lg, so
light entering over the photograph fades before it reaches the words.

### Two files, not one

`SideRays.tsx` is the vendored renderer, converted to TypeScript and otherwise the author's shader
and render loop. `HeroRays.tsx` is the leaf that knows this site: it reads the palette off
`document.documentElement` and sets the dials. Replacing the vendored source later means swapping
one file and leaving the other alone.

Its two-rule stylesheet was folded into class names rather than added as `SideRays.css`, so the
branch gains no stray CSS file: `relative size-full overflow-hidden` on the host,
`absolute inset-0 block size-full` on the canvas.

### What the integration changed

- **`origin="top-right"`**, confirmed against the owner's reference image.
- **Tuned to that image rather than to the component's defaults.** The first pass read as a fan of
  thin shafts; the reference is one broad beam with a couple of softer ones beside it. `density` is
  what decides that (4 cut the light into stripes, 2.6 leaves it whole), with `sharpness: 0.22` and
  `falloff: 1.15` for a soft edge that still reaches the far corner.
- **The second accent is stripped.** The component ships amber `#FFC46B` and blue `#96c8ff`, which
  is two accents and CLAUDE.md removes one on sight. Here it is `--accent` against `--text`: one
  ember edge riding a near-white core, which is the shape of the light in the reference image.
  White is not an accent, so the lock holds. `blend: 0.55`, past half, so the core leads.
- **Colours are read from the tokens, never pasted.** A WebGL uniform cannot read a CSS variable,
  and a literal `#ff5a36` in the props would put the accent in two places. Same
  `useSyncExternalStore` arrangement as `CtaShader`, with a `null` server snapshot so both render
  passes agree on the first frame and nothing paints at the component's amber-and-blue defaults.
- **Reduced motion gets `speed: 0`, `intro: false`, `followMouse: false`** — lit and still, which is
  the final static state rule 10 asks for. The component's own reduced-motion branch only slows its
  clock to 0.3x, so this does not rely on it.
- **A ref write moved out of render.** The original assigns `settingsRef.current = settings` during
  the render body so prop changes reach the loop without tearing down the GL context. That is a
  side effect React is allowed to discard, so it is an effect here.

### Where it sits, and the layer that hid it first

`aria-hidden`, `pointer-events-none`, `absolute inset-0`, **last child of the hero `<section>`,
after the scrim.**

It shipped at `-z-10` first, by analogy with `CtaShader`, and the owner reported seeing no rays at
all. `hero-scrim` is `linear-gradient(to right, var(--bg) 0%, var(--bg) 68%, transparent 96%)`:
**opaque `--bg` across the left two thirds**, which is exactly where light from the left lands. It
is `absolute` at the auto level, so it painted straight over anything negative, and at lg there was
nothing to see. Lesson worth keeping: `-z-10` is the right layer in `FinalCta`, whose only
underlying layers are its own `--bg` and a flat scrim, and the wrong one here. Check what else
paints in the section before copying a z-index across.

Above the scrim and the photograph now, still below the type: the heading column is `relative z-10`
and this is at the auto level. **The headline is the LCP element on this route and nothing is
allowed over it.**

Verified after the move, with a stand-in gradient painted onto the host because this browser cannot
render the shader: the layer reads from the left across both the scrim and the photograph, and the
h1, the subtext and both buttons sit on top of it. `elementFromPoint` on the headline returns the
`hero-word` span and on the primary CTA returns the anchor, so the layer intercepts nothing. LCP is
still the hero `<img>`, CLS 0, no horizontal scroll, and the host is not a reveal target.

### The honest gap

**The rays have not been looked at.** The browser available in this environment reports no WebGL at
all (`webgl2: false`, `webgl1: false`), so the canvas renders nothing in it. That did confirm the
fallback: `getContext` returns null, the effect leaves early, and the result is a transparent canvas
with no console error and no layout effect, which is why this needs no `hasWebGl` probe of the kind
`CtaShader` carries for a library that rejects an uncatchable promise.

What it could not confirm is the look, or the contrast. `intensity`, `glow` and `opacity` are set to
roughly two thirds of the component's defaults, reasoned from the token contrast rather than seen:
`--text` on `--bg` measures about 17:1 and `--muted` about 7.3:1, so there is headroom for light
behind them, but light behind them spends it, and the brightest moment is the first second after
mount while the intro is still growing. All three numbers live in one place in `HeroRays.tsx`.

**Still owed, on a machine with a GPU:** one pass by eye at 1440 and 375, and an axe
`color-contrast` run on the hero with the rays lit. A contrast scan in a browser without WebGL is
measuring the unlit page and proves nothing about this.

### Also worth knowing

The home page now holds two WebGL contexts, this one and `CtaShader`'s in the closing CTA. Both
sleep: this one reschedules `requestAnimationFrame` only while something moves, and an
`IntersectionObserver` plus `visibilitychange` stop it off-screen and in a background tab.

## v4 / hero-background.png as the hero's background (Task 24)

The owner supplied `public/site_images/hero-background.png` and asked for it as the hero background.
Registered in `src/content/photos.ts` as `hero-background`, tone `dark`, with its real pixel size.

### The shape of the file decided the layout

**1774 x 522, a 3.4:1 panorama.** That one number ruled out the obvious move. The hero's photograph
slot was a half-width panel, `lg:inset-y-0 lg:right-0 lg:left-1/2`, which at 1440 is 720x900, a
0.8:1 box. `object-cover` of a 3.4:1 source into 0.8:1 shows a narrow vertical slice of the middle
and throws the desk, the plant and the person away. Dropping the new file into the existing slot
would have looked broken.

So the slot became the background it was asked to be: `lg:inset-0`, full bleed. That still crops, to
about the middle 47% of the width, and upscales about **1.72x** to reach `min-h-[100dvh]`, which
this frame takes because nearly all of it is unlit bokeh. `focus: 45% 50%` puts the monitors and the
WordPress logo in that window.

Under lg it is a `2/1` band in flow, not the panorama's own 3.4:1, which at 375 would be a 110px
strip, and not the `4/3` the previous portrait source wanted, which would crop this one to its
middle third. `sizes` is `100vw` at every width now, which is simply what it is; the old 83vw note
was arithmetic about a half-width panel that no longer exists.

### The scrim had to come back, or there was nothing to see

`hero-scrim` was `linear-gradient(to right, var(--bg) 0%, var(--bg) 68%, transparent 96%)`. Against
a half-width panel that was right. Against a full-bleed background it blanked two thirds of the
photograph and what was left read as an unidentifiable silhouette: first build showed the back of a
head and no screen.

Now `--bg 0%, --bg 55%, transparent 92%`. 55% is the last column that has to be opaque: the headline
runs to about 53% of the viewport at 1440 and the subtext and buttons stop well before it. axe
`color-contrast` on the hero subtree: zero violations.

### A free LCP win, and why

**LCP moved off the photograph and onto the headline, at 104ms** (it was the photograph at about
1.27s in `docs/qa-report.md`). Chrome excludes an image that covers the whole viewport from being an
LCP candidate, treating it as a background, so the first headline line now takes it. Worth knowing
before anyone reads the improvement as something they did.

At 375 the LCP is still the `<img>`, because there the image is a band in flow rather than a
full-viewport layer. CLS 0 at both widths, no horizontal scroll.

### Still soft, and the only real fix is upstream

522px of source height stretched to a 900px hero is a 1.72x upscale. It holds here because the frame
is soft bokeh and the one sharp thing, the WordPress logo, is large. A source around 1100px tall at
the same aspect would remove the upscale entirely at 1440. Worth asking for if the hero is ever
shot again.

### Note for whoever looks next

`HeroRays` now sits over this photograph, and the photograph already carries strong ember lighting
of its own. The two were tuned separately and have not been seen together, because this environment
has no WebGL. If the combination is too hot, the rays are the thing to pull back, not the image.

## v4 / the hero photograph becomes a background at every width (Task 25)

Task 24 made the photograph a full-bleed background at lg and left an in-flow band below it, so on a
phone the picture arrived *after* the buttons instead of behind them. The owner asked for it to be
the background on mobile and tablet too.

### One layer now, at every width

The `<Photo>` moved out of the grid and became `absolute inset-0`, the first child of the section.
The scrim lost `hidden lg:block` and renders everywhere.

**`object-position` is per breakpoint, not per photograph.** The source is 3.4:1, so how much of it
survives depends entirely on the viewport: a 1440x900 window keeps about the middle 47%, a 375x812
phone keeps about **14%**, a vertical slice barely wider than one object. `57%` puts the lit monitor
and the WordPress mark inside the phone's slice; `45%` opens out at lg to take in the plant, the mug
and the desk. Set as classes, which is why this registry entry carries no `focus`: `Photo` writes
`focus` as an inline style and an inline style beats a class.

### The contrast failure axe could not see

Below lg the type sits on the photograph, so the scrim went flat, which is what contract rule 6
requires of a scrim over a photograph, and the lead went `--on-photo`, because `--muted` over a
scrimmed photograph is the 2.55:1 `parts.tsx` already records.

At the shared `--photo-scrim` (0.66) axe reported **zero violations and five `incomplete`**:
*"background color could not be determined because element contains an image node."* axe does not
compute contrast against a photograph, so a clean run here means nothing.

Measured directly instead, compositing every pixel of the visible crop under the scrim and taking
the worst case, at native resolution:

| scrim alpha | `--on-photo` text | `--accent` "today." |
| --- | --- | --- |
| 0.66 | 5.8:1 | **2.1:1 — fails** |
| 0.80 | 9.6:1 | 3.5:1 |
| **0.84** | **11.1:1** | **4.1:1** |

The ember word is the one that failed, because the lit WordPress mark sits directly behind it. At
30px bold it is large text, so its floor is 3:1, not 4.5:1. Same picture at 375, 768 and 1023.

So the hero has its own token, `--hero-scrim` at 0.84, rather than moving the shared
`--photo-scrim`, which is measured for mastheads at 0.66 and used across the site. At lg nothing
changed: the type is back in its own column on solid `--bg` and the scrim is still the horizontal
wipe, with the lead back to `--muted`.

**The lever, if the photograph should read brighter, is `object-position`, not the scrim.** Moving
the bright mark out from behind the headline buys contrast without dimming the frame.

### Measured

375, 768, 1024 and 1440: photograph behind the type at all four, no horizontal scroll, CLS 0, axe
`color-contrast` zero violations on the hero subtree. Desktop verified unchanged: gradient scrim,
`--muted` lead, 45% focus, LCP still the headline span. Hero height at 768 is exactly 1024, so
removing the in-flow band also stopped the hero running past 100dvh on small screens.

## v4 / the photograph leads on small screens, and the hero CTAs stack (Task 26)

Two asks: the hero CTAs stacked at full container width, and on a phone the photograph shown first
and in full, with the words after it.

### The photograph leads below lg, and is the background at lg

Task 25 put it behind the type at every width. On a phone that meant a 3.4:1 picture in a 0.46:1
window, which keeps about **14% of its width**: a vertical slice barely wider than one object. It
was a background, but it was not the photograph.

Below lg it is now a band at the top of the hero, before the headline, running at the source's own
`aspect-[1774/522]` and bleeding edge to edge. Nothing is cropped: the plant, the headphones, the
mug, the lit monitor and the person are all in frame. Measured at 375: the box is 360x106 at ratio
3.40 against the source's 3.40, so the crop is zero.

At lg it is still `lg:absolute lg:inset-0` against the section, with `lg:mx-0`, because an
absolutely positioned box with both insets set still answers its margins and the full-bleed
negatives would otherwise push it past the viewport.

### Which retires the heavy scrim, and the contrast problem with it

The type is back on solid `--bg` below lg, so:

- `hero-scrim` is `hidden lg:block` again and back to the single horizontal gradient.
- The lead is `--muted` at every width again, not `--on-photo`.
- `--hero-scrim` at 0.84 is **deleted**. It existed only to carry the ember headline word over the
  lit WordPress mark, and there is no longer any type over the photograph at these widths. The
  measurement that produced it is kept in Task 25 and summarised in the `hero-scrim` comment, in
  case that layout ever returns; it is not a number anyone should have to derive twice.

Worth noticing: moving the picture out from under the words solved an accessibility problem rather
than trading one off. The failure Task 25 had to engineer around simply stopped existing.

### CTAs

`flex flex-col gap-3 sm:flex-row sm:flex-wrap`, with `w-full sm:w-auto` on both buttons. Two
content-width buttons on separate lines read as a ragged edge, and the primary is the page's whole
job here, so below sm it gets the column. `w-full` is safe on both utilities: each is an
`inline-flex` box that already centres its own label and chip, so nothing inside them moves.

Measured at 375: both 328x44, same left edge, which is the container's full width inside its 16px
gutters and over the 44px floor contract rule 5 sets. At 1440 they are back to a row at content
width, 151 and 244.

### Measured

375, 768 and 1440. Image above the headline below lg and absolute at lg; zero crop at 375; CTAs
stacked below sm and a row above it; scrim hidden below lg and shown at lg; axe `color-contrast`
zero violations on the hero at 1440; CLS 0 and no horizontal scroll at all three; LCP still the
headline span at 1440.

## v4 / the hero stops being a hole with a picture in it on small screens (Task 27)

The owner sent a phone screenshot: too much empty space above and below, and asked for the
photograph a little zoomed.

### Measured first, because the obvious fix was the wrong one

At 375 before this: 94px between the header and the photograph, 126px below the last button, and
**65% of the viewport used by content**.

The instinct is to trim the padding. That makes it worse. The hero was `min-h-[100dvh]` with
`items-center`, and its content is about 565px against an 812px screen, so the 250px difference was
being split above and below. Shrinking the padding shrinks the content and hands the same number
straight back to the centring. Total emptiness is `viewport - content`, and padding is not in it.

### Two changes, in the order they were tried

**The zoom, which the owner asked for and which helps because it makes the content taller.** The
band below lg was running at the source's own 3.4:1, which is 106px on a 360px screen, a letterbox
strip. Now `aspect-[3/2]` on a phone and `aspect-[2/1]` from md: 240px and 377px. 3/2 keeps the
middle 44% of the frame, the mug, the lit monitor with the mark on it, and the person, which is the
part of this picture that says what the page is about.

That alone took the gaps to 75 and 107, and the fill to 70%. Better, not fixed.

**`lg:min-h-[100dvh]` instead of `min-h-[100dvh]`, which is the actual fix and a deliberate contract
deviation.** Rule 4 asks a hero to fill the screen. On a wide window this one does, and nothing
there changed. On a phone it cannot, and forcing it only manufactured the hole. Below lg the section
now sizes to its content.

Rule 4's real requirement, *CTA visible without scrolling*, is better served than before, and the
next section now peeks above the fold, which tells the reader the page scrolls. One token to revert
if the owner would rather keep the rule literally.

### After

| | 375 before | 375 after | 768 after | 1440 |
| --- | --- | --- | --- | --- |
| header to photograph | 94px | **32px** | 32px | n/a, background |
| last CTA to section end | 126px | **64px** | 64px | n/a |
| photograph height | 106px | **240px** | 377px | full bleed |
| content fill | 65% | **78%** | 80% | full |

CLS 0 and no horizontal scroll at all three. CTA above the fold at all three. At 1440 the hero is
still exactly 900px, the photograph is still the absolute background and the gradient scrim is still
shown, so nothing about the desktop composition moved.

## v4 / the supplied service renders, audited and placed (Task 28)

Eight 359x149 renders arrived in `public/site_images/services/`. The owner asked for an audit and a
purposeful home.

### The audit

They are not photographs and not icons: single-object 3D renders on a dark bokeh desk, one lit
subject each. Contract rule 7a allows generated imagery using the variation's art direction, so
they are legitimate; they are simply a **different visual language** from the documentary
photographs the templates already use, which is the argument for keeping them to one place rather
than scattering them into existing photograph slots.

**Half of them carry a second accent.** Measured in the browser as the warm/cool split of lit
pixels, skipping near-black and near-grey:

| | warm | | | warm |
| --- | --- | --- | --- | --- |
| speed-optimization | 100% | | backup-recovery | 31% |
| emergency-fixes | 94% | | hacked-site-cleanup | 25% |
| woocommerce-help | 91% | | malware-cleanup | 23% |
| maintenance-care | 50% | | site-migration | 10% |

v4 has a one-accent lock and CLAUDE.md strips a second accent on sight, but you cannot strip a
colour out of a raster the way you strip a token. The owner chose to ship the four warm ones and
regenerate the rest; all four cool files are logged in docs/image-todo.md with the direction.

**359x149 is small**, so the placement had to be one where the render is never asked to be large:
about 1.5x upscale on a 1440 desktop card and 1.8x on a 2x phone. That rules out a masthead, which
is 1104px wide and would be a 3x upscale of a soft source.

### Placed on the hub cards, and the grid had to be made whole

**Superseded the same day by Task 29: the render is the card's background now, not a banner across
its top. The `anyBanner` box described below no longer exists. The audit above still stands.**

`LinkCardItem` gained an optional `banner`, and `/about/`'s six hub cards pass it through
`hubBanners`. The banner cancels the card padding, owns the two top corners at the 14px radius, and
runs at the source's own `aspect-[359/149]` so nothing is cropped. It scales 1.05 on hover like the
home tiles, behind `(hover: hover)`, with `transition-[scale]` rather than `transition-transform`,
because Tailwind v4 writes `scale-105` to the standalone `scale` property.

**The first build keyed the box off `i.banner` and looked unfinished.** Four hubs have a usable
render and two do not, so the grid rendered four cards with a picture beside two with a small icon
and an empty space where the picture would be. Screenshotted, and it read as a bug rather than a
design.

So the box is drawn for every card in a grid where *any* card has one: `anyBanner`. A card with no
render centres its existing icon in the same box at display size. Every card in the row keeps one
silhouette, and a render arriving later is one line in `hubBanners` with no layout consequence.
Measured after: six cards, all six with the box, four photographs, two icon fallbacks, all 416px
tall at 1440.

### Measured

- `/about/`: axe clean on the section at 375, CLS 0, no horizontal scroll, banner alts empty
  (decorative, the card's heading already names the destination).
- **No other route changed.** `LinkCards` renders on five templates across 99 routes; `anyBanner` is
  false everywhere except `/about/`, confirmed on a hub route: 17 cards, 0 banner boxes.

## v4 / the hub card renders move from a banner to the card background (Task 29)

The owner asked for the renders behind the cards rather than in a strip across the top.

### What changed

The picture is `absolute inset-0 -z-20` inside the card's own `isolate`, with a flat scrim at
`-z-10`, both above the card's `bg-surface` and below every child in flow. `overflow-hidden` on the
card is what makes the 14px radius clip the picture. The `anyBanner` box is gone, and with it the
icon-fallback: a card with no render simply keeps the plain surface and its icon, and because there
is no empty box to fill, the two treatments sit together without looking unfinished.

### A prediction I got wrong, and the measurement that corrected it

Before building it I estimated the background treatment would crop to the middle 54% of the render
and upscale about 2.8x, against 1.5x for the banner, and said so. That was wrong, and wrong in a
useful direction: it assumed a 416px-tall card, which was the height **with** the banner box adding
~220px to it. Take the banner away and the card is 219px tall.

Measured on the shipped layout: the card is 542x219 at 1440, which is 2.47:1 against the render's
own 2.41:1. So the crop is almost nothing and the upscale is **1.51x**, 1.63x on a phone. The
background treatment is the better of the two on resolution, not the worse.

### The scrim, measured twice

Type on the picture needs a heavier scrim than the shared `--photo-scrim`, and the binding
constraint is not the body copy, it is the title's ember hover, which needs 3:1 as large text.
Worst case across the four renders, compositing every pixel of the visible crop:

| scrim | `--on-photo` | `--muted` | ember hover title |
| --- | --- | --- | --- |
| 0.66 (shared `--photo-scrim`) | 6.1 | **2.8 fails** | **2.25 fails** |
| 0.78 (`--card-scrim`) | 9.4 | 4.28 | **3.45** |
| 0.84 | 11.5 | 5.25 | 4.23 |

0.78 with the summary moved to `--on-photo`, which is the same swap the hero lead makes and for the
same reason: `--muted` is 4.28:1 here and body copy needs 4.5. The caret stays `--muted` because it
is a UI graphic at 3:1. The numbers were first taken against the wrong 540x416 box and re-taken
against the real 542x219 one; they are unchanged, because the brightest pixel in `emergency-fixes`
is near the centre and survives either crop.

At 0.78 the picture is about a fifth of its own brightness. It reads as a lit texture behind the
words rather than as a photograph, which is the trade any text-over-image card makes.

### Measured

Six cards, four with a picture and two plain, all 219px tall at 1440 and 219 to 244 at 375 where
the grid is one column. Scrim resolves to `rgba(12, 12, 14, 0.78)`, title and summary to
`rgb(241, 240, 238)` on picture cards and the summary back to `--muted` on the plain ones. CLS 0 and
no horizontal scroll at both widths. No other route changed: `LinkCards` renders on five templates
across 99 routes and only `/about/` passes a `banner`.

## v4 / "How working with us runs" as a numbered track (Task 30)

The owner supplied a reference image: three cards across under a dashed timeline, circular 01/02/03
stations, the first card lit, an ember icon tile in each.

### What it replaced, and why that matters

A vertical rail, whose own comment read: *"The order is the sequence and the only thing that carries
it: no numbers and no stage labels, which contract rule 6 bans."* That rail existed **because** of
rule 6. So this is a reversal, not a gap being filled, and it is recorded as one.

### Two of rule 6's bans are spent here, on instruction

- **"Step 1 / Stage 2" labels** — the 01/02/03 stations are the spine of the requested design and
  cannot be removed without removing the design.
- **Three equal cards in a row** — likewise. `LinkCards` still refuses a three-up elsewhere
  (`across = n < 4 ? (n === 3 ? 2 : n) : cols`), so this section is now the one exception on the
  site rather than a new general rule.

### Two were not, because they cost the design nothing

- **No ember glow.** Rule 6 bans neon glows and MASTER's hard-bans list names "ember glows" directly.
  The reference lights its first card with a bloom; here a firm `border-accent` over `--accent-tint`
  carries the same "you start here" with no glow. Side by side the difference is a halo, and the
  hierarchy survives without it.
- **No arrow button.** The reference puts one in the lit card's corner. These three entries are not
  links and have nowhere to go, and an arrow that goes nowhere is a promise the card cannot keep.

Also not reproduced, with reasons: the reference centres its heading, and `Section` left-aligns on
all 99 routes, so matching it here would make this one section the odd one out; and its sub-line
("A simple, clear process from start to finish") is invented filler of exactly the kind rule 6's
banned-verbs clause is aimed at, so there is no sub-line.

### `ol`, not `dl`

The numerals are the design, and an ordered list already announces "1 of 3" to a screen reader. So
every numeral on screen is `aria-hidden` decoration sitting over real semantics, rather than a
"Step 1" string typed into the page. That is also the narrowest reading of what rule 6 bans: a
typed stage label, not an ordinal on a track.

The track is drawn per column so it bridges the grid gap, dashed across the full row with the run
into the first station solid. Stations are `bg-bg` discs, which is what masks the dashes behind
them. Below lg there is no track at all: the cards stack and each carries its numeral at the top
right, same numeral, same `aria-hidden`, different place.

### A bug the screenshot caught

First build gave every icon tile `bg-accent-tint`. On the first card, which is itself
`--accent-tint`, the tile vanished: cards 2 and 3 had a plate behind the icon and card 1 had a
floating glyph. The lit card's tile now takes `bg-bg` with an ember edge, which is also closer to
the reference. Verified in the DOM: tile backgrounds are `rgb(12,12,14)` then the tint twice, and
only the first has a 1px `rgb(255,90,54)` border.

### Measured

1440 and 375: axe clean on the section (zero violations, not just zero contrast violations), three
cards equal at 244px, CLS 0, no horizontal scroll, numerals confirmed `aria-hidden`.

### Not touched

`remoteDelivery` also renders on `CityTemplates` as a three-card `dl`. That is unchanged, so the
same content now has two presentations. Deliberate: the owner asked for the about page. If the two
should match, the track is the thing to lift into a shared part.

## v4 / pictures behind the three stations (Task 31)

The owner supplied `Meetings.png`, `While_we_work.png` and `Handover.png` for the Task 30 cards.

### The set

One coherent set, and a much better fit than the service renders were: **1448x1086, ember
monochrome, subject right of centre with the left of the frame near black.** No second accent
anywhere in them, so nothing had to be parked this time. They key straight onto the content by
label, through `deliveryPhoto` in `src/content/photos.ts`.

**Resolution is finally in our favour.** The card is 352x244 at 1440, so these are *downscaled*
about 4x rather than stretched. Every other image on this site has been fighting an upscale; this
set has headroom to spare.

### The scrim, measured three times because the geometry kept moving

Type sits on these, so they need a scrim, and the number came from compositing every pixel rather
than from taste. Worst case across the three is always `Meetings`, whose ember arc is the brightest
thing in the set:

| scrim | `--on-photo` | `--muted` | `--accent` |
| --- | --- | --- | --- |
| none | 1.16 | 1.00 | 1.00 |
| 0.66 (`--photo-scrim`) | 6.63 | **3.02 fails** | 2.43 |
| **0.78 (`--card-scrim`)** | **9.88** | 4.50 | 3.63 |

`--card-scrim` at 0.78 already existed from the hub cards, so no new token: it was re-measured
against this set rather than assumed to carry over, and it does.

Two consequences, both forced by the numbers rather than chosen:

- **Nothing on these cards is `--muted`.** It lands on 4.50:1, which is the body floor exactly with
  nothing in reserve. Title and body are both `--on-photo`.
- **The first station's numeral loses its ember.** `--accent` measures 3.63:1 here and a 14px bold
  numeral needs 4.5. The ember border is what marks the first station now, which it already was.

Measured a third time against the **whole uncropped frame**, because the mobile card is 328x244 and
crops almost nothing where the desktop card crops 20px: 10.30:1 worst, slightly *better* than the
desktop crop, because that crop zooms into the brightest region. The scrim holds at every width.

### Other changes the pictures forced

The icon tiles were `bg-accent-tint`, which disappears on a lit background the same way it
disappeared on the tinted card in Task 30. All three now take `bg-bg` with a border, ember on the
first and `--line-strong` on the rest, so the tile reads whatever is behind it.

### Measured

1440 and 375: cards 352x244 and 328x244, scrim resolves to `rgba(12,12,14,0.78)`, title and body to
`rgb(241,240,238)`, alts empty (decorative: each card's heading already names the step), CLS 0, no
horizontal scroll.

## v4 / the knowledge base index becomes scannable (/guides/, Task 32)

The owner's note was that the page is "boring and not easy to read, scannable", and wanted a proper
hero, hover and motion, "like a SaaS page". Task 2 had already fixed this page's *structure*: 5,711px
of seventeen repeated sections became search plus one directory. What it never fixed was the
directory's **surface**. 54 links in one grey field, three type sizes within 4px of each other, no
boundary around a group, and one `hover:text-accent-text` as the entire answer the pointer ever got.

| Layout family | Eyebrows | Marquee | CTA intents | Client islands |
| --- | --- | --- | --- | --- |
| Lead, instrument and measure header (7/5), one grouped column-flow index of cards, closing band | 0 | 0 | BOOK, CHAT, CHECK | `Finder` only |

### 21st.dev was searched first and nothing was taken

CLAUDE.md asks for it before any new UI. The nearest hit was "Searchable Question Index", which is
an FAQ with inline collapsible answers on shadcn tokens. These 37 guides are 37 *pages*, not answers
to open in place, and the search is already built and already ranked against error strings. Nothing
in the result set was closer to this page than what the repo already has.

### The Task 2 border refusal is reversed, deliberately

Task 2's entry reads: "The groups carry no border and no surface, because three bordered boxes in a
row is three equal cards". That reading of rule 6 holds for a feature trio and does not hold here.
Seventeen boxes of one to four rows each, in a masonry flow, measure 167px to 413px tall and never
form a row of three equal anything: measured at 1440 they pack 5/6/6 into three columns with their
bottoms 152px apart. The border is doing the one job a border exists for on a directory, which is
saying where a group ends, and it is the thing whose absence made 54 links read as one field.

### Three changes, all of them about where a group starts and stops

1. **Each group is a card.** The house `rounded-[14px] border-line bg-surface shadow-card`, at `p-4`
   under `md` and `p-5` over it. The edge firms to `--line-strong` on `has-[a:hover]` and
   `has-[a:focus-visible]`, never on the box itself: a panel is not interactive, so the trigger is
   the control inside it, which is the closing band's rule and the same two properties.
2. **Each group carries its hub's mark**, `hubIcon[service.hub]`, duotone, ember, keyed to a field
   that already exists rather than picked per string. This turned out to be the largest single win
   and it was free: eleven of the seventeen services are under Fixes, and in a column-major flow in
   SITEMAP order they fill columns one and two with wrenches, leaving Security, Speed and WooCommerce
   to column three. The page groups itself by hub without a single extra heading.
3. **Every row is a row.** The left rail was `border-l` on the `<ul>`, so the smallest thing that
   could respond to a pointer was the whole group. It is now an inset 1px span per row, which lets
   one row light its own segment ember while its three siblings stay quiet, with the title going
   ember beside it and an arrow nudging in on the right.

Ember on `--surface` measures **5.93:1**, so the hover title clears body contrast and the rail and
arrow clear the 3:1 for graphics. axe does not test hover states, which is why this one is computed.

### The header gains a container and a measure

The `Finder` was a bare label over a bare input in an empty five-column well, which read as a
leftover rather than as the one instrument on the page. It sits in a `--surface` card now, and the
input moved from `bg-surface` to `bg-bg` so the field is recessed against the panel holding it
rather than the same colour as it. The no-match card moved with it, same reason.

Under both columns, /compare/'s header measure at three cells instead of two, counted from the same
files the directory renders: 37 errors written up, 17 services that fix them, 20 messages quoted
exactly. No border and no surface on a cell, because a bordered three-up *is* the shape rule 6
names; a hairline above the row with the cells divided on it says the same thing without becoming
cards. Stacked under `sm` it is label-and-number rows.

### The reveal now runs on the directory, which Task 2 refused

Task 2 left this flow out of the reveal because "a transform on a column-fragmented box is
under-specified across engines". That risk is about a box that actually fragments. Every card here
carries `break-inside-avoid` and the measurement confirms none of them splits: 17 cards, all exactly
347px wide at 1440, one `x` per column. Verified rendering at 375, 768 and 1440 before it went in.
`document.getAnimations()` sits at 21 after a full-page walk, not ~130, so the `fill: both` set the
reveal leaves behind is the 17 cards plus four headings.

**Tailwind v4, again.** The arrow uses `-translate-x-1`, and the compiled rule is
`translate: var(--tw-translate-x) var(--tw-translate-y)` on the standalone `translate` property, so
`transition-transform` would have covered nothing, exactly as `scale-105` did in Task 22. It is
`transition-[opacity,translate]` at 150ms ease-out, which is the `cta-chip` nudge the buttons already
use. `motion-reduce:transition-none` leaves the arrow appearing instantly rather than travelling.

### Measured, production build

| | Task 2 | Task 32 | Change |
| --- | --- | --- | --- |
| Document height, 1440 | 2,921px | 3,670px | +26% |
| Document height, 375 | 6,992px | 8,437px | +21% |
| Unique guide URLs in the HTML | 37 | 37 | unchanged |

The page got taller and that is the trade the owner asked for: the height is card padding and the
header measure, and it buys a boundary around every group. `p-4` under `md` rather than `p-5` was
added after the first measurement came back at 8,832px on a phone, which took 395px back.

1440 / 1024 / 768 / 375: columns 3/3/2/1, no horizontal scroll at any of them, CLS 0, LCP still the
h1 at 76ms (it carries no reveal, for the reason `rise-in`'s comment gives), axe clean on
`color-contrast`, `link-name`, `heading-order`, `region`, `listitem`, `dlitem`, `definition-list` and
`nested-interactive` at 375 and 1440, every target in the index at or over 44px. Reduced motion:
`getAnimations()` 0, nothing left at opacity below 1, `rise-in` resolves to `animation-name: none`,
the arrow's `transition-property` resolves to `none`.

## v4 / the comparison index becomes scannable (/compare/, Task 33)

Same note from the owner as Task 32, on the next index along: boring, not scannable, wanted a proper
hero, hover and motion. The structure here was already right and is untouched: a stacked split
ledger of three full-width entries, deliberately not three tiles, deliberately not
`CompareTemplate`'s verdict-cards-over-a-table family. What was wrong was that **the right-hand
column of every entry was a wall of grey**.

| Layout family | Eyebrows | Marquee | CTA intents | Client islands |
| --- | --- | --- | --- | --- |
| Lead-and-measure header (7/5), stacked split ledger, closing band | 0 | 0 | BOOK, CHAT | none |

### 21st.dev was searched first and nothing was taken

Every result was the wrong half of this page. "Comparison Table", "Spec Sheet" and "Two-Plan Diff
Pricing Comparison Table" are the *child* page's job, which `CompareTemplate` already does from real
`rows`. "Us vs Them Comparison" and "Comparison Section" are marketing panels that tick one column
and cross the other, which is a winner declared; `src/content/compares/` declines to declare one and
the h1's own lead says so. Nothing in the catalogue is an index *of* comparisons.

### The criteria stop being a paragraph

Eight to ten criterion titles per entry, 14px, `--muted`, in a two-column flow. Nine lines of the
same weight, the same colour and no edge between any of them read as a paragraph, not as a list of
topics, which is exactly backwards: these titles are the thing that tells a visitor whether this is
their question.

They are chips now, wrapped with `flex flex-wrap gap-2`. Countable at a glance, and wrapping instead
of fragmenting also drops the `break-inside-avoid` the column flow needed.

**14px, not a pill.** MASTER's shape lock names chips explicitly and bans pills, and there is no
`rounded-full` anywhere in the repo: `grep` returns nothing outside `size-*` circles. `--muted` on
`--surface-2` measures **6.78:1**, and `--text` on it (the hover state) **14.9:1**.

They are deliberately not interactive on their own. The row's stretched `::after` is still the one
tab stop and it sits over them, so a click on a chip opens the comparison that chip belongs to
rather than filtering something that does not exist.

### The seam is what lights

The entry already had the hub rows' ember rule sweeping under it on hover. Two more responses join
it, so the hover reads as the whole pairing waking rather than one underline moving:

- **The hairline between the two names goes ember.** That seam *is* the comparison, which the
  Task-era docstring says in as many words, so it is the right thing to light.
- **The chips go from `--muted` to `--text`.**

Both `[@media(hover:hover)]`-gated and `motion-reduce:transition-none`, matching the rule that was
already there. Measured while hovered: seam `rgb(255,90,54)`, rule `rgb(255,90,54)`, chips
`rgb(241,240,238)`, heading `rgb(255,90,54)`, which is ember on `--bg` at the token comment's 6.30:1.

The scenario count also stopped being grey: the numeral is `--text` and `tabular-nums` inside the
otherwise `--muted` sentence, so it is findable without reading the line.

### The header measure moves into a card and gains a third cell

Same move as /guides/ in Task 32 and for the same reason: the five-column well is the only thing
beside the headline, the page has no photograph (the catalogue has no honest frame for a decision
taken before any work exists), and a bare pair of rows between two hairlines reads as a leftover.
It is the house card now, and the first thing it answers is how many pairings exist: **3** pairings,
**27** criteria compared, **14** scenarios answered, all three reduced from the same files the
ledger below renders.

### Measured, production build

Document height at 1440 goes 2,417px to 2,492px, +3%: the chips are denser than the column flow they
replaced and very nearly pay for the taller header on their own. 375 / 768 / 1024 / 1440: 4,944 /
3,454 / (1009 scrollWidth) / 2,492px, no horizontal scroll at any of them, CLS 0, axe clean on
`color-contrast`, `link-name`, `heading-order`, `region`, `listitem`, `dlitem`, `definition-list`,
`nested-interactive` and `label-content-name-mismatch` at 375 and 1440. That last rule is not
optional here: the comment on the row records that naming the anchor off the heading broke WCAG
2.5.3 once already, and the chips moving inside the row's hit area is exactly the kind of change
that could do it again. It does not: the anchor's content is still its visible label.

Reduced motion: `getAnimations()` 0, nothing left under opacity 1, `rise-in` resolves to
`animation-name: none`, and all three hover transitions resolve to `transition-property: none`.

## v4 / the comparison page becomes readable (/compare/[slug]/, Task 34)

Third in the owner's run of index-and-detail passes, on the page the /compare/ index opens.
`CompareTemplate` renders all three. Its family is unchanged: masthead, verdict-by-scenario cards,
a real comparison table, closing band.

| Layout family | Eyebrows | Marquee | CTA intents | Client islands |
| --- | --- | --- | --- | --- |
| Photo masthead, verdict cards, side-by-side table, closing band | 0 | 0 | BOOK/PLANS/QUOTE by node intent, CHAT | none |

### 21st.dev was searched first and nothing was taken

Two searches. The comparison-table results ("Comparison Table", "Spec Sheet", "Two-Plan Diff
Pricing Comparison Table") are this page's component, but all three are shadcn-token builds that
would arrive without the two accessibility fixes this table already carries and has logged: the
focusable scroll region and the `scope`/`caption` structure. "Spec Sheet" also leads on a
show-only-differing-rows toggle, which is meaningless where every row differs by construction.
"Us vs Them Comparison" ticks one column and crosses the other, which is a winner declared, and
these files decline to declare one. A search for a stacking responsive table returned five
card-stack carousels, none of them a table.

### The three equal cards in a row were real, and they were ours

`Which one fits` ran `md:grid-cols-3` over four or five scenarios. On two of the three pages the
first row was **literally the three equal cards in a row that contract rule 6 bans**, with the
remaining one or two orphaned beside a hole. Two up now: `md:grid-cols-2` gives 2+2 on the care
plan page and 2+2+1 on the other two, and buys each scenario about 90px more line, which is what
stopped the headings breaking over three lines.

No hover on these cards. They are panels, not links, and Hover Earns It holds. What they gained is
a start edge: the closing band's short ember rule above each scenario, so five near-identical blocks
of bold-line-over-grey-paragraph have something for the eye to count.

### The table was the actual problem

Nine rows, three columns, and two of the columns were the same 14px grey with nothing between them.
Four changes, none of them decoration:

1. **Fixed column proportions.** A `<colgroup>` at 21% for the criterion. Left to content the
   criterion column collapsed to about 110px and broke every title over two or three lines while
   the two value columns, holding five times the text, took the rest.
2. **Three delimited columns.** A hairline closes the criterion column and another opens the second
   side, so an eye crossing a 1104px row always knows which of the two it is reading.
3. **A row tint on hover.** This is a reading aid, not an affordance: nine rows a thousand pixels
   wide are read *across*, and marking which one the eye is on is the only thing a pointer can
   usefully do for that. It answers rule 10's one-sentence test with "which row you are on". Set on
   the cells rather than the row, via `hover:[&>*]:bg-surface-2`, so the criterion cell tints with
   the rest of them rather than staying behind its own opaque background. `--muted` on `--surface-2`
   is 6.78:1.
4. **`py-3` to `py-4`**, because the rows were tighter than any other list on the site.

### Two bugs found while verifying, both pre-existing

**Every row header was centred.** `td` set no alignment and a `<th>` defaults to `text-align:
center`, so nine row headers per page have been centred in their column since the template was
written. Invisible at 1440 where most titles fit one line; obvious at 375, where the column is
narrowest, every title wraps, and the second line lands somewhere the eye is not waiting for it.
`text-left` on the criterion cell.

**`scrollable-region-focusable` is still clean**, which is the fix the existing comment records.

### The sticky column, and the coverage it cost before it was scoped

Under 768 the table scrolls sideways, and the column it scrolls away from is the only one that says
what the row is about. The criterion cell is `sticky left-0` with its own opaque `--surface`;
measured at 375 it holds at 1px from the region's left edge after a 299px horizontal scroll.

Shipped unscoped first, and axe caught the cost: `position: sticky` makes the cell a positioned
element, and axe then reports **every cell in the next column** as "partially obscured" and returns
`incomplete` instead of a contrast ratio. Ten nodes per page, at 1440, where the check is usually
run and where nothing was scrolling in the first place. `min-w-[40rem]` fits from about 690px up,
so the sticky is now `max-md:` only: 1440 measures clean again, and the phone, where the cell
actually does its job, is measured by compositing instead. Between about 690 and 767 it is on and
inactive, which is harmless and is the price of using a breakpoint rather than a container query.

### The masthead carries the pairing, and it was measured

The h1 was the flat string `A vs B`. It is now the two names at full weight with the word between
them smaller and lighter, which is the shape the index gives every pairing. `vs` is real text inside
the h1, so the accessible name is unchanged.

It stays on `--text` rather than dropping to `--muted`, because this heading composites against a
photograph under `--photo-scrim` and muted type over a picture is the measurement that has caught
this site out before. axe cannot resolve it (three `incomplete` nodes: the h1, the new span and the
lead, all "contains an image node"), so it was composited from the rendered pixels at 375 with the
text layers hidden:

| | worst background pixel | ratio to `--text` | needs |
| --- | --- | --- | --- |
| the `vs` glyph box | `rgb(80,80,81)` | **7.07:1** | 4.5 (14.96px regular at 375) |
| the whole h1 line | `rgb(95,95,96)` | **5.60:1** | 3.0 (large text) |

The `vs` needing the *higher* bar is the point of measuring it: at 1440 it renders 24.6px and counts
as large text, at 375 it renders 14.96px and does not.

### Measured, production build

`/compare/wordpress-vs-wix/` at 1440: 3,114px to 3,430px, +10%, which is the row padding and the
five verdict cards now stacking three rows deep instead of two. At 375 it measures 5,842px.

All three slugs checked at 375 / 768 / 1024 / 1440: no horizontal page scroll, CLS 0, the table
overflowing only below about 690px, verdict grids resolving 2-up, row headers left and static above
`md`. axe clean on `color-contrast`, `link-name`, `heading-order`, `region`, `listitem`,
`scrollable-region-focusable`, `th-has-data-cells`, `empty-table-header` and `table-duplicate-name`,
with the only `incomplete` the three masthead-over-photograph nodes measured above. Reduced motion:
`getAnimations()` 0, nothing under opacity 1, `rise-in` resolves to `animation-name: none`, the row
tint's `transition-property` resolves to `none`.

## v4 / a mark per criterion in the side-by-side table (Task 35)

The owner asked for icons on `Side by side` that "visually relate and relevant meaning". The table
had none: the criterion column was nine or ten bold strings with nothing to tell them apart but the
words themselves, which is exactly the scan the icon is for.

### Keyed to the criterion, never picked at the call site

`src/content/icons.ts` opens with the rule this had to satisfy: *an icon is keyed to a field that
already exists*. `criterionIcon` is a new map in that file, keyed by the `rows[].criterion` string,
21 entries covering all 27 rows across the three comparisons. It earns the map rather than a call
site: **six of the 21 criteria appear in two comparisons each**, so "Cost structure" is guaranteed
the same mark on /compare/wordpress-vs-wix/ and /compare/woocommerce-vs-shopify/, which a choice
made in `CompareTemplate` would have lost the first time either page was touched.

Two build-time guards, following the file's existing pattern:

1. Every criterion has a mark, or the build fails.
2. **No two rows of one comparison share a mark.** This is the `verbIcon` rule and it bites harder
   here: these sit in one column of one table, so a duplicate would silently claim two rows were
   about the same thing. Verified not a no-op by feeding it a known collision, which it caught.

Near misses are split deliberately, and all three pairs share a table: `Cost structure` the receipt
against `Transaction fees` the percent, `How you pay` the card against `Commitment` the calendar,
`Indian payment gateways` the bank against `GST invoicing` the rupee.

Nothing here characterises either side. A criterion is a question both columns answer, so the mark
belongs to the question and is identical across both halves of the row.

### Identity is not the test, legibility at 16px is

The guard can only see identity, and the first render showed that is not enough. Three marks were
changed after looking at the rendered column:

| Criterion | Was | Now | Why |
| --- | --- | --- | --- |
| Ownership and hosting | hard drives | key | Sat directly above `Cost structure`'s receipt; at 16px both are a small ruled rectangle |
| Backups and monitoring | counter-clockwise clock | hard drives | Sat directly under `Routine updates`' clockwise arrows: two circular arrows in adjacent rows. Hard drives is also the mark `verbIcon` already gives "Back up" |
| GST invoicing | document | rupee | Shared a table with the receipt, and the rupee says what the criterion is actually about |

### Muted at rest, ember with the row

A column of ten ember marks is the one accent shouting, and this page already carries ember on the
verdict cards above. The marks are `--muted` at rest, where they work as shapes, and take the accent
on the row the pointer is on, which folds them into the row tint Task 34 added rather than adding a
second thing that moves. `--muted` on `--surface` is 7.35:1 and ember on `--surface-2` is 5.47:1,
both over the 3:1 a graphic needs; measured live while hovered, the mark reads `rgb(255,90,54)` and
its siblings stay `rgb(163,163,173)`.

`aria-hidden` throughout: the criterion text beside each one already names it, so the row header's
accessible name is unchanged.

The criterion column went from 21% to 24% to pay for the mark and the gap. At 1440 it measures
264px and every title still sits on one line; at 375 it is 154px inside the sticky column, which
holds at 1px from the region edge after a 280px horizontal scroll with the mark and a two-line
title both legible.

### Measured, production build

`/compare/wordpress-vs-wix/` at 1440: 3,430px to 3,450px, +20px, which is the wider criterion
column changing one row's wrap. At 375, 5,842px to 5,862px. CLS 0, no horizontal page scroll, axe
clean on `color-contrast`, `link-name`, `heading-order`, `region`, `listitem`,
`scrollable-region-focusable`, `th-has-data-cells`, `empty-table-header`, `image-alt`,
`svg-img-alt` and `aria-hidden-focus`, with the only `incomplete` still the three
masthead-over-photograph nodes measured in Task 34. Reduced motion: `getAnimations()` 0, the mark's
`transition-property` resolves to `none`, so it switches colour without travelling.

## v4 / the free site check stops being four identical ticks (/free-site-check/, Task 36)

Same note from the owner, on the lead-magnet page. The structure was already the right one and is
unchanged: benefit headline and a preview of the magnet on the left six columns, the smallest form
that can deliver it on the right six, `BookingFlow` in `check` mode.

| Layout family | Eyebrows | Marquee | CTA intents | Client islands |
| --- | --- | --- | --- | --- |
| Lead-magnet split: benefit and magnet preview beside the form | 0 | 0 | CHAT, plus the form itself | `BookingFlow` only |

### 21st.dev was searched first and nothing was taken

Six lead-magnet and signup-hero results, all of them a single email field under a headline:
"Coming Soon Hero Block", "CTA Email Subscribe Section", "Email Signup Form". This page's form is
a three-step `BookingFlow` shared with /contact/, which already holds the site's validation, its
live region and its handover. Two of the results lead on a social-proof avatar row, which on a
launch with no customers is the invented testimonial CLAUDE.md forbids.

### A real bug: the chat line was rendering as a 48px button mid-sentence

`<ChatButton location="free-site-check" />` was called with **no `className` and no `icon` prop**,
so it rendered a bare `<button>` carrying the CHAT chip: `cta-chip` is `display: grid` at 1.75rem,
which forced the button to 48px inside a 14px sentence and pushed "Chat with an engineer" onto its
own line above "Questions first?", overlapping it. Measured before the fix: paragraph 48px,
button 48px, chip present.

Fixed with the shape `FinalCta` already uses for exactly this: `icon={null}` to drop the chip, plus
the underline treatment, because a bare `<button>` under Tailwind's preflight inherits the sentence
completely and leaves nothing on screen to say it can be pressed. Measured after: one line, no
chip, `text-decoration: underline`, `rgb(241,240,238)`.

`py-3` then buys the 44px target contract rule 5 asks for. `ChatButton` renders `inline-block`, so
this padding **does** grow the line box: the paragraph measures 44px, not 20px. That is 24px of
leading traded for a hit area a thumb can find, and it is a trade rather than a free win. WCAG
2.5.8 would have exempted it as a target inline in a sentence, which is the exemption the three
sibling `CheckLink`s on /guides/, /pricing/ and `GuideTemplate` rely on with no hit area at all.
**Those three are still invisible inline links**, logged here rather than changed unasked.

### Four identical ticks said nothing

`COVERED` was four strings, each with the same ember `CheckIcon`. A tick says "this is a list",
which the bullet already said; it cannot say which of the four lines you are looking at, and these
are four different subjects. Each line carries its own mark now, all four from the site's existing
vocabulary where `verbIcon` already fixes the meaning: Update is the up-arrow, Back up the hard
drives, Harden the shield, Measure the gauge.

Declared in the page beside the strings rather than in `src/content/icons.ts`, because this copy is
page-local and has no content-layer field to key off. The rule that file states is that a mark is
never chosen per string at the *render* site; one declaration next to the content satisfies it, and
there is nothing for a build check to iterate over.

The marks sit in `bg-bg` tiles with a `--line` border. Not `accent-tint`: that tile vanished
against a lit panel twice already, in Tasks 30 and 31. Ember on `--bg` is 6.30:1.

### Title and detail, not four sentences

The four lines were 6, 8, 10 and 6 words at one weight and one colour, so the only way to find the
one you cared about was to read all four. They are a title over a detail now, same words:
Versions / Backups / Security basics / Speed, with the sentence under each. Hairline between rows.

The card itself became the house card. It was a bare `--surface-2` box sitting beside the form's
bordered, lifted `--surface` card, and two panels doing the same job in one row reading as
different materials made the left one look like a note someone had left on the page.

The deliverable line gets a mark of its own, since it is what the page is asking for an address in
exchange for, and `checkTurnaround` is now **gated** the way /pricing/ gates it: contract rule 8
says a null value renders nothing, and ungated this sentence would read "within . No call needed."

### Motion, where there was none

This page carried no `rise-in` at all, on either column. Four now: lead 70ms, covers card 140ms,
chat line 210ms, and the form column at 140ms so the two columns arrive together rather than one
chasing the other across the page. The h1 stays unanimated for the reason `rise-in`'s own comment
gives, since it is this route's LCP element.

**No hover was added to the covers list and that is deliberate.** It is a panel, not a link, and
Hover Earns It holds. The only interactive things on this page are the form and the chat link, and
both answer already.

### Measured, production build

1440: document 1,928px, CLS 0, no horizontal scroll. 375: 4,106px, no horizontal scroll, the chat
target 44px. axe clean on `color-contrast`, `link-name`, `button-name`, `heading-order`, `region`,
`listitem`, `label`, `aria-hidden-focus` and `svg-img-alt` at both widths; the single `incomplete`
at 375 is the site-wide wordmark in the fixed header, obscured by `nav-blur`, which is unrelated to
this page. Reduced motion: `getAnimations()` 0, `rise-in` resolves to `animation-name: none`, the
chat link's `transition-property` resolves to `none`.

## v4 / the cities index puts the city first (/wordpress-development/cities/, Task 37)

Next index in the owner's run. The masthead, the closing band and the `max-w-4xl` cap are unchanged;
the directory under them is rebuilt.

| Layout family | Eyebrows | Marquee | CTA intents | Client islands |
| --- | --- | --- | --- | --- |
| Photo masthead, header measure, 2-up city card grid, closing band | 0 | 0 | QUOTE, CHAT | none |

### The one word anyone scans for arrived last

Eight `LinkCards`, every title `WordPress development in <City>`. Four identical words open every
card and the city, the only thing that differs and the only thing this page is read for, lands at
the end of a line. The city is the heading now at 24px display, and the repeated phrase is the 14px
kicker above it.

**The anchor text is unchanged.** Kicker then city in DOM order, both inside the one `<a>`, so the
accessible name is still "WordPress development in Bengaluru …" as the snapshot confirms, and the
internal anchor text search engines read is the same string it was.

Its own card rather than `LinkCards`, because this content is city-shaped and the generic component
could only render it as a repeated sentence. Everything else is the house `cardLink`: border firms
to `--line-strong`, `--shadow-lift`, and the caret nudges 2px on the 150ms ease-out the buttons use.
Measured hovered: city `rgb(255,90,54)`, siblings `rgb(241,240,238)`, border 0.36 against 0.08,
caret `translate: 2px`.

### Chips were tried here and taken out again

`servicesHighlighted` is three or four service ids per city and they genuinely differ, so a chip row
looked like the obvious way to separate Ahmedabad from Kolkata. Built, rendered, and wrong: those
titles run 20 to 35 characters ("Custom WordPress plugin development"), so in a 420px card they
stacked **one per line**. Four near-full-width pills under every summary, the page from 2,605px to
3,472px, and "WordPress website design" repeated on most cards.

The summary already separates these cities, and in the words that actually matter: Tamil and English
pages, Gujarati pages, Bengali, Marathi. The services are one click away on the page the card opens.
Reverted to a caret. Recorded because the reasoning is not obvious from the diff, and the same idea
will look just as attractive next time.

### The header measure, where it can be measured

/guides/ and /compare/ carry it in the header grid. This page's header is `PageMasthead`, which
composites type over a photograph under `--photo-scrim`, so the measure sits on the page below the
band instead: a 28px numeral is the last thing that should be read against a picture when it can sit
on `--bg`. Two cells, both reduced from `src/content`: **8** cities, **10** services these cities ask
for. The stale "fourteen cities" in the template's own comment is corrected to a form that cannot go
stale again.

### Measured, production build

1440: 2,605px to 2,862px, +257px, which is the measure strip and the 24px city headings. 375:
5,663px, cards 343px wide, one per row. No horizontal scroll at either. CLS 0 on a clean load, with
a `PerformanceObserver` installed before navigation reporting no entries at all; the 0.007 seen in
an earlier run was the chat widget mounting during the scroll walk, not the grid. axe clean on
`color-contrast`, `link-name`, `heading-order`, `region`, `listitem`, `dlitem`, `definition-list`,
`aria-hidden-focus`, `svg-img-alt` and `nested-interactive` at 375 and 1440; the two `incomplete`
nodes are the masthead h1 and lead over the `racks` photograph, which every `PageMasthead` route
reports. Reduced motion: `getAnimations()` 0, nothing under opacity 1, `rise-in` resolves to
`animation-name: none`, and both the city colour and the caret nudge resolve to
`transition-property: none`.

### Not done, and worth a pass of its own

`CityTemplate`, the per-city page in the same file, has two problems this task did not touch:

1. **`remoteDelivery` renders `sm:grid-cols-3` over exactly three entries**, which is contract rule
   6's three equal cards in a row, the same violation found in `CompareTemplate` in Task 34. /about/
   already rebuilt these same three entries as a numbered track in Tasks 30 and 31, so there is a
   shape to borrow rather than invent.
2. **`localContext` is four paragraphs of 400 to 600 characters** set as plain `--muted` body with
   nothing between them. It is the bulk of the page and it is the least scannable thing on it.

### 21st.dev was searched first and nothing was taken

Five location-card results, all of them travel-destination cards built around a photograph:
"Location Card", "3D Card", "Expanded Map", a tilt-and-expand card with real map tiles. This page
deliberately has no photograph per city and no map, for the reason the masthead comment already
gives: the work is remote, there is no office in any of these cities, and a picture of a skyline
would imply one.

## Task 38 / city detail page (/wordpress-development/cities/<city>/, 8 routes)

Layout family: **masthead over a card grid of doors, then ruled local-context rows and the shared
delivery track.** Eyebrows on the page: 0. Marquees: 0. CTA intents: QUOTE and CHAT, in the header
and on the closing band. Image-todo: nothing added; every picture here already existed.

The page the owner called "boring and not scannable", written out as four problems:

| Section | What was wrong |
| --- | --- |
| Header | `PageMasthead` with no `lead`. A bare h1 and two buttons over a photograph. |
| `localContext` | Four paragraphs, 156 to 589 characters, flat `--muted`, no heading, no section, no entry edges. About 1,800 characters as one block. |
| `#services` | Correct already, but third on the page, behind the wall. |
| `#remote` | `sm:grid-cols-3` over exactly three entries: rule 6's three equal cards in a row, the same violation Task 34 found in `CompareTemplate`. |

### The header now says what the page is

`lead={c.seo.description}`. Not a new sentence: it is the one already written for this route and the
one the visitor read in the result they clicked, so the band repeats the promise rather than
inventing a second one. Rule 4 caps hero subtext at 20 words and two of the eight ran 21, so
`delhi-ncr` lost "sites" and `mumbai` lost "businesses". Both still carry every term they were
written around; checked at 20 words each. The header is three text elements against the cap of four,
and `PageMasthead` counts its own beats, so the lead lands at 70ms and the buttons at 140.

### Doors before prose

Reordered to header, services, local context, delivery, FAQs, closing band. A reader who arrived on
"WooCommerce developer in Kolkata" now reaches the WooCommerce page without reading 1,800 characters
about the Hooghly first, and a reader who wants the context still has all of it, one section down.

### The wall, folded into two columns

Same four paragraphs, not one character edited, inside a real `Section` with a heading
(`What <city> websites are built to do`, which is the phrasing `citiesLead` already uses for this
content). Two columns at `lg`, one below it, each paragraph opening on the ember tick the compare
page's scenario cards use: four entry edges where there were none, and the 1440 height drops from
roughly 4,900px to 4,001px.

`gap-x-10` against `gap-y-7` on purpose. The vertical gap is the one that reads as "new block" and
the tick is already saying it, so the horizontal gap is the larger of the two; equal gaps made the
2x2 read as a four-cell grid rather than as two columns of prose.

**No heading per paragraph, and that is the point.** These are four topical blocks per city, and any
label set over them would be a sentence this site invented about a place it has no office in. The
blocks are given edges, not names.

**No hover on them either.** Every card on this page that lifts is a link. A panel that answers the
pointer and then goes nowhere is the affordance this system does not hand out, and the request for
"proper hover effects" is met where hover is honest: the service cards (border to `--line-strong`,
`--shadow-lift`, caret 2px, title to ember), the FAQ rows (caret 180, ember), and the closing band
(`:has()` on the buttons, ember tick scaling out).

### `RemoteTrack`, extracted rather than rebuilt

/about/ had already rebuilt these same three `remoteDelivery` entries as a numbered photo track in
Tasks 30 and 31. The city page was rendering them as the banned 3-up. Rather than design a third
shape, the track moved into `parts.tsx` and both pages call it. One component, two call sites, so
rule 6's numeral exception is spent once rather than per template and the two cannot drift.

`sizes` is the only prop, because the two pages are not the same width: /about/ runs the 1104px
spine and a station is 368px there; this page is capped at `max-w-4xl`, so from 1024 up the content
is a constant 848px and a station is (848 - 48) / 3 = **267px**, measured at 1440. The hint was first
written 288 by guess and corrected to 272, the next round number above the real slot. Every contrast
figure the track carries was measured for /about/ and is recorded on the component itself.

### 21st.dev was searched first and nothing was taken

Eight results for editorial / long-form content layouts. The closest was **Editorial service list**
(#37530: numbered rows, hover offset, expandable descriptions). Not taken for two reasons: the
disclosure family is already spent on this page by `Faqs`, which rule 3 forbids repeating within a
page, and an accordion needs a summary label per row that this content does not have and that this
site may not invent. The rest were hero and split-content blocks built around a photograph, which
this page deliberately does not have per city.

### Measured, production build

1440: 4,001px, container 896px, local columns 404px each, track stations 267px, no horizontal
scroll. 375: 7,240px, every grid at one column, the track's `lg` numeral at `display: none` and the
stacked numeral showing in its place, no horizontal scroll. `max-w-[68ch]` resolves to 766px and
binds in exactly one band, 768 to 1023, where the single column is otherwise the full 848px; in the
2-up grid and at 375 the column is narrower than the cap, so it is inert there. (`ch` in Geist at
17px is 11.27px, so the cap is a container width, not a character count. The `52ch` first written
here resolved to 586px, wider than any column it sat in, and did nothing at all.)

axe at 1440 and at 375: **zero violations**, 26 rule groups passing. The two `incomplete` nodes are
the masthead h1 and lead over the photograph, which every `PageMasthead` route reports and which the
`--photo-scrim` entry already accounts for. Reduced motion at 375: `getAnimations()` running 0,
zero elements under opacity 1, zero still transformed, `rise-in` resolving to `animation-name: none`.
Reveal coverage on a clean load with a paced scroll: 21 of 21 targets animated, none left hidden.

### A note for whoever measures this next

Two runs of the reveal check reported elements stranded at opacity 0 (once the whole local section,
once two FAQ rows and both closing-band columns). Both were the measuring script, not the page: a
scroll walk that steps faster than the IntersectionObserver delivers leaves whatever it skipped
unobserved, and `io.unobserve` runs before `animate()`, so a missed crossing is missed for good
*within that run*. A walk stepping 50 to 60% of the viewport height with ~260ms between steps reports
21 of 21 every time. Check the walk before filing a bug against `revealScript`.

### Not done, and deliberately left

Every city's fourth `localContext` paragraph is partly about remote working or language, and on
Chennai and Bengaluru it restates what "How working with us runs" says two sections below. That is a
content overlap, not a layout one, and editing eight city files to remove it is the owner's call.

## Task 39 / the site container, 1152px to 1200px

The spine is **1200px** now (`75rem`), so the desktop content width is **1152px** after the
`px-4 md:px-6` gutters. It was `max-w-6xl` (72rem / 1152px) over a 1104px content width.

### It is one token now, and that is most of the task

`max-w-6xl` was typed out **seventeen times**: the `page` constant in `parts.tsx` and sixteen
hardcoded copies in `NavBar`, `SiteFooter`, `Hero`, `FinalCta`, `FixPan`, `Faq`, `Plans`, `Proof`,
`Practices`, `Restored`, `Guarantee`, `ErrorStack` and `ProblemTiles`. Seventeen literals is
seventeen chances for the next change to this number to leave one section's left edge out of line,
which is exactly the bug this file records twice under "Container widths: three, on purpose".

`--container-page: 75rem` lives in the `@theme` block in globals.css and Tailwind v4 generates
`max-w-page` from it. All seventeen call sites use it. The next change to the site width is a
one-line diff.

### The one that nearly shipped: `cn` did not know the new class

`cn` is `clsx` into `twMerge`, and **tailwind-merge only knows the widths Tailwind ships**. To it
`max-w-page` is an unrelated class, not a member of the `max-w` group, so `cn(page, pageY,
"max-w-4xl")` returned **both** classes. Two `max-width` declarations of equal specificity, and the
generated stylesheet's own order then picked the winner: `max-w-page`.

Measured on the production build the moment the token landed: `/wordpress-development/cities/<city>/`
reported `containerW: 1200` with `max-w-4xl` sitting right there in its class list, and its h1 on
the spine's left edge instead of its own. Every narrowed route was silently on the spine.

**Nothing in the toolchain can see this.** `tsc`, `eslint`, `scripts/check-content.ts` and
`next build` all passed clean on the broken build, because every class string in it is valid. It is
visible only by measuring a rendered page, which is why the container sweep below is not optional.

The fix is in `src/lib/utils.ts`: `extendTailwindMerge({ extend: { classGroups: { "max-w":
["max-w-page"] } } })`. Verified against tailwind-merge 3.7 before shipping it, in both directions:
without the extension `twMerge("max-w-page max-w-4xl")` returns both classes; with it, `max-w-4xl`,
and `"max-w-4xl max-w-page"` returns `max-w-page`. **Any future `--container-*` token has to be
added to that list**, or it reintroduces this exact failure.

### Container sweep, measured at 1500 on the production build

| Route | Class on the container | Rendered | h1 left |
| --- | --- | --- | --- |
| `/` | `max-w-page` | 1200 | 167 (at 1440) |
| `/wordpress-fix/` (hub) | `max-w-page` | 1200 | 231 |
| `/wordpress-fix/critical-error/` (service) | `max-w-page` | 1200 | 231 |
| `/guides/<slug>/` | `max-w-page` | 1200 | 231 |
| `/compare/<slug>/` | `max-w-page` | 1200 | 231 |
| `/pricing/` | `max-w-page` | 1200 | 231 |
| `/about/` | `max-w-page` | 1200 | 201 (masthead padding) |
| `/contact/` | `max-w-5xl` | **1024** | 255 |
| `/wordpress-development/cities/<city>/` | `max-w-4xl` | **896** | 383 |
| `/case-studies/` | `max-w-3xl` | **768** | 383 |

The three narrower widths are **unchanged and deliberate**. They are reading-measure caps, not
container-derived: widening them pushes body copy past a readable line, which is the opposite of
what Task 38 just did to the city page. (This also corrects a stale line in the container table
above: `/pricing/` left the 4xl row at some point and is on the spine.)

On the home page, 13 spine-aligned boxes, nav and footer among them, all report left 113 and width
1200 at 1440. One left edge, which is the intra-page rule this file has caught two bugs with.

### Every `sizes` hint that keys off the container

Content width went 1104 to 1152, so anything derived from it moved. All measured in the browser
rather than computed and hoped for:

| Hint | Was | Now | Real slot |
| --- | --- | --- | --- |
| `bannerSizes` (masthead, the LCP on ~95 routes) | `(min-width: 1152px) 1104px` | `(min-width: 1200px) 1152px` | 1152, picks the 1200 candidate, **1.04x** |
| `LinkCards` 4-up banner | 264px | **276px** | `(1152 - 48) / 4` = 276, measured 276 on `/wordpress-fix/` |
| `RemoteTrack` on `/about/` | 368px | 368px, **unchanged** | measured 368. `(1152 - 48) / 3`. It was 16px over on the old spine and the new container made it exactly right. |
| `RemoteTrack` on the city page | 272px | 272px, unchanged | that page is `max-w-4xl` and did not move |

Checked and deliberately left alone: `ErrorStack` (`48rem`), `Restored` (`72rem`), `ProblemTiles`
and `Plans` (`vw`-based), and `RealScreen` in the guide. The guide box is capped at **68ch, not by
the container**, so it did not move; its `680px` hint against a real 736px box is a pre-existing
under-request that resolves to the 750 candidate at 1.02x, and the stale "720px (max-w-3xl less
px-6)" in that component's comment is corrected to say what actually caps it.

### Things that scaled themselves

`ErrorPanels` is a `7fr / 1fr / 1fr / 1fr` track, so the closed slivers went 107px to about 115px
with no edit. The logo marquee is percentage-based: three copies of 768px still cover a 1152px
window after the `-33.3333%` shift, with room over. Both carried the old number in a comment and
both comments are corrected.

### Gates

`tsc` 0, `eslint` 0, content check 52 matches over 186 files, build 99 routes. axe at **1440 on the
home page: zero violations** across 12 sections; at **375 on the service and city pages: zero
violations**. No horizontal scroll at 375, 1440 or 1500 on any route sampled. The `incomplete`
nodes are `color-contrast` over photographs, which is what every `PageMasthead` route and the home
page's composited sections already reported; a container width cannot move a contrast ratio, since
the scrim is a flat token over the whole band, and these were not re-diffed against the old build.

## Task 40 / one width, every route

**The container table above is now a single row.** Every page on the site runs the 1200px spine.
The owner asked for it directly, twice: Task 39 left three narrower widths in place and explained
why, and the answer was "i want all pages should be 1200px". That is the decision; this entry
records what it cost and what held.

### What was narrowed, and is not any more

| Route | Was | Now |
| --- | --- | --- |
| `/wordpress-development/cities/` and `/<city>/` | `max-w-4xl` (896) | spine, **1200** |
| `/contact/` | `max-w-5xl` (1024) | spine, **1200** |
| `/free-site-check/` | `max-w-5xl` (1024) | spine, **1200** |
| `/case-studies/` | `max-w-3xl` (768) | spine, **1200** |

Five call sites, all of the form `cn(page, pageY, "max-w-Nxl")`, now just `cn(page, pageY)`. The
`max-w-5xl` left in `MegaMenu` is untouched: it is a menu overlay, not a page container.

### Nothing needed a new measure cap, and that is the whole reason this was cheap

The argument for the three narrow widths was that they protected reading measure. It turns out the
protection was already one level down, in `ch`, on the elements that actually hold prose:

- the city page's context paragraphs are `max-w-[68ch]`
- `/contact/`'s lead is `max-w-[46ch]`, `/free-site-check/`'s is `max-w-[60ch]`
- `/case-studies/`'s empty-state copy is `max-w-[48ch]`
- `/contact/` and `/free-site-check/` are 12-column grids, so their columns are proportions and
  simply got wider in proportion

**A cap written in `ch` is a measure and does not care how wide the page under it is.** A cap
written as a container width is a measure pretending to be a layout, and that is the one that had
to be argued about. Nothing was added in this task; the `ch` caps absorbed the change on their own.

Measured on the spine: city context columns **556px** (404 before), city cards **568px** 2-up,
`/contact/`'s form card **649px** on its 7 of 12 tracks.

### `RemoteTrack` lost its only prop

`sizes` existed because the city page was `max-w-4xl` and its station was 272px against 368 on
/about/. Both pages are the same width now, so both stations are a constant (1152 - 48) / 3 =
**368px** from `lg` up and the prop had nothing left to vary. One hint, written once inside the
component, measured at 368 on both pages with the image slot at 366 picking the 384 candidate,
**1.05x**.

### Gates

`tsc` 0, `eslint` 0, content check 52 matches over 186 files, build 99 routes. axe: **zero
violations** on `/wordpress-development/cities/`, `/wordpress-development/cities/chennai/`,
`/contact/` and `/case-studies/` at 1500, and on `/contact/` at 375. No horizontal scroll at 375 or
1500 anywhere. The city detail page got **shorter**, 4,001px to 3,802px, because the wider columns
take fewer lines.

Nothing changed below `lg`: every cap removed here was above 375, so the phone layout is the one
Task 38 and Task 39 already measured.

### The reveal-walk artifact, again, and how to tell it apart from a bug

Three elements on the city page and two on the city hub reported `opacity: 0` with
`getAnimations().length === 0` after a scroll walk, and the hub's closing band photographed as an
empty panel. Both were the measuring script, as in Task 38. The proof is one line and worth reusing:
call `scrollIntoView({ block: "center" })` on each stuck element with ~700ms between them, then
re-read. All five went to opacity 1 with one animation each. A fast programmatic walk can move past
an element between two of the observer's intersection computations, in which case **no entry is
generated at all**, the element stays observed, and the next real crossing fires it. A human
scrolling never hits this. Before filing a bug against `revealScript`, run that check.

## Task 41 / the site-wide scroll animation system

Eight primitives in `src/components/motion/`, one token table, and nothing outside that folder
imports Motion any more. Built to the owner's brief; the four decisions that shaped it were put to
the owner before any code was written, and the answers are recorded in each section below.

### The decision that set the architecture

Motion's `whileInView` writes `opacity: 0` into the server HTML and waits for hydration. The
brief's own rule 9 asks for content readable with JS disabled, and rule 7 forbids patching a flash
with a mounted-state boolean. **Those cannot both hold with `whileInView`**, and this file already
recorded the consequence once: `MaskRise` and `CtaReveal` shipped hidden body copy, which is "the
one thing a page of body copy must not do".

So `Reveal` and `Stagger`, the two primitives that wrap body copy on all 99 routes, keep the
inline-script engine and are **Server Components with no Motion in them at all**. Everything else is
Motion inside `LazyMotion` + `domAnimation` with `m` components. The owner chose this split over
"all eight on Motion".

### The token table moved, and MASTER.md moved with it

The owner chose the brief's values over the ones this variation ran: easing
`cubic-bezier(0.22, 1, 0.36, 1)` over the sampled spring, 24px/14px travel over a flat 14, 0.07s
stagger capped at 6 over the 70ms uncapped ladder, 0.5 / 0.35 / 1.2s durations.

`src/components/motion/tokens.ts` is the source. `globals.css` mirrors the subset CSS needs, because
`Reveal` and `Stagger` animate through the stylesheet. **`npm run check:motion` fails the build if
the two drift**, and it also greps for Motion imports outside the folder, which is the brief's own
acceptance check made executable. MASTER.md's Motion section now documents this table rather than a
second one.

`--ease-spring` survives for the three things that animate a real spring rather than an entrance:
the FAQ's `block-size`, and the closing band's tick and border.

### The engine learned four things

The inline script in `app/layout.tsx` was a fixed 14px/1000ms rise. It now reads
`--motion-duration`, `--motion-ease` and `--motion-distance` from `:root`, and per element:

- `data-rv-dir` - up / down / left / right / none, and `clip` for a rise out from behind an edge
- `data-rv-dist` - px, overriding the responsive default
- `data-rv-delay` - ms, which is how `Stagger` orders a group
- `data-rv-target="child"` - observe this box, animate the one inside it
- `data-rv-repeat` - opt out of `once`, which rule 2 says you should not

Every attribute is optional, so the 59 bare `.reveal` markers that predate the primitives still work
and take the defaults.

**Two of those exist for one bug.** A line at `translateY(100%)` inside `overflow-hidden` is fully
clipped, and an IntersectionObserver measures what is left after an ancestor clips it: nothing. The
box has to be the observed thing and the line the animated one, which is why `data-rv-target` and
the `[data-rv-target="child"] > *` rule in the stylesheet both exist. `MaskRise` recorded this trap
and `TextReveal` would have reintroduced it.

**The viewport test gained a height guard.** The brief's `threshold: 0.2` can never be reached by an
element taller than five viewports, so anything taller than 80% of the window is accepted on first
intersection instead. Without it a pinned rail would never animate at all.

### What happened to the 14 files that imported Motion

| Was | Now |
| --- | --- |
| `CtaReveal` | **deleted**, replaced by `Stagger` |
| `MaskRise` | **deleted**, replaced by `TextReveal` |
| `PracticeRows` | **Server Component**: its only Motion was the stagger; the hover wipe, ember rail and hollow index were always CSS |
| `RestoredOverlay` | **Server Component**, same reason. It had been shipping both of its lines at `opacity: 0` |
| `LogoMarquee` | 80 lines to 3: it is a call site for the `Marquee` primitive now |
| `CtaShader`, `FaqTabs`, `FixRail`, `HeroRays`, `Magnetic`, `MegaMenu`, `NavBar`, `TileGrid`, `ZoomImage`, `QuotePair` | moved to `motion/interactions/`, behaviour unchanged |

The ten that moved do things no primitive covers: a pinned scroll rail, a WebGL shader, a pointer
magnet, a mega menu, a filtering grid. Converting them to primitives would have deleted working,
measured behaviour. Moving them means the folder is the only place Motion lives, which is what the
brief's acceptance grep actually asks for.

### Measured against the brief's acceptance checks

| Check | Result |
| --- | --- |
| No `motion` imports outside the folder | **pass**, enforced by `npm run check:motion` |
| CLS 0.00 on home, a service page, an article | **pass**: 0.0000 on all three, measured with no interaction |
| LCP element not animated | **pass**: home's LCP is the hero headline at 232ms, 0 animations on it or any ancestor; service and guide LCP images the same |
| Renders with JS disabled | **pass on 98 routes.** Home ships 4 hidden nodes, all of them `QuotePair` placeholder quotes |
| No hydration warnings | **pass**: console clean on every route checked |
| Reduced motion | **pass**: 33 reveal targets on home, 0 hidden, 0 transformed, 0 running animations, marquee `animation-name: none` |
| Lighthouse 95+ on throttled mobile | **fail, and not because of this work.** See below |

### Lighthouse: 62 on home, and what is actually causing it

| Route | Score | LCP | CLS | TBT |
| --- | --- | --- | --- | --- |
| `/` | **62** | 3.2s | 0 | **8,890ms** |
| `/guides/<slug>/` | 91 | 3.5s | 0 | 110ms |
| `/wordpress-fix/critical-error/` | 89 | 3.3s | 0 | 190ms |

Home's total blocking time is 8.9 seconds, and one chunk accounts for **11,868ms of script
evaluation**. Its contents: `gsap` and `ShaderMount`. Neither is part of the animation system.
GSAP is used by exactly one file (`GuaranteeHeading`) and the paper-design WebGL shader by one
(`CtaShader`), both on the home page only. The pages without them run 110 to 190ms of TBT, which is
the true cost of this system.

The remaining gap on those two pages (89 and 91 against the 95 target) is LCP at 3.3 to 3.5s under
simulated mobile throttling, which is image weight, not JavaScript.

**So the target is reachable and the work it needs is not animation work**: drop GSAP for the one
heading that uses it (contract rule 2 already bans mixing it with Motion), defer or drop the shader,
and attack the hero image weight. Not done here, because none of it was in scope and all of it
changes designed behaviour the owner has signed off.

### Known exception: QuotePair

`QuotePair` reveals each sentence of a quote and then the attribution, which is a nested stagger and
not something `Stagger` expresses in one level. It stays on Motion, and its four nodes are the only
hidden content left in any server HTML on the site. The content is `src/content/testimonials.ts`
placeholders, which `next.config.ts` already blocks from a production deploy, so nothing real is
hidden. When genuine quotes arrive, this section is rebuilt and the exception goes with it.

### ScrollProgress and StickyCTA, both owner-instructed exceptions

`ScrollProgress` is a scroll cue, which contract rule 6 bans. Scoped to `/guides/<slug>/`, mounted
nowhere else, and it reports the article's own length rather than the document's: measured `scaleX`
0 at the top and 0.79 at half the document, because the footer is not part of the article. It takes
a **selector, not a ref**, which is what keeps `GuideTemplate` a Server Component.

`StickyCTA` is desktop only, because under 768px the shell already renders the fixed action bar and
the chat widget floats at every width. Verified: absent at 375, present past 60% depth at 1440,
dismisses, stays dismissed across a scroll up and back, and writes `sessionStorage`. Both of its
client reads go through `useSyncExternalStore` with server snapshots that render nothing, so there
is no hydration mismatch and no effect-then-setState. It is hidden on `/contact/` and
`/free-site-check/`, which already are the conversion step.

## Task 42 / the closing band gets a weave

> **Superseded by Task 43.** The CSS line grid described below was replaced, on the owner's
> instruction, by the swept-beam SVG they supplied. The `closing-grid` utility is gone. The two
> findings here still stand and are the reason Task 43 went in cleanly: the no-gradient argument
> (hard-stop lines, masks remove alpha) and the equal-mask-radii rule.


`ClosingBand` carries a lattice of hairlines behind its content, fading out at the edges and gone by
the corners. One `@utility` in globals.css and one `-z-10` span in the component; **12 call sites
pick it up**, which is every reading page's closing panel. The home page's `FinalCta` is a different
component with a shader background and was not touched.

### Two rules it had to get past, and how

MASTER rules out gradients outside the hero scrim. Both halves of this clear that bar for different
reasons, and both have precedent in the same stylesheet:

- **The lattice is a `linear-gradient` with a hard stop at 1px.** There is no interpolation anywhere
  in it: it draws a line. The alternative is an inline SVG of exactly the same thing.
- **The fade is a `mask-image`**, which removes alpha rather than adding a colour, so what shows
  through is the panel's own `--surface`, unchanged. This is verbatim the argument `marquee-fade`
  already makes four rules above it.

### The cell is the band's own padding

32px against `p-8`, 48px from `md` against `p-12`. The first gridline then lands exactly on the
content's left edge instead of cutting the panel at whatever offset a round number produced, so the
heading sits inside a cell rather than across one. Measured: 1152x193 band, 48px cells at 1440;
343x279 band, 32px cells at 375.

### Equal mask radii, which is the part that is not obvious

`ellipse Rx Ry` measures Rx against the box width and Ry against its height, so **equal percentages
put the falloff in normalised space**: a point at (dx, dy) from the centre sits at
`sqrt((dx/Rx)^2 + (dy/Ry)^2)` whatever shape the box is. At `90% 90%`, corners land at 78.6% and
edge midpoints at 55.6% on every band on the site, so one declaration covers every aspect ratio the
component renders at.

**This was found by testing, not by reasoning.** The first version used `110% 125%`, tuned by eye on
the 1152x193 desktop band, and it looked right there. On the 343x279 phone band the corners came out
at about half strength and the lattice stopped reading as texture and started reading as graph
paper. Mismatched radii do not survive the aspect ratios this component actually renders at.

Solid to 25%, gone by 75%: corners past the end of the fade, edge midpoints about two thirds
through it, middle of the panel at full strength.

### Contrast, measured rather than assumed

`--line` is `rgb(255 255 255 / 0.08)`, the faintest token on the site. Compositing one line over
`--surface` gives `rgb(39 39 42)`, and `--text` on that is **13.08:1**, against 16.14:1 on the bare
panel. The worst case is a heading sitting directly on a gridline and it is an order of magnitude
clear of the 4.5:1 floor.

axe returns `incomplete` rather than a ratio for this panel, because it cannot compute contrast
through a background image. That is the reason for the `incomplete`, not a miss, and it is why the
figure above was computed by hand.

### Checks

axe **zero violations** on the band at 1440. **CLS 0** (the layer is `absolute inset-0`, it reserves
nothing and shifts nothing). No horizontal scroll at 375. No JavaScript: `ClosingBand` is still a
Server Component and this adds no bundle. `pointer-events-none` and `aria-hidden`, so it is outside
the accessibility tree and cannot take a click. Dropped entirely under `forced-colors: active`.
`tsc` 0, `eslint` 0, content check 52/196, motion check clean, build 99 routes.

## Task 43 / the closing band's beams

The CSS line grid from Task 42 is gone. In its place is the swept-beam artwork the owner supplied
as SVG: 58 raked curves across the panel, 13 of them lit in ember, fading out before they reach the
edges. `src/components/templates/ClosingBeams.tsx`, one `-z-10` node inside `ClosingBand`, picked up
by all 12 call sites. No JavaScript: it is a Server Component and ships no bundle.

### The artwork is generative, so it is not 8KB of coordinates

The pasted file is about 8,000 characters of path data. Every one of the 58 curves turns out to be
the first curve translated by `(+7n, -8n)`, and the 13 lit ones are simply every fourth. Checked
against three samples from the original (n = 0, 1 and 57) before relying on it, and the built page
emits byte-identical `d` strings, verified on the production HTML down to the final `1083 419`.

So the component is a seven-point array and a loop. Eight kilobytes of literal coordinates inlined
into twelve routes is eight kilobytes in which a typo is indistinguishable from a curve.

### Retoned, because the source is drawn for a light page

Three reds (`#F14D4C`, `#FF5F5E`, `#E03A39`) over `#d4d4d4` hairlines. Hardcoded hex is banned here
and the variation is accent-locked, so the hairlines take `--text` and every lit beam takes
`--accent`. The three reds collapsing to one ember costs the artwork nothing: what makes a beam read
as lit is the alpha ramp along its length, not the hue step between two near-identical reds.

Stroke opacity moved with it. `0.04` is a visible hairline on a near-white page and nothing at all
over `--surface`; `0.1` puts the base curves at about the weight of `--line`, which is the token the
rest of the site uses for this job.

### The pasted glow positions were one frame of an animation

The source's gradient coordinates are values like `97.10166%`. Those are not hand-set numbers: this
is a snapshot of an animated component and the decimals are a frame of it.

A gradient only shows where its stop falls inside the viewBox, and `y1` equals `x1` throughout, so a
single value has to land inside the window on **both** axes. Beam `i` is curve `4i`, so its bounding
box starts at `(-380 + 28i, -189 - 32i)` and is 1064 square; intersecting that with the 696x316
viewBox gives each beam a narrow band of usable values. Measured across all thirteen: **eleven fall
outside it.** Only beams 1 and 4 would have glowed, and the other eleven would have rendered as
plain hairlines, which is exactly what the first build looked like.

Each position is now the centre of its own overlap, so all thirteen land in frame with nothing
animating. The gradient's *shape* is the source's own and is kept exactly (`x2` 4.85 points before
`x1`, `y2` 0.78 before it), which is what makes the lit stretch short and raked instead of a wash
down the whole beam.

### `preserveAspectRatio="none"`, deliberately

The band is about 6:1 and the viewBox is 2.2:1. `slice` was tried first and crops away most of the
artwork, including the part of the radial falloff that does the fading: the first build had beams
running edge to edge with no visible fade and no ember at all. Stretching maps the whole viewBox
onto the band, which rakes the curves shallower (on a band this wide that reads as light across it,
not as distortion) and is also what makes the overlap arithmetic above exact.

### The fade is the artwork's own

No CSS mask is involved any more. The base curves are painted through the source's radial gradient,
opaque through the middle and gone by 43.6%, and each lit beam through a linear gradient that is
transparent at both ends. The edges and corners clear because the paint runs out. `closing-grid` and
its mask were deleted; nothing else referenced them.

### Checks

axe **zero violations** on the band at 375. **CLS 0.** No horizontal scroll. Zero focusable nodes
inside the SVG, which is `aria-hidden` and `pointer-events-none`, so it is outside the accessibility
tree and cannot take a click or a tab stop. Rendered 1150x191 inside a 1152x193 band at desktop and
341x277 inside 343x279 at 375. Inline SVG weight on the page: about 10.4KB of markup, all of it
generated. `tsc` 0, `eslint` 0, content check 52/197, motion check clean, build 99 routes.

## Task 44 / ember trails on the closing band

The static lit beams from Task 43 now run. A short ember segment travels the length of a scattered
thirteen of the 58 curves, appearing and crossing at irregular intervals, which is what the owner
asked for: "red line trail like running these lines random over existing lines."

### How a trail is made

`stroke-dasharray: 140 1443` against a path 1583 units long, so there is exactly one dash per curve,
and `stroke-dashoffset` animates one full period per cycle. Painted through a second copy of the
artwork's radial falloff in `--accent`, so a trail dims as it runs out towards the panel's edge
rather than stopping at it. That one gradient replaced the thirteen per-beam ones Task 43 computed.

**Contract rule 10 exception, the fourth on the site**, after the FAQ's `block-size` and the two
grid-track animations. The justification is the same shape as theirs: **there is no transform that
moves a point along a curve.** Translating the path moves the whole line; a clip would need a mask
animated in two axes at once to follow the sweep. The animated area is a half-pixel stroke inside a
1152x193 box, which is the smallest on the site.

### Why it reads as random rather than as a loop

Measured, not assumed: each curve is inside the viewBox for only **70 of its 1583 units**, so a
trail is visible for about a tenth of its cycle. Thirteen trails at periods of 9 to 16 seconds put
one or two in frame at a time and take a very long while to repeat an arrangement.

The thirteen curves are picked by hand, not at an interval: gaps of 3, 6, 3, 7, 4, 4, 7, 4, 7, 4, 3,
5. The first draft ended 55, 56, 57, which put three trails on neighbouring curves half a pixel
apart; they read as one thick line rather than three, and evenly spaced trails read as a mechanism.
Corrected before the first build was looked at.

Periods and phases are **deterministic functions of the index, never `Math.random()`**. A random
value picked during render is a different number on the server than on the client, which is a
hydration mismatch on twelve routes. The phases are negative so each trail starts part way through
its own cycle; without that all thirteen set off together on the first frame and the band opened on
a single visible pulse.

### Reduced motion, and the mistake caught in it

`stroke-dasharray: none` paints each trail along its full length, which is the static lit beam of
Task 43: the reader gets the picture rather than a frozen dash parked wherever the clock stopped.

**The first version of that was louder than the animation it replaced.** Moving, you see one or two
short segments, because of the 70-in-1583 figure above. Still, you see all thirteen at full length
at once, and at the animated `0.55` that is thirteen ember lines across the panel. A reduced-motion
reader would have got a markedly busier design than everyone else, which is backwards. The static
arm drops to `0.15`, the figure Task 43 was measured at, and the two states now sit at about the
same weight. Verified in the browser under forced reduced motion: `animation-name: none`,
`stroke-dasharray: none`, `stroke-opacity: 0.15`, zero running animations, zero dashoffset movement.

### It is a client component now, for one reason

The `IntersectionObserver` that sets `data-beams-paused` when the band leaves the viewport, which
`animation-play-state: paused` keys off. The logo marquee records the argument: a loop that runs for
the whole visit while visible for a fraction of it is work nobody asked for, and this band sits at
the very bottom of every page. Verified: paused on load (the band is below the fold on every route),
running once scrolled to, all thirteen dashoffsets advancing.

Nothing else about the component depends on client state, so the markup is identical on both sides
and there is nothing for hydration to disagree about.

### Checks

axe **zero violations** on the band. **CLS 0.** Zero focusable nodes inside the SVG, which stays
`aria-hidden` and `pointer-events-none`. Thirteen trails, `140px, 1443px` dash, periods 9 to 16s
confirmed in computed style. `tsc` 0, `eslint` 0, content check 52/197, motion check clean, build 99
routes.

## Task 45 / the beams thinned out

The closing band's fan was crowded: stretched onto a band about 6:1, 58 curves at a 7-unit step sat
close enough together to read as hatching rather than as light. The owner asked for more air.

**39 curves at `(+10.5n, -12n)`, which is the same box at two thirds the density.** The step is 1.5x
the source's `(7, -8)` and the count comes down to match, so the artwork's total spread is
unchanged: 38 x 10.5 is 399, exactly 57 x 7, and 38 x 12 is 456, exactly 57 x 8. Confirmed on the
built page rather than on paper, where the last curve still begins `M19 -645`, the same coordinate
the 58-curve fan ended on. The fan occupies the same rectangle and is simply less dense.

The inline SVG went from about 10.4KB to **6.5KB** on every one of the twelve routes, which was not
the point but is worth having.

### This is where the artwork stops matching the source

Tasks 43 and 44 could say the emitted paths matched the owner's pasted file character for character.
They no longer do, and this is the one place they deliberately differ. The generative relationship
is intact (every curve is still the first one translated by a fixed step); only the step and the
count changed, on the owner's instruction.

### The trails moved with it

Carried across by scaling each index by 38/57, which keeps the spacing identical **in the artwork's
own units**: the gaps now run 2, 4, 2, 5, 2, 3, 5, 2, 5, 3, 2, 3, and the tightest pair is
2 x 10.5 = 21 units, exactly the 3 x 7 the tightest pair had at the old density. So the trails are
no closer together than they were, and the rule that no two sit on neighbouring curves still holds.

Thirteen trails, and nothing else about them changed: same 140/1443 dash on the same 1583-unit path,
same 9 to 16 second periods, same negative phases.

### Checks

Verified on the production build at 1440 and 375: 39 curves in the base path, 13 trail paths, all
thirteen animations running once the band is in view and paused before it. `tsc` 0, `eslint` 0,
content check 52/197, motion check clean, build 99 routes.

## Task 46 / the About page's stats strip, and a safety gate that was not working

A four-cell figures strip on `/about/`, between "What we work on" and "How working with us runs".

### Three gated claims and one counted fact

The owner asked for a stats section "with fake stats". Contract rule 6 bans **invented statistics**
outright, rule 8 allows numbers only from `src/content` or `getSiteStatus()`, and this page's own
header comment says there is no years-in-business line or client volume "because none of those
exist in src/content as a confirmed fact". A figure like "500 sites recovered" is a factual claim
made to a customer, not decoration.

The codebase already has the mechanism for exactly this and it is not a workaround: `confirm()` in
`src/config/brand.ts`, which renders a value in dev and preview and fails a production build until
the owner replaces it. It is how `brand.claims` already carries "booking takes about two minutes".
So `brand.stats` holds three gated figures and the fourth cell is `cities.length`, counted at build
time, which means the strip is never entirely unverified however long the others sit.

Cities rather than services or guides: those two are already printed as numerals in the sentence
under "What we work on" a screen above, and one figure appearing twice on a page at two type sizes
reads as two different facts.

Four cells, never three (rule 6). Hairline dividers rather than four bordered boxes, so it reads as
one instrument. `Stagger` and `CountUp` from Task 41, doing the job the motion table mapped them to.

### It was in the first viewport, which rule 4 forbids

Built first directly under the masthead, where a trust strip usually goes. Measured at 1440: top
edge at **592px against a 900px viewport**, inside the first screen, where brief rule 4 allows
nothing that animates on scroll, and `CountUp` runs 1.2s. Moved below "What we work on", where it
sits at 2550px, comfortably past the fold, and the page also reads in a better order. Verified
counting after the move: 232, 378, 449, 480, 493, 498, 500, with the token easing visible in the
spacing of the samples.

### "1 hrs"

The reply-time cell counted up through every integer below its target, so it put **"1 hrs"** on
screen for a frame. Suffix changed from `" hrs"` to `"h"`, which is correct at every value the count
passes through. One character, and the sort of thing only a frame-by-frame look finds.

### The gate did not work, and that is the important part of this entry

Everything above rests on "a production deploy fails until the owner confirms". **It did not.**

`next.config.ts` collects the unconfirmed values and throws when `VERCEL_ENV === "production"` or
`BRAND_STRICT === "1"`. Probed by logging `process.env` from inside the config during `next build`
with both set on the command line: **both read `undefined`**. Next loads the compiled config in a
context that does not carry the shell environment. `BRAND_STRICT=1 next build` exited **0** with
three unconfirmed stats, placeholder testimonials and an unconfirmed support email. The warning
printed; nothing stopped.

This is pre-existing and predates this task. It is recorded here because this task is what exposed
it, and because a gate that reports a problem and then lets the deploy through is worse than no
gate: it is the thing everyone points at when asking whether something can ship.

**`scripts/check-confirmed.ts`** runs the same rule as the first step of `npm run build`. A second
measurement shaped it: **`tsx` does not pass the shell environment to the script it runs** either.
`BRAND_STRICT=1 npx tsx -e "console.log(process.env.BRAND_STRICT)"` prints `undefined`, with or
without `export`, where plain `node` prints `1`. So the trigger is a **flag**, `--strict`, passed by
a new `npm run build:prod`, which cannot be lost; the two environment arms are kept for CI that sets
them and does reach the process. `next.config.ts` keeps its warning, which is useful in dev.

Verified both arms: `npm run build` reports 18 unconfirmed values and exits 0; the strict run exits
**1** and names the three stats first.

### Checks

Server HTML carries the final figures (`500+`, `6`, `2h`, `8`) in a `.sr-only` span, so the strip
reads correctly with JS off and a screen reader never hears the intermediate numbers. axe **zero
violations** at 1440 and 375. **CLS 0**, helped by `tabular-nums` from `CountUp`, so a digit
changing cannot change a cell's width. Four equal 288px cells at 1440, one column at 375, no
horizontal scroll. Reduced motion: final values immediately, zero running animations.

### 21st.dev

Searched. Closest was **Stats Grid** (#29195), bordered metric cells. The pattern was taken, the
component was not: it ships shadcn token names that do not exist here and a three-column grid that
rule 6 bans.

## Task 47 / effect 11 on every button, and a wipe on the stats cells

Two hover changes the owner asked for, from two references.

### The buttons: Codrops effect 11, read out of its own stylesheet

`button--calypso` from `tympanus.net/Development/ButtonHoverStyles/`, taken from `css/base.css`
rather than guessed at. Two layers:

- `::before` is a circle 120% of the button wide, resting collapsed below it at `scale3d(0,0,0)`.
  On hover it balloons up and fills the box over **400ms on the source's own
  `cubic-bezier(0.1, 0, 0.3, 1)`**.
- `::after` is a plain block waiting one button-height above, dropping in over **50ms, delayed
  400ms**, exactly as the circle finishes. A circle alone leaves a curved top edge; the block
  flattens it into a rectangle. **The motion is the circle, the block is the tidy-up.**

**It ports without touching how it moves**, because it is transform-only: contract rule 10 is
satisfied by the original.

Two things had to change. The source paints `#000` and inverts its label with
`mix-blend-mode: difference`, which over ember is unpredictable and is a hardcoded hex besides. So
each button fills with a token. `--on-accent` on `--accent` is the secondary's hovered pair at
**6.30:1**; the primary's label never moves. Both well clear of the 4.5:1 floor.

**Not ported: the label's roll-up.** It animates a `<span>` the source wraps its text in, and this
site's labels are bare text nodes across 86 call sites of differing shape. Wrapping them all is a
refactor, not a hover, and it was left for the owner to ask for.

### The primary filled dark first, and looked switched off

The faithful translation fills the primary with `--bg`, draining a light button to black the way
the source does. Built that way, measured at **17.16:1**, and then looked at: the one ember control
on the page goes near-black while the secondary beside it stays dark, so **the main call to action
reads as disabled at exactly the moment the pointer is on it.** Hovering something should not
demote it.

The fill is `color-mix(in srgb, var(--accent) 72%, var(--text))` now, a lighter ember. Both buttons
move the same way under the pointer, towards the accent and towards active, and nothing on the page
changes rank. The primary's label does not move at all, so there is no colour swap to time.

### The stats cells: the wipe that already existed

"Sliding background colour" is what `PracticeRows` has done since Task 30: a panel one step up from
the page, scaled from `origin-left` so a solid edge crosses left to right, which is the reading
direction. Ported rather than invented, so there is one dialect for this gesture and not two.
`tasteskill.dev`'s own styles are CORS-blocked from script and were not readable; the description
was unambiguous enough and the house move matches it.

**These cells are not links**, and the Hover Earns It rule normally reserves a pointer response for
things that go somewhere. Spent on the owner's instruction, recorded here so it reads as a decision
rather than drift.

### A false alarm worth recording

The built CSS was checked to confirm `[@media(hover:hover)]:group-hover:scale-x-100` is really
gated, since a tap would otherwise leave a cell filled with no way to clear it. A first look at the
200 characters before the rule showed no `@media` wrapper and the conclusion drafted was that the
gate had never worked anywhere on the site, which would have made a liar of a dozen entries in this
file.

It was wrong. Tailwind groups every rule sharing a variant into **one** media block, so the window
had simply landed in the middle of it. A brace-balance walk backwards from the rule reports
`ENCLOSED BY: @media (hover:hover){`. The gate works. **Check the enclosing block, not the
preceding bytes**, before concluding a variant did not compile.

### Checks

Hovered with a real pointer, not a dispatched event: circle at `scale3d(1,1,1)`, block at 0, label
swapped. axe **zero violations**. **CLS 0.** `overflow: hidden` does not clip the focus ring, which
is a `box-shadow` on the button itself rather than on a child. Reduced motion removes both pseudo
layers entirely (`display: none`) and the button keeps the lift it had before, which is a real
hover state and not a dead one; the stats wipe keeps its state change with `transition-property:
none`. `tsc` 0, `eslint` 0, content check 52/197, motion check clean, build 99 routes.

## Task 48 / the fill follows the cursor, and the secondary stops going red

Two corrections to Task 47, both from the owner looking at it.

### The stats fill grows from the pointer now

Task 47 reused `PracticeRows`' wipe, which scales from `origin-left` and therefore sweeps the same
way whichever edge the pointer came in at. Entering a cell from the right meant watching the fill
travel away from the cursor and then back under it.

`src/components/HoverFill.tsx` is a client leaf: a stylesheet cannot know where a pointer is, so the
two coordinates are written to custom properties on `pointerenter` and again on `pointerleave`, and
everything after that is CSS. A circle sits at those properties and only `scale` animates, so
contract rule 10 holds and the work stays off the main thread. The same expanding circle the buttons
make, so there is one vocabulary for "something filled under the pointer" rather than two.

The properties **default to 50%**, so a touch device that fires no pointerenter, a keyboard user or
a blocked bundle gets a centred fill rather than a broken one.

**Sizing is the part that is easy to get wrong.** The circle has to cover the box from any point on
it, corners included, so its radius must beat the box's diagonal. `w-[250%] aspect-square` gives
720px against a measured 308px diagonal on a 288x110 cell, clearing it more than twice over.

Verified by calling the component's own handlers with known coordinates: entering the left edge sets
`6px, 55px`; the right edge `282px, 55px`; the top right `285px, 3px`; the bottom middle
`144px, 107px`; and leaving at the top left moves the origin to `10px, 10px`, so it collapses
towards the exit. Photographed with four cells frozen mid-fill from four different origins.

**A note on testing this.** Synthetic `pointerenter` and `pointerover` events do not reach a React
`onPointerEnter`, so the first two attempts read empty and looked like a broken component. The
handlers were there the whole time: `__reactProps$…` on the node lists both. Call the handler off
that object, or drive a real pointer; do not conclude from a dispatched event that the wiring is
missing.

### The secondary no longer fills with the accent

Task 47 had it filling `--accent`, which put the loudest colour on the page on the lesser of the two
controls and made the pair swap rank under the pointer. Ember stays on the primary.

The replacement value was set by contrast, not by taste. The label stays `--text`, so the fill has
to stay dark enough to carry near-white. `--surface-2` mixed 55% with `--text` is about
rgb(124,123,125) and roughly **3.6:1**, which fails. At 78% it resolves to **rgb(75,75,78)** and the
label measures **7.63:1** against a resting surface of rgb(20,20,23), so the lift is obvious and the
text is far clear of the floor. The primary's lighter ember measures rgb(251,132,106) at **8.01:1**.

Both figures were read off the built page. An earlier pass recorded them from arithmetic and was
wrong by a different route: `getComputedStyle` returns a `color-mix` result as `color(srgb 0.29 …)`
with 0-to-1 floats, and a parser expecting `rgb(0-255)` read 0.29 as 0.29 and reported 18.41:1 for
a pair that is actually 7.63:1. **Parse the `color()` form before trusting a ratio.**

### Checks

axe zero violations, CLS 0, reduced motion drops the transition and keeps the state change, the
`(hover: hover)` gate intact on both. `tsc` 0, `eslint` 0, content check 52/198, motion check clean,
build 99 routes.

## Task 49 / the footer wordmark

The brand name at the foot of every page, running the spine's full width and fading out before the
bottom. Ported from interfaces.dev's footer on the owner's instruction, read out of the live page.

### What the reference actually does

Not what its visible footer section suggested. The brand mark there is a hand-drawn signature SVG,
which is somebody's actual signature and not something to copy. The treatment the owner meant is the
block after it:

```html
<div class="relative overflow-hidden h-16 sm:h-28 lg:h-32">
  <svg aria-label="Interfaces" viewBox="0 0 420 73" class="h-auto w-full stroke-gray-400 text-gray-300">…10 letter paths…</svg>
  <div class="absolute inset-x-0 bottom-0 bg-linear-to-b from-transparent to-gray-background h-1/2"></div>
</div>
```

**And it does not clip.** The box heights are set just above the artwork's rendered height at each
breakpoint (720px wide at `lg` gives 125px against a 128px box), so nothing is cut; the gradient over
the lower half is doing all of the work. Worth knowing, because the first build here clipped 104px
off the letters at desktop on the assumption that it did.

### Three deliberate departures

**Live text, not letter paths.** Theirs has to be an SVG because the mark is set in their own face.
MASTER locks this site to Bricolage Grotesque, so shipping someone else's outlines would break the
type lock and cost ten `<path>` elements. A real string stays crisp at any zoom and changes when
`brand.name` does.

**A mask, not a painted gradient.** The reference fades to a literal `to-gray-background`, correct
only while the footer is exactly that colour. `mask-image` removes alpha instead of adding colour,
so whatever is behind shows through, and it is what keeps this inside MASTER's no-gradient rule:
the same argument `marquee-fade` and the closing band's beams already make.

**`aria-hidden`, where theirs is labelled.** The footer's address block says LetsFixWP a few lines
above, so announcing it twice is noise. It is decoration, and `select-none` keeps it out of a copied
selection.

### Two measurements that changed the build

**The mark was filling 71% of the container, not the 96% first reported.** A `display: block` span is
as wide as its parent whatever its text does, so measuring the element returned the container width
and hid the gap entirely; a screenshot at that size looked close enough to pass. A `Range` over the
text node measures the letters: "LetsFixWP" in Bricolage at 800 with -0.04em tracking renders
**4.29x its font size** wide. Dividing the available width by 4.4 leaves just under two percent of
slack, which fills the spine without ever overflowing it: **95% at 375, 99% at 1440**, no horizontal
scroll at either.

**Crop the leading, never the letters.** Canvas TextMetrics on this exact face and weight puts the
ink between **0.105em and 0.845em** of a `line-height: 1` box. Negative margins of `-0.105em` and
`-0.155em` remove exactly that air, so the element's box becomes the letters: 56px at 375 against a
76px font, 197px at 1440 against 266px. The box needs no height of its own, which is what fixed a
fixed-height version that cut 104px of glyph at desktop and nothing at all at 375.

### Contrast, and why it is 36% rather than a whisper

At 11% the mark measured **1.32:1** and axe reported a serious `color-contrast` violation. Decorative
text is exempt from contrast under WCAG 1.4.3, so it could have stayed and been argued, but an
exemption an auditor has to be told about is worse than a number that passes on its own. The mark is
large text, so the threshold is 3:1 rather than 4.5:1, and `--text` at **36%** over `--bg` clears it.
The mask then removes most of it again, so what is on screen is far quieter than the token suggests.

### Checks

axe **zero violations** at 375 and 1440, where the first version had one serious. **CLS 0.** No
horizontal scroll at either width despite `white-space: nowrap`, because the box clips. `tsc` 0,
`eslint` 0, content check 52/198, motion check clean, build 99 routes.

## Task 50 / the wordmark rises, and the page ends on it

Two changes to Task 49's footer mark, both asked for against a screenshot.

### It rises out from behind its own edge

`Reveal` gained a `direction="clip"`, which the engine has supported since Task 41 through
`data-rv-dir="clip"` and `data-rv-target="child"` but which nothing exposed: `TextReveal` wrote
those attributes by hand, and `app/layout.tsx` says the primitives should be the only things that
emit them. Now they are.

**A clip reveal does not carry `reveal-self`, and that is the whole subtlety.** The box is the thing
watched and the child is the thing moved, so hiding the box would hide the element the observer
needs to see and the engine would animate the child of something that never becomes visible. A
child at `translateY(100%)` inside an `overflow-hidden` parent is entirely clipped, and an
`IntersectionObserver` measures what is left after an ancestor clips it, which is nothing. `MaskRise`
recorded this trap, `TextReveal` nearly reintroduced it, and it is now written on `Reveal`'s own
prop so the next caller cannot miss it.

The footer stays a Server Component: this ships no JavaScript of its own.

Verified on the built page: before scrolling, the span is `opacity: 0`; after a paced walk to the
bottom it is `opacity: 1` with an identity transform and one animation recorded. Under reduced
motion it is `opacity: 1` with no transform **without ever scrolling to it**, and zero animations
run.

### The page ends on the mark

The footer wrapper's `pb-14 md:pb-28` is gone. Measured at 1440: the gap below the wordmark is
**0px** and the document's scroll height ends exactly at the mark's bottom edge, so the letters run
to the foot of the document with nothing under them. The mask fades them out before they get there,
so the page ends on the mark dissolving rather than on a cut.

**At 375 there is still 76px below it, and that is correct.** It is not leftover padding:
`body:has(header[data-action-bar])` reserves `4.75rem + env(safe-area-inset-bottom)` under 48rem so
the fixed mobile action bar does not sit on top of the content. Removing it would put the bar over
the wordmark. Checked rather than assumed, because a 76px gap after deleting padding looks exactly
like padding that was missed.

### Checks

axe **zero violations** at 375 under reduced motion. **CLS 0.** No horizontal scroll. `tsc` 0,
`eslint` 0, content check 52/198, motion check clean, build 99 routes.

## Task 51 / polishing the wordmark's entrance

The footer mark rose correctly and felt wrong. Two values were doing it, both of them tuned for a
different size of movement, and both now measured rather than guessed.

### One duration for a 24px nudge and a 197px rise

The engine read `--motion-duration` for everything. The wordmark is **197px tall at 1440** and rises
its own height, so it covered that ground in the token's 500ms: about **400px a second**, which is
the lurch. `data-rv-dur` lets one element ask for longer without moving the token out from under the
other hundred that are still nudging 24px. The footer passes **900ms**, near 220px a second, which
is the weight something that size should move with. Exposed on `Reveal` as a `duration` prop, since
`app/layout.tsx` says the primitives are the only things that may write these attributes.

### An opacity ramp competing with the clip

The keyframes finish opacity at **30%** of the run. On a 24px nudge that is imperceptible. On a long
rise it means a **fully opaque block travelling the remaining 70%**, and that is what actually read
as unsmooth: the reveal was over while the movement carried on.

A `clip` reveal finishes it at **8%** instead. The clip is already doing the revealing, so a fade on
top of it is a second, competing one. It is not removed outright: 8% is a safety net for a caller
who forgets the `overflow-hidden` that `clip` requires, where the element would otherwise appear in
full below its box.

### Sampled frame by frame rather than eyeballed

Per-frame `requestAnimationFrame` samples of the live animation at 1440:

| t | opacity | y |
| --- | --- | --- |
| 110ms | 1.00 | 184 |
| 217ms | 1.00 | 95 |
| 343ms | 1.00 | 35 |
| 444ms | 1.00 | 16 |
| 644ms | 1.00 | 2 |
| 843ms | 1.00 | 0 |

Opacity is full at **60ms**, 6.7% of the run, so the fade is effectively instant and the clip does
the work. The travel covers half its distance in the first 200ms and spends the rest settling, which
is what `cubic-bezier(0.22, 1, 0.36, 1)` is for and what makes the end read as arriving rather than
stopping. Duration confirmed at 900ms on the running animation, easing confirmed as the house curve.

### Both clip callers checked

`FinalCta`'s "Let's fix it." is the other one and still resolves to opacity 1 and an identity
transform on the token duration; only the footer passes 900. Reduced motion renders the wordmark at
opacity 1 with no transform **without ever scrolling to it**, and zero animations run.

### One oddity found and deliberately not fixed

A `<p class="sr-only">` sitting as a direct child of a `.reveal` container takes the hidden start
state and never animates: it is 1px and clipped, so the observer has nothing to see. It stays at
`opacity: 0`, which costs nothing, because `opacity` does not remove an element from the
accessibility tree and the paragraph is visually hidden by design. Recorded so the next sweep that
counts hidden reveal targets knows why one never resolves.

### Checks

axe **zero violations**. **CLS 0.** No horizontal scroll. `tsc` 0, `eslint` 0, content check
52/198, motion check clean, build 99 routes.

## Task 52 / the wordmark animates on every route, not just the landing one

The footer mark played on whichever page the visitor arrived on and never again, however many routes
they clicked through. Two causes, both structural, and both had to be fixed for it to work.

### Why it only ever ran once

`<SiteFooter />` is a **sibling of `<main>`** in the root layout, so Next keeps the same DOM node
across a soft navigation. Nothing remounts, and the engine had already called `io.unobserve` on it
after the first run. A node it has finished with is a node it never looks at again.

And even a replacement would not have helped on its own: the engine's `MutationObserver` watched
**`#main` only**, so anything appearing in the footer was invisible to it.

### Both halves

**`FooterWordmark` is a client leaf keyed on the pathname.** A changed `key` makes React discard the
element and build a new one, which is a node the engine has never seen, so it is scanned, observed
and animated again. The `seen` WeakSet keys off the node itself, so a fresh node is fresh to it with
no bookkeeping to reset. This is the only client code in the footer and it costs close to nothing:
`usePathname` is already in the bundle on every route because `StickyCTA` uses it.

**The engine watches the footer as a second target**, rather than widening to `body`. Widening would
have worked and would also have put every mutation from the chat vendor's widget and the Radix
dialog portals through a rescan, which is the cost the `#main` scope was chosen to avoid. Two
explicit targets keep both properties.

### It still does not replay within a page

Brief rule 2, checked rather than assumed. On `/guides/`, after the mark had animated: scrolling to
the top and all the way back down leaves the animation count at **1** and the mark visible
throughout. A route change is the only thing that re-arms it. `once={false}` would have satisfied
"every page" too and would also have replayed the mark every time the footer re-entered the viewport
on a single page, which is the behaviour the rule exists to prevent.

### Measured across real soft navigations

Driven by clicking in-page links, with `performance.getEntriesByType("navigation").length === 1`
confirming no full page loads happened:

| Page | Node instance | Before scroll | After scroll | Animations |
| --- | --- | --- | --- | --- |
| `/about/` | 1 | 0 | 1 | 1 |
| `/pricing/` (soft nav) | 2 | 0 | 1 | 1 |
| `/guides/` (soft nav) | 3 | 0 | 1 | 1 |

A new node instance per route, each starting hidden and arriving on its own.

Reduced motion holds across navigation too: the mark is `opacity: 1` with no transform on load
**and** after a soft navigation, in both cases without ever scrolling to it, with zero animations
running.

### Checks

axe **zero violations**. **CLS 0.** `tsc` 0, `eslint` 0, content check 52/199, motion check clean,
build 99 routes.

## v4 / video slots reserved on three pages (Task 53)

Three video slots, recorded before coding (contract rule 3). None is filmed. Each renders a composed
empty state today and becomes a real player the moment a file lands in `src/content/videos.ts`, with no
code change: the same existence gate `RealScreen` and `hasScreen()` already run for `public/screens/`.

| # | Page | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `/about/` | "How a rescue runs" (new) | one framed media block on the full spine, caption under the frame, nothing beside it | no | no | none (the masthead and the closing band carry this page's two) |
| 2 | `/case-studies/` | the existing empty state | composed empty state with one framed visual above the copy | no | no | BOOK, CHAT (already present, unchanged) |
| 3 | `/` home, `Proof` | the existing quote cards | no new family: a media slot inside the card that is already there | no | yes (already, the logo marquee) | unchanged |

Budgets after this pass: 0 pinned scenes of 2. Home stays at 1 marquee and gains no section, so its
family count is unchanged at 11. `/about/` goes from 4 sections to 5 and spends no eyebrow. No page has
two consecutive image-plus-text splits: slot 1 is a media block with no text column beside it, and slot
3 sits inside a card.

### Why the restored-site section was rejected as a host

The plan approved for this task put the second business slot in `src/components/sections/v4/Restored.tsx`,
on the argument that it is the one section whose entire content is one visual and whose stand-in actively
misleads (`docs/image-todo.md`: under "Same site. Working again." an unlit monitor reads as the site still
being down). Reading the section ruled it out.

`RestoredOverlay` covers that frame edge to edge with `absolute inset-0 bg-photo-scrim` and holds the
section's own `h2#same-site` and its sentence centred on top of it. A `<video controls>` underneath is
unreachable: the scrim paints over it, and the player's control bar lands under the overlay's copy. Making
it work means removing the overlay and restacking the section's words above or below the frame, which is
the redesign this task's non-goals rule out, and it would also cost the section the one measured pairing
the site has for text over photography (`--on-photo` on flat `--photo-scrim`, 6.58:1).

So the slot moved to `/case-studies/`, which the repo already documents as its proof-shaped hole: the page
is a dashed empty state whose whole job is evidence that does not exist yet. It needs no redesign, and the
video is the first evidence the page can carry before a written case study is approved.

Restored keeps its three-branch fallback chain untouched. The honest note stands that it still wants
`/screens/restored.png` from `npm run capture`, which needs Docker.

### Why a video slot is not a new primitive

`src/components/VideoFrame.tsx` is 3 small exports layered on each other, and the frame itself is the
`Framed` shape already inline in `Restored.tsx:16` and specified at `MASTER.md:211`: `--surface-2` bezel,
`p-2`, 14px outside and 14px inside, `border-line`, `--shadow-card`. Nothing new was invented for it.

- `Clip` renders the `<video>`: `controls`, `preload="none"`, a poster, and `width`/`height` so the box is
  the final box. No player library, no custom chrome, no autoplay, which is what keeps it inside contract
  rule 13 on a home page already measured at LCP 5.2s.
- `VideoSlotBox` is the 16/10 aspect box: the clip, or the dashed `border-line-strong` empty state that is
  this codebase's established placeholder signal (`QuotePair.tsx:40`, `case-studies/page.tsx:23`).
- `VideoFrame` wraps the box in the capture frame and puts the caption in a `figcaption` **under** the
  frame, because contract rule 6 bans labels on images.

The caption is the honest part. While a slot is empty it names what will play there and says it is not
filmed yet, so the page never shows a play affordance for a video that does not exist.

### Accessibility gate carried forward, deliberately unsatisfied

A clip cannot ship without a captions track, and a `<track>` cannot be written for a file that does not
exist. `src/content/videos.ts` carries `captions` on the clip type as a required field, so the day a clip
is added TypeScript asks for its `.vtt` path rather than letting an uncaptioned video reach the page. The
empty state needs no track: its text alternative is the `figcaption`.

### Measurements

Taken from the prerendered HTML in `.next/server/app/` rather than from a browser: this machine's
sandbox blocks loopback networking, so `next start` binds in a namespace nothing else can reach, and
port 3000 reports EADDRINUSE with nothing listening on it (a WSL2 port reservation, not a server).
What follows is therefore measured where it can be, and the browser passes are named as not run.

| Page | Video-slot figures rendered | `<video>` elements | `autoplay` | Dashed empty states |
| --- | --- | --- | --- | --- |
| `/about/` | 1 | 0 | 0 | 1 |
| `/case-studies/` | 1 | 0 | 0 | 1 (plus the page's own panel, which is a different block) |
| `/` home | 2, one per quote card | 0 | 0 | 2 (plus the two existing quote markers) |

Zero `<video>` elements is the correct result while every `clip` is null: the empty state is markup,
not a stalled player, so there is nothing to fetch and nothing to fail.

Heading order on `/about/` after the insert, read off the rendered HTML: h1 "About LetsFixWP", then
h2 "What we work on", h2 "How working with us runs", **h2 "Watch a rescue"**, h2 "Want us to look at
your site?". One h1, no level skipped, and the new section is the fifth of five rather than second,
which is where the slot's own comment argues it belongs.

Contrast, computed from the token values in `globals.css` rather than sampled:

| Pairing | Measured | Needs | Where |
| --- | --- | --- | --- |
| `--muted` on `--surface-2` | **6.79:1** | 4.5 (body) | the caption, which sits inside the frame's bezel |
| `--line-strong` at 0.36 over `--surface` | **3.36:1** | 3.0 (UI boundary) | the dashed empty-state border, composited rgb(105,105,107) |

Both are new pairings on this site. For reference the existing ones measure `--muted` on `--surface`
7.35:1 and the same dashed border on `--surface-2` 3.34:1, so the slot is in line with what the quote
cards and the case-studies panel already spend.

CLS is 0 by construction rather than by measurement: the box is `aspect-[16/10]` with no image in it,
`Clip` carries `width` and `height` from the content file so a real clip reserves the same box, and
nothing in the slot loads an asset that could resize it. No negative margins and no fixed widths, so
it cannot produce horizontal scroll inside the `max-w-page` spine.

Reduced motion: the slot runs no animation of its own. On `/about/` and `/case-studies/` the frame
carries `reveal-self`, whose hidden state is `globals.css:711`, and that rule arms
`opacity: 1 !important; transform: none !important` under `prefers-reduced-motion: reduce`. With the
bundle blocked entirely there is no `.reveal-js` on `<html>`, so the frame renders at full opacity
either way. In the quote cards the frame sits outside the Motion variants, so it never animates at all.

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 201 files scanned, legacy off**, motion
check clean, `npm run build` green at **99 routes** (55 SITEMAP nodes, 37 guides, 3 compares, 4
utility). `check-confirmed` still counts **2 placeholder testimonials** and still fails a production
deploy, which is the result wanted: adding a video slot to those two cards did not quietly launder
them into confirmed content.

**Not run, and not claimed:** axe, Lighthouse, the 375/768/1024/1440 screenshot pass, and a measured
CLS and LCP. The sandbox has no loopback networking and the attached browser sits in a different
network namespace from anything `next start` can bind, so no page could be loaded. These are the
checks to run first on a machine that can serve the build, and `/about/` plus `/` are the two routes
that need them.

## v4 / the proof section becomes a paged video carousel (Task 54)

Recorded before coding (rule 3). Home section 5 changes layout family. The two quote cards side by
side became one card per view on a snap rail, because the video slot added in Task 53 had turned each
card into five stacked blocks (video frame, its caption, a dashed chip, a 7xl quotation glyph, a
display blockquote at `text-3xl`, attribution) and two of those stacked into one column below 768px.

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 5 | We repair sites running on | **was** two quote cards side by side (`md:grid-cols-2`) | no | yes, the logo strip | none in the cards |
| 5 | We repair sites running on | **now** paged carousel, one card per view, video beside quote, prev/next plus dots inside the spine | no | yes, unchanged | none in the cards |

Home stays at 11 sections and at one marquee. No eyebrow spent. No new consecutive image-plus-text
split: the card is a single block whose two halves are one quote, not a section-level split.

### Rule 3: why this is not the rail the page already has

Section 3 is recorded as "scroll-driven rail, 5 panels on one line, bleeding to the edge", so a second
horizontal track needed an argument rather than an assumption. `FixRail` and this carousel are
opposites on every axis that defines that family:

| | Section 3, `FixRail` | Section 5, `QuoteCarousel` |
| --- | --- | --- |
| What moves it | the page scroll, written to `scrollLeft` every frame through a spring | the visitor, through buttons, dots, a swipe or arrow keys |
| Controls | none, by design | prev, next, four dots, a position counter |
| Snapping | **refused outright** (`FixRail.tsx:77-78`: the drive would fight it for the last pixels of every frame) | `snap-x snap-mandatory`, which is the whole paging mechanism |
| Width | bleeds to the window edge, cards cut off to say there is more | contained in the 1152px spine, one full-width card |
| Units | 5 panels read as one continuous row | 4 discrete slides, one at a time |

One is a continuous automatic pan you can interrupt; the other is discrete manual paging. Different
family, recorded as such.

### Why there is no autoplay

Not taste. `LogoMarquee` sits in this same section and is the page's one auto-moving track, which rule
3 caps at one per page and `Marquee.tsx:22-24` already records as spent. An auto-advancing carousel
would be the second. It would also fight the slot's own content: an advancing slide can pull a clip
away from someone who pressed play on it.

Which simplifies rule 9 rather than dodging it. The rule asks for "pause plus previous and next
controls and stop on hover, focus and reduced motion". Prev and next are real buttons; hover, focus
and reduced-motion stops are vacuous because nothing moves on its own; **pause is not applicable, and
that is a consequence of there being nothing to pause rather than an omission.**

### Why no carousel library, and why not 21st

21st.dev was searched first, per CLAUDE.md. Ten testimonial carousels, none usable: every one is
quote-and-avatar rather than video, most lead with autoplay (`Carousel Testimonials`, `Testimonials
with Carousel`, `Reviews Carousel`), and the two closest on behaviour (`Testimonial Section 3` and
`4`, prev/next plus keyboard) are three-card centre-highlighted layouts, which is rule 6's three equal
cards in a row. Each would also need its tokens rewritten and a second accent stripped.

No Embla, Swiper or Keen either. The whole mechanism is three CSS classes and one DOM call:

```
snap-x snap-mandatory scroll-smooth   +   motion-reduce:scroll-auto
el.children[i].scrollIntoView({ block: "nearest", inline: "start" })
```

`scrollIntoView` with no `behavior` argument inherits the scroller's computed `scroll-behavior`, so
**reduced motion is handled entirely by the media query** and there is no JS branch that can drift
from the CSS. `block: "nearest"` is load-bearing: without it, paging a horizontal rail also scrolls
the page vertically to centre the slide.

The active index comes from an `IntersectionObserver` rooted on the rail, holding a ratio per slide
across callbacks so a slide leaving view cannot win. Not a scroll listener: rule 6 bans
`window.addEventListener('scroll')`, and `Marquee.tsx:52-58` already set the observer as the house
pattern for "is this thing in view".

Rule 10 wants one sentence per animation. Nothing here is animated: scroll position is not an animated
property, the dots change state with no transition (a width transition would be a layout animation,
which rule 10 forbids), and what the movement communicates is **that there is more than one client
story, and which one you are on.**

### What the card lost

| Block | Was | Now |
| --- | --- | --- |
| video | full card width, 16/10, above everything | `md:col-span-5`, beside the quote; full width only below 768px |
| quotation glyph | `text-7xl` display character on its own line | gone; the blockquote carries real typographic quotes |
| placeholder chip | a dashed block on its own line | one `text-xs` chip |
| quote | `text-2xl md:text-3xl` display | `text-xl md:text-2xl` display |
| attribution | `mt-auto pt-6` | unchanged |

Slides are `w-full shrink-0 snap-start` in a flex row, so `align-items: stretch` gives every card the
height of the tallest and the controls underneath never jump between slides.

### Four slides, not two

A carousel of two is controls looking for content. `src/content/testimonials.ts` went from two
placeholder entries to four, each still `placeholder: true` and each with its own video slot in
`src/content/videos.ts`. The four are deliberately four different jobs (an emergency, a planned piece
of work, a hacked site, a store move) so no two slides make the same point, which is the split the
file already asked of the original two.

**This makes the production gate louder, not quieter.** `scripts/check-confirmed.ts` and
`next.config.ts` count placeholders and fail a production deploy while any remain, so the count goes
from 2 to 4. That is the honest direction: the section now has four visible slots that say no client
has said any of this yet.

### Measurements

Read off the prerendered `.next/server/app/index.html`, for the same reason as Task 53: this machine's
sandbox has no loopback networking, so nothing can serve the build and no browser can reach it.

| Assertion | Result |
| --- | --- |
| `aria-roledescription="carousel"` groups | 1 |
| slides, with labels | 4, labelled "1 of 4" through "4 of 4" |
| video-slot figures | 4, one per slide |
| `<video>` elements | 0, correct while every clip is null |
| `autoplay` anywhere | 0 |
| snap rail, `snap-x snap-mandatory scroll-smooth` | 1 |
| `motion-reduce:scroll-auto` | 1 |
| prev and next controls | both, labelled "Previous client story" and "Next client story" |
| dot controls | 4, labelled "Go to client story 1" to "4" |
| `aria-current` | `true` on the first dot, `false` on the other three |
| position counter | renders "1 of 4" |
| blockquote class | one variant only: `text-xl md:text-2xl`, down from `text-2xl md:text-3xl` |
| `text-7xl` in the cards | 0; the one left on the page is the hero headline at `xl:` |
| h2 count | 18, unchanged: the carousel adds no heading |

The prev button server-renders as `disabled=""`, which is right: the first slide is the active one
before any hydration, and a control that cannot do anything should say so rather than silently fail.

Contrast, computed from the token values rather than sampled. UI indicators and boundaries need 3:1,
body text 4.5:1:

| Pairing | Measured | Needs |
| --- | --- | --- |
| active dot, `--accent` on `--bg` | **6.30:1** | 3.0 |
| inactive dot, `--line-strong` on `--bg`, composited rgb(99,99,101) | **3.26:1** | 3.0 |
| control border, `--line-strong` against the page `--bg` | **3.57:1** | 3.0 |
| control border against its own `--surface` fill | **3.36:1** | 3.0 |
| placeholder chip, `--muted` on `--surface` at `text-xs` | **7.35:1** | 4.5 |
| position counter, `--muted` on `--bg` | **7.82:1** | 4.5 |
| attribution, `--text` on `--surface` | **16.14:1** | 4.5 |

The disabled control drops to `opacity-40` and is below 3:1 by design; WCAG exempts an inactive
control, and the state is also carried by the real `disabled` attribute rather than by colour alone.

Card height is stated as intent rather than as a number, because measuring it needs a browser. What
produces the reduction is specific and visible in the diff: the 16/10 video moves from full card width
to `md:col-span-5` beside the quote, the `text-7xl` glyph line is deleted, the dashed chip goes from a
block to a `text-xs` inline chip, and the blockquote drops one step on both breakpoints. Below 768px
the card still stacks video over quote, so the saving there is the glyph, the chip and the type step,
not the layout.

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 201 files scanned, legacy off**, motion
check clean (no Motion imports outside `src/components/motion/`, and this carousel imports none at
all), `npm run build` green at **99 routes**.

`check-confirmed` now reports **4 placeholder testimonials**, up from 2, and still fails a production
deploy. That is the intended direction: four visible slots now say that no client has said any of
this yet.

`QuotePair.tsx` was deleted rather than left beside its replacement. `Proof.tsx` was its only consumer.
The references left in `docs/qa-report.md` are kept: they are a record of what was measured against
that component at the time, not live documentation.

**Not run, and not claimed:** axe, Lighthouse, the 375/768/1024/1440 screenshot pass, measured card
heights, and a real swipe test on a touch device. The last one matters most here, because touch
inertia against `snap-mandatory` is the one behaviour that cannot be reasoned about from markup. Run
these first on a machine that can serve the build.

### Follow-up: the section link moves into the controls row

Reported from a screenshot: "Read the case studies" sat on its own line under the carousel while the
right half of the controls row was empty, so the row read as unfinished and the link spent a whole
line of height restating nothing.

It now sits in the controls row, in a right-aligned group with the counter: paging on the left, the
link and "n of 4" on the right. That is one line of height recovered from the section and the row's
dead space filled by the one thing in the section that goes somewhere.

It is passed into `QuoteCarousel` as an `action` node, the same composition the `media` slot already
uses, so the link stays a Server Component and its href keeps coming from `src/config/routes.ts`,
which rule 16 makes the only legal source for one.

The row became `flex-wrap` with `gap-y-4` at the same time. Two 44px buttons and four 44px dot
targets already take about 280px, and the spine is 343px of usable width at 375, so without wrapping
the link would have pushed the row past the viewport. Wrapping drops the right group to a second line
instead, which is a taller row at that width but no horizontal scroll, and rule 12 forbids the latter
outright.

Verified in the prerendered HTML: the link renders once on the page, inside the controls row, before
the counter. `tsc` 0, `eslint` 0, content and motion checks clean, build green at 99 routes.

## v4 / home, proof split in two and moved to where the doubts are (Task 55)

Recorded before coding (rule 3). No new layout family: this is a split and a reorder of blocks the
page already had. Home goes from 11 sections to 12 because one section that was doing two jobs
becomes two sections that each do one.

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 2 | We repair sites running on (**new**, `Logos.tsx`) | labelled logo strip, one line, centred label above it | no | yes, the page's one | none |
| 9 | What clients say (**new**, `ClientStories.tsx`) | paged carousel, one card per view (Task 54's family, unchanged) | no | no | none in the cards; the case studies link sits in the controls row |

Budgets after: 12 sections, still **1 marquee**, still **0 pinned scenes of 2**, 0 eyebrows. The
carousel's family was argued against section 4's scroll-driven rail in Task 54 and that argument is
unchanged by moving it; the two are now further apart rather than closer.

### The order, before and after

| # | Was | Now |
| --- | --- | --- |
| 1 | Hero | Hero |
| 2 | Sound familiar (the break) | **We repair sites running on** (logo strip) |
| 3 | Here is what we do next (the fix) | Sound familiar (the break) |
| 4 | Pick your problem | Here is what we do next (the fix) |
| 5 | **We repair sites running on + the quotes** | Pick your problem |
| 6 | Same site. Working again. | **Same site. Working again.** |
| 7 | Choose how you want help | Choose how you want help |
| 8 | Guarantee | Guarantee |
| 9 | How we work on your site | **What clients say** |
| 10 | Questions people ask first | How we work on your site |
| 11 | Let's fix it. | Questions people ask first |
| 12 | | Let's fix it. |

### Why

Four findings from an audit of the page against SaaS proof conventions and `PRODUCT.md`'s own
conversion goal. Each one is a placement problem, not a styling one.

**One section was doing two jobs under a heading that named one of them.** The section was
`aria-labelledby="repair-sites-on"`, so its accessible name was "We repair sites running on" while it
contained the logo strip, four client stories and the case studies link. That heading answers "do you
support my stack"; it says nothing about clients. The styling showed the block had outgrown its
heading: measured across the rendered HTML, every other section heading on this page is 30px display
extrabold, and this one alone was **16px, non-display, `--muted`**. So the page's entire client-proof
block had no visible heading at all, and a screen reader announced four testimonials inside a region
named after a platform list. Split, each half now says what it is, and "What clients say" is set in
the house heading like every other section.

**The logo strip was about four screens too late.** It was recorded at 65% page depth. A logo row is
the fastest credibility check a visitor can make and the convention everywhere is to put it directly
under the hero. The argument is stronger here than for generic SaaS: `PRODUCT.md` has the visitor
arriving mid-emergency, often on a phone, often straight off a search for their error string, with
success defined as a booked fix in about two minutes. Someone deciding whether this company is real
does it on the first screen. It is also the cheapest block on the page to move: one line of markup
and a strip of inline SVG.

**The page led its proof moment with its weakest proof.** The quote carousel sat *before* `Restored`,
the real before-and-after capture, which is the most persuasive asset the page owns. With no real
client quotes yet, a demonstration is the proof that works: a real screen beats an empty testimonial
block. `Restored` now follows "Pick your problem" directly, so the sequence reads recognise your
error, see the fix, see the same site working, and only then hear from clients.

**The testimonials sat next to no decision.** They were in a narrative gap between the problem list
and the result, with no call to action within a screen. They now sit after `Plans` and `Guarantee`,
which is this page's price-and-risk moment, where the doubt a client story answers ("did this work
for someone like me") is the doubt the visitor actually has.

### What was deliberately not changed

The opening run of break, fix, pick-your-problem is well judged for a visitor who arrived in a panic
and is not reshuffled to suit a convention. The carousel itself is untouched: the finding was where it
sat, not what it was. No copy was rewritten and no section was restyled beyond giving the client
stories the house heading they should always have had.

### The one risk this introduces

The marquee is a client island carrying eight inline SVGs, and it moves from 65% depth to the second
section on a page already measured at **LCP 5.2s against a 2.5s budget**. The icons are inline, so it
adds no network request, and `Marquee` already stops itself when off screen. What it does add is
hydration work higher up the page. The hero is `min-h-[100dvh]`, so the strip still starts below the
first viewport and brief rule 4 (nothing animating in the first screen) continues to hold. **This is
the thing to measure first** on a machine that can serve the build.

### Measurements

Read off the prerendered `.next/server/app/index.html`, for the reason given in Tasks 53 and 54: this
machine's sandbox has no loopback networking, so nothing can serve the build and no browser can
reach it.

Heading hierarchy, in document order, with the size each is actually set at:

| # | Level | Heading | Size | Display face |
| --- | --- | --- | --- | --- |
| 1 | h1 | Broken WordPress? Back online today. | 30px | yes |
| 2 | h2 | We repair sites running on | 16px, `--muted` | no, by design: it labels a strip |
| 3 | h2 | Sound familiar? | 30px | yes |
| 4 | h2 | Here is what we do next. | 30px | yes |
| 5 | h2 | Pick your problem. We take it from there. | 30px | yes |
| 6 | h2 | Same site. Working again. | 30px | yes |
| 7 | h2 | Choose how you want help | 30px | yes |
| 8 | h2 | 14-day guarantee | SVG letterforms | yes |
| 9 | h2 | **What clients say** | **30px** | **yes** |
| 10 | h2 | How we work on your site | 30px | yes |
| 11 | h2 | Questions people ask first | 30px | yes |
| 12 | h2 | Let's fix it. | display | yes |

Row 9 is the fix. The client-proof block went from having no heading of its own to carrying the same
30px display heading as every other section. Row 2 stays at 16px `--muted` deliberately: it is a label
for a logo row, not a section opening, and it is still a real h2 so the strip has a name in the
outline rather than being eight unexplained pictures.

| Assertion | Result |
| --- | --- |
| `<section>` elements in `<main>` | 12, up from 11 |
| marquees | 1, unchanged, rule 3 intact |
| carousels | 1 |
| logo strip renders before "Sound familiar?" | yes |
| `Restored` renders before the client stories | yes |
| client stories render after the guarantee | yes |
| one h1 | yes, no level skipped anywhere |

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, `npm run build` green at **99 routes**. `check-confirmed` still reports 4 placeholder
testimonials and still fails a production deploy, unchanged by the move.

`Proof.tsx` was deleted rather than left beside its two replacements; `src/app/page.tsx` was its only
consumer. `LogoMarquee` is untouched and still the single call site of the `Marquee` primitive.

**Not run, and not claimed:** axe, Lighthouse, the 375/768/1024/1440 screenshot pass, and the LCP
measurement that this task specifically calls for, since the marquee moved from 65% depth to the
second section on a page already at 5.2s. Run that one first.

## v4 / case studies, redesigned around what the page can honestly show (Task 56)

Recorded before coding (rule 3). `/case-studies/` was 41 lines: breadcrumbs, a bare h1, a video slot
and one dashed panel. It was the only inner page on the site with **no masthead and no closing band**,
which is why it read as unfinished rather than as empty.

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Case studies (masthead) | type on a photographic band, the shared `PageMasthead` | no | no | BOOK, CHAT |
| 2 | What each write-up contains | 4 icon cards, 2x2, cursor-aware hover fill | no | no | none |
| 3 | The same site, before and after | one framed media block, caption under it | no | no | none |
| 4 | No write-ups are published yet | composed empty state, dashed `--line-strong`, one sentence | no | no | none |
| 5 | What to read instead | link card grid, 2 across | no | no | none |
| 6 | Closing band | the shared `ClosingBand` | no | no | BOOK, CHAT |

Six families, all distinct, none repeated on this page. 0 marquees, 0 eyebrows, 0 pinned scenes. The
two CTA pairs are the masthead's and the closing band's, which is the pattern every other inner page
already runs; the empty state's own `BookLink`/`ChatButton` pair was **removed**, because three
copies of the same two buttons on one page is the repetition rule 3 exists to stop.

### The constraint that shaped the whole page

**There are no case studies, and none may be invented.** `PRODUCT.md` lists them under "absent, and
must not be fabricated by any future work", rule 6 bans invented brands outright, and every entry in
`src/content/testimonials.ts` is still `placeholder: true`. So this is not a redesign that waits for
content: it is a page built to be worth reading while the content does not exist, and to fill in
without a rewrite when it does.

What it shows instead is real. The anatomy of a write-up is a promise about format, not a claim about
results. The counts in the link cards are `guides.length` and `services.length`, counted from
`src/content` at build time, which is the only kind of number rule 8 allows on screen. The video slot
is the one piece of evidence that needs nobody's permission to produce.

### Where the design guidance was followed, and where the project overrode it

Four skills were asked for and all four were read. Three of them are written for a generic premium
landing page and collide head-on with this design system. Contract rule 1 puts the taste-skill bans
and the brand anchors above generic design-system output, and `MASTER.md` is explicit, so the project
won every collision:

| Guidance | Why it was not followed |
| --- | --- |
| `rounded-full` pills, `rounded-[2rem]`, concentric "double-bezel" radii | `MASTER.md:92`: 14px everywhere, including nested elements. "No pills, no sharp corners, no other radius anywhere." |
| Radial mesh gradients, glowing orbs | No gradients outside the hero scrim and the guarantee veil |
| `backdrop-blur` cards | No `backdrop-filter` anywhere except the scrolled nav bar |
| `blur-md` resolving to `blur-0` on scroll entry | Rule 10: transform and opacity only. Blur is neither |
| Eyebrow pill badges above every heading | Rule 6 bans pills and section-number eyebrows; the eyebrow budget is `ceil(sections/3)` and this page spends none |
| Ultra-light icon strokes | One icon family site-wide, Phosphor duotone |

What did carry over, because it agrees with the house system rather than fighting it: strong ease-out
easing (`--motion-ease` is `cubic-bezier(0.22, 1, 0.36, 1)`, already a strong ease-out), transitions
that name their exact properties instead of `all`, hover gated behind `(hover: hover)`, press feedback
at `scale-[0.98]`, a stagger in the 30 to 80ms band (the house token is 70ms), and hierarchy built
from weight, size and leading together rather than size alone.

### Hover, and the rule it had to get past

DESIGN.md's Hover Earns It rule reserves a pointer response for things that go somewhere, so the four
anatomy cards, which are not links, would normally get nothing. They use `HoverFill`, the cursor-aware
fill built for the About stats cells, which is the one existing exception and was spent on the owner's
instruction for exactly this case: non-link cells that still answer the pointer. No new mechanism, no
second vocabulary. The link cards keep `cardLink`, where the border firms to `--line-strong` and the
shadow steps to `--shadow-lift`, both gated and both naming their two properties.

### 21st.dev

Searched first, per CLAUDE.md. Eight results, none adopted: every one is a landing-page hero with a
sticky navbar, gradient headline text, a dashboard mockup and glow effects. Stripping the gradients,
the glows, the pills and the second accent leaves nothing of the component, and this page needs an
inner-page masthead rather than a landing hero. The closest by intent, an empty-state kit, is a shadcn
component against token names this repo does not have, and the empty state here already exists on our
tokens.

### Measurements

Read off the prerendered `.next/server/app/case-studies.html`. No browser on this machine: the
sandbox has no loopback networking, as recorded in Tasks 53 to 55.

Heading outline, which is the scannability claim made concrete. The page went from an h1 and nothing
else to a labelled structure a reader can skim in five stops:

| Level | Heading |
| --- | --- |
| h1 | Case studies |
| h2 | What each write-up contains |
| h3 | What the site was doing / What we found / What we changed / What it took |
| h2 | The same site, before and after |
| h2 | No write-ups are published yet |
| h2 | What to read instead |
| h2 | Want us to look at your site? |

One h1, no level skipped, every section named by what it holds.

| Assertion | Result |
| --- | --- |
| masthead photograph | `/site_images/services/emergency.jpg` through `next/image` |
| sections | 5, plus the masthead header and the closing band |
| anatomy cards | 4, each with a `HoverFill` |
| link cards | 4, all carrying `cardLink`'s gated hover |
| video slot | present, still "Not filmed yet" |
| dashed empty states | 2: the status panel and the video slot's own box |
| "Fix my site" on the page | **2**, down from 3: masthead and closing band only |
| counts printed | 37 guides, 32 services, both counted from `src/content` |

Contract bans, grepped against the rendered markup rather than trusted:

| Ban | Result |
| --- | --- |
| `backdrop-blur` | 0 |
| radius other than 14px | 0 |
| `blur-*` filters | 0 |
| `rounded-full` | 4, all of them `HoverFill`'s internal fill circle. That is the shape of a radial fill, not a pill-shaped control, and it is the component already shipped on `/about/`. Not a shape-lock violation |
| `gradient` | 4, all of them `ClosingBeams`' SVG `radialGradient` defs inside the shared closing band, which 11 pages already render |

Contrast, computed from the token values. The anatomy card is the only new pairing, and it has two
states because `HoverFill` repaints the card from `--surface` to `--surface-2` under the pointer, so
both were checked:

| Pairing | Resting | Hovered | Needs |
| --- | --- | --- | --- |
| ember icon | 5.93:1 | 5.47:1 | 3.0 |
| h3, `--text` | 16.14:1 | 14.90:1 | 4.5 |
| body, `--muted` | 7.35:1 | 6.79:1 | 4.5 |

Motion: `Stagger` ladders the four cards at the house 70ms step, `Section` puts `reveal-self` on each
h2, and `LinkCards` brings its own `reveal` on its `ul`. One animated owner per ancestor chain is
preserved, because `Section` does not carry `reveal` itself. `HoverFill` animates `scale` only, behind
`(hover: hover)`, and drops its transition under reduced motion rather than pinning every card filled.

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, `npm run build` green at **99 routes**.

**Not run, and not claimed:** axe, Lighthouse, the 375/768/1024/1440 screenshot pass, and any measured
LCP for the new masthead photograph on this route. The masthead is the first large image this page has
ever loaded, so that measurement is the one that matters most here.

## v4 / the backing plate on the error grids (Task 57)

Recorded before coding (rule 3). No new section and no new layout family: this is a hover treatment on
the card grid that two existing sections already render.

| Where | Section | Change |
| --- | --- | --- |
| `ServiceTemplate.tsx` (32 pages) | "Errors we fix here" | the grid gains the backing plate |
| `GuideTemplate.tsx` (37 pages) | "Other errors we fix" | the same |

The other four `LinkCards` call sites (the hub's "What we do here", the city page's service list, the
about hub grid, the case-studies "What to read instead") are **unchanged** and keep the plain
`cardLink` hover.

### The effect

An ember-tinted plate sits behind each card at the same size and radius. On hover the card slides 7px
up and to the left off it, so the plate shows along the bottom and right edges, like a sheet of paper
lifted off a coloured one underneath. `translate` only, so no layout moves and nothing reflows.

Chosen from a set of four shown to the owner as an artifact, after an earlier set of five
cursor-tracking effects was rejected outright. What separated this set: all four were pure CSS, where
three of the five cursor variants needed a new client component and one needed artwork for 32 services.

The plate is `bg-accent-tint`, which is the existing `color-mix(in srgb, var(--accent) 10%, var(--surface))`
token, with a `border-accent-text/35` edge so it reads against `--bg` without a second hue. One accent
throughout. It is `aria-hidden` and carries no text, so it has no contrast requirement of its own.

Motion: `transition-[translate]` named explicitly rather than `transition-all`, at the card's existing
200ms, behind `(hover: hover)` so a tap cannot leave a card parked off its plate. Under reduced motion
`motion-reduce:translate-none!` pins the card on the plate and the hover becomes the border and shadow
step alone, which is the state the grid has today.

**Tailwind v4 note that decides the implementation:** `-translate-x-*` writes to the standalone
`translate` property, not to `transform`. A `transition-transform` here would never animate, which is
the bug recorded against the hover work in commit `87999e8`. The transition names `translate`.

### Why a variant component rather than a prop on the grid

`LinkCards` is shared by six sections, and only two of them want this. The composition rule is to
avoid teaching a shared component a second visual mode through its public API, so the two call sites
now render `ErrorCards`, an explicit variant that owns both the plate and the mapping.

That mapping is the other half of the reason. Both templates had the same five lines typed out, turning
a guide into a card: `routes.guide(slug)`, the title, the first symptom, the error string and the
urgency mark. One component now holds it, and both templates drop their `LinkCards` and `urgencyIcon`
imports; the service template drops `routes` as well, since that grid was its only use of it.

`plate` survives as a boolean inside `LinkCards`, which is the mechanism, while `ErrorCards` is the
API. One internal flag consumed by one named variant is the thing the rule is protecting against
becoming a pile of them.

### The risk, and why it is smaller here than on the artifact

Ember behind every card is a lot of accent on a page full of them. These two grids are the right place
for it: a service page lists at most four guides and a guide page at most three siblings, so the plate
appears a handful of times rather than twelve. The hub's "What we do here" grid, which can run eleven
services wide, is deliberately not included.

### Measurements

Read off the prerendered HTML and the compiled stylesheet in `.next/`. No browser on this machine, for
the reason recorded in Tasks 53 to 56.

Scope, which is the thing most worth proving here, since `LinkCards` is shared by six sections:

| Page | Plates | Sliding cards | Expected |
| --- | --- | --- | --- |
| `/wordpress-fix/critical-error/` (service) | 4 | 4 | yes |
| `/guides/500-internal-server-error/` | 3 | 3 | yes |
| `/guides/critical-error-on-this-website/` | 3 | 3 | yes |
| `/wordpress-fix/` (hub, control) | **0** | 0 | no |
| `/about/` (control) | **0** | 0 | no |
| `/case-studies/` (control) | **0** | 0 | no |

**101 plates across 48 prerendered pages**, and the plate count equals the sliding-card count on every
one of them, so no card ever has a plate it cannot slide off or a slide with nothing behind it. 31 of
the 37 guides render "Other errors we fix"; the other 6 are the only guide their parent service has, so
`siblings` is empty and the section does not render at all.

One false positive worth recording so the next person does not chase it: grepping for `bg-accent-tint`
alone finds the numbered step chips in "Safe things to try first", which have used that token since
Task 12. The plate is only the pairing `border-accent-text/35 bg-accent-tint`.

The compiled CSS confirms the Tailwind v4 behaviour this was built around:

```
-translate-x-\[7px\]:hover { --tw-translate-x: calc(7px * -1); translate: var(--tw-translate-x) var(--tw-translate-y) }
border-accent-text\/35    { border-color: color-mix(in oklab, var(--accent-text) 35%, transparent) }
```

The utility writes to the standalone `translate` property, never to `transform`, which is why the
transition names `translate`. The border emits a flat `var(--accent-text)` rule first and the
`color-mix` second, so a browser without `color-mix` gets a solid ember edge rather than no edge.

`tailwind-merge` resolved the two transitions as intended: the card's class list carries only
`transition-[border-color,box-shadow,translate]`, with `cardLink`'s original
`transition-[border-color,box-shadow]` replaced rather than duplicated.

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, `npm run build` green at **99 routes**. `eslint` passing is load-bearing here: it is what
proves the three imports the refactor orphaned (`LinkCards` and `urgencyIcon` in both templates, plus
`routes` in the service template) were actually removed.

**Not run, and not claimed:** axe, Lighthouse, the 375/768/1024/1440 screenshot pass, and the one check
that matters most for this change, which is whether a card sliding 7px left at the grid's left edge
reads correctly against the 16px page gutter at 375. Transform overflow does not create a scrollbar, so
this should be safe, but it is reasoned rather than measured.

## v4 / "Most urgent problems" becomes a ranked list (Task 58)

Recorded before coding (rule 3). The hub's third section changes layout family.

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 3 | Most urgent problems | **was** a 2-up card grid with an optional full-width lead panel | no | no | none |
| 3 | Most urgent problems | **now** ruled rows, ranked, each carrying its urgency mark, title, error string and caret | no | no | none |

### Why: the family had quietly collided

Reported as "looks boring, un-designed". It is, and the cause is structural rather than cosmetic.

The P5 entry above records this page as a photographic masthead, then a **row directory**, then a card
grid, then the closing band. Four families, no repeat. **Task 9 turned the directory into
`LinkCards`**, and nobody re-checked rule 3 against the section underneath it. From that point the hub
has run two card grids back to back, differing only in column count: four across for "What we do here"
at `HubTemplate.tsx:74`, two across for "Most urgent problems" at `:96`. The second one reads as a
weaker copy of the first because structurally that is what it had become.

Moving it to rows restores the alternation the page was designed with and gives rule 3 its clean
answer again. It also costs nothing elsewhere: ruled rows are not otherwise on a hub page.

### Why it also looked unfinished up close

It was never `LinkCards`. It was a hand-rolled `<Link className={cardLink}>` carrying a title and a
mono line, which is a bordered box with two text nodes in it. Against the cards in "Errors we fix
here" it was missing the urgency mark, the summary, the caret and, since Task 57, the backing plate.

Three further defects, all now fixed by the change rather than patched:

- **`items-start` on the grid** (`:96`), not `items-stretch`. Every card was its own content height, so
  with one-line titles and zero to two mono lines the bottoms came out ragged. In a ruled list variable
  row height is the normal reading, so the defect stops being one.
- **No caret.** Every other link card on the site ends with the "go there" mark; this one had none, so
  the only hover signal was the title changing colour.
- **The ranking was invisible.** The section is named "Most urgent problems" and is genuinely sorted by
  `urgencyRank`, but nothing on screen expressed it. The old comment argued the rank should not be
  printed, which is right about the *word* "critical" (it restates the heading) and wrong about the
  *shape*: `urgencyIcon` exists for this, three marks in one accent, and both sibling grids use it. A
  critical error and a standard one rendered identically.

### What the change drops, and why that is a gain

`leadWide` is gone. It gave the full spine to the hub's worst problem when that problem was both
critical and carried a literal error string, which was weighting done with area because a grid has no
other way to rank. **A ranked list ranks by position**, so first place does the job the wide panel was
doing, and the hub stops needing a rule about when a panel is allowed to be wide. Only the security hub
ever qualified.

No numerals on the rows. Rule 6 bans "Step 1 / Stage 2" labels, and the urgency mark plus the ordering
already carry the rank; a numeral beside them would be a third statement of the same fact.

The list is an `<ol>`, because it is genuinely ordered and the order is the information.

### Hover

The row is the link. The title goes ember, the caret slides 4px, and the row's own rule firms from
`--line` to `--line-strong`: three cues, no background change, so nothing shifts and no row needs a
negative margin to bleed a fill into the page gutter. Gated behind `(hover: hover)`, and the caret
carries `motion-reduce:translate-none!`. The backing plate is deliberately **not** carried over: it is
the card grids' hover language and a row is not a card.

### Measurements

Read off the prerendered HTML in `.next/server/app/`. No browser on this machine, as recorded in
Tasks 53 to 57.

| Hub | Rows | Urgency marks | Carets | Rows with a second line |
| --- | --- | --- | --- | --- |
| `/wordpress-fix/` | 6 | 6 | 6 | 6 of 6 |
| `/wordpress-security/` | 5 | 5 | 5 | 5 of 5 |
| `/wordpress-performance-migration/` | 4 | 4 | 4 | 4 of 4 |
| `/woocommerce/` | 2 | 2 | 2 | 2 of 2 |

Marks and carets equal the row count on every hub, so no row is missing either. `maintenance` and
`development` have no guides and render nothing here, unchanged. The section is an `<ol class="reveal
border-t border-line">`, and the old grid is gone from it: no `sm:grid-cols-2`, no `items-start`, no
`cardLink`.

### The thin-row problem, found by measuring rather than by looking

The first build of this list was correct and still read sparse: **only 20 of the 37 guides carry an
`errorText`**, and on the fix hub that meant four of six rows were a title and nothing else, which in
a ruled list is a lot of empty rule. The grid had the same gap and hid it better, because a card with
one line still looks like a card.

The fallback is the guide's first symptom, which is the same sentence the error cards already print as
their `summary`, so nothing is invented. It is set in the body face, not the mono: on this site mono
means a string the software actually prints, and a symptom is our sentence about the error rather than
the error's own words. That distinction is the reason the two lines are not interchangeable.

After it, every rendered row on all four hubs carries a second line: 8 error strings and 9 symptom
lines across 17 rows.

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, `npm run build` green at **99 routes**.

One mistake worth recording, because it will recur. The first edit put the new section comment in
`{/* ... */}` form directly inside `{topGuides.length > 0 && ( ... )}`. That is an **expression**
position, not JSX children, so the brace opened a block and the parse failed with `')' expected`. The
original code used a plain `//` comment there for exactly this reason. Inside `&& (`, comments are
`/* */` or `//`, never `{/* */}`.

**Not run, and not claimed:** axe, Lighthouse, and the 375/768/1024/1440 screenshot pass. The width
worth checking first is 375, where a long error string meets `line-clamp-1` beside a 24px mark and a
20px caret.

### Addendum to Task 57: the guardrail on `plate`

`LinkCards` serves six sections and two of them wanted the backing plate, so `plate` exists as an
internal boolean with `ErrorCards` as the named variant that consumes it. That is the right shape for
one variant and the wrong shape for three, so the rule is now written on the prop itself where an
editor shows it on hover rather than only here:

- **No template passes `plate`.** A section that wants it goes through a named variant: `ErrorCards`
  when it is showing errors, a new one when it is not. The decision about which sections get a
  treatment belongs with the thing being shown. The first template that writes `<LinkCards plate />`
  has put the component back to being a pile of visual flags.
- **A second visual variant replaces the boolean with a `variant` union** (`"plain" | "plate"`).
  Booleans do not compose: two is four states, three is eight, and most of them mean nothing, while a
  union keeps the illegal ones unrepresentable.
- **Three variants, or a card whose body differs rather than its dressing,** is where service cards
  and error cards stop being one component.

This is the same failure mode the hub page hit: Task 9 changed the directory to card grids and nothing
recorded that against the rule in P5, so the page ran two of the same family for several passes before
anyone noticed. A note costs nothing and is what stops the drift.

**One real defect fixed while adding it.** Inserting `ErrorCards` in Task 57 placed it between
`LinkCards`' long doc comment and `LinkCards` itself, so that comment, thirty lines covering the
no-three-across rule, the single-anchor decision and the reveal reasoning, was silently documenting
`ErrorCards` instead. Both blocks are back beside the function they describe. Nothing rendered
differently; it would have misled the next reader, which on a file this heavily commented is the
expensive kind of wrong.

`tsc` 0, `eslint` 0, content and motion checks clean, build green at 99 routes.

## v4 / the plate reaches the hub directory, and a correction (Task 59)

Recorded before coding (rule 3). No new section and no new layout family: the hub's "What we do here"
grid gains the backing plate the error grids got in Task 57.

| Where | Section | Change |
| --- | --- | --- |
| `HubTemplate.tsx` (6 pages) | "What we do here" | the service directory gains the plate, through a new `ServiceCards` variant |

### The correction, which is why this is allowed at all

Task 57 excluded this grid, in writing, with this reason: *"Ember behind every card is a lot of accent
on a page full of them... The hub's 'What we do here' grid, which can run eleven services wide, is
deliberately not included."*

**That was wrong, and the markup says so.** The plate is `absolute inset-0` with `rounded-[14px]`,
sitting behind a card that is `bg-surface`, opaque, at the identical box and the identical radius. It
is completely covered at rest. A plate becomes visible only when its own card slides 7px off it, so
**at most one is ever on screen, and only while the pointer is on it.** The fix hub now renders eleven
plates and a reader sees zero of them until they hover one.

The concern was reasoned from the token rather than from the geometry, and it cost this grid two
tasks' worth of being the odd one out. Worth remembering as a failure mode: "that colour is strong" is
not an argument until you have checked whether the colour is ever visible.

### Why a second variant component and not a flag at the call site

The rule written on `plate` in Task 57's addendum says a section that wants the plate goes through a
named variant: `ErrorCards` when it is showing errors, **a new one when it is not**. This section shows
services, so it is the second case, and the hub now renders `ServiceCards`.

It also takes the mapping with it. `HubTemplate` was turning a node into a card inline
(`href: n.path`, `n.title`, and the summary looked up through `getService(serviceIdOf(n.path))`), and
that knowledge now sits beside the treatment it goes with. The template drops its `LinkCards` and
`getService` imports; `serviceIdOf` stays, because the problem list still uses it.

**This does not trigger the union conversion**, and the distinction matters for whoever reads that rule
next. The rule converts the boolean when a **second visual variant** appears. This is a **second
consumer of the same variant**. There is still exactly one treatment, defined in exactly one place, and
two named components opting into it. Nothing about the plate is written twice, which is the whole point
of the single source of truth: adding a third consumer is one more small component, not one more flag.

The city page lists services too, but from `Service` objects rather than hub nodes, so it keeps its own
call and is the obvious third consumer if that section ever wants the same treatment.

### Measurements

Read off the prerendered HTML. Cards, plates and sliding cards in the directory section of every hub:

| Hub | Service cards | Plates | Sliding | Wide-last |
| --- | --- | --- | --- | --- |
| `/wordpress-fix/` | 11 | 11 | 11 | 0 |
| `/wordpress-development/` | 6 | 6 | 6 | 0 |
| `/woocommerce/` | 4 | 4 | 4 | 0 |
| `/wordpress-maintenance/` | 4 | 4 | 4 | 0 |
| `/wordpress-security/` | 4 | 4 | 4 | 0 |
| `/wordpress-performance-migration/` | 3 | 3 | 3 | 1 |

Every section consistent. **133 plates across the build**, up from 101. `/about/` and `/case-studies/`
still render **0**, so the four remaining plain `LinkCards` call sites are untouched.

One measuring trap, recorded because it cost a second pass: counting cards with an exact match on
`<li class="relative isolate"` under-reports by one wherever `wideLast` is true, because that li
carries `sm:col-span-2` as well. The performance-migration hub looked like a 2-cards-3-plates mismatch
until the regex matched on the prefix. The grid was correct the whole time.

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, `npm run build` green at **99 routes**.

**Not run, and not claimed:** axe, Lighthouse, and the 375/768/1024/1440 pass. The width to check first
is the fix hub at 1440, which is now eleven cards each able to slide 7px, and 375, where the leftmost
card slides into a 16px gutter.

## v4 / the problem grid stops being two-thirds dead (Task 60)

Recorded before coding (rule 3). No new section and no new layout family: home section 5 keeps its
searchable tile grid. What changes is what a tile shows at rest, plus one hover behaviour on the grid.

### The diagnosis, which is not what the report said

Reported as the tiles needing something interesting on hover. The hover was already doing three things
(the lift, the photograph scaling, the arrow travelling), all mirrored on `focus-visible`. The problem
is the resting state, and it is an asymmetry:

- **20 tiles are `critical`**: `row-span-2`, a photograph, a scrim.
- **32 are not**: flat `bg-surface`, two lines of text, no image, no mark.
- `urgency` has three values and only `critical` is visible. **`high` (13 guides) and `standard` (4)
  render identically to each other**, and the 15 service tiles carry no mark at all.
- **`errorText` is never shown**, on 23 of the 37 guides, despite already being indexed for search in
  `matchIndex.head` (`src/content/index.ts:68`). The literal string a visitor is staring at is the
  most recognisable thing this site owns and the tile was hiding it.
- The result count is `sr-only` (`TileGrid.tsx:108`) and the chips carry none, so nothing on screen
  says the grid holds 52 problems.

Two thirds of the grid was text on a flat panel. No hover fixes that, because a third of the audience
arrives on a phone and never triggers one.

### What changes

**At rest, visible to everyone:**

1. **The urgency mark appears on every guide tile**, all three levels, using the existing
   `urgencyIcon` (octagon / triangle / wrench): shape, never hue, so it stays off a colour-only
   indicator. It goes in the tile's existing top row beside the arrow, in flow, so no tile changes
   height.
2. **Service tiles carry a count instead.** A service tile is a family of errors rather than an error,
   so an urgency mark would be inventing data it does not have. `service.guideSlugs.length` is real
   and already in hand, so those 15 tiles read "6 errors in this family", which is more specific than
   the generic family symptom they showed before.
3. **The second line becomes the literal error string**, in `font-mono` like every other error string
   on the site, wherever a guide has one. Guarded against the case where it restates the title: the
   schema documents `title` as "the exact error phrase", so for several guides the two are the same
   sentence and printing both would be a duplicate line. Where there is no `errorText`, or it
   duplicates the title, `symptoms[0]` stays exactly as it was.
4. **The counts become visible.** The `sr-only` live region becomes a visible one, so it serves both,
   and each category chip shows how many problems it holds.

**On hover and focus, for pointer users:**

5. **The grid focuses on what you point at.** Every tile except the one under the pointer drops to
   50% opacity. One new `@utility tile-focus` in `globals.css`, which is the house pattern for a
   selector Tailwind cannot express (`btn-fill`, `marquee-fade` and `guarantee-mask` are already
   there).
6. **The error string goes ember** on the hovered or focused tile. Colour only. It is the recognition
   payoff: the literal string lights up as you reach for it.

### Three constraints that shaped the implementation

- **No tile may change height.** `auto-rows-[9rem]` plus `row-span-2` is what the Motion `layout`
  spring interpolates between (`TileGrid.tsx:133-139`); a hover that grows a tile fights the spring
  and reflows the grid. Everything added is in flow inside the existing box.
- **The dim applies to the `<a>`, never the `<li>`.** `motion.li` writes `opacity: 1` as an **inline
  style**, which beats any class, so dimming the list item cannot work. The anchor carries no inline
  opacity. This is the kind of thing that looks like a CSS specificity bug for an hour.
- **Tiles are pre-serialized ReactNodes.** `ProblemTiles` builds `node` at module scope and
  `TileGrid` renders it opaquely, so the client island cannot inspect or wrap a tile. That rules out
  JS-driven per-tile hover and rules in CSS, which is what this uses. No JS was added.

### 21st.dev

Searched first, per CLAUDE.md. Eight results, none installed. One mechanic was worth taking:
`Hover Reveal Cards` dims **and blurs** every card but the hovered one. The dim is right for a 52-tile
grid and the blur is dropped, because rule 10 is transform and opacity only. The rest were cursor-glow
and pixel-reveal variants, or `Expanding Cards`, which animates width and therefore layout.

### What this deliberately does not fix

32 tiles still have no image, and 16 of the 20 that do share 8 stock photographs, because only 4 real
captures exist in `public/screens/`. That is the content gap in `docs/image-todo.md` and it needs
`npm run capture`, which needs Docker. Giving the imageless tiles real information is the honest
mitigation; dressing them in more stock photography would not be.

### Measurements

Read off the prerendered `index.html` and its RSC payload. No browser on this machine, as recorded in
Tasks 53 to 59. Only 9 tiles are in the HTML body (the cap); all 52 tile nodes are serialized into the
payload, so the full set is countable there.

| Assertion | Result |
| --- | --- |
| tiles in the default view | 9, the cap |
| of those, carrying an urgency mark | 9 of 9 |
| second line is an error string / family count / symptom | 4 / 0 / 5, and exactly one per tile |
| mono error lines across all 52 | 23, matching the 23 guides that have an `errorText` |
| family-count lines across all 52 | 15, matching the 15 service tiles exactly |
| tiles printing their title twice | **0** |
| `tile-focus` on the grid | yes |
| `transition-[box-shadow,opacity]` per tile | 9 of 9 |
| visible count | "9 of 52 problems shown" |
| chip counts | Everything 52, Fixes 37, Security 8, Speed and migration 4, WooCommerce 3; the four categories sum to 52 |

The `@utility` compiled as intended:

```
@media (hover:hover) and (pointer:fine) {
  :is(.tile-focus:has(a:hover) a:not(:hover),
      .tile-focus:has(a:focus-visible) a:not(:focus-visible)) { opacity: .5 }
}
```

Two counting traps, both recorded because both wasted a pass:

- **The mark's class string is not unique to this tile.** `mt-0.5 size-5 shrink-0 text-accent-text` is
  also `Plans.tsx:71`'s check icon, which is on the same page, so grepping the document for it returns
  60 rather than 37. The sound counts are the scoped one (9 of 9 rendered tiles) plus construction:
  the mark is `guide ? <Mark/> : null` and the 15 family-count lines prove exactly 15 service tiles,
  which leaves the mark on the other 37.
- The tile anchor renders `href` before `class`, so a regex anchored on `<a class=` finds nothing.

### The contrast check caught a real failure before it shipped

The error string was going ember on hover on every tile. Measured, that is fine on a flat tile and
**fails on an image tile**:

| Pairing | Measured | Needs |
| --- | --- | --- |
| mono line `--muted` on `--surface` (flat tile) | 7.35:1 | 4.5 |
| mono line `--text` on `--surface-2` | 14.90:1 | 4.5 |
| mono line `--text` over `--photo-scrim`, brightest photo | 7.53:1 | 4.5 |
| ember `--accent-text` on `--surface` | 5.93:1 | 4.5 |
| ember `--accent-text` on `--surface-2` | 5.47:1 | 4.5 |
| **ember `--accent-text` over `--photo-scrim`** | **2.76:1** | **4.5** |
| chip count `--muted` on `--surface` | 7.35:1 | 4.5 |
| chip count `--on-accent` on `--accent` | 6.30:1 | 4.5 |
| visible result count `--muted` on `--bg` | 7.82:1 | 4.5 |

This is the same trap the scrim comment in `ProblemTiles.tsx` already records for `--muted` (2.55:1
there). The ember reward is now scoped to the flat tiles, verified: **0 image tiles carry it**. An
image tile keeps `--text` and already has its own reward, the photograph scaling behind the words.

The dimmed tiles land around 2.7:1 at 50% opacity. That is not a WCAG failure and not treated as one:
they are the tiles the visitor is explicitly not pointing at, the state is transient, pointer-only, and
reverts on leave. The hovered tile is always at full opacity.

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, `npm run build` green at **99 routes**. No JavaScript was added: the dim is a stylesheet
rule and everything else is server-rendered markup.

**Not run, and not claimed:** axe, Lighthouse, and the 375/768/1024/1440 pass. Two things need a real
browser. Whether the dim reads as focus rather than as the page greying out, which is a judgement no
contrast number settles. And whether the mark plus the arrow leave enough width for a two-line title
at 375, where the tile is a fixed 9rem that clips from the top.

## v4 / the plate becomes the card hover, and the flag goes (Task 61)

Recorded before coding (rule 3). No new section and no new layout family. Every link-card grid on the
site now shares one hover.

| Section | Before | After |
| --- | --- | --- |
| "Errors we fix here" (32 service pages) | plate | unchanged |
| "Other errors we fix" (31 guide pages) | plate | unchanged |
| "What we do here" (6 hubs) | plate | unchanged |
| **"What to read instead"** (`/case-studies/`) | plain | **plate** |
| **"What we work on"** (`/about/` hub grid) | plain | **plate** |
| **City service list** (8 city pages) | plain | **plate** |

### Why the rule written in Task 57 is being retired rather than followed

That addendum said a section wanting the plate must go through a named variant: `ErrorCards` for
errors, `ServiceCards` for services, a new one otherwise. Asked for the plate on a fourth section,
following it literally would have produced a third component whose **entire body is passing a flag**.
"What to read instead" is four hand-authored links to the guides, the free check, the pricing page and
the about page: no domain type, nothing to map, nothing to encapsulate. A named variant there is
ceremony, not composition.

The count is what actually settled it. Four of six sections wanted the treatment, which stops being a
variant and starts being the default. So the plate is now what a link card does, the `plate` boolean
is **deleted**, and with it the rule, because there is no longer anything to opt into. The two
remaining holdouts were about to be the only inconsistent grids on the site rather than deliberate
exceptions.

This is the cheaper direction in code as well: the change removes a prop, a conditional in three
places and roughly fifteen lines of documentation about when to pass it, and adds nothing.

**`ErrorCards` and `ServiceCards` stay**, and their reason for existing gets simpler rather than
weaker. They were carrying two jobs, a data mapping and a visual flag; they now carry only the
mapping, which is the half that always earned them. `ErrorCards` turns a guide into a card, five lines
that were typed out identically in two templates. `ServiceCards` turns a hub's child node into a card.
Neither mentions the plate any more.

### A name collision this also clears up

`parts.tsx` had **two unrelated things called `plate`**: `PageMasthead`'s `plate?: string`, which is
the mono box holding the literal error string on a guide's masthead, and `LinkCards`' `plate?:
boolean`, the backing plate. Same file, same word, different concepts. Deleting the boolean leaves one
`plate` in the file and the ambiguity goes with it.

### What does not change

The effect itself is untouched: an ember-tinted plate at the card's own box and radius, revealed when
the card slides 7px up and left, `translate` only, behind `(hover: hover)`, pinned by
`motion-reduce:translate-none!`. It remains invisible at rest, because the card is opaque at the same
box, so a grid of eleven shows no ember until a pointer lands on one. That geometry is why the
Task 57 worry about "a lot of accent on a page full of them" was wrong, as Task 59 recorded.

### Measurements

Read off the prerendered HTML. No browser on this machine, as recorded in Tasks 53 to 60.

| Page | Section | Plates | Sliding cards |
| --- | --- | --- | --- |
| `/case-studies/` | What to read instead | 4 | 4 |
| `/about/` | What we work on | 6 | 6 |
| `/wordpress-development/cities/bengaluru/` | city service list | 4 | 4 |
| `/wordpress-fix/` | What we do here | 11 | 11 |
| `/wordpress-fix/critical-error/` | Errors we fix here | 4 | 4 |
| `/guides/500-internal-server-error/` | Other errors we fix | 3 | 3 |

Plates equal sliding cards on every section, so no card has a plate it cannot slide off and none
slides off nothing. **174 plates across the build, up from 133**, the difference being the three
sections that were still plain.

The one layering question this raised is `/about/`, the only grid whose cards carry a photograph of
their own. Verified there: 6 list items, 6 plates, 4 banner photos at `-z-20` with their 4 scrims. No
collision, and the reason is structural rather than lucky. The plate is `-z-10` inside the **list
item's** `isolate`; the photograph and its scrim are `-z-20` and `-z-10` inside the **anchor's** own
`isolate`. Two separate stacking contexts, so the two `-z-10` layers never meet. The card stays opaque
either way, through `bg-surface` or through the photograph, which is what keeps the plate invisible
until the card moves.

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, `npm run build` green at **99 routes**.

The diff removes more than it adds: a prop, its fifteen-line contract, three conditionals, and the
`plate` mention in both variant components. `ErrorCards` and `ServiceCards` each lost a line and kept
their reason for existing.

**Not run, and not claimed:** axe, Lighthouse, and the 375/768/1024/1440 pass. The width worth checking
first is 375 on `/about/`, now the only place where a card that slides 7px also carries a photograph
cropped into it.

## v4 / the one card grid the plate missed (Task 62)

Recorded before coding (rule 3). No new section and no new layout family.

Task 61 made the plate universal "for every link card on the site". It was not. The city directory at
`/wordpress-development/cities/` renders its eight city cards **by hand**
(`CityTemplates.tsx:67-70`), using the `cardLink` class string directly rather than going through
`LinkCards`, so the sweep missed it and it became the only card grid on the site without the
treatment. Measured before the fix: `/cities/` had **0 plates against 10 cards**.

The hand-rolled card is deliberate and stays that way. Its own comment records why: the body is
city-shaped, an eyebrow over a large city name over the city's own description, rather than the
icon-title-summary `LinkCards` renders. The card is different; the hover should not be.

### The fix is to stop expressing the plate as markup

Copying the plate `<span>` and the four hover classes into the city card would have worked and would
have been the wrong answer: two copies of one treatment, free to drift, which is the thing the last
two tasks were spent removing.

Instead the plate moves out of `LinkCards`'s JSX and into a `@utility card-plate` in `globals.css`,
drawn as a `::before` on the **wrapper** rather than as an element in the card:

```css
@utility card-plate {
  position: relative; isolation: isolate;
  &::before { content: ""; position: absolute; inset: 0; z-index: -10; ... }
  @media (hover: hover) and (pointer: fine) { &:hover > a { translate: -7px -7px } }
  @media (prefers-reduced-motion: reduce)   { &:hover > a { translate: none } }
}
```

**It has to be the wrapper, not the card.** A `::before` on the anchor would slide away with the
anchor, leaving nothing behind to reveal. The plate must stay put while the card moves, so it belongs
to the element that does not move, which is the list item.

`cardLink` gains `relative` and `translate` in its transition list, so the anchor is ready to be slid
by whatever wraps it. Both consumers then opt in with one class on their `<li>`:

| Consumer | Change |
| --- | --- |
| `LinkCards` | `card-plate` on the `li`; **the plate `<span>` and the four hover classes are deleted** |
| the city card | `card-plate` on the `li`; nothing else |

Net effect: one definition, two consumers, zero duplicated markup, and the next hand-rolled card grid
gets the plate by adding one class rather than by copying anything.

### Why this did not surface in Task 61

Task 61 counted plates per page and found six sections consistent. Every page it checked went through
`LinkCards`. The city **hub** was never in the sample, only a city **page**, which does use
`LinkCards` for its service list and did have four plates. A verification that samples only the paths
the change touches cannot find the path it missed, which is the general lesson: the sweep should have
counted `cardLink` consumers, not `LinkCards` consumers.

### Measurements

Read off the prerendered HTML and the compiled stylesheet. Counted by the **wrapper** class this time
rather than by the plate's colour pair, which is the counting method that would have caught the gap in
Task 61.

| Page | `card-plate` wrappers | Old plate `<span>`s |
| --- | --- | --- |
| **`/wordpress-development/cities/` (the gap)** | **8** | 0 |
| city page, bengaluru | 4 | 0 |
| `/case-studies/` | 4 | 0 |
| `/about/` | 6 | 0 |
| `/wordpress-fix/` hub | 11 | 0 |
| service page | 4 | 0 |
| guide page | 3 | 0 |

The city hub went from 0 to 8. Zero old plate spans anywhere confirms the markup implementation is
fully retired rather than running alongside the utility. **182 wrappers across the build**, against
174 plate spans before, the difference being the eight city cards.

The utility compiled as written, including a fallback Lightning CSS added on its own:

```
.card-plate { isolation: isolate; position: relative }
.card-plate:before { content:""; z-index:-10; background:var(--accent-tint);
                     border:1px solid var(--accent-text); border-radius:14px; position:absolute; inset:0 }
@supports (color: color-mix(in lab, red, red)) {
  .card-plate:before { border-color: color-mix(in oklab, var(--accent-text) 35%, transparent) }
}
@media (hover:hover) and (pointer:fine) { .card-plate:hover>a { translate:-7px -7px } }
@media (prefers-reduced-motion:reduce)  { .card-plate:hover>a { translate:none } }
```

The solid `border: 1px solid var(--accent-text)` is the no-`color-mix` fallback and the `@supports`
block refines it, so an old browser gets a solid ember edge rather than no edge. The reduced-motion
rule is last, so it wins against the hover rule on a machine that matches both.

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, `npm run build` green at **99 routes**.

### The same syntax error, three times

Both edits in this task first shipped the section comment as `{/* ... */}` placed directly after
`return (` and after `(c) => (`. Both are **expression** positions, not JSX children, so the brace
opens a block and the parse dies with `')' expected`. This is the third time in this session, after
Task 58 in `HubTemplate`.

The rule, written here so it stops recurring: **a comment on the line after `return (`, `=> (` or
`&& (` is `//` or `/* */`, never `{/* */}`.** The braces are only for comments **between JSX
elements**, once a tag is already open. Every one of these three was caught by `tsc` before anything
ran, which is the system working, but it is three builds spent on one habit.

## v4 / semantic structure audit across all 98 prerendered pages (Task 63)

Prompted by a report of "two header divs" in the inspector. Every prerendered page was parsed with a
real tag stack, because the question each check answers depends on nesting rather than on counting.

### The two headers are correct, and here is why

There genuinely are two `<header>` elements on most pages. Only one is a landmark.

| Element | Where | Role |
| --- | --- | --- |
| `<header class="fixed inset-x-0 top-0 z-40 h-16" data-action-bar>` | direct child of `body` | **banner** |
| `<header>` from `PageMasthead` | inside `main`, and usually inside `article` | **none** |

ARIA in HTML gives `header` the banner role **only when it is not a descendant of `article`, `aside`,
`main`, `nav` or `section`**. The masthead is inside `main` on every page that renders one, so it is a
generic element that groups the page's introductory content, which is exactly what `header` is for.
Two header *elements*, one banner *landmark*. Nothing to fix.

Measured across all 98 pages with that rule applied:

| banner | contentinfo | main | scoped `<header>` | pages |
| --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | 92 |
| 1 | 1 | 1 | 0 | 6 |

**Zero pages with a wrong landmark count.** The six without a scoped header are the pages that render
no masthead: `/contact/`, `/free-site-check/`, `/preview/` and the three legal routes.

**A note on the audit script itself, because it produced a false positive worth not repeating.** The
first pass treated a `header` whose nearest sectioning ancestor was `main` as a banner, and reported
duplicate banners on `/guides/`, `/compare/` and `/case-studies/`. Those three put the masthead in a
plain `div` under `main` rather than inside an `article`, which changed the nearest *sectioning*
ancestor but not the answer: `main` is itself in the exclusion list. The rule is the exclusion list,
not the nearest sectioning element.

### What was clean

Across 98 pages: exactly one `h1` each, no skipped heading levels, no empty headings, no duplicate
`id` attributes, no `li` outside a list, no `dt`/`dd` outside a `dl`, no nested anchors, no anchor
inside a button or button inside an anchor, and every `section` carries an accessible name. Each page
has three `nav` landmarks (the mobile action bar, the breadcrumbs, the footer directory) and **all of
them are named**, which is what keeps three navigation landmarks navigable rather than ambiguous.

### Two real defects, both fixed

**1. `aria-controls` pointing at nothing, on the home FAQ.** `FaqTabs` set `aria-controls={panelId}`
permanently, but the answer panel lives inside `AnimatePresence` and is unmounted while collapsed, so
every closed question referenced an element not in the document. That is what axe's
`aria-valid-attr-value` fails on. Now `aria-controls={isOpen ? panelId : undefined}`: the attribute
exists only while its panel does, and `aria-expanded` carries the state either way.

**2. Nested `figure` on the home page, four of them.** A quote card in `QuoteCarousel` is a `figure`
whose `figcaption` is the attribution, and `VideoFrame` put its own `figure` and `figcaption` inside
it. One card, two figure roles, two captions.

Nested figures are **valid** HTML, which is why this is a judgement rather than a violation: a figure
may contain sub-figures. It is wrong here on meaning rather than on syntax. The video is part of the
testimonial, not a figure in its own right, so the card now renders `VideoSlotBox` in a `div` with the
caption as a `p`. The caption sentence moved to an exported `videoCaption(id)` so the frame and the
card still read from one definition rather than two copies of the same two branches.

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, build green at **99 routes**. Re-running the audit after the fixes: **nested figures 0,
dangling aria references 0, duplicate ids 0.**

**Not run, and not claimed:** axe itself. This audit is a static parse of the server-rendered HTML and
checks structure, not contrast, focus order or anything that only exists after hydration. The client
islands in particular (the tile grid, the carousel, the FAQ) render differently once opened, and only
a browser sees that.

## v4 / semantic audit against the Next 16 docs, and the metadata bug it found (Task 64)

Prompted by "is the structure semantic, and is the inspector showing wrong structure?". Read the
local docs at `node_modules/next/dist/docs/`, which `AGENTS.md` makes authoritative over nextjs.org
for 16.3.8, then audited the built output and the JSX independently.

### The inspector question, answered

**The inspection was of `npm run dev`, and that is most of the explanation.** Next injects elements in
development that do not exist in the production HTML:

| Element | What it is | In production? |
| --- | --- | --- |
| `nextjs-portal` | the dev error overlay and devtools indicator | **no** |
| `next-route-announcer` | the `aria-live` region announcing route changes, added at runtime | not in any prerendered file |
| HMR scripts, unminified module graph | development plumbing | no |

Both greps return **0 of 98** prerendered pages. `devIndicators.md:22` also records that the overlay
cannot be configured away: `devIndicators: false` hides the indicator, "Next.js will still surface any
compile or runtime errors".

Two further framework artifacts that look wrong and are not ours: `<div hidden><!--$--><!--/$--></div>`
as the first child of `body` is React's Suspense placeholder, and the `self.__next_f.push` script
blobs are the RSC payload. Worth knowing from `generate-metadata.md:1244`: on a **dynamic** route with
streaming metadata, "the resulting metadata tags are appended to the `<body>` tag" rather than the
head. Our pages are prerendered, so metadata is in `<head>`; metadata appearing at the foot of `body`
would be a signal that a route had gone dynamic.

### Structure: clean, verified twice

Zero content-model violations across all 98 pages and, independently, across all 88 `.tsx` files:
no `p` wrapping block content, no `button` holding non-phrasing content, no `span` wrapping a block,
no `ul`/`ol` with a non-`li` child, no nested anchors, no anchor inside a button, no `label` with two
controls, no heading inside a `p`/`span`/`button`. This is the decisive check for the question asked:
React renders JSX verbatim, so a `p` wrapping a `div` would reach the browser and be **repaired** on
parse, which is exactly how an inspector's DOM comes to differ from its source. There are none.

Landmarks hold at exactly 1 banner, 1 main, 1 contentinfo per page, with 1 `h1`, no skipped heading
levels, no duplicate ids, no dangling aria references and all three `nav` landmarks named.

### The real defect: 80 of 98 pages had no `og:site_name` or `og:locale`

`generate-metadata.md:1344-1348`: metadata objects from different segments are merged **shallowly**,
and "metadata with nested fields such as `openGraph` ... defined in an earlier segment are
**overwritten** by the last segment to define them."

The root layout set `openGraph: { siteName, type, locale }`. `pageMetadata` in `parts.tsx` set its own
`openGraph` with title, description, url and type, which **replaced** the root's object wholesale and
dropped `siteName` and `locale` with it. Every service, guide, city and comparison page goes through
that helper, so social cards on most of the site carried no site name and no locale.

Measured before: **og:site_name on 18 of 98 pages.** After: **98 of 98.**

The fix is the one the docs themselves recommend: a shared object, spread rather than restated.
`sharedOpenGraph` now lives in `src/config/brand.ts` beside the name it reads, and both the root
layout and `pageMetadata` spread it. The hub branch of `nodeMetadata` sets no `openGraph` at all and
therefore always inherited correctly; it is unchanged.

### Two validity errors that caused no DOM divergence, both fixed

Neither would have shown in the inspector, because no parser repairs them. Both are real invalid HTML.

- **`colgroup` before `caption`** in the comparison table (`CompareTemplate.tsx`). `caption` must be a
  table's first child. The two are swapped.
- **A decorative `span` inside a `dl`'s `div`** on `/about/`. A `div` child of a `dl` may contain only
  `dt` and `dd` groups, and `HoverFill` was rendering a span as its first child. Fixed the way the
  backing plate was in Task 62: the fill is now a `::before` in a `@utility hover-fill`, so the
  component emits one element instead of two. Verified: 4 wrappers, **0 decorative spans left**. The
  `fill` prop went with it, since both call sites used the default.

### Two things read from the docs that needed no change

- **`data-scroll-behavior`**: Next 16 stopped overriding `scroll-behavior` during client transitions
  (`version-16.md:961-983`). Only relevant if `html { scroll-behavior: smooth }` is set, and it is
  not; `globals.css` sets `scroll-padding-top` only, which is separately what `link.md:964-972` asks
  for under a sticky header. Nothing to do.
- **`priority` deprecated for `preload`** on `next/image` (`image.md:293`). `Photo.tsx` already uses
  `loading="eager"` with `fetchPriority="high"` and its comment already records the rename.

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, build green at **99 routes**. Re-ran both audit scripts: 0 content-model violations, 0
landmark errors, 0 dangling references.

One correction to the tooling: the landmark audit script was itself wrong in Task 63, reporting
duplicate banners on three pages. It tested the nearest *sectioning* ancestor; the actual rule is an
exclusion list of `article`, `aside`, `main`, `nav`, `section`, and `main` is in it. Script corrected,
and it now reports clean.

**Not run, and not claimed:** axe, Lighthouse, and loading either server in a browser to diff the dev
and production DOMs directly. The sandbox has no loopback networking. Everything above about the dev
DOM is read from Next's own source rather than observed.

## v4 / `<article>` stops being the page wrapper (Task 65)

Asked why every page's main content is wrapped in `<article>`, and whether that is sound. It was not.
`<article>` had become the generic layout box carrying `page` and `pageY`, on **94 of 98 pages**.

### What the element means

The HTML spec: "a complete, or self-contained composition ... **in principle independently
distributable or reusable**, e.g. in syndication." It maps to ARIA `role="article"`, which screen
readers announce and some, JAWS among them, give a dedicated key to jump between.

Measured against that definition:

| Template | Pages | An article? |
| --- | --- | --- |
| `GuideTemplate` | 37 | **yes**, a written guide to one error is exactly this |
| `CompareTemplate` | 3 | **yes**, defensibly: a neutral comparison document stands alone |
| `ServiceTemplate` | 32 | no, a landing page for a service |
| `HubTemplate` | 6 | no, a directory of services |
| `CityTemplates` (hub + cities) | 9 | no, listing and landing pages |
| about, case-studies, 3 legal routes, preview, `LegalPending` | 7 | no |
| `FixPan` panels | home | no, and worse: five of them |

So about fifty pages announced "article" for something that is not one, and the home page announced
five separate articles for what is a single five-step process.

It was also inconsistent with itself. `/compare/`, `/contact/`, `/free-site-check/`, `/guides/` and
`/pricing/` already used a plain `div` for the identical job, so the five correct pages read as the
exceptions.

Nothing about it was broken, and there is no SEO cost either way: structured data does that job and
every route already emits its own JSON-LD. The cost is that a hub directory is announced as a
self-contained composition, which is simply untrue.

### What changed

`<article>` stays where the content really is one: **37 guides and 3 comparisons**. Everywhere else
the wrapper only ever carried layout classes, so it is a `div`; `main` already supplies the landmark
and nothing else was relying on the element.

**The fix rail became an ordered list.** Diagnose, Back up, Repair, Verify, Harden is a sequence and
the order is the information. `FixRail`'s track is now an `ol` and `FixPan`'s panels are `li`, where
before they were five sibling `article` elements telling assistive tech the opposite: five unrelated
compositions that happened to sit in a row. `FixPan` is `FixRail`'s only consumer, so the track could
change without touching anything else, and no motion changed: the rail still drives `scrollLeft` on
the same scroller.

### Measurements

| | Before | After |
| --- | --- | --- |
| Pages containing an `<article>` | 94 of 98 | **40 of 98** |
| Breakdown | every template but five pages | 37 guides, 3 compares, **0 unexpected** |
| Home fix rail | 5 `<article>` in a `div` | 1 `<ol>`, 5 `<li>`, 0 `<article>` |

Both semantic audits re-run and still clean: 0 content-model violations, 0 landmark errors, 0 heading
problems. In particular the new `ol` passes the `ul`/`ol`-with-a-non-`li`-child check, and the `li`
elements pass the `li`-outside-a-list check.

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, build green at **99 routes**.

One note on how this was done, since it was a blanket textual replace of `<article`/`</article>`
across ten files: the only risk was rewriting the word inside a prose comment, and `GuideTemplate`'s
`id="guide-article"` and its doc comment both sit in a file that was deliberately not in the list.
Grepped after, nothing mangled.

**Not run, and not claimed:** axe, or a screen-reader pass to hear the difference. The change is
reasoned from the spec and verified in the markup.

## v4 / the backing plate inverts: lifted at rest, settles under the pointer (Task 66)

One change, in the `card-plate` utility. All **182 wrappers** across the build follow it with no call
site touched, which is the whole point of having moved the plate into CSS in Task 62.

| | Before | After |
| --- | --- | --- |
| At rest | card flush on its plate, plate completely hidden | card 7px up and left, **plate showing along the bottom and right edges** |
| Pointer / focus | card slides off, plate revealed | card settles back down flush, plate hidden |
| Touch | **nothing at all**, the effect needed a pointer | the resting offset, same as everyone else |

### Why the inversion is the better way round

**Reach.** The effect previously existed only under a fine pointer, so a phone saw a plain card and
nothing else. The resting offset now sits outside the hover query, so every visitor sees the design
and the hover is the reward rather than the whole idea.

**Direction of travel.** A card that drops *under* your finger answers the press. A card that jumps
*away* from it does not. Inverted, the motion agrees with the gesture.

### The cost, stated plainly

**Ember is now visible on every card at rest**, as a 7px L along two edges, where before it appeared
one card at a time and only under the cursor. On the fix hub that is eleven ember slivers at once.
This is the thing Task 57 worried about and Task 59 dismissed, and the dismissal was correct **only
while the plate was hidden at rest**. That premise is now gone, so the worry is live again: this is
the largest amount of accent the site has ever shown at once, against a one-accent lock that reserves
ember for display words and single marks.

It is still one accent and still the existing `--accent-tint` token, so no rule is broken outright.
But if the hub pages read as busy, the dial to turn is this one: either a smaller offset, or a plate
closer to `--surface-2` with the ember kept only in its border.

### The cascade, verified in the compiled stylesheet

```
.card-plate>a                       { translate: -7px -7px }   /* resting, every device */
.card-plate:has(a:focus-visible)>a  { translate: none }        /* keyboard, no media gate */
@media (hover:hover) and (pointer:fine) { .card-plate:hover>a { translate: none } }
@media (prefers-reduced-motion:reduce)  { ...both selectors   { translate: -7px -7px } }
```

Three things that had to be in that order and are:

- **The resting offset carries no media query**, so touch gets it.
- **Focus sits outside the hover query.** Focus arrives from a keyboard, which a device without a
  fine pointer still has; gating it behind `(hover: hover)` would have denied the response to anyone
  tabbing on a tablet. This was wrong in the first version of this change and corrected before it
  shipped.
- **Reduced motion comes last and wins**, pinning the card at its resting offset so the pointer
  changes nothing and no movement happens at all. The composition survives; only the motion goes.

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, build green at **99 routes**. Wrapper count unchanged at 182, since nothing but the
stylesheet moved.

**Not run, and not claimed:** axe, and any judgement about how eleven ember slivers actually look on
a hub page at 1440. That one needs eyes on a browser and is the thing most likely to want tuning.

## v4 / the inner-page banner goes full bleed (Task 67)

`PageMasthead` was a rounded card inside the 1200px spine: `rounded-[14px]`, `shadow-card`, the
photograph constrained to 1152px with a gutter either side. It is now a band that runs to both window
edges, with the words still on the spine. One change in the shared component reaches **90 pages**, the
8 template families that render a masthead.

| | Before | After |
| --- | --- | --- |
| Photograph and scrim | 1152px, inside the gutters | **window width** |
| h1, plate, lead, actions | the band's own padding | the same 1152px spine as the rest of the page |
| Shape | `rounded-[14px]`, `shadow-card` | neither |
| `sizes` | `bannerSizes`, the spine hint | `100vw` |

Text stays on the spine deliberately. A headline running to the window edge at 1440 abandons the
measure and the one left edge every other section on the page shares; the band bleeds, the words do
not. The inner wrapper is the `page` class string, so it cannot drift from the spine it is matching.

The radius and the card shadow went with the card shape. A band that meets the window has no corners
to round and no edge for a card shadow to sit against, which is why the home hero has been unrounded
since Task 25. This is not a break of the 14px shape lock: there is no visible corner left to be
sharp.

### The breakout, and the scrollbar trap under it

```css
@utility full-bleed { width: 100vw; max-width: 100vw; margin-inline: calc(50% - 50vw) }
```

Half the container's width minus half the viewport's, as a negative margin on each side, lands the
element exactly on the window from inside a centred parent.

**`50vw` counts the scrollbar.** On any page that scrolls vertically, which is all of them, the
viewport's *content* box is narrower than `100vw` by the scrollbar's width, so this overshoots by
about 15px on Windows and raises a horizontal scrollbar, which contract rule 12 forbids outright.
`body` now carries `overflow-x: clip` for it.

**Clip and never hidden.** `overflow: hidden` would make the body a scroll container, and every
`position: sticky` on the site resolves against the nearest scrollport: the service and guide reading
rails both stick at `top-28` and would have silently stopped. `clip` establishes no scroll container,
and `overflow-x: clip` with `overflow-y: visible` is a legal pair that leaves the y axis alone, since
the substitution rule only fires when one axis is `visible` and the other is neither visible nor clip.

### `bannerSizes` is deleted

It described the spine, which the banner no longer occupies, so it was dead the moment the photograph
went to `100vw`. Left in place it would have been a loaded gun: a `sizes` hint that reads correct,
names the right token, and is wrong about the box by a factor that grows with the window. Its own doc
comment recorded a 2.5x over-fetch shipped once from exactly that drift. The example in
`src/components/motion/README.md` moved to `sizes="100vw"` with it.

### Measurements

| Assertion | Result |
| --- | --- |
| Mastheads carrying `full-bleed` | **90** |
| Each with `sizes="100vw"` and an inner `mx-auto w-full max-w-page px-4 md:px-6` | yes, on service, guide and about samples |
| Pages with a scoped `<header>` but no full bleed | **2**, and both correct: `/guides/` and `/compare/` render their own text-only split headers and were never `PageMasthead` consumers |
| `bannerSizes` references left | 0 |

Compiled output:

```
.full-bleed { width:100vw; max-width:100vw; margin-inline:calc(50% - 50vw) }
body { ...; overflow-x:clip }
```

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, build green at **99 routes**.

**Not run, and not claimed:** axe, and the 375/768/1024/1440 pass, which is the one this change most
needs. Three things want eyes on a browser: that no horizontal scrollbar appears at any width despite
the `100vw` band, that the sticky reading rails on the service and guide pages still stick now that
`body` is `overflow-x: clip`, and whether a 1440-wide photograph still reads at `100vw` when the
library was shot for a 1152px box. The last one is a likely follow-up: a band twice as wide crops the
same frame harder.

## v4 / the breadcrumbs move onto the hero, and the photograph settles (Task 68)

Two changes to `PageMasthead`, reaching the same **90 pages** Task 67 did.

### Breadcrumbs inside the band

They sat above the band on the page background, which left a strip of empty page between the header
bar and the hero and gave the band no top edge of its own to hold. They are now the band's first row,
on the photograph, with the headline block pushed to the foot by `mt-auto`.

Nine call sites stopped rendering `<Breadcrumbs>` and pass `crumbs` to the masthead instead, so the
page files no longer decide where the trail goes. Five keep rendering it themselves, correctly:
`/compare/`, `/contact/`, `/free-site-check/`, `/guides/` and `/legal/guarantee/` have no masthead to
put it in.

**Moving it onto an image was not a relocation, it was a recolour, and the reason is measured.**
Breadcrumbs were `--muted`, and `--muted` over `--photo-scrim` is **2.55:1**, the exact pairing
`PageMasthead`'s own comment already records as failing. Two more pairings were ruled out on the way:

| Candidate | Over the scrim | Verdict |
| --- | --- | --- |
| `--muted`, the page tone | 2.55:1 | fails body text |
| `--accent-text` for the hovered crumb | 2.76:1 | fails, same trap as Task 60's tile |
| `--on-photo` | **6.58:1** | used |

The page tone lifts the current crumb from `--muted` to `--text`. That trick has no equivalent here,
because **`--on-photo` and `--text` are the same value**: both ends would be the same white. So on a
photograph every crumb is `--on-photo` and the current page is marked by **weight**, with links
**underlining** on hover rather than changing colour. Nothing in the trail now depends on a colour
difference that the scrim cannot carry.

`tone` is a union, `"page" | "photo"`, and not a boolean. That is the rule this file already carries
on the plate: two named states rather than a flag that invites a third.

### The photograph settles

`hero-settle` eases the band's image from `scale: 1.06` to its own box over **1.2s** on load, then
holds. Scale only, cropped by the header's `overflow-hidden` while it runs, and `animation: none`
under reduced motion.

**On load rather than on hover, and that was the one real decision here.** The band is not a link,
and DESIGN.md reserves a pointer response for things that go somewhere; a hero that reacts to the
cursor claims to be clickable and is not. Hover also reaches nobody on a phone, which is where this
audience arrives mid-emergency, so an entrance plays for everyone and a hover would have played for
roughly half.

1.2s rather than the site's 0.5s standard, deliberately. This is the largest paint on the page and a
half-second zoom across a 1440px band reads as a lurch; the slower curve reads as the image settling
while you take in the headline. The `--motion-ease` curve is the site's one easing, unchanged.

### Measurements

| Assertion | Result |
| --- | --- |
| Pages with breadcrumbs inside the hero `<header>` | **90** |
| Pages with breadcrumbs still on the page body | 4 prerendered, plus `/contact/`, which is dynamic and so not in the static output |
| Pages with both | **0** |
| Hero images carrying `hero-settle` | **90** |
| Rendered nav tone | `text-sm text-on-photo` |
| Rendered crumb link | `hover:underline hover:underline-offset-4`, no colour change |

Compiled output:

```
@keyframes hero-zoom { 0% { scale: 1.06 } }
.hero-settle { animation: hero-zoom 1.2s var(--motion-ease) both }
@media (prefers-reduced-motion: reduce) { .hero-settle { animation: none } }
```

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, build green at **99 routes**. The eight files that stopped rendering `<Breadcrumbs>` had
their now-unused imports pruned, which `eslint` passing is what proves.

**Not run, and not claimed:** axe, and the 375/768/1024/1440 pass. Three things want a browser. That
the settle does not hurt LCP, since the image it animates is the LCP element on about 90 routes and
paints at 1.06 on the first frame. That the breadcrumbs stay legible against the brightest frames in
the library rather than only against the measured average. And whether the band's minimum height
still holds now that a breadcrumb row sits above the headline inside it.

## v4 / the hero meets the header (Task 69)

Reported from a screenshot: a strip of page background between the fixed bar and the top of the hero
band. Measured, it was **32px at base and 48px from md**, on all 90 masthead pages.

### Why it was there, and why it only became wrong now

`pageY` is `pt-24 pb-8 md:pt-28 md:pb-12`. Its own comment records the arithmetic: the bar is `fixed`
and 64px, pages wanted 32 and 48 of their own breathing room, so the constant is those numbers with
the 64 they have to clear added on. 96 and 112. That is correct **when the first thing under the bar
is text**, which it was for every page when the constant was written.

A full-bleed band is not text. Breathing room above a picture that runs to both window edges is not
spacing, it is a seam. And it was invisible until Task 67: inside the 1200px spine the gap read as
the page gutter continuing upward, so nothing looked wrong until the band went to the window edges
and the strip became a band of its own.

### The fix

`pageYMasthead`, the bar's height and nothing else:

```
pageY          = pt-24 pb-8 md:pt-28 md:pb-12     unchanged, for pages that open on text
pageYMasthead  = pt-16 pb-8 md:pb-12              64px, so the band's top edge meets the bar's
```

The band keeps its own `py-6 sm:py-10 md:py-14 lg:py-16`, which is what holds the breadcrumbs clear
of the bar now that they sit inside it (Task 68).

A second constant rather than a negative margin on `PageMasthead` cancelling the difference. The
negative margin would have been one edit instead of eight and is the worse answer: it encodes
`96 - 64` and `112 - 64` as literals in a second file, so changing `pageY` would move every masthead
by a silent amount with nothing failing. Two named constants say which kind of page each is for.

### Measurements

| Group | Pages | Top padding |
| --- | --- | --- |
| With a full-bleed band | **90** | `pt-16 pb-8 md:pb-12`, every one |
| Without | 6 | `pt-24 pb-8 md:pt-28 md:pb-12`, unchanged |
| No `page` wrapper at all | 2 | the home page, whose sections carry their own container, and `/preview/`, which has its own width |

The six that keep the original padding are the right six: `/compare/`, `/free-site-check/`,
`/guides/` and the three legal routes all open on text under the bar, where 32 and 48 of clearance is
what they were always asking for.

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, build green at **99 routes**.

### The option not taken

The bar's backdrop is a `motion.div` whose **opacity is driven by scroll** (`NavBar.tsx:84`), so at
the top of a page it is transparent and only frosts once you move. That means the band could run
underneath it to `y: 0` rather than stopping at 64, and the photograph would show through the bar
until the first scroll, which is the shape most SaaS heroes take and which this nav is already built
for. Not done, because the report asked for the hero to start immediately after the header and that
is what "after" means. It is a one-line change to `pageYMasthead` if the fuller version is wanted,
plus a check that the logo and the menu button hold their contrast against a photograph instead of
against `--bg`.

**Not run, and not claimed:** axe and the 375/768/1024/1440 pass. The width to check first is 375,
where the band now starts 64px from the top of the document and the breadcrumb row inside it sits
directly under the bar.

## v4 / the header height becomes one number (Task 70)

Asked to make the bar taller. It is **64px to 80px**, and the work was not the 16px: it was that
**seven values were keyed to 64 and none of them said so.**

### What was derived from a literal

| Where | Was | Now |
| --- | --- | --- |
| `NavBar.tsx` the bar, its row, the menu dialog's row | `h-16` x3 | `h-[var(--header-h)]` |
| `globals.css` anchor and focus clearance | `scroll-padding-top: 6rem` | `calc(var(--header-h) + 2rem)` |
| `parts.tsx` `pageY`, pages that open on text | `pt-24 md:pt-28` | `calc(--header-h + 2rem)` / `+ 3rem` |
| `parts.tsx` `pageYMasthead`, pages that open on a band | `pt-16` | `var(--header-h)` |
| `ServiceTemplate` and `GuideTemplate` reading rails | `sticky top-28` | `calc(--header-h + 3rem)` |
| `Hero.tsx` the home hero's own clearance | `pt-20`, `pt-24` tall | `calc(--header-h + 1rem)` / `+ 2rem` |
| `preview/page.tsx` | `pt-24 md:pt-28` | the same calc as `pageY` |

Every one encoded the same 64 plus its own offset: 32 for a text page, 48 for a rail, 16 for the
hero, 0 for a band. Raising the bar by hand meant finding all seven and redoing each sum, and the
failure mode is silent: the page still renders, the headline just sits under the bar, or a sticky
card pins 16px too high. `--header-h` is in `:root` and they all read it, so the height is one line.

### Two of these were not obvious

**`pageYMasthead` is the bar's height exactly** and nothing else, because a full-bleed band's top
edge meets the bar's bottom edge (Task 69). It is the only one of the seven with a zero offset, so it
is also the only one where a stale literal would have been invisible: at 64 it looked deliberate.

**The home hero was carrying its own copy.** `Hero.tsx` is not a `PageMasthead` page and never read
`pageY`, so its `pt-20` was an eighth literal hiding behind a different name. Left alone it would
have become exactly the bar's height, quietly costing the hero the 16px of clearance it was designed
with.

One contract note. Rule 4 caps a hero's top padding at `pt-24`, which is 96px, and the tall variant
now computes to 112. The cap was written against a 64px bar and means "no more than 32px beyond the
header"; the derivation preserves that relationship rather than the number it produced. Recorded here
rather than silently exceeded.

### Why 80px

The bar holds a 44px minimum-height button. At 64 that leaves 10px above and below; at 80 it leaves
18, which is the difference between a control wedged into a bar and one sitting in it. 80 is also
where the search field, the primary button and the menu button stop competing for vertical space.

It is not a value from MASTER's spacing table, which runs 4 / 8 / 24 / 32 / 48 / 64 / 96. That table
governs the gaps between things, not the height of a component, the same way 44px targets and the
14px radius are their own numbers. 96 would have been the next table value and is a 50% jump.

### Measurements

Compiled, with the token resolving once:

```
--header-h: 5rem
.h-[var(--header-h)]                  { height: var(--header-h) }
.pt-[var(--header-h)]                 { padding-top: var(--header-h) }
.pt-[calc(var(--header-h)+1rem)]      { padding-top: calc(var(--header-h) + 1rem) }
.pt-[calc(var(--header-h)+2rem)]      { padding-top: calc(var(--header-h) + 2rem) }
.md:pt-[calc(var(--header-h)+3rem)]   { padding-top: calc(var(--header-h) + 3rem) }
.top-[calc(var(--header-h)+3rem)]     { top: calc(var(--header-h) + 3rem) }
scroll-padding-top: calc(var(--header-h) + 2rem)
```

Rendered on a service page: bar `h-[var(--header-h)]`, page `pt-[var(--header-h)]`, rail
`sticky top-[calc(var(--header-h)+3rem)]`. No literal left anywhere in the chain.

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off`**, motion
check clean, build green at **99 routes**.

**Not run, and not claimed:** axe and the 375/768/1024/1440 pass. Three to look at. The bar at 375,
where 80px of fixed chrome is a larger share of a short viewport. The home hero, which is
`min-h-[100dvh]` and now gives 16px more to the header. And the reading rails on the service and
guide pages, which should still clear the bar by 48px rather than tucking under it.

## v4 / AI writing tells, audited and guarded (Task 71)

Asked to strip AI signatures from the site's text. Audited first, because the answer turned out to be
that there were almost none, and the useful work was making that durable.

### What was measured

Every rendered page was parsed, script and style stripped, and the remaining text nodes matched
against the patterns in Wikipedia's "Signs of AI writing": **98 pages, 70,879 visible words.** The
same pass ran over the authored strings in `src/content` (2,030 prose strings), `src/components` and
`src/app`.

| Pattern | Hits in 70,879 rendered words |
| --- | --- |
| em or en dash | **0** |
| AI vocabulary (delve, showcase, testament, underscore, vibrant, tapestry, pivotal, crucial, foster, enhance, deep dive, additionally) | **0** |
| sales language (boasts, nestled, renowned, breathtaking, stunning, groundbreaking, commitment to) | **0** |
| inflated significance (stands as a testament, plays a key role, evolving landscape) | **0** |
| shallow -ing riders (highlighting, underscoring, showcasing) | **0** |
| deep sayings (at its core, the real question, what really matters) | **0** |
| staged run-ups (let's dive in, here's what you need to know) | **0** |
| chatbot residue, cutoff disclaimers, emoji | **0** |
| not-X-but-Y | 5, all kept |

Zero dashes is not luck: `check-content.ts` has banned them in every `.ts` and `.tsx` under `src`
since before this session, comments included.

### The five "not just" phrases stay

> "the whole page stops, not just that feature"
> "do not just delete it and move on"
> "Why not just buy a premium theme?"
> "Why not just find and replace the domain in the SQL file?"

The pattern is a tell when the negative half names something nobody claimed, so the positive half
sounds bigger. None of these do that. Two are questions a customer actually asks, and the site answers
them. One is an imperative. The other two correct exactly the belief a reader arrives with, which is
why one plugin can take down a whole site, and both halves carry information. Rewriting them to dodge
a regex would make the copy worse, so they were left and the reason recorded.

### What changed

Only two things, both guards rather than rewrites.

**The banned-word list grew from 13 to 30** and now runs over **all of `src`**, not only
`src/content`. Headings, leads, empty states and button copy are written straight into the components
and page files, and a visitor reads those too. Every added word was checked first: none appeared
anywhere in `src`, so this guards against drift rather than cleaning anything up.

Three words were deliberately left out. `key`, `gate` and `critical` have real technical senses here,
an API key, a gated claim, a critical error, and banning them would force worse words.

**Markdown under `src` is now checked** for dashes and banned words. The walker only collected `.ts`
and `.tsx`, so `src/components/motion/README.md` had sat at **8 em dashes**, the only such file in
the tree. They are colons now, which is how the rest of this repo joins a label to its clause.

### Both new rules were proved to fire

A guard that does not fail on a violation is worth nothing, so each was tested by introducing one and
confirming the failure:

```
src/components/HoverFill.tsx:66      banned word: seamless     (would not have been checked before)
src/components/motion/README.md:139  em/en dash                (file would not have been read before)
```

Both reverted after. Worth recording that the revert of the second used `git checkout`, which also
threw away the dash fix in the same file; the fix was reapplied and re-verified at 0.

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, build green at **99 routes**.

**Not claimed:** that the copy is free of every AI habit. The patterns a regex can catch are the
vocabulary and punctuation ones. Structural tells, a paragraph built as a triad, a one-line closer
that restates the paragraph above it, a heading restated in its first sentence, need reading rather
than matching. The audit looked for them and found the copy plain, but that is a judgement, not a
measurement.

## v4 / the card caret moves to the top right (Task 72)

Reported from a screenshot of the city directory. The "go there" caret sat at the card's foot; it is
now on the card's top line, right-aligned.

### Scope: two card types, and five carets that are not cards

The report said "all these kind of cards", so the first job was deciding what counts. Seven carets
render across the site; only two sit on a card:

| Where | Moved? |
| --- | --- |
| `LinkCards` (`parts.tsx`), the site-wide link card | **yes** |
| the hand-rolled city card (`CityTemplates.tsx`) | **yes** |
| the hub's ranked problem rows | no, a row: the caret is centred at the row's right |
| `/compare/` and `/pricing/` ruled rows | no, rows |
| the carousel's next button | no, a control |
| the breadcrumb separator | no, punctuation between crumbs |

### What the old position was for, and why the new one needs less

The caret was pinned with `mt-auto` and `self-end`, and the comment explained why: on a row of cards
with titles of different lengths, pinning to the floor is what made every caret sit on one line.

At the top that agreement is free. **The top edge is the line a row of cards already shares**,
whatever the titles below do, so the pin comes out and nothing replaces it. The card also loses the
`pt-5` the foot needed, and a card with no icon used to start its title at the very top; the caret row
gives it a top line it did not have.

Two shapes, because `LinkCards` cards may or may not carry an icon:

- **With an icon** (the error grids, the about hub grid, case studies): the top line is the icon on
  the left and the caret on the right. Height is unchanged, because the icon was already that row.
- **Without one** (the hub directory, the city service lists): the caret sits alone on the right.
  `ml-auto` rather than `justify-between`, so it holds the far edge instead of collapsing left when
  there is nothing beside it.

The city card keeps its eyebrow, "WordPress development in", on that line, with the caret opposite.

### Measurements

Rendered, first card of each kind:

```
city card     <span class="flex items-start justify-between gap-3">
                <span>WordPress development in</span>[CARET]</span>
              <span>Chennai</span> ...

LinkCards     <span class="flex items-start gap-3">[CARET]</span>
  no icon     <span>Emergency WordPress Fix (site down)</span> ...

LinkCards     <span class="flex items-start gap-3">[ICON][CARET]</span>
  with icon   <span>WordPress critical error on this website</span> ...
```

The caret precedes the title in document order in all three, which is the point: it is read as part
of the card's top line rather than as a mark hanging off the bottom. **Old bottom-caret wrappers left
anywhere in the build: 0.**

### Checks

`tsc` 0, `eslint` 0, content check **ok: 52 match candidates, 202 files scanned, legacy off**, motion
check clean, build green at **99 routes**.

**Not run, and not claimed:** axe and the 375/768/1024/1440 pass. Two to look at. Cards without an
icon now carry a caret row they did not have, which adds about 36px above the title and takes about
40px off the foot, so the hub's eleven-card grid should end up slightly shorter rather than taller,
but that is arithmetic and not a measurement. And on the city card the caret now sits beside a line of
text rather than alone, so the 24px gap between the eyebrow and the glyph wants checking at 375 where
the eyebrow is closest to wrapping.

### Correction to Task 72: the caret row left a hole

Reported from a screenshot of the hub directory: dead space between the top of the card and its
title. Measured, **36px** of it, and the cause was the fix in Task 72.

That task gave the caret a flex row of its own. On a card with an icon that was free, because the
icon was already that row. On a card **without** one, which is the hub directory and the city service
lists, the row held nothing but the caret: 20px of row, plus the title's own 16px margin, above a
title that used to sit hard against the top of the card.

The caret is now `absolute top-5 right-5` and costs no layout at all. Same corner on both kinds of
card, and the title keeps its original rhythm: against the top on a plain card, 16px under the icon
on a card that has one. `cardLink` already carries the `relative` it positions against, from Task 62.
The title gained `pr-7` so its first line clears the glyph instead of running under it.

Rendered, the two shapes:

```
no icon     [CARET-absolute]<span class="block max-w-[40ch] pr-7 …">Emergency WordPress Fix…
with icon   [CARET-absolute][ICON]<span class="… pr-7 … mt-4">WordPress critical error…
```

Empty caret rows left in the build: **0**.

The city card is unchanged and did not have the problem: its caret shares a line with the
"WordPress development in" eyebrow, so that row was never empty.

`tsc` 0, `eslint` 0, content and motion checks clean, build green at 99 routes. The 375 check noted at
the end of Task 72 still applies, and now also covers whether `pr-7` is enough clearance for the
longest title at the narrowest card.
