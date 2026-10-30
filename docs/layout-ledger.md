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

The fixed bottom action bar is a `nav` labelled "Get help", not a bare div: below 768px it is the page's
persistent CTA, and as a div its two targets were the only content on any page outside a landmark, which is what
axe's `region` rule reported as moderate at 375 on every page. The top bar's row is `gap-2`: at `gap-1` the search
trigger and the menu button sat 4px apart where rule 5 asks for 8px.

## v3 / shared template primitives (src/components/templates/parts.tsx)

Not a page. Three conventions that were in practice on four pages each but written down nowhere, which is how two
of them drifted.

**Body measure.** 68ch is the lead paragraph (20 usages) and 70ch the small secondary line that follows it, in a
card summary, a link-row summary or an FAQ answer (7). Both are inside the craft floor's 65 to 75ch. The narrower
measures are local exceptions, not a scale: 56ch and 52ch head a panel or a closing band, 48ch and 62ch carry one
short line, and everything under 30ch is a headline wrap control rather than body copy. `parts.tsx`'s `prose` is
the canonical lead measure and now says so in place, which is also the stable reference a parked ruling needs:
it was cited once by a line number that has since drifted. Six body measures are hand-typed across 38 usages,
they are correct where they sit, and 38 edits to centralise them would be a worse diff than the convention.

**The interactive cell.** `cardLink` and `stretchedLink` are the idiom /about/, /guides/, /compare/ and the hub
template each re-derived by hand, correctly, four times: the hover and press transition, the
`has-[a:focus-visible]` ring on the cell, `motion-reduce:transition-none`, and the stretched link that drops its
own outline only where `:has()` can replace it. All four now import them. Resting elevation is `shadow-card`;
`--shadow-lift` is MASTER's hover shadow only (MASTER.md:99,204). Verified render-identical: every class attribute
on all four pages, in document order, is class for class (token for token) what it was before the consolidation; the strings differ in order, since `p-6` moved
to the end in each of the four cells, but the merged class set and so the render are unchanged.

**The rail's claim set.** `railPoints` in src/content/notices.ts is the one set every `FactRail` shows. The
service rail asked for (backupFirst, fixedPrice, ownLogin) and the guide rail for (backupFirst, ownLogin,
accessRemoved), so a visitor got a different set of promises on a guide than on its parent service. Nothing in
the briefs or the task reports records a reason for that split, so the two are aligned on all four claim lines
rather than on a rationale invented after the fact. Each line is already gated and already shown site-wide by the
home page's security section, so the alignment adds no promise. Each one also carries its own full stop now: the
rail printed them bare as list items while the pricing header, the contact panel and two lines of the booking
flow appended a stop, so the same sentence read two ways (rule 14). The stop is in the data because four of the
five uses are mid prose, and `backupFirst` gained its verb so the stop is honest on all four.

## v3 / illustration (every page)

Not a section. Every page on the site is illustrated, and the illustrations are **Unsplash files**, not authored
SVG. Six of them live in `public/site_images/illustrations/` and render through `<Illustration>` in
src/components/sections/v3/Photo.tsx, which is the single entry point, so the image unveil and the sizing live
in one place and a new illustration inherits them by being registered in src/content/photos.ts.

Where they appear: the hero of home, hub, city, compare, guide, /pricing/, /about/ and /guides/; the service
hero, by node intent; the service page's outcome panel; three home bento cells; the four step tabs; and both
sides of the plan comparison. Guide pages do get one, reversing the 2026-10-30 decision to skip them, at the
owner's instruction.

Downloaded, not hotlinked, so next.config.ts needs no `remotePatterns` and nothing third-party is fetched at
runtime: measured at 0 off-origin image requests on all nine page types. Every file is
`images.unsplash.com/vector-*`, the free Unsplash Licence; the `plus.unsplash.com/premium_vector-*` results
that dominate the same searches are Unsplash+ subscription assets and were deliberately excluded. Ids, authors
and licence sit beside the registry entries.

Two earlier attempts at this are gone and should not be revived without reading this. `OutcomeArt` and
`HeroArt` were hand-authored SVG plates in a `--art-*` ramp, built because no reference site used photography
and because authored SVG themes for dark mode and costs nothing over the network. They were replaced on the
owner's explicit instruction after three rounds: the brief was Unsplash illustrations, not authored vector.
The `--art-*` tokens were removed with them.

Assignment is semantic, added 2026-10-30 after the first pass reused one scene everywhere: `hubArt` in
HubTemplate keys an illustration per hub id, and `serviceArt` in ServiceTemplate reads hub first and intent
second, so a security service shows the shield whatever kind of work it is. Both fall back, so a hub or intent
added to SITEMAP renders rather than failing on a missing key.

**Colour-lock exception.** Most of the files are blue and orange, and `shield-and-firewall` is the first
green-family one. That is the one place a hue other than the green accent appears, it was chosen knowingly, and it does not extend to UI, type or controls. MASTER.md records it
the same way.

## v3 / navigation is not disclosure (every page)

Not a section. `LinkRows` was redesigned on 2026-10-30 and renamed in the tables above from "link rows" to
"stacked link cards", because it and `Faqs` had become the same component by sight.

They were identical, class for class: both `divide-y divide-line border-y border-line`, both rows titled
`font-display text-lg font-bold`, both ending in `CaretRightIcon size-5 text-muted`. The only difference was
what the caret did on interaction. That is worse than repetition, it is the wrong affordance: a divided row
list ending in a right chevron is the web's standard "expand me", so four sections were promising disclosure
and delivering navigation. And the pair is **adjacent** on both content templates, guide rows 7 then 8 and
service rows 7 then 8, so a reader met the same object twice in a row with two different behaviours.

The split is now carried by three things at once, not one:

| | Disclosure (`Faqs`) | Navigation (`LinkRows`) |
| --- | --- | --- |
| Container | divided rows inside one card | separate cards, gap-separated |
| Glyph | `CaretRight`, rotates on open | `ArrowUpRight`, nudges on hover |
| Hover | none, it is not a link | lifts to `--shadow-lift` |

`ArrowUpRight` was not invented for this: it is already the navigation glyph on the home bento cells and the
quote cards, so the caret is now exclusively the disclosure signal site-wide. The hub's "Most urgent problems"
list took the same glyph change for the same reason; it stays a ranked panel, which its urgency badges already
distinguish, so its family is unchanged.

Family collisions were checked per page rather than assumed. Stacked link cards are full-width, compact and
gap-separated, which keeps them clear of the service page's bento (varied spans, `min-h-40` cells), the guide's
cause tiles (a grid of small grey tiles) and the city page's delivery bento. `Faqs` gaining a card brings it
into line with the home page's own FAQ, which has been "searchable accordion inside a card" since v3 shipped;
the template version was the odd one out at "plain disclosure list", and the tables now say so.

## v3 / the link-card grid (three callers)

Not a section. `LinkCard`, `cardGrid` and `GuideCard` in templates/parts.tsx are the one implementation behind
three grids: the pricing page's service directory inside its tabs, the hub's "Most urgent problems", and the
guide page's "More <parent> errors".

Extracted on the third caller rather than copied a third time. All three had the same twenty lines of frame,
banner and hover, which is three places for the hover to drift. `GuideCard` goes further and holds the whole
guide card body, because the hub grid and the guide grid show the same object and had already started describing
it differently.

The hover is four things and none touch layout: the card lifts, the banner scales, the arrow nudges, the shadow
deepens. The scale sits on a frame inside the banner, never on the `<img>`, so it cannot compound with the image
unveil's own `scale(1.06)` start.

