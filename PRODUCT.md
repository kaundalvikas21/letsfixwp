# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

No i18n framework. `lang="en"` with Open Graph locale `en_IN`; no locale routing.

## Users

**Primary.** An Indian WordPress site owner or small business whose site is down, hacked, or losing sales
right now. Often on mobile, often non-technical, often arriving from a search for the literal error text
their site is printing. They are in a stressful moment and want one thing: someone to fix it.

**Secondary, and deliberately lower in the nav.** Buyers of care plans, migrations, and development
projects. Agencies reselling support via `/wordpress-maintenance/white-label/`.

Per-service audience is a content field, not a guess: `whoItsFor` on every service in
`src/content/services/`. Example, `emergency.ts`: "Owners whose site is offline right now and who cannot get
into wp-admin to undo whatever changed."

## Product Purpose

On-demand WordPress repair and care at letsfixwp.com. Most visitors arrive with a broken site, pick their
problem, and either book a fix or open live chat.

Success is the visitor naming their problem and reaching a booked fix or a live conversation in about two
minutes. The home page and nav stay emergency-first; development and city pages never outrank fixes.

Home H1 as built: "Broken WordPress? Back online today."

## Positioning

Emergency-first triage, not a contact form.

`src/lib/match-problem.ts` scores the visitor's own free text against 37 per-error guides (title,
`errorText`, symptoms) and the fix-intent services, and returns the top three. Every result resolves to a
service, so the BOOK call to action never has a dead target. The visitor does not need to know what is wrong,
only what they are seeing.

The service promises behind it, all confirmed by the owner: a fixed price agreed before work starts, a full
backup taken before any change, work done through a login the client creates (never their password), and
that access removed when the job is done.

## Operating Context

**Booking.** Lives on `/contact/` (`src/app/contact/BookingFlow.tsx`), reused in `check` mode on
`/free-site-check/`. Reached through `routes.book({ service, guide?, url? })`.

Three request types (`src/app/contact/booking-schema.ts`), with named screens, never numbered:

- `fix` -> Problem, Your site, Contact, Confirm
- `project` -> Project, Contact, Confirm
- `check` -> Your site, Contact, Confirm

**Field contract.** `type, service, guide, description, siteUrl, host, access, budget, timeline, name,
email, phone, contactMethod`. These names are part of the analytics and autofill contract. Do not rename them
silently.

**It never collects credentials.** Access options are `secure-link` (default), `have-ready`, and `need-help`.
There is no password field, on purpose, and the page says so out loud. Budget buckets are currency-derived:
INR `[50000, 200000, 600000]`.

**Submission.** Drafts persist in `sessionStorage` under `booking-draft`. The Server Action `submitBooking`
(`src/app/contact/actions.ts`) revalidates the whole payload with the same zod schema and returns
`{ ok: true, ref }` with `ref = LFW-<base36>`. It delivers nothing yet. `src/lib/booking.ts` falls back to a
prefilled `mailto:`, and while `brand.email` still holds its placeholder it degrades further to a ticket the
visitor copies by hand.

**Nulls render nothing.** `src/lib/status.ts` returns all nulls until a chat provider is wired.
`src/content/pricing.ts` is all nulls, as are `typicalTurnaround` and `priceFrom` across every service file.
The UI hides a null field rather than estimating it. Never invent a number here.

**Instrumentation.** `src/lib/track.ts` has typed events (`cta_book_click`, `cta_chat_open`,
`cta_plans_click`, `cta_quote_click`, `cta_check_click`, `problem_search`, `booking_step`,
`booking_complete`) and no vendor wired.

**Call to action wording** is centralised in `src/config/cta.ts`, one label per intent. `npm run check` fails
the build if any of those strings appears anywhere else.

## Capabilities and Constraints

**Stack.** Next.js 16.3.8 App Router, React Server Components by default, React 19.2.8, Turbopack,
`trailingSlash: true`. TypeScript strict. Tailwind CSS v4. `motion/react` plus gsap. `@phosphor-icons/react`
as the only icon family. Radix and shadcn primitives only, never in default styling. react-hook-form with
zod 4. `next/font` only. `next/image` for every raster. No test framework; checks are assert-based scripts.

**Information architecture is frozen** in `src/config/sitemap.ts`: 1 home, 6 hubs, 32 services, 1 city hub,
8 cities, 5 pages, 2 collections. Never add, rename, or drop a sitemap page without asking. `/supporting/` is
not a page and must never be created.

**Every internal link comes from `src/config/routes.ts`.** `npm run check` bans hardcoded internal paths, and
`scripts/route-test.ts` fails the build if a sitemap path has no route or a route has no sitemap entry
(utility routes whitelisted).

**Content model.** zod schemas in `src/content/schema.ts` for Service, Guide, City, and Compare, documented
in `docs/foundation.md`.

**Cities** (`inNav: false`, priority 1 to 8): Chennai, Delhi NCR, Bengaluru, Ahmedabad, Kolkata, Pune,
Mumbai, Hyderabad. Each page must be substantially unique, never a doorway page. Service JSON-LD with
`areaServed`; never LocalBusiness unless a real address exists. No invented clients, offices, addresses, or
reviews. No `AggregateRating` without real review data.

**Content rules enforced by `npm run check`** (`scripts/check-content.ts`): no em-dash or en-dash anywhere in
`src`; a banned filler-word list in `src/content/**` (elevate, seamless, unleash, revolutionize, robust,
leverage, cutting-edge, delve, empower, streamline, unlock, supercharge, game-changer); asserted
`matchProblem` behaviour.

