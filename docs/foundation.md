# Foundation brief (revised Prompt 0)

Source of truth for routes, content model, CTAs, redirects and SEO. The information architecture itself lives in src/config/sitemap.ts.

## ROLE
You are building the conversion site for an on-demand WordPress repair and care service at https://letsfixwp.com. Most visitors arrive with a broken site: they pick their problem and either book a fix instantly or open live chat. Secondary visitors buy care plans, migrations or development projects. The home page and nav stay emergency-first; development and city pages never outrank fixes in the nav.
The information architecture is fixed by src/config/sitemap.ts. Never add, rename or drop a sitemap page without asking.

## SKILLS
Load design-taste-frontend, redesign-existing-projects, full-output-enforcement and ui-ux-pro-max. If brand.legacy.enabled is true, follow taste-skill Section 11 (Redesign Protocol, mode = Overhaul); otherwise treat this as greenfield. Follow ui-ux-pro-max Step 1 (stack = Next.js, pass --stack nextjs to any search). Foundation work builds structure, data and routes only: unstyled semantic HTML, no visual styling.

## STACK (check package.json before every import; print install commands first)
- Next.js 16.3.8, App Router, React Server Components by default, Turbopack, trailingSlash: true. Read the AGENTS.md that `next dev` writes and follow its version-matched docs.
- TypeScript strict. Tailwind CSS v4 via @tailwindcss/postcss. motion (import from "motion/react"). @phosphor-icons/react as the only icon family. shadcn/ui only for Dialog, Sheet, Accordion, Tabs, Tooltip, Command, NavigationMenu (never left in default styling). react-hook-form + zod. next/font only. next/image for every raster.
- gsap + @gsap/react only when a variation asks for them.

## BRAND CONFIG: src/config/brand.ts
```
{ name: "fixmywp" {{CONFIRM final brand name}}, domain: SITE_URL, email: "{{CONFIRM}}", accent: "#CC3333",
  currency: "INR" {{CONFIRM INR, USD or both}}, gst: { registered: {{CONFIRM}}, gstin: null },
  legacy: { enabled: {{CONFIRM true only if letsfixwp.com replaces fixmywp.com for the same business}} } }
```
When legacy.enabled is true, and only then: the 30-day guarantee, the "restored in a day or less" promise for hacked sites, the care plan's free fix ($150 value), and the testimonials of Sean Garrity (HostingAdvice.com) and Joe Kwak (DEN Industries Professional Services) may appear, docs/audit.md records them, and the old fixmywp.com URLs redirect (table below). When false, none of those claims or quotes appear anywhere.
Until the owner confirms, keep {{CONFIRM}} values as typed placeholders that fail loudly in a production build, and default legacy.enabled to false.

## INFORMATION ARCHITECTURE (generated from SITEMAP)
- hub: /<hub>/ index listing its services and its top guides.
- service: /<hub>/<service>/ with content from src/content/services/<id>.ts. id = last path segment, prefixed with the hub when not unique (woocommerce-fixes, woocommerce-development, maintenance-woocommerce).
- cityHub and city: /wordpress-development/cities/ and /wordpress-development/cities/<city>/, built in priority order.
- page: /pricing/, /free-site-check/, /case-studies/, /about/, /contact/ (Contact and Emergency Ticket; it hosts the booking flow).
- collection: /guides/ and /guides/[slug]/ (error knowledge base), /compare/ and /compare/[slug]/.
- Utility routes outside the tree and outside the nav: /legal/terms/, /legal/privacy/, /legal/guarantee/ (only when legacy.enabled), /contact/thanks/.
- /supporting/ is not a page. Never create it.

src/config/routes.ts exports typed helpers: routes.hub(id), routes.service(id), routes.guide(slug), routes.city(slug), routes.compare(slug), routes.book({ service, guide?, url? }) = /contact/?service=...&url=..., routes.quote(service) = /contact/?service=...&type=project, routes.plans(service) = that plan's page, routes.check = /free-site-check/, routes.reviews = /case-studies/. Every internal link uses them. Nav, footer, breadcrumbs, BreadcrumbList JSON-LD and app/sitemap.ts all derive from SITEMAP plus the guide and compare collections. Add a route test that fails the build if a SITEMAP path has no route or a route has no SITEMAP entry (utility routes whitelisted).

## CONTENT MODEL (zod schemas in src/content/schema.ts)
1. Service, one per sitemap service leaf: { id, path, hub, intent, title (the phrase people search), h1, summary, whoItsFor, symptoms[] (fix intent only), whatWeDo: { verb, detail }[] (3 to 5, verbs as labels), deliverables[], typicalTurnaround: string|null, priceFrom: string|null, faqs (4 to 6), guideSlugs[], relatedPaths[], seo { title max 60, description max 155 }, image { slot, alt } }
2. Guide, one per specific error (informational search intent): { slug, title (the exact error phrase), h1, errorText? (literal message as WordPress prints it), symptoms[], likelyCauses[], safeChecks[] (2 or 3, never editing core files), whenToCallUs, parentService (service id), urgency: 'critical'|'high'|'standard', faqs (3 or 4), seo, image }
3. City: { slug, city, priority, localContext (business types common in that city, written specifically; no invented clients, offices, addresses or reviews), servicesHighlighted[], faqs, seo }. Each city page must be substantially unique (no doorway pages). Use Service JSON-LD with areaServed; never LocalBusiness unless a real address exists.
4. Compare: { slug, a, b, verdictByScenario[], rows: { criterion, a, b }[], seo }. Factual and neutral.