**`min-w-0` is load-bearing in three places here and the reason is the same each time.** A CSS grid item takes
its automatic minimum size from its min-content width, so one unbreakable string anywhere inside it widens the
item rather than wrapping or ellipsing. Guide symptoms quote literal error text and file paths, and the guide
cards carry a truncated error line, so without it the page scrolled sideways at 375 in breach of rule 12. It sits
on `LinkCard`'s `li` and its body span, and on the guide template's `lg:col-span-8` body column. Found by
measuring `document.documentElement.scrollWidth` per page, not by eye: three of five pages were over.

Family check per page, not assumed. On the guide page row 4 is cause tiles, a two-column grid of small text-only
tiles, and row 8 is now a three-up image-led card grid: different column count, different content, a banner on
every cell. On the hub, row 2 is the span-varied text-led symptom bento and row 3 is this uniform image-led grid.
Both are defensible as distinct families and both are recorded here rather than left to be re-argued.

**The repetition is now at its worst on a guide page and is still unresolved.** Every sibling of a guide shares
its parent service, so `guideArt` correctly returns one illustration for all of them, and that illustration is
also the page's own hero. A guide page can therefore show the same picture five or six times. Subject-driven
mapping is doing the right thing and the result is wrong, because eight illustrations cannot cover thirty-two
services. The standing recommendation, made four times and not yet taken, is to swap the card banner for the
per-service Phosphor icon tile, which varies immediately and needs no new assets.

## v3 / closing CTA (every page)## v3 / closing CTA (every page)

Not a section of one page. `ClosingCta` (src/components/sections/v3/ClosingCta.tsx) is the last block on home,
the service, hub, compare and city templates, /pricing/, /about/ and /guides/. Eight closing blocks became one
component on 2026-10-30, so the last thing a visitor sees is the same offer in the same shape wherever they are
and a change to it is one edit rather than eight. The home page's `FinalCta` is now a wrapper holding only its
own words.

Seven of those pages were the split-band family (text left, buttons right) and the home page was the gradient
panel; all eight are now the panel. That is a family change on seven pages and a deliberate one, so the tables
above say "closing panel" rather than "split band".

Shaped past the headline-and-buttons the home page had, because the brief asked for CRO: an outcome headline, a
line saying what happens next, the page's own primary beside chat, and a reassurance line. The reassurance reads
`railPoints`, the same gated claim set the conversion rail shows, so nothing is promised here that is not
promised elsewhere and an owner turning a claim off empties it. The primary follows the page's node intent, so a
plan page closes on "See plans" and a project page on "Get a quote". CHECK appears only on /pricing/ and
/guides/, the two closers where the visitor is not in an emergency (foundation.md).

**The mesh rule was widened, not broken.** MASTER allowed one radial mesh on "the final CTA only", written when
the home page was the only page that had one. It now reads as each page's final CTA, recorded in MASTER. Still
one gradient treatment, used once per page, at the bottom of it.

## v3 / CTA icons (every page)

Not a section. Every CTA carries an icon chosen for the action: a wrench for having the site fixed, a speech
bubble for chat, a shield for ongoing cover, a receipt for a quote, a stethoscope for a check-up on a site that
still works. They live in src/components/Cta.tsx, which is already the only place a CTA label or target can come
from, so the icon cannot drift from the label.

`btn-primary` already set `gap: 0.5rem` for one; `btn-secondary` never had a gap and its glyph would have sat
flush to the label, so that was added too.