**Chat.** crisp, intercom, tawk, and chatwoot are supported via `NEXT_PUBLIC_CHAT_PROVIDER`,
`NEXT_PUBLIC_CHAT_ID`, and `NEXT_PUBLIC_CHAT_HOST`. Unconfigured, it ships no vendor code and falls back to a
dialog. Operator presence comes only from vendors with a real `available()`.

**Open decisions.** These are open, not undecided-looking defaults. `src/config/brand.ts` wraps each in
`confirm(...)`; `next.config.ts` warns on every build and throws when `VERCEL_ENV=production` or
`BRAND_STRICT=1`:

- support email address
- GST registration and GSTIN
- LetsFixWP's own guarantee. Today a visibly labelled 14-day placeholder: the hero drops the clause from its
  subtext while `placeholder` is set, and `/legal/guarantee/` prints "Placeholder guarantee, not a real
  offer. Replace before launch."
- chat provider
- booking handoff. The `razorpay`, `stripe`, and `cal` branches of `src/lib/booking.ts` currently throw.
- per-problem turnaround and price, which stay null until the owner supplies them
- the unmapped legacy URL decisions listed in `docs/audit.md`

No phone number exists anywhere in the repo, although the booking form collects one.

## Brand Commitments

**Name.** LetsFixWP, always read from `brand.name`, never hardcoded.

**Currency.** INR. India-first, confirmed by the owner. Corroborated by `src/content/notices.ts` ("We work
with businesses across India remotely"), the `en_IN` Open Graph locale, and the INR budget buckets.

**Voice.** Urgent but calm, trustworthy, direct, content-first, fast. Real specific copy. No filler verbs, no
em-dashes or en-dashes.

**Confirmed promises.** The eight entries in `brand.claims` are confirmed by the owner and are the only speed
and safety claims that may appear anywhere: a broken site is back online the same day; every engineer is
vetted; booking a fix takes about two minutes; fixes are fixed price, agreed before work starts; a full
backup is taken before any change; we work through a login you create for us and never ask for your password;
our access is removed when the work is done; a free site check comes back in two working days.

**Hard ban: fixmywp.com.** That is a different company, still live and trading. None of its content, claims,
testimonials, address, or legal text may appear here on any design variation. `brand.legacy.enabled` is
`false` for good, confirmed by the owner on 2026-10-07; do not flip it back without a written instruction.
`scripts/check-content.ts` fails the build on that company's facts, with only `brand.ts`, `testimonials.ts`,
and `redirects.ts` exempt. Specifically not ours: the 30-day guarantee, the "restored in a day or less"
promise, the care plan's $150 free fix, the Eugene OR address and PST hours, and the Sean Garrity and Joe Kwak
testimonials. `legacyFacts` in `brand.ts` is dead code kept only until a removal pass.

**Open question, recorded not resolved: which value is the brand colour.** `brand.accent` is `#CC3333`, but it
reaches the interface only through the Open Graph border (`src/lib/og.tsx`). The shipped V4 world locks a
dark-only theme on ember `#FF5A36`, and the CSS `--accent` custom property is a third value again. This needs
the owner, not a design decision.

## Evidence on Hand

**Real.** 37 guide files (`src/content/guides/`), 32 service files, 3 compare pages, 8 city files. 15
photographs in `public/site_images/`, catalogued by tone in `src/content/photos.ts`; only one is a daylight
frame, so several slots currently run off-direction stand-ins, logged per slot in `docs/image-todo.md`. 74 QA
screenshots in `docs/qa/`.

**Real error screens, not yet captured.** `scripts/capture-errors.mjs` (`npm run capture`) boots a throwaway
WordPress through `@wordpress/env`, breaks it one way at a time, and captures 1600x1000 screenshots with
Playwright into `public/screens/<guide-slug>.png`: white screen of death, critical error notice, database
connection error, maintenance mode, too many redirects, and a restored frame. `public/screens/` does not
exist yet; the run is blocked on Docker per `docs/image-todo.md`. This mechanism is the reason div-built fake
screenshots are banned rather than needed.

**Absent, and must not be fabricated by any future work:**

- Client testimonials. `src/content/testimonials.ts` opens with "PLACEHOLDERS, not testimonials. Nobody said
  these words." Both entries carry `placeholder: true`, the cards label themselves as placeholders on screen,
  `ServiceTemplate.tsx` filters them out entirely, and `next.config.ts` counts them and fails a production
  deploy.
- Case studies. `/case-studies/` renders a deliberate empty state: "No case studies are published yet. We add
  them once clients approve the write-up."
- Prices, turnarounds, review ratings, response times, offices, and addresses.

## Product Principles

1. **Emergency before everything.** Development and city pages never outrank fixes in the nav.
2. **Every path ends in a bookable fix.** No dead-end diagnosis; the matcher always resolves to a service.
3. **Null over invented.** An unconfirmed number is hidden, never estimated.
4. **The visitor's words, not ours.** Guides carry the literal error text people actually search for.
5. **Nothing borrowed from fixmywp.com.** Ever.

## Accessibility & Inclusion

The standing bar, already established and already met, not a new promise. From
`docs/section-contract.md` rules 5, 9, and 13: WCAG AA contrast in both themes (4.5:1 body, 3:1 large text
and UI), one h1 per page, landmarks, full keyboard operation, reduced-motion respect, 44x44 touch targets, a
2px accent focus ring. Performance budget LCP under 2.5s, CLS under 0.1, INP under 200ms.

`docs/qa-report.md` records axe-core at zero violations of any impact across 375, 768, 1024, and 1440 widths
including reduced-motion, on home, service, guide, and contact.

One open gap: the service page meets the performance budget at Lighthouse mobile 93, but the home page does
not, at Performance 69 with LCP 5.2s. The diagnosis and a measured-worse `next/dynamic` attempt are recorded
in the QA report. This is an open issue, not a solved one.
