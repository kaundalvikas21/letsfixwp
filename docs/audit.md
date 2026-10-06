# fixmywp redesign audit (taste-skill 11.B)

> **Status after Prompt 0.1 (sitemap migration):** the site is now letsfixwp.com with the IA in `src/config/sitemap.ts`. Everything below about fixmywp.com (brand claims, testimonials, address, legal text, old URLs) applies **only when `brand.legacy.enabled` is true** in `src/config/brand.ts`, which defaults to false. While it is false none of those claims render, the legal pages show a pending notice, and the fixmywp.com redirects are off.
>
> **Legacy redirects** (when enabled) live in `src/config/redirects.ts` as host-matched 301s for `fixmywp.com` and `www.fixmywp.com`. Host-level alternative: point fixmywp.com at a redirect-only host (Cloudflare Redirect Rules, or an nginx `server` block) that returns 301 for the six mapped paths and sends every other path to the letsfixwp.com home page. Either way, keep the old domain registered and verified in Search Console and submit a Change of Address.

Mode: **Redesign, Overhaul**. New visual language; content, URLs and SEO equity preserved.
Source: facts supplied in the foundation brief, plus one read of the live /testimonials, /tos and /privacy-policy pages (owner approved) for verbatim quotes and legal text. No other scraping.

## Live slugs that must keep returning 200 at the same path

| Path | New implementation |
| --- | --- |
| `/wordpress-hacked-fix` | Problem template, `hacked` (canonical here) |
| `/fix-wordpress-theme` | Problem template, `theme-broken` (canonical here) |
| `/fix-wordpress-plugin` | Problem template, `plugin-conflict` (canonical here) |
| `/app` | Booking flow. Every get-help button points here |
| `/wordpress-maintenance-services` | Care plan page (PLANS CTA target) |
| `/testimonials` | Testimonials page, live meta title and description kept |

`/fix/hacked`, `/fix/theme-broken`, `/fix/plugin-conflict` send 308 to the legacy URLs above.

## Other live URLs found in the live nav and footer

| Live path | Handling |
| --- | --- |
| `/about-us` | 308 to `/about` |
| `/tos` | 308 to `/legal/terms` (text kept word for word, noindex kept) |
| `/privacy-policy` | 308 to `/legal/privacy` (text kept word for word, noindex kept) |
| `/wordpress-support-request` | 308 to `/app` (it was the "Submit Ticket" and emergency support target) |
| `/fix-wordpress-services` | 308 to `/fix` |
| `/wordpress-optimization` | 308 to `/fix/slow-wordpress-site` |
| `/testimonials/page/:n` | 308 to `/testimonials` |
| `/wordpress-upgrade` | **Unmapped. Owner decision needed** (closest: `/fix/failed-core-update`) |
| `/wordpress-installation-services` | **Unmapped. Owner decision needed** (no matching service in the new IA) |
| `/affiliate-terms-conditions` | **Unmapped. Owner decision needed** (legal copy, must not change silently) |
| `/blog`, `/blog/*.php`, category hubs (`/security`, `/plugins`, `/themes`, `/maintenance`, `/woocommerce`, `/troubleshooting`, `/wordpress-seo`, `/performance`, `/content`, `/website-security-terms-glossary`) | **Out of scope, highest SEO risk.** The blog must stay on the old stack or be migrated before DNS cutover |

## Brand tokens

- Primary red `#CC3333`, secondary green `#399A35` (`src/content/site.ts`)
- Support email `help@fixmywp.com`
- Promises: 30-day guarantee on services; hacked sites "restored in a day or less"
- Hosting and maintenance plan includes one free fix ($150.00 value)
- Footer facts kept: 2852 S. Willamette St. #272, Eugene OR 97405; Mon. to Fri. 8am to 6pm PST; "24/7 Emergency Client Support"; not affiliated with Automattic disclaimer
- Type stack, logo treatment, radii: not assessed (no visual audit in this pass). Logo and wordmark must not change without approval (11.F)

## Information architecture

```
/                         home: triage, critical problems, all problems by category, testimonials, plan
/fix                      problem index: search + category filter
/fix/[slug]               34 static problem pages
/[legacySlug]             3 static problem pages at their live URLs
/app                      booking flow (?problem=<slug>&url=<site>)
/pricing  /wordpress-maintenance-services  /testimonials  /about  /contact
/legal/terms  /legal/privacy  /legal/guarantee
```

Primary nav keeps the live labels: WP Help, Got Hacked?, Pricing, About Us, Testimonials (plus Contact). Live "Pricing" pointed at `/wordpress-maintenance-services`; it now points at the new `/pricing`, which links to the plans page. **Confirm with owner.**

## Conversion paths

1. Problem page: BOOK ("Fix my site") to `/app?problem=<slug>`, or CHAT ("Chat with an engineer").
2. Home triage: free-text symptom to top 3 matching problems, each with BOOK.
3. Plans: PLANS ("See care plans") to `/wordpress-maintenance-services`.

Events (`src/lib/track.ts`, no vendor yet): `cta_book_click {location, problem}`, `cta_chat_open {location}`, `problem_search {query}`, `booking_step {step}`, `booking_complete`.
Booking field names (analytics and autofill contract): `problem`, `description`, `siteUrl`, `name`, `email`, `phone`.

## Content blocks

- Doing work: problem-specific pages, the 30-day guarantee, the hacked-site promise, the two approved testimonials.
- Retire: the live site's other testimonials are not approved for reuse yet (only Sean Garrity and Joe Kwak are). Copyright line "2013-2017" is stale.

## SEO baseline

- Live testimonials meta: title "WordPress Testimonials for Fix My WP", description "Client Testimonials for our Fix WordPress Services" (kept).
- Live legal pages are `noindex, follow` (kept).
- New: per-route `generateMetadata`/`metadata`, canonical on every page, JSON-LD (Organization; Service + Offer, FAQPage, BreadcrumbList per problem), sitemap.xml, robots.txt, per-problem Open Graph images. No AggregateRating (no review data).

## Requirements analysis (ui-ux-pro-max Step 1)

- Product type: Tool / service conversion site (on-demand emergency repair).
- Audience: WordPress site owners and small businesses in a stressful moment (site down, hacked, losing sales), often on mobile, often non-technical.
- Style keywords: urgent but calm, trustworthy, direct, content-first, fast.
- Stack: Next.js 16 App Router (`--stack nextjs` for any search).
- Platform: web, desktop and mobile.

## Owner inputs still needed

- `typicalTurnaround` and `priceFrom` per problem (UI hides them while null).
- Real chat provider (CHAT opens email until then) and booking delivery (CRM or email provider; the booking flow hands off via mailto until then).
- Full guarantee terms for `/legal/guarantee` (currently states only the confirmed 30-day fact, noindex).
- Decisions on the unmapped live URLs above.

Design Read pending: set by the variation prompt.