`icon` defaults on and is off in five places: the four quiet inline text links inside sentences ("Nothing down
right now? Get a free site check"), where a glyph mid-sentence reads as debris, and `CtaPair`, which renders
unstyled links in a paragraph.

## v3 / typed section headers (every page)## v3 / typed section headers (every page)

Not a section. Every `Section` now carries an icon tile left of its heading, looked up from `sectionIcons` in
templates/parts.tsx by the `id` the component already receives. No call site passes it, and a `Section` whose
id has no entry renders the old bare heading, so the map can stay partial without breaking a page.

Added 2026-10-30 against a diagnosis taken from the rendered page rather than the source. On
/guides/error-establishing-database-connection/, 3,706px tall, five sections sat under one h1 with the same
`font-display text-2xl font-extrabold` heading and nothing else: "What you are seeing" measured 0 icons and
0 cards, "When to call us" 0 and 0 while being the page's conversion moment, and the FAQ 802 characters with
0 cards. The page read as five interchangeable black headings over grey text, so a reader could not tell a
section's kind without reading it. That is the defect; the entrance, the reveals and the process row from
earlier passes did not touch it.

**The tile is not an eyebrow and does not spend the eyebrow budget.** The budget counts the small text label
above a heading; this is a glyph, carries no text and carries no number, so it is also clear of rule 6's ban
on section-number eyebrows. That distinction is what makes it legal on pages already at their limit, which is
most of them.

Contrast: the glyph is `--accent-text` on `--accent-tint`. MASTER measures accent text on `--surface-2` at
4.31:1 and restricts it to large text and icons there; `--accent-tint` is a different token and was measured
separately for this, in both themes. Nothing text-sized goes on the tile.

MASTER's shape lock did not cover icon tiles. It lists cards at 20px, inputs at 12px and controls as pills,
and an icon tile is none of those, so it was added to the table at 12px rather than guessed per use.

## v3 / entrance (every page)

Not a section. One entrance for the whole site: an element carrying `data-reveal` rises 16px and fades
in once, the first time it enters the viewport. `Reveal.tsx` is the single IntersectionObserver that adds
`.revealed`; `globals.css` holds the two rules; nothing else is involved and no dependency was added.

Reverse-engineered from the reference the brief names, gotechark.com (2026-10-28, its own stylesheet and
markup): WOW.js over animate.css, `.wow` on 50 elements, `fadeInUp` on 44 of them, `fadeInLeft` on 4 and
`fadeInRight` on 2, `.animated` at 1s with fill both on the browser default ease, `data-wow-delay` on only
2 of the 50, and the reduced-motion kill switch animate.css ships. Two findings decided our build. Its
trigger fires **once per element and then stops watching**, which is why nothing there ever sits
half-faded. And it animates at **element** granularity, not section: what makes that page feel alive is 50
things arriving separately, not the easing curve.

Three things were deliberately not copied. `fadeInUp` travels `translate3d(0, 100%, 0)`, a full element
height, which on a tall card is hundreds of pixels of float; ours travels 16px. Its 1s on the default ease
drifts; ours is 600ms on `--ease-spring`, the site's existing curve. And it costs a library plus a
stylesheet; ours is one observer and one CSS rule.

This replaced a scroll-linked `view()` timeline built earlier the same day. That version was cheaper
(no JS at all) but wrong on both counts above: it tracked the scrollbar rather than triggering, so
progress followed the reader's scroll position, and it only ever worked per section. Firefox's lack of
scroll-driven animations stopped mattering with it.

Granularity per surface: `Section` in templates/parts.tsx reveals its heading and, unless
`revealBody={false}`, its body as one block. The four sections whose children are cards pass false and
mark the cards instead, so nothing fades inside something that is also fading: the hub's service cards
and urgent-problem rows, and the service page's "What we do" cells and "What you get" rows. On the home
page, Security and Boundaries mark their eyebrow, heading and each group or pair; the other sections are
single compositions, where the section is the right unit. The hero never reveals, on any template: it is
above the fold and has its own CSS entrance. The home bento never reveals, because BentoMotion already
runs a staggered in-view entrance on its cells.

**Coverage, completed 2026-10-30.** The entrance now reaches every page that is meant to be browsed. The
shared primitives carry it, which is why most of this was not a per-template edit: `Section` reveals a
heading and, unless `revealBody={false}`, its body; `LinkRows` and `TickList` reveal each row with a `--i`
index, so their four and one callers inherit it and so does any future one. Per-template lists that do not
go through a primitive carry it directly: the guide's causes and safe checks, the compare verdict cards and
table rows, and the city page's context paragraphs and delivery cards. `LinkList` is deliberately left
whole: it renders small chips, and a chip row reads better arriving as one row than as eight chips.

**Three surfaces are excluded on purpose, and this is a standing decision, not an unfinished job.**

- `/legal/terms/`, `/legal/privacy/` and `/legal/guarantee/`. These are documents of ten or more headings
  that people arrive at in order to *read*, often linked straight to one clause. Content that waits to be
  scrolled into view is friction on a legal page rather than polish, and somebody checking a refund term
  should never have to scroll it into existence.
- `/contact/`. A booking flow: the visitor is transacting, not browsing, and a form whose steps animate as
  you scroll is the one place on a site where motion costs conversions outright.
- `/free-site-check/`. Added to this list after reading it rather than from the plan: it is a lead form with
  its copy and its fields side by side in a single viewport, so there is nothing to scroll an entrance into.
  A reveal on content that never leaves the fold only risks a flash on load and buys nothing.
- `/preview/`. Internal.

A test asserts the absence rather than trusting the omission: the verification run reports the
`[data-reveal]` count on those routes and expects zero, because an exclusion nobody checks is just a gap.

No stagger, matching the reference, where only 2 of 50 elements carry a delay. Rows in a grid already
arrive separately because they cross the trigger line at different scroll positions.

Measured in a real browser rather than read off the stylesheet (Playwright, chromium 1248): home 17
animated elements, /wordpress-fix/ 19, /wordpress-fix/emergency/ 19. On every one of them each element is
hidden before its trigger, every element is revealed after a full scroll, and none is left part-faded. On
the hub, 3 elements are already revealed at first paint because they are in the viewport on load, which is
the observer firing on observe rather than a missed trigger. Three ways content could have been stranded
are all closed and all tested: `prefers-reduced-motion: reduce` reveals everything and never observes
(0 of 19 hidden), scripts disabled leaves everything visible through the `<noscript>` rule in
app/layout.tsx (0 of 19 hidden), and a 3s failsafe in the observer reveals anything still hidden if it
never fired.

## v3 / image entrance (every page)

Not a section. Photographs do not use the rise-and-fade the text uses: the frame opens and the picture
settles into it. `[data-reveal="image"]` in globals.css animates `clip-path: inset(12%)` out to
`inset(0%)` while `transform: scale(1.06)` eases back to 1, over 900ms on `--ease-spring`. The same
observer (Reveal.tsx) triggers it, once, on entry.

Reverse-engineered from infiniareserve.com (2026-10-28, its own markup). That site is the same stack as
this one, Next.js with motion, plus Lenis for smooth scroll, and drives the effect from its own
`data-unveil` attribute in two layers: a wrapper at `clip-path: inset(12%)` over an image held at
`transform: scale(1.06)`. The scrape caught one frame mid-flight at `inset(9.3363%)`, which is what fixes
the direction and the 12% start rather than leaving them guessed. Ours composes both on the single
element, because the image already is that element and no call site should have to add a wrapper to get
the effect. 900ms against the text's 600ms is deliberate: a photograph is a larger object, and a large
thing moving at a small thing's speed reads as cheap.

**The SSOT is `Photo` and `Illustration` in src/components/sections/v3/Photo.tsx**, with its registry in
src/content/photos.ts. Every photograph on the site goes through that component, so the attribute is set
there once and nothing else carries it. A photograph added later inherits the entrance by existing in
the registry and being rendered through `<Photo>`; the failure mode is a new component reaching for
`next/image` directly, which opts itself out silently. `Screen`, the real-capture frame in the same
file, carries it too.

`preload` is the entire opt-out list. A preloaded photograph is the above-the-fold one, so it is the LCP
element and its wrapper already runs `settle` (the home hero and the service hero both do). Animating a
clip-path there would double that entrance and put a paint-blocking effect on the metric rule 13 caps at
2.5s.

Measured in a real browser (Playwright, chromium 1248): on the home page 9 photographs carry the unveil
and 1 opts out, every one reads `inset(12%)` with `scale(1.06)` before its trigger and `inset(0%)` with
`scale(1)` after a full scroll, transition 0.9s, none left clipped. Under
`prefers-reduced-motion: reduce`, 0 of 9 are clipped.

One bug was found by running that test rather than reading the stylesheet. The `<noscript>` rule in
app/layout.tsx reset `opacity` and `transform` but not `clip-path`, so with scripts disabled all 9
photographs stayed clipped to their middle 76%. The rule now resets `clip-path` as well, and the same
test reads 0 of 9.

Coverage is currently thin on the pages this most needs to land on, and that is a content gap rather than
a code one: `<Photo>` appears in Hero, Bento, Steps and PlanCompare on the home page, and once in the
service template, where it is the preloaded hero and therefore opted out. A service page has exactly one
photograph and /about/ has none, so the unveil is effectively a home-page effect until the inner pages
get the imagery docs/image-todo.md already tracks.

## v3 / home

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | split with overlapping offset image (6/6 at lg, image overlaps next section by 48px) | no | no | BOOK, CHAT |
| 2 | What we fix | bento grid, 7 cells (4x3 at lg, 2 columns at md, 1 column below) | yes ("What we fix") | no | none (cells link to problem pages; cell 7 opens the problem palette) |
| 3 | Four moves | tabbed showcase (Radix Tabs, sliding pill; panel = text 5 / image 7 at md, stacked below; tabs scroll-snap 8px apart under 768px, one bordered segmented track from md) | no | no | none |
| 4 | Pricing | pricing tiers with billing toggle (3 tiers, care plan centre at 1.04 with accent ring; scroll-snap cards under 768px, care plan first) | no | no | PLANS (care plan), BOOK (one-time fix), BOOK with service=malware-removal (cleanup) |
| 5 | Prevent the next one | interactive toggle comparison (radio pill toggle with sliding thumb; card = content left, photo right at md) | yes ("Prevent the next one") | no | BOOK or PLANS, following the toggle |
| 6 | Security | grouped icon list (3 groups x 2 items; group label 3 cols, items in 2 columns; one soft divider between groups) | yes ("Security") | no | none |
| 7 | What we don't do | definition grid (4 term and description pairs, 2x2 from md, 1 column below, no icons) | no | no | none |
| 8 | Guarantee | centered manifesto card (large numeral, H2, one sentence, text link). Renders nothing until brand.guarantee is set | no | no | none (text link to /legal/guarantee/) |
| 9 | FAQ | searchable accordion inside a card (labelled filter input above 7 Radix accordion items; filtered-out items leave with layout animation; composed empty state) | no | no | CHAT (empty state only) |
| 10 | Final CTA | gradient panel (the one gradient on the site, static radial green mesh; centred) | no | no | BOOK, CHAT |

Reordered on 2026-10-28 to the spine all three reviewed competitors share (fixed.net, gotechark.com, fixmysite.com):
hero, then the problem catalogue, then the process, then price, and the care plan only after the thing it upsells.
The bento moves 3 -> 2, the tabbed showcase 4 -> 3, pricing 6 -> 4, the toggle comparison 5 -> 5, security 8 -> 6.
No component changed; only its position did.

Two sections left the page in the same pass. The static logo grid is gone because a tech-stack grid was the weakest
thing that could hold slot 2, and the quote masonry is gone because src/content/testimonials.ts holds two marked
placeholders, so it rendered placeholder cards above the price. Both component files stay in
src/components/sections/v3/: Quotes returns to slot 4 the day two real quotes exist, and the logo grid is a
candidate for /about/. The page is 10 sections as a result.

Note for section 2: the hero photo hangs 48px into it at lg. The logo grid used to absorb that with `lg:pt-28`;
the bento's own `lg:py-24` is 96px, so the overlap lands in padding and nothing was added. The cell in the first
row's right half at lg is cell 2 (col-start-3), which is what the photo hangs over.

Sections 1 and 3 carry the page's claims and now read their gates. The hero asserts five, not the two the fix
routing named: `sameDay` is the headline's "today", and `vetted`, `bookingMinutes`, `fixedPrice` and `backupFirst`
are the four halves of the subtext. All five are composed from `brand.claims` at module scope, so the hero stays a
Server Component with a CSS-only entrance and no client JS in the LCP path, and the headline is still one string
the h1 splits per word for the `rise` stagger. `bookingMinutes` is interpolated rather than spelled out, the
pattern `checkTurnaround` already uses on /free-site-check/ and in the booking flow, so the number on screen is the
gated value itself; that is the one copy change, "two minutes" to "2 minutes". Section 3 gates three lines, one of
them `alt` text, because assistive tech reads it. Measured by flipping each claim off and rebuilding: the headline
drops to "Your WordPress site, back online.", the subtext to "Book a vetted WordPress engineer in 2 minutes. Full
backup first." or "... Fixed price.", and the Approve and Fix steps to "quotes the work" and "We fix the cause".
Every surviving sentence is a complete thought.

Nothing under src/content can gate a claim: those files are zod-parsed static data with no access to
`brand.claims`, and src/content/notices.ts is the one exception because it imports brand and gates the words
itself. The care-plans FAQ restated `backupFirst` there ungated and now does not; that page is a service page, so
its rail still carries the promise in gated form. `scripts/check-content.ts` grew a claim-phrase scan to keep the
next one out, deliberately phrase-level: "full backup", "backed up" and "back online" are ordinary prose on nine
measured lines across the guides and city files, so a rule wide enough to read intent would fire on all of them. Known survivor: `src/content/services/support-hours.ts:17`
("Take a backup of files and database before any change") is a real process step, kept by explicit ruling; if
`brand.claims.backupFirst` is ever set false it needs a manual content edit, as no automated check will catch it.

Eyebrow budget for this page: 10 sections, so ceil(10 / 3) = 4 eyebrows allowed, and 3 are used (sections 2, 5 and 6).
Two unstyled foundation sections ("Site down or hacked right now", "What we do") sat after the final CTA until the
QA pass; they duplicated the bento and the footer and were removed. Section 7 is the one section on this page with
no competitor equivalent but fixed.net's: it publishes what LetsFixWP does not do. Its wording is gated on
brand.boundaries, because fixed.net's own list (no custom development, no web design, no new sites) would be a
false statement here, where src/config/sitemap.ts sells all three.

## v3 / service template (/<hub>/<service>/)

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero, with the trust chip row inside it | split with a content-height portrait photo frame | no | no | node intent, CHAT |
| 2 | Lead statement (summary, then "Who this is for") with the conversion rail: in flow under 1024px, sticky beside the lead column from lg | lead column with conversion rail | no | no | node intent, CHAT (rail, lg only) |
| 3 | Does your site show this? (fix intent only) | icon-marked tick list | no | no | none |
| 4 | How this job runs | numbered step row (4 steps, 2x2 from sm, 1 column below) | no | no | none |
| 5 | What we do | bento grid, spans varied per item count, one duotone icon per verb | no | no | none |
| 6 | What you get | tinted outcome panel, statement stack, one 16/10 photograph | no | no | none |
| 7 | Errors we fix here | stacked link cards | no | no | none |
| 8 | Questions | disclosure list in a card | no | no | none |
| 9 | Related | chip row | no | no | none |
| 10 | Closing | split band (text left, buttons right) | no | no | node intent, CHAT |

Eyebrow budget: 10 sections on a fix page, so ceil(10 / 3) = 4 allowed, and 0 are used. A plan or project
page drops row 3 and runs 9, so ceil(9 / 3) = 3 allowed, and 0 used. No row repeats a layout family.
Marquee is `no` on every row: v3 has no marquee anywhere.

Rows 1, 4, 5 and 6 changed on 2026-10-28, from an audit of the three reference sites' own service pages
(fixed.net /wordpress-security, fixmysite /wordpress-malware-removal, gotechark
/fix-my-wordpress-website). All three carry a numbered process, two of three carry trust chips under the
hero, and one carries six icon cards where we had text-only cells. The target the brief actually names is
that a section should be understandable before its text is read, and this page was `h2 → text` nine times
with only bento cell widths and one tinted panel as non-text signal.

**The trust chips are inside the hero block, not their own section, and that is a contract constraint
rather than a preference.** Row 9 (Related) is already this page's chip row, and rule 3 refuses a second
section in a family already on the page. Putting them in the hero also matches the references, where the
chips are hero support: fixed.net sets its price line in exactly that position.

Row 4 reads `STEPS` from src/content/notices.ts, which is where that array now lives so the home page's
tabbed showcase and this row cannot drift apart. It stayed out of the other content files because it gates
`fixedPrice` and `backupFirst`, and notices.ts is the one file under src/content allowed to read a claim
gate. The four moves are generic to every job, so this row needed no new copy: 32 service pages gained a
process section without a word being written for it. It is 2x2 rather than 4 across because the row sits in
the 8-of-12 content column, where four cards measure about 175px and wrap a 20-word step to seven lines.

Row 5's icons come from `whatWeDoIcons` in templates/parts.tsx, built the same way as `practiceIcons`
beside it: the key is a union of the real verbs, not `string`, so a service that introduces a verb with no
icon fails to compile instead of rendering `undefined` as a component. 159 items across the 32 services use
36 distinct verbs, which is what made one icon per verb a 36-line map rather than a per-service decision.

Row 6's photograph is a seeded picsum placeholder under contract rule 7, logged in docs/image-todo.md, and
is a deliberate choice by the owner over an icons-only treatment after being told it will read as obviously
fake on 32 live pages. It renders through the same markup as `<Photo>` so it inherits the
`data-reveal="image"` unveil; next/image used directly would opt out silently.

Hero carries no subtext: the shortest service field is 25+ words, over the contract's 20-word hero cap, so
service.summary renders as the lead statement below the hero. Row 1 is still the only image-plus-text
split, and row 6's photograph sits inside a panel rather than a split, so the 2-consecutive-splits limit is
not approached.

## v3 / guide template (/guides/<slug>/)

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | document header with the urgency badge and the diagnostic panel | no | no | none |
| 2 | Capture | device frame (renders only when the capture exists) | no | no | none |
| 3 | What you are seeing, with the conversion rail beside the whole body column | lead column with conversion rail | no | no | node intent, CHAT (rail, lg only) |
| 4 | What usually causes it | cause tiles with an inline cause-to-check diagram | no | no | none |
| 5 | Safe things to try first | numbered procedure with a warning note | no | no | none |
| 6 | When to call us | accent-tinted call-out panel with an inline CTA row | no | no | BOOK (parent service), CHAT, CHECK |
| 7 | Questions | disclosure list in a card | no | no | none |
| 8 | More errors | uniform image-led card grid (3 up at lg, 2 at sm), severity badge per card | no | no | none |

Row 6 became a call-out panel on 2026-10-30: it was a four-line grey paragraph carrying the page's only
conversion moment, and measured 0 icons and 0 cards. It is tinted with `--accent-tint` rather than
`--surface-2` so it stays distinct from the warning note inside row 5 immediately above it, which is the one
real adjacency risk in the change. Row 3's symptoms list also stopped being plain `list-disc` bullets and now
uses `TickList` with a warning mark, because a check mark reads as "we provide this" and these are symptoms.

The five cause tiles in row 4 were deliberately left alone. They are already this page's one non-uniform
family, each cause is a single sentence with no natural lead to emphasise and no per-cause icon derivable from
the data, and numbering them would repeat the numbered circles in row 5 directly below. Improving them means
writing new content, which is a content decision rather than a layout one.

Eyebrow budget for this page: 8 sections, so ceil(8 / 3) = 3 eyebrows allowed, and 0 are used. A guide with no
capture in public/screens/ drops row 2 and runs 7 sections, so ceil(7 / 3) = 3 allowed, and still 0 used. No row
repeats a layout family. Marquee is `no` on every row. This template carries no photography at all, so it has zero
image-plus-text splits and the 2-consecutive-splits limit cannot be reached.

Row 1 replaces the bare mono strip with `DiagnosticPanel` (`parts.tsx`): the literal message on `--surface-2` at
12px with a 1px accent left rule, labelled so it is clear the text is what WordPress prints rather than our words.
`errorText` is optional and 17 of the 37 guides have none (measured: 20 have it, 17 do not), so on those the panel
carries the guide's first symptom in plain type instead, under its own label, and row 3 then drops from
`symptoms` whichever line the panel took. It drops by content, not by position: `symptomsBesides` (`parts.tsx`)
removes any symptom containing the first 24 characters of what the panel showed, case-sensitively, so a guide
whose second or third symptom quotes the error loses that one and keeps its first. Its own comment carries the
limits of that test. Measured on all 37 guides: no guide ends with an empty list, none ends with a single line,
and the shortest `symptoms` array on the site has four, so row 3 always shows at least three. A 1px rule, not a thick one: the craft floor refuses a
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
| 1 | Hero, with the trust chip row inside it | split: title block with lead and CTA pair, HeroArt right from lg | no | no | node intent, CHAT |
| 2 | Which of these is your site doing | span grid of symptom cards (bentoLayout): a bento on three hubs, uniform 2-up on the other three | no | no | none |
| 3 | Most urgent problems | uniform image-led card grid (3 up at lg, 2 at sm), severity badge per card | no | no | none |
| 4 | What happens next | numbered step row (4 steps, 2x2 from sm, 1 column below) | no | no | none |
| 5 | Not sure which one | closing panel (shared ClosingCta) | no | no | node intent, CHAT |

Eyebrow budget: 5 sections, ceil(5 / 3) = 2 allowed, 0 used. No marquee. No image-plus-text splits at all.

Rows 1 and 4 changed on 2026-10-30, carrying the service template's 2026-10-28 audit across to the six hubs,
which were the thinnest page type on the site at three sections plus a hero. Row 4 is the same `StepRow`
primitive and the same `jobSteps` content the service pages use, so a third copy of the process was not
written and the hub cannot describe a different one. Its heading is "What happens next" rather than the
service page's "How this job runs" because a hub is a category page where nothing has been chosen yet.
It sits after row 3 and before the closing band so the reassurance is adjacent to the CTA, which is where
it does conversion work.

Repeating the four moves on both the hub and its services is deliberate. Many visitors land on a hub and
convert from it without opening a service page, and all three reference sites repeat their process at both
funnel depths for the same reason.

**No photograph was added, and that is a standing decision rather than an omission.** The hero dropped its
photograph in an earlier pass because the available hub frames were reused and several were dark, against
MASTER's bright-daylight direction, and an index panel only repeated the grid below it; `hubPhotos` was
deleted, so hubs carry no photo data at all. The service pages' placeholder photograph was an explicit
owner decision for that template and does not extend here.

**No subject icon was added to the row 2 cards.** They already carry a navigational caret, and their text
fit is tuned: `bentoLayout` weighs each card on the copy it actually holds and the 1.4 ratio was hand-tuned
against exactly this content. An icon per service would need a 32-entry map and would compete with the
symptom list inside the same cell, so the span variation stays the differentiator.

Row 2 reads the real intent mix of each hub. Measured: wordpress-fix 11 fix; wordpress-security 3 fix, 1 project; woocommerce 1 fix, 3 project; wordpress-maintenance 3 plan, 1 project; wordpress-performance-migration 3 project; wordpress-development 6 project. `symptoms` is empty on every non-fix service (serviceSchema refine), so a card shows its first three symptoms when it has them and otherwise its `summary`, `whoItsFor` and the first three `deliverables`. The heading follows: "Which of these is your site doing?" only when at least one card has symptoms, "Pick the work that fits" when none does. Row 3 renders only when the hub has guides (4 of 6 do: maintenance and development have none). It ranks by `Guide.urgency` and shows the urgency in words plus an icon (`UrgencyBadge`), never colour alone. The hero drops the photograph and carries no visual (contract rule 4 allows text plus CTA): the old hub photographs were reused frames, several dark, against the bright-daylight direction in MASTER, and an index panel only repeated the grid. `hubPhotos` is removed, so hubs carry no photo data. Row 4 replaces a closing band that repeated the node title and both hero buttons; it renders the page's primary CTA (`primaryCtaFor(node.intent)`, so PLANS on maintenance and QUOTE on development) beside `ChatButton`, which is the same pair the hero shows.

Row 2's mechanism was invented, tuned and measured on this page over two fix rounds, and the compare entry and the
/guides/ prose both document it while its origin page did not. `bentoLayout` (src/lib/bento.ts) decides per hub
whether the grid is a bento at all. It weighs each card on the text that card actually holds (`shown`, so symptoms
when a service has them and otherwise summary, whoItsFor and deliverables) and compares the heaviest to the
lightest against `UNIFORM_RATIO`, 1.4. Above it `bentoSpans` pairs the cards off into rows of the 6-column grid and
gives the heavier card of each pair the 4 and the lighter the 2, so no row is two equal cards and no long cell
lands in a narrow slot. At or below it the grid is a plain 2-up on 3-column halves, because near-equal weights
give `bentoSpans` nothing to differentiate and it would only invent wide cells the text cannot fill. Either way an
odd last card spans the whole row rather than leaving half a row empty, and spans map to class names through a
literal record in the template, because Tailwind v4's scanner never emits a computed `md:col-span-${n}`.

Measured against the real content, three of the six hubs take the uniform branch and are therefore not bentos:
`wordpress-maintenance` (ratio 1.28, four cards, 3,3,3,3), `wordpress-development` (1.20, six cards, 3,3,3,3,3,3)
and `wordpress-performance-migration` (1.12, three cards, 3,3,6). The three that are bentos are `wordpress-fix`
(1.67, eleven cards, ending on a 6), `wordpress-security` (2.63) and `woocommerce` (2.06). 1.4 was tuned by hand
against exactly this split, which is why the number lives beside the function and not in a template.

## Shared: the guide card has no banner, and the related block is one grid (2026-10-30)

Two changes that touch every page type, recorded here rather than in one template's table because both are now
single sources of truth read from several places.

**The banner came off `GuideCard`.** It was `guideArt(parent)`, which resolves from the parent service's hub and
intent. Every grid of guide cards on this site is grouped by parent or by hub, so that function could never
differentiate one card from its neighbour. Counted over the real content: all 26 guides under /wordpress-fix/
resolve to `working-at-laptop`, all 5 under /wordpress-security/ to `shield-and-firewall`, the 4 under
/wordpress-performance-migration/ to `metrics-and-team`, and a service page's 2 to 4 siblings to one picture by
construction. Every one of those grids was showing the same image three or four times down the column. The hub
template's own comment claimed the banner was "the thing that distinguishes one card from the next"; that was
wrong, and the comment is corrected in place. What actually distinguishes them is the urgency badge, the symptom
and the literal message, which is what a reader arriving from an error on their screen is matching against.
`guideArt` is deleted rather than flagged per caller, because there is no caller it was right for. This is the
image repetition that had been raised four times and recorded as recommended-and-not-taken; it is taken now.

`LinkCard`'s `art` is optional as a result. A banner belongs on a card only when it differs from card to card,
which is true of the pricing directory (32 services across six hubs) and of nothing else that uses the card.

**"Related" is `RelatedGrid`.** Only the service template ends on a related block today, across 32 pages, and it
was `LinkList`: a flat chip row of titles. Those paths point at four different kinds of page (category, service,
guide, comparison) and the chip said nothing about which, so the one fact a reader needed before clicking was
the one the control withheld. The grid card carries that kind as its label, from `kindForPath`, which reads the
same three sources `titleForPath` already resolves rather than inventing a second lookup. Two up, because the
measured content is 3 paths on 19 services and 4 on 13, which fills two columns with nothing stranded.

Rule 3 on the service page: the body now holds the what-we-do bento (icon tiles, not links, span-varied), the
guide card grid and the related grid. Three grids, which a strict reading of one-family-per-page does not love.
They are kept apart deliberately and by weight, not by hoping: the bento is unlinked icon tiles at varying
spans, the guide cards are full cards on `surface` with badges and a mono message line at three columns, and the
related cards are the lightest thing on the page, `surface-2` with no shadow, no summary and no banner, at two
columns. The alternative is to leave "Errors we fix here" as a row list, which is what was asked to change.

## v3 / city template (/wordpress-development/cities/<city>/)

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | split: narrow document header, HeroArt right from lg | no | no | QUOTE, CHAT |
| 2 | Local context | prose column | no | no | none |
| 3 | What <city> clients ask for | stacked link cards | no | no | none |
| 4 | How working with us runs | span bento of labelled delivery cards (bentoLayout) | no | no | none |
| 5 | Questions | disclosure list in a card | no | no | none |
| 6 | Closing | split band | no | no | QUOTE, CHAT |

Row 4 rendered `remoteDelivery`'s three items as three equal cards in a row, which contract rule 6 bans outright;
/about/ fixed the same breach on the same data and this file was the survivor. Spans now come from `bentoLayout`
weighted on the line each card actually holds (`r.text`, the hub grid's own weighting: the phase name is a label
row, not part of that line). Measured on the real copy the three run 65 to 90 characters, a ratio of 1.38, under
`UNIFORM_RATIO`, so the uniform branch returns (3,3,6): two a row, which rule 6 allows, and the odd last card
spanning the row rather than leaving half a row empty. 1.38 is close to the 1.4 threshold, so a reworded line
could flip these to the varied branch (2,4,6); both are correct here, because the spans map through a literal
class record that covers 2, 3, 4 and 6. The grid is one column below 768px, where three cards never fit anyway.

## v3 / compare template (/compare/<slug>/)

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | split: document header with lettered A/B chips, HeroArt right from lg | no | no | none |
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
| /pricing/ | scope and outcome: trust chips in the header, three equal tier cells with the centre ringed and scaled, outcome rows per tier, a numbered step row, an icon-marked inclusion list, a tabbed service card grid, a real comparison table, a disclosure FAQ and a split closing band | no | no | BOOK, PLANS, QUOTE, CHECK, CHAT |
| /about/ | company document: uniform hub cards two a row, ruled engagement rows, a grouped practice list, a city chip row and a closing band, with the shared rail beside the body from lg | no | no | BOOK, CHAT |
| /guides/ | urgency-grouped error cards under a search panel, then a service chip row and a closing prompt band | no | no | BOOK, CHAT, CHECK |

"Pick the error you are seeing" was cut down on 2026-10-30. The family did not change: it was a card grid and
it stays a card grid, which is what keeps the page at one family. What changed is density, measured first on
the rendered page at 1280: the section was 3,954px of a 6,901px document, 57% of the page, 37 cards and 1,053
words, each card four stacked text blocks of near-identical shape (grey service label, bold title, a two-line
grey symptom sentence, mono error strip). Matching an error against 37 paragraphs is reading, not scanning,
which is the complaint.

The card now holds two lines. Line 1 is the title. Line 2 is what the screen actually says: the literal
`errorText` in mono where the software prints one (20 guides), and otherwise the first symptom that does not
restate it, in plain muted text (17 guides). The mono/plain split is not decoration, it is the distinction
between a quoted message and a description of behaviour, and it is the second recognition key after the title.
Dropped: the parent-service label, which repeated down a group (five services cover most of the 20 critical
guides) and is still reachable from the chip row below, and the standalone symptom sentence, which is the first
thing the guide page itself says.

The grid went 2-up to 3-up at lg (`cardGrid`, the same constant the hub urgent grid and the pricing directory
read), so the groups read in a third fewer rows. The odd-last-card row span came out with it: that rule exists
for a 2-column grid, and in three columns a remainder of one or two cards is the ordinary shape. Each group
head gained its count, so a reader can judge a group's size and skip it without scrolling through it.

Not taken: collapsing the two lower-urgency groups behind disclosure. It would shorten the page further and it
is the obvious move, but the page already carries a real disclosure control in the FAQ family elsewhere on the
site, and 2026-10-30's earlier finding on this site was exactly that two sections which look alike and behave
oppositely are worse than a long list. A reader who is down right now should not have to open anything.

| /compare/ | stacked full-width comparison cards, each with A/B chips, summary and the criteria compared | no | no | BOOK, CHAT |
| /wordpress-development/cities/ | stacked link cards | no | no | QUOTE, CHAT |

/pricing/ gained three things on 2026-10-30, from the audit against fixmysite's own plans page: `TrustChips`
in the header, a numbered `StepRow` ("How the work runs") and an icon-marked list of what every option
includes, read from the gated `railPoints`. All three are existing components and existing gated content, so
nothing new was written. Families: the step row and the tick list are both new to this page, and the eight
blocks give ceil(8 / 3) = 2 eyebrows allowed with 0 used.

"Every service, grouped by the work" became a tabbed directory on 2026-10-30. It was three stacked lists under
three subheadings, so the page printed all 32 services at once and the reader scrolled past two thirds of them to
reach the third. The tabs are the three `Service.intent` values the content already carries, which is why no
content changed and the labels came free from the tier names: One-time fix (15 services), Care plan (3) and
Project (14).

Each panel is a card grid, not a row list: 2 up from sm and 3 from lg, every card carrying the illustration for
that service's subject (`serviceArt` in src/content/photos.ts, the same map the service hero reads, so the two
can never disagree). The row list it replaced gave 32 services one shape and no visual cue to which kind of work
each was.