turnaround and price stay null until the owner supplies them; the UI hides null fields.

Seed guides, grouped by parentService (real, specific copy; no filler verbs; zero em-dashes or en-dashes):
- emergency: site-down-after-update, stuck-in-maintenance-mode
- critical-error: critical-error-on-this-website, php-fatal-error, memory-exhausted-error, syntax-error
- white-screen: white-screen-of-death
- database-connection-error: error-establishing-database-connection
- server-errors: 500-internal-server-error, 502-bad-gateway, 503-service-unavailable, http-error-uploading-images
- plugin-theme-conflict: plugin-conflict, theme-broken
- update-php-errors: php-upgrade-broke-site, failed-core-update
- login-redirect-issues: locked-out-of-wp-admin, login-redirect-loop, password-reset-not-working, too-many-redirects
- email-not-sending: wordpress-not-sending-email, woocommerce-emails-not-sending
- elementor-issues: page-builder-layout-broken
- site-recovery: migration-failed, restore-from-backup, posts-returning-404
- malware-removal: wordpress-hacked, redirect-hack, unknown-admin-users
- blacklist-removal: google-deceptive-site-warning
- seo-spam-cleanup: japanese-keyword-spam-hack
- speed-optimization: slow-wordpress-site, core-web-vitals-failing, high-server-load
- hosting-migration: mixed-content-ssl-errors
- woocommerce-fixes: woocommerce-checkout-not-working, payment-gateway-errors

Seed compare pages: care-plan-vs-pay-as-you-go-support, wordpress-vs-wix, woocommerce-vs-shopify.
Seed all eight city files.

## CONVERSION PLUMBING (no styling)
- src/config/cta.ts, one label per intent, imported everywhere; no other CTA wording may exist:
  BOOK = "Fix my site" (routes.book), CHAT = "Chat with an engineer" (opens chat), PLANS = "See plans" (routes.plans), QUOTE = "Get a quote" (routes.quote), CHECK = "Get a free site check" (routes.check).
- Each page's primary CTA comes from its node intent: fix = BOOK, plan = PLANS, project = QUOTE, info = BOOK. CHAT is always the secondary. CHECK appears only where the visitor is not in an emergency: guides, pricing, the home finder's no-match state, the footer.
- src/lib/track.ts: track(event, props), no vendor yet. Events: cta_book_click, cta_chat_open, cta_plans_click, cta_quote_click, cta_check_click (each with location and service), problem_search {query}, booking_step {step}, booking_complete.
- src/lib/status.ts: getSiteStatus() returns { engineersOnline: boolean|null, medianResponseMinutes: number|null, asOf: Date|null }, nulls until the chat provider is wired. UI renders nothing for a null field. Never invent numbers.
- src/lib/match-problem.ts: matchProblem(text) scores free text against guides (title, errorText, symptoms) and fix-intent services, returning the top 3 as { guideSlug?, serviceSlug, score }. Every result resolves to a service so BOOK always has a target.

## LEGACY REDIRECTS (only when brand.legacy.enabled)
301 from the old fixmywp.com paths, using host-matched redirects in next.config.ts (document the DNS or host-level alternative too):
- /wordpress-hacked-fix -> /wordpress-security/malware-removal/
- /fix-wordpress-theme -> /wordpress-fix/plugin-theme-conflict/
- /fix-wordpress-plugin -> /wordpress-fix/plugin-theme-conflict/
- /wordpress-maintenance-services -> /wordpress-maintenance/care-plans/
- /testimonials -> /case-studies/
- /app -> /contact/ (keep the query string)

## SEO
generateMetadata on every route, canonical URLs with trailing slashes. A <JsonLd> server component: Organization, Service with Offer per service (omit price when null), TechArticle per guide, FAQPage, BreadcrumbList. No AggregateRating without real review data. app/sitemap.ts, app/robots.ts, opengraph-image.tsx for services and guides.

## REAL SCREENSHOTS FOR LATER
scripts/capture-errors.mjs: start a local WordPress with @wordpress/env, trigger each visible error state (white screen, critical error notice, database connection error, maintenance mode, too many redirects) and capture 1600x1000 PNGs with Playwright into public/screens/<guide-slug>.png. These real captures replace any need for div-built fake screenshots.

## DELIVER
Folder tree, schemas, every content file with real copy, unstyled templates for every route, routes.ts, redirects, JSON-LD, sitemap, route test, capture script. Run `next build` and fix every error.
