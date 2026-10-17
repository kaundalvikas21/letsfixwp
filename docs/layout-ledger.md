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
| 2 | Funnel stage one, the break | GSAP sticky-stack, 4 full-viewport cards (taste skeleton 5.A) | yes ("Sound familiar?") | no | BOOK (mini-CTA after the last card) |
| 3 | Funnel stage two, the fix | GSAP horizontal pan, heading plus 5 panels plus the CTA beat (taste skeleton 5.B), ember progress rail | no | no | BOOK (the last beat of the track, label only) |

Sections 4 and up are still v3 components until they are rebuilt, so their rows stay in the v3 tables.
Budgets used so far: 2 pinned scenes of 2 (the budget is now spent, so the restored-site scene that
follows scrubs without pinning), 0 marquees, 1 eyebrow, 2 image-plus-text layouts, never consecutive.

Section 2 measurements (1440): 4 cards, 3 pin-spacers (the last card never pins), each previous card scrubbed
to scale 0.92 and opacity 0.55 by the next card's trigger, scene height 3952px. Under 768px and under reduced
motion: 0 pin-spacers, `position: static`, no transforms, a plain vertical list, which the CSS does on its own
(`motion-safe:md:sticky`) so it holds even if the GSAP leaf never runs. A focusable skip link before the scene
jumps to the mini-CTA row. The capture panel is 70% of the card width at 375, 768 and 1440.

Hero measurements (1440 unless stated): h1 72px, leading 1.1 (79.2px), tracking -0.04em (-2.88px), opsz 72;
two lines at every width from 320 to 1440; "today." in ember on --bg at 6.30:1; the clip mask keeps 0.16em
(11.5px) of descender room so the y in "today" is whole at rest; rightmost text at 62% of the viewport, with
the scrim opaque to 68%, so every word sits on solid --bg; CTA above the fold at 320, 375, 414, 480, 640,
768, 1024, 1280 and 1440; one preload and one image request for the LCP photograph; reduced motion renders
both lines at opacity 1 with no transform from the first paint.

Section 3 measurements (1440): heading leads the track, then Diagnose, Back up, Repair, Verify, Harden, then
the BOOK beat; 1 pin-spacer; track 1624px wider than the viewport, so the scene is 2524px tall and the pin
releases exactly where the pan ends. The ember rail is `scaleX` 0 to 1 on the same scrubbed timeline, measured
at 0.08, 0.54 and 1.00 across the scene. Under 768px and under reduced motion: 0 pin-spacers, panels stacked
vertically in DOM order, the rail hidden (it has nothing to report without a pan), no horizontal page scroll.
A focusable skip link precedes the scene, and the one focusable element inside the track, the BOOK link, was
tested: focusing it from the top of the page leaves it inside the viewport, so a keyboard user is not carried
somewhere they cannot see.

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
| 10 | Questions people ask first | accordion with category tabs | no | no | none |

Section 10 measurements (1440, production build): three tabs (Before booking, During the fix, After the
fix), two questions each, six in total. Radix Tabs carries the arrow keys and roving focus, measured by
pressing ArrowRight twice and watching the selected tab and its questions change. Each question is a plain
button with aria-expanded and its own region: collapsing removes the region from the accessibility tree,
reopening restores the same 78px panel. The chevron reads matrix(-1, 0, 0, -1) when open, which is the
180-degree turn. Reduced motion: the panel is already at full height 120ms after opening, so it swaps
instantly. Tabs are 44px on mobile, no horizontal scroll. FAQPage JSON-LD carries all six questions,
including the four sitting in closed tabs.

The six are referenced from the service pages by id and exact wording, so rewording a question in the
content file fails the build here instead of letting the two drift apart. This replaced the v3 Faq and
FaqAccordion, both deleted.

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 11 | Closing statement | full-viewport closing statement | no | no | BOOK (magnetic), CHAT (plain text) |

Section 11 measurements (production build, after the second pass): a full-width banner, 461px tall at
1440 and 431px at 375, with the photograph edge to edge at 1440x461 and 375x431. The section carries no
min-height and no viewport unit: its height is the content plus 96px of padding above and below at desktop,
80px at mobile. The headline is 112px at 1440 and 48px at 375, leading 0.9, left edge on the same 168px
measure as every other section. BOOK is 56px tall at 14px radius with a 40x40 chip at 14px holding the
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

- **A scroll-progress rail**: 2px ember along the bottom edge, `scaleX` bound to `scrollYProgress`, fading in
  with the backdrop. Measured 0.00 at the top, 0.25, 0.60 and 1.00 at those points in the page. It earns its
  place: the home page is about 18,000px and the two pinned scenes make the native scrollbar misreport it.
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