Card banners use `cardArt` (src/content/photos.ts), which returns **landscape illustrations only**. The square
files are badge compositions on white: centred artwork with wide margins baked into the file, so cropped to a
16/10 banner they leave white down both sides that reads as padding and cannot be removed in CSS without cutting
the subject. They stay in heroes, where the frame is nearer square.

**Known and unresolved: a tab shows two distinct banners across fifteen cards.** Eleven of the fifteen one-time
fix services are in `wordpress-fix` and are all, semantically, the same subject, so a subject-driven map
correctly gives them the same picture. That is right and it still looks repetitive. Resolving it needs either
more landscape illustrations, or a per-service visual that is not a photograph: the Phosphor icon tile already
used by the typed section headers varies per service with no new assets. Raised with the owner rather than
decided here.

The hover scale sits on a frame inside the card rather than on the `<img>`, so the unveil's `scale(1.06)` start
and the hover's `1.04` never compound into 1.10 on first hover. They do not actually fight for one property:
Tailwind v4 emits `scale:` and `translate:` as standalone properties while the unveil writes the `transform`
shorthand, so the two compose. **Measuring a Tailwind v4 hover through `getComputedStyle(el).transform` reads
`none` and looks broken.** Read `scale` and `translate` instead; two passes were wasted on that here.

