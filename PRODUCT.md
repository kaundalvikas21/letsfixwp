# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: the owner or manager of a WordPress site that is broken right now. They arrive mid-emergency,
often from a search for the literal error their site is printing ("error establishing a database
connection", "critical error on this website", a white screen). They are not shopping; they want the
site back and they want to know who is touching it. Technical confidence ranges from none to
"I already tried deactivating plugins".

Secondary, not in an emergency: owners buying a care plan or pay-as-you-go support hours; businesses
commissioning a migration, a WooCommerce build, or development work; agencies looking for white-label
delivery.

Market: India, selling in INR (confirmed 2026-10-22). The eight city pages (Mumbai, Delhi NCR,
Bengaluru, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad) are the local market, not a delivery-location
artifact. Nothing on the site may assume a US or European timezone, currency, or business hours.

## Product Purpose

An on-demand WordPress repair and care service at letsfixwp.com. The site's job is to let a visitor in
an emergency name their problem and either book a fix or reach a live engineer, in as few steps as
possible. Success is a booked fix or an opened chat, not a read page. Secondary success is a care plan,
a quote request, or a free site check.

## Positioning

Emergency-first and diagnosis-led: the visitor enters through their own error message, and every error
resolves to a specific fix with a specific owner. Repairs are carried out by an in-house team
(confirmed 2026-10-22), not an anonymous ticket queue or a freelancer marketplace, which is what makes
the same-day and access-handling promises below ones the business can actually keep.

The home page and navigation stay emergency-first. Development, city, and plan pages never outrank
fixes in the nav.

## Operating Context

- Visitors land on a guide for one specific WordPress error, or on a fix service page, far more often
  than on the home page. Guides must convert, not just inform.
- The visitor usually cannot log into their own site, and may be reading on a phone, from a hosting
  support chat, or from an email alert.
- Access to a client's site is granted as a login the client creates; work is done on the live site or
  a copy of it, after a backup.
- Information architecture is fixed by `src/config/sitemap.ts`. Pages are not added, renamed, or dropped
  without the owner's say.
- Every CTA label comes from `src/config/cta.ts`: BOOK "Fix my site", CHAT "Chat with an engineer",
  PLANS "See plans", QUOTE "Get a quote", CHECK "Get a free site check". No other CTA wording exists.
  CHECK appears only where the visitor is not in an emergency.

## Capabilities and Constraints

Confirmed capabilities: emergency repair (white screen, critical error, database connection, server
errors, login lockout, email, page-builder breakage, failed updates and migrations); malware removal,
blacklist removal, and SEO spam cleanup; site recovery and restores; speed and Core Web Vitals work;
hosting and platform migration; WooCommerce fixes and development; care plans and pay-as-you-go support
hours; custom theme and plugin work, redesign, and white-label delivery for agencies.

Claims the business stands behind (confirmed 2026-10-22, all four):
- a broken site is back online the same day;
- fixes are fixed price, agreed before work starts;
- a full backup is taken before any change;
- work happens through a login the client creates, the password is never asked for, and access is
  removed when the job is done.

Engineers are in-house. Copy may say so; it may not imply a vetted contractor bench, a 24/7 rota, or
named staff who do not exist.

Explicitly undecided, and not to be invented:
- every published price (`src/content/pricing.ts` is all `null`; the UI hides null price fields);
- per-service `typicalTurnaround` and `priceFrom`;
- support email address;
- GST registration and GSTIN;
- how long booking takes and how long a free site check takes to come back;
- live chat provider (`NEXT_PUBLIC_CHAT_PROVIDER`), and therefore whether engineers-online and
  median-response figures can ever render — `getSiteStatus()` returns nulls and the UI renders nothing
  for a null field;
- booking and payment handoff (Razorpay, Stripe, Cal.com, or none — today a booking is handed over by
  email);
- LetsFixWP's own guarantee: the one in `brand.ts` is a visibly marked placeholder and fails a
  production deploy until the owner replaces or removes it.

Unconfirmed values are typed `confirm(...)` placeholders in `src/config/brand.ts`: they warn in dev and
fail a production build. `scripts/check-content.ts` fails the build on forbidden content.

## Brand Commitments

- Name is LetsFixWP, at letsfixwp.com. Always read from `brand.name`; never hardcode it.
- Accent `#CC3333`.
- fixmywp.com is a different company that is still trading. Its content, claims, testimonials,
  guarantee, address, hours, and legal text may never appear here, on any design variation
  (`brand.legacy.enabled` is false for good, confirmed 2026-10-07). The legacy redirect table and
  legacy facts in `brand.ts` are dead code kept only until a removal pass.
- Icons: `@phosphor-icons/react` only. Type via `next/font` only.

## Evidence on Hand

- Real, specific written content: 32 service files, the seeded error guides, eight city pages, and
  three comparison pages, all under `src/content/`.
- Real error screenshots are producible, not invented: `scripts/capture-errors.mjs` boots a local
  WordPress with `@wordpress/env` and captures genuine error states with Playwright into
  `public/screens/<guide-slug>.png`.
- Absences that must never be filled with invention: there are no testimonials
  (`src/content/testimonials.ts` is placeholders, visibly marked, and fails a production deploy), no
  case study clients, no published prices, no review data (so no AggregateRating), no real street
  address (so Service JSON-LD with areaServed, never LocalBusiness), and no named customers or logos.

## Product Principles

1. The emergency outranks everything. A visitor who cannot get into their site reaches a fix or a human
   without reading marketing.
2. The visitor's own error message is the entry point. Guides are conversion surfaces, and every match
   resolves to a bookable service.
3. Nothing is claimed that the business has not confirmed. A null price, turnaround, or figure renders
   as nothing, never as a plausible number.
4. Trust is earned with specifics about access and process, not with adjectives: backup first, a login
   you create, access removed, a price agreed up front.
5. The other company's history is not ours. No borrowed proof, ever.

## Accessibility & Inclusion

WCAG AA, per `docs/section-contract.md` rule 9: 4.5:1 body and 3:1 large-text/UI-boundary contrast in
both themes, semantic landmarks, one h1 per page, aria-labels on icon-only buttons, keyboard operation
throughout, reduced-motion respected, and pause plus previous/next controls on any carousel or marquee.
Emergency visitors are stressed and often on a phone, so tap targets, contrast, and text size carry
real weight here.
