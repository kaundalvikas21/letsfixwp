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
| City, City hub, guides index | max-w-4xl | x=296 | Prose plus a 3-up strip. |
| Guide, compare index | max-w-3xl | x=360 | Reading documents. Body copy is capped at 68ch regardless, so a 6xl guide would hold a 694px text column in a 1104px container under a 1104px h1. Strictly worse. |

The x=168 spine rule is an **intra-page** rule, and both bugs it has caught were intra-page: a section whose
heading sat at x=296 while every heading above and below it sat at x=168. On a guide every heading sits at
x=360, consistently, and nothing is out of line with anything. The widths were left alone deliberately:
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
compare index still runs at `max-w-3xl`; the guide no longer does.

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
frame would describe the wrong picture. The capture arm emits a real `<link rel=preload as=image>`; the
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