The hover is three things moving together and nothing moving the layout: the card lifts to `--shadow-lift`, the
illustration scales to 1.04 inside the card's own `overflow-hidden`, and the arrow nudges up and right. Transform
and opacity only, per rule 10, so nothing reflows and nothing shifts the cards around it; `motion-reduce` drops
all three. The scale sits on the image and not the card, because scaling a card in a grid moves its neighbours'
perceived alignment even when it does not reflow them.

It reuses the `StepsTabs` idiom rather than inventing a second tab pattern: Radix `Tabs` for arrow keys, Home and
End and roving focus, a shared-layout pill on the active trigger, panels kept mounted and `inert` so the change is
a real crossfade. `layoutId` is `service-pill`, distinct from the home page's `steps-pill`, so the two can never
animate into each other. Family check: /pricing/ had no tabbed section before this, and the home page's tabbed
showcase is a different page.

"What each one covers" was redesigned on 2026-10-30: it was four rows of prose, three columns wide, and had to
be read rather than scanned. It is still a table, which is the right semantic for a comparison and the only
instance of that family on the page, but the cells are now shapes.

"How the work runs" was a comma-joined list of verbs and is now one pill per verb carrying its own glyph from
`whatWeDoIcons`, the same map the service pages use, so the shape of the work reads before a single word does
and the two surfaces cannot disagree about which glyph means which verb. "How it is priced" is a pill rather
than a sentence. Every row label carries its own icon, so the left column is scannable too. The head is
`sticky` inside the scroll region, because on a four-row table it scrolled away before the last row and which
column you were in stopped being obvious.

The care-plan column is tinted and carries an "Ongoing" text badge. The tint is never the only marker (rule 9),
and the badge is the same word the tier card above it uses.

21st.dev was searched for this and nothing could be installed: its comparison components are all boolean
check-and-cross matrices, and these cells are prose, verb lists and deliverables. What transferred was the
principle, that a comparison should be read by shape, plus the sticky head and the highlighted column.

Two of the reference's pricing devices were deliberately not copied. Its price-comparison matrix needs
numbers, and every `priceFrom` is still null, while the page's existing "What each one covers" table already
does the comparison job without them. And its FAQ is grouped under six labelled headings because it carries
about 28 questions; ours carries 7, where grouping would be scaffolding around nothing. A flat disclosure
list is the right shape at that size, so the FAQ was left alone.

The booking form (src/app/contact/BookingFlow.tsx) is shared by /free-site-check/ and /contact/, so it carries one
v3 style: 12px inputs on --line-strong, 44px targets, a step progress bar, and inline errors under each field.

/guides/ is one page of four blocks, which is why its single layout-family cell reads as a list: a document header
holding the search panel, the catalogue, the chip row and the closing band. Four blocks, so ceil(4 / 3) = 2
eyebrows allowed and 0 used, no marquee, no image-plus-text split anywhere on it.

A topic filter was approved in the 2026-10-30 audit, after fixed.net's /resources, and then not built. Three
reasons, all found while implementing it. This page already rejected one in writing: the search panel is the
site's own command palette, chosen "rather than a second filter written for this page". It would be the third
discovery axis here, after that palette and the urgency grouping. And a `?category=` filter turns one index
into seven near-identical views of the same 37 guides, which is the thin-content shape foundation.md warns
about for city pages, and would need canonicals and sitemap handling to be safe. The per-element entrance on
the group headers and the cards was added; the filter was raised with the owner instead of shipped.

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
table, the FAQ and the closing band. The three tiers are equal-width cells of `md:grid-cols-3`, not unequal cards:
what sets the centre apart is the accent ring, the `md:scale-[1.04]` and the badge that says in words what the
ring means, and that distinction is the whole rule-6 justification, so it has to be stated accurately. The tier grid is `md:items-stretch`, not `md:items-center`: the cards end on
`mt-auto pt-8` so their CTAs align at the card foot, which only works when the cells are stretched to equal
height, and under `items-center` each cell was content height and the three CTAs sat at three different heights.
Stretched is also what the cards already do in the scroll-snap row below md, so both widths now agree. Six blocks, so ceil(6 / 3) = 2 eyebrows allowed and 0 used, no marquee, and
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
wider. "Per month" is a string hardcoded in pricing/page.tsx, not read from `care-plans.summary`: it is written to
agree with that summary ("A monthly plan where we handle updates, backups, monitoring and security checks"), and
the code's own comment says so, but an edit to `summary` will not update it and nothing fails if the two diverge.
An annual option is named only once `planAnnual` is published, so the page never states a billing option no
content backs. Typical turnaround is a row that appears only
once an anchor publishes one. It does not repeat the price: the cards carry the price slot, and repeating it here
would be a second treatment of the same gated value.

The FAQ reuses the mechanism from the home `Faq` section rather than new copy: seven questions referenced by
service id and exact question text, resolved from the content files, so rewording a question fails the build
instead of letting the two drift. It renders through `Faqs` (parts.tsx), the disclosure list in a card, and emits
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
what the footer and the breadcrumb print. Six blocks: a document header, the hub cards, the engagement rows, the
practice list, the city chips and the closing band, so ceil(6 / 3) = 2 eyebrows allowed and 0 used. Marquee is
`no`. The page carries no photography, so it has zero image-plus-text splits and the 2-consecutive limit cannot
be reached; the frames now referenced by nothing are all `tone: "red"`, which MASTER.md:39 locks out of v3,
so none of them is a candidate and nothing is logged to image-todo. There are four of them, not three:
`laptop-hands`, `monitors`, `alert` and `keyboard-red`. `hero-console` is not among them, because `Bento.tsx:45`
still falls back to it when the capture is missing, and a scan for `"alert"` finds `role="alert"` in the booking
flow, which is not a use of the frame. The conclusion is unchanged by the correction: all four are red.

No two blocks share a layout family: cards (the hub grid), full-width label rows (the engagement list), a
grouped icon list two items to a group (the practice list), a pill chip row (the cities) and a split band
(closing). The rail is not a sixth family; it is the one `FactRail` node, in the aside beside the body column.

Unlike the service and guide templates, the rail is `hidden` below lg here. It carries no claim `points` on this
page, because the practice list is the same promises in full, so its whole body below lg would be
`brand.guarantee`, which is still a placeholder: a lone card reading "Placeholder, not a real offer yet." is
worse on a narrow screen than no card. Nothing is lost there. The fixed bottom bar is already the CTA under lg,
and the footer links /legal/guarantee/ at every width. Deleting one `hidden` brings it back the day the
guarantee is real.

Block 2 replaces the `LinkRows` of the six hubs, which was the third appearance of that divided-row pattern
across the in-scope pages and showed `hubLead` only as a one-line summary. A card carries the hub's first
sentence that fits rule 4's 25-word cap on supporting copy, since every `hubLead` runs 36 to 46 words: measured,
that is 20, 23, 13, 11, 14 and 22 words, the opening sentence for four hubs and the second for the two whose
openers run 26 and 33. The development lead's second sentence gained one word in `3ddde13`, so that card reads
14: its pronoun had no noun once the sentence was excerpted from the paragraph.

The cards are uniform, two a row from md, which rule 6 allows; it bans three. This block carries no bento, and
the reason is a measurement rather than a preference. Weighted on the line a card actually holds, as the hub
grid weighs its own cells, the six run 61 to 128 characters, a ratio of 2.10, so `bentoLayout` returns a real
bento of (2,4) (4,2) (2,4). Built and looked at, that grid is worse at both widths: the longest line left is 23
words, so every 4-span cell sits half empty, and the 2-span cell is 227px at 768, which breaks "WordPress Fixes
& Error Resolution" onto three lines beside a half-empty neighbour. Trimming the copy to the cap is what took
the variance out of the content, and `bentoLayout` returns this same uniform shape for the untrimmed paragraphs
(ratio 1.21). The guides index made the same call for the same reason, which Task 2 recorded: asymmetry over
content that cannot fill it only invents cells. The whole card is the link, with the title as its accessible
name and the hub-page fallback for browsers without `:has()` so focus is never invisible.

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
grouped two-up icon list in the body column, and the icons are the one thing the two share, because icons are
not content: `practiceIcons` sits in `parts.tsx` with the other shared primitives, so neither page depends on
the other, and it is keyed by the `PracticeId` union `notices.ts` exports, so a practice item added without an
icon is a compile error rather than `undefined` rendered as a component.

Block 5 is coverage, from the eight real city files, as a row of pill links to the city pages under
`citiesLead`, which states that the work is remote. It is headed "Where we work", not "Where our clients are":
those eight pages are the `/wordpress-development/cities/` taxonomy and their content is what websites in that
city are usually built to do, so nothing in `src/content` establishes a client in any named city, and a heading
that implies one is social proof invented from a route tree. No `LocalBusiness` JSON-LD and no address: there
is no office in any city, which is the decision `CityTemplates.tsx:32-34` records and nothing here contradicts
it. No count is printed; eight links are their own quantity, and a count framed as an achievement is rule 8.

The rail carries `brand.guarantee` with the placeholder disclosure `FactRail` already renders, and the CTA pair.
It carries no claim `points`: block 4 is the full practice on this page, and the rail would print the same
promises a second time in shorter words.

## v3 / contact (/contact/)

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| 1 | Intro column + form card | 5/7 split, intro left, tabbed flow card right | no | no | CHAT (intro) |
| 2 | Booking flow | named-screen wizard inside the card (Problem, Your site, Contact, Confirm) | no | no | BOOK or QUOTE or CHECK on the last screen |
| 3 | Success | confirmation state replacing the flow, with handoff disclosure and CHAT | no | no | CHAT |

Three sections, so ceil(3 / 3) = 1 eyebrow allowed and 0 used. No marquee, and no two rows share a layout family.
The mode here is Operate, not Persuade: the page is a tool someone types into, so it carries no imagery, no bento
and no second rail, and the bar for changing anything is that it makes the form easier to complete.

Two flows share the page: Emergency ticket (routes.book) and Project enquiry (routes.quote, type=project), each
keeping its own sessionStorage draft. /free-site-check/ runs the same component in "check" mode.
Progress is shown by screen name only, never "Step 1 of 4". The generated booking override suggests red/orange/green
step colours; the v3 colour lock wins, so every screen uses the single accent.
/contact/thanks/ was deleted: the success screen is now part of the flow, so the redirect target was dead.

The Radix tab panel is `tabIndex={-1}`: Radix makes it a tab stop, and on a panel this tall focus can only show as
a ring around the whole card or, with `outline-none`, not at all. Its first field is the next stop either way.
The success disclosure row is 44px tall with the hidden marker and caret the shared `Faqs` summary uses, so it is a
rule-5 target rather than a 20px line of text.
Every fixed-price sentence on the page now reads `claimLine.fixedPrice` from src/content/notices.ts behind
`brand.claims.fixedPrice`, with the `// brand.claims.x` marker beside it: the lead paragraph, the confirm note (both
lines, and the note box with them) and the success reply line. With the claim off each one drops to a shorter
sentence that still reads. `brand.claims.checkTurnaround` stays interpolated into the check flow's success line.
The tabs are a deliberate MASTER deviation, not an oversight: MASTER's tabs spec wants an accent thumb animated
with a shared `layoutId`, and these change background instead. Radix already supplies `role="tablist"` and
arrow-key selection, which is the functional half of that spec, and the mode here is Operate: a motion island on
a form buys no completion speed. The guarantee's placeholder disclosure is its own line in the shared wording
rather than a prefix, because `brand.guarantee.summary` already opens with the same word while it is unset.
Text-entry inputs carry the MASTER input spec in full, 12px 16px padding included; the radios inherit the label's
14px, which is not an iOS zoom trigger. "Who hosts it?" is `autoComplete="off"`: no token names a hosting provider,
and "organization" was offering the visitor's own employer.

## v3 / the bento entrance, as a deliberate MASTER deviation

MASTER.md:203 specifies the bento entrance: `whileInView`, opacity 0 to 1 and y 16 to 0, 60ms stagger, spring
stiffness 100 / damping 20, `viewport={{ once: true }}`, communicating reading order across the grid. The home
page has it. The six span grids and card grids added on this branch do not: the hub template, the service
template, the compare template, /guides/, /about/ and the city template are all static, because the motion lives
in `BentoMotion.tsx` and `Bento.tsx` is the only file that imports it.

That is the right call under contract rule 13 and not an oversight. `BentoMotion.tsx` is a `'use client'` leaf, so
importing it into those six would put client JS in the LCP path of every template on the site to animate content
that is already readable without it; five of the six are the first grid on their page, so the entrance would be
running where it cannot communicate reading order the reader has not reached yet. The home page is the one place
the grid is the page's argument rather than its index, and it is also the one page where the entrance is below a
hero that has already loaded. Recorded here in full because the contact tabs' MASTER deviation is recorded in full
further up and this one, across six templates, was not recorded at all.

## v3 / live chat

Our own launcher (`src/components/sections/v3/ChatProvider.tsx`), never the vendor's bubble, which is hidden by
CSS the adapter injects. Fixed bottom right, 24px insets, 44px tall, label from md up; hidden under 768px where the
bottom bar already carries chat, and hidden on /contact/ and /free-site-check/ so it cannot sit on a submit button.
The vendor script loads on first launcher click, or on requestIdleCallback after the window load event, never in
the critical path. Blocked or missing script falls back to a dialog with BOOK and the support address.
No provider is configured (NEXT_PUBLIC_CHAT_PROVIDER), so nothing third-party is requested and no presence dot renders.
