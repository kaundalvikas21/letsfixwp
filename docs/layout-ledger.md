# Layout ledger

One row per section, recorded before coding (docs/section-contract.md rule 3). One table per page per variant.

<!-- Template:
## <variant> / <page>

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
-->

## v1-incident-console / global shell (every page)

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| S1 | Top nav (64px, sticky) | Three-zone bar: wordmark / Fixes, Security, Care plans, Pricing, More / CTA pair. Fixes and Security open two-column dropdown panels, More a one-column panel (Radix NavigationMenu). Below lg: Sheet with every hub as an accordion | No | No | CHAT (ghost), BOOK (solid) |
| S2 | Mobile action bar (<768px) | Fixed bottom bar, hidden while hero CTAs are visible | No | No | BOOK (flex-1), CHAT (icon) |
| S3 | Footer (every page) | Link columns from SITEMAP hubs + Resources, a quiet city row under Development, then company, legal, email, copyright | No | No | None |

Status: S1, S2 built in V1.1. Eyebrows used: 0. Marquees used: 0.

## v1-incident-console / home

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| H1 | Hero with live triage | Asymmetric split 5/7 (text / interactive console); stacked under 768px, console after headline | No | No | BOOK (solid), CHAT (ghost); console result adds BOOK (service + guide) and the HOW text link; no-match shows CHAT + CHECK text link |
| H2 | Platform logos under the hero | Logo marquee (the page's only marquee): one plain line + monochrome Simple Icons logos | No (plain sentence, not an eyebrow) | Yes (1 of 1) | None |
| H3 | Problem finder | Vertical tab index: search above, left vertical tablist (horizontal scroll-snap under 768px), right 2-column row list | Yes: "Common emergencies" (1 of 1 allowed at 3 sections) | No | BOOK per search result (text link), CHAT in footer; rows link to service and guide pages |
| H4 | After you book | Vertical timeline with a scroll-drawn line; browser-frame captures on two entries (Diagnose right, Verify left) | No | No | None |
| H5 | Trust bento | Bento grid, 5 cells in 3x3: 2x2 photo (guarantee), 1x1 accent tint, 1x1 macro photo, 1x1 surface, 2x1 surface-2; columns A/A/D, A/A/E, B/C/E | No | No | None |
| H6 | Live desk status | Full-width single statement row: status or desk hours left, one CTA right | No | No | CHAT only |
| H7 | Pricing | Uneven pricing columns 1.4fr 1fr 1fr at lg (emergency full row over two columns at md, stacked under 768px, emergency first) | No | No | BOOK (emergency), PLANS (support hours, care plans), CHECK text link under the grid |
| H8 | Client quotes | Asymmetric quote pair: 7-col large quote left, 5-col quote right 64px lower; renders only when brand.legacy.enabled (both quotes belong to the fixmywp.com business) | No | No | None (text link to case studies) |
| H9 | Guarantee | Split statement + checklist (the page's only image-free split): H2 + sentence + link left, 5 ShieldCheck practices right; stacked under 768px | Yes: "Guarantee" (2 of ceil(9/3)=3) | No | None (text link to /legal/guarantee/ when legacy is on) |
| H10 | Objection FAQ | Single-column accordion (max-w 760px) with a sticky side card at lg; card below the list under lg | No | No | CHAT (side card) |
| H11 | Final CTA | Full-bleed photo panel with a --bg 70% scrim, H2 + CTA pair only | No | No | BOOK (solid), CHAT (ghost) |

Status: H1 built in V1.2. Home sections so far: 1. Eyebrows used: 0 of ceil(n/3). Marquees used: 0. Image-plus-text splits in a row: 1.

V1 SYNC (after merging main): S1 and H1 rows updated for the sitemap model. Layout families unchanged. Eyebrows used: 0. Marquees used: 0.

V1.3: H2 built (logo marquee). Home sections so far: 2. Eyebrows used: 0 of ceil(2/3)=1. Marquees used: 1 of 1. Image-plus-text splits in a row: 0 (marquee breaks the run).

V1.4: H3 built (problem finder). Home sections so far: 3. Eyebrows used: 1 of ceil(3/3)=1 ("Common emergencies"). Marquees used: 1 of 1. Image-plus-text splits in a row: 0. The finder replaced the unstyled foundation "Site down or hacked right now" list.

V1.5: H4 built (vertical timeline). Home sections so far: 4. Eyebrows used: 1 of ceil(4/3)=2. Marquees used: 1 of 1. Image-plus-text splits in a row: 1 (Diagnose), then text-only entries, then 1 (Verify).

V1.6: H5 built (trust bento). Home sections so far: 5. Eyebrows used: 1 of ceil(5/3)=2. Marquees used: 1 of 1. Image-plus-text splits in a row: 0. Three claims and the guarantee render as {{CONFIRM}} until confirmed in src/config/brand.ts.

V1.7: H6 built (desk status row). Home sections so far: 6. Eyebrows used: 1 of ceil(6/3)=2. Marquees used: 1 of 1. Live dot: 0 today (getSiteStatus() returns nulls); 1 when real data arrives.

V1.8: H7 built (pricing). Home sections so far: 7. Eyebrows used: 1 of ceil(7/3)=3. Marquees used: 1 of 1. Every price and the "Quote in minutes" promise show {{CONFIRM}}; "Most booked" hidden until confirmed; guarantee line hidden while legacy is off.

V1.9: H8 built (quote pair). Renders only when brand.legacy.enabled; today it is absent, so visible home sections stay at 7. Eyebrows used: 1. Marquees used: 1 of 1.

V1.10: H9 built (guarantee split). Home sections (legacy on): 9. Eyebrows used: 2 of ceil(9/3)=3 ("Common emergencies", "Guarantee"). Marquees used: 1 of 1. Image-free splits: 1 (this one). Headline wording, the reopen sentence and all 5 practices carry {{CONFIRM}}.

V1.11: H10 built (objection FAQ). Home sections (legacy on): 10. Eyebrows used: 2 of ceil(10/3)=4. Marquees used: 1 of 1. Start time, cannot-fix policy, payment and the backup line carry {{CONFIRM}}.

V1.12: H11 (final CTA) and S3 (footer) built; the unstyled foundation "What we do" list is removed (the footer carries every hub and service link). Home sections (legacy on): 11, all different layout families. Eyebrows used: 2 of ceil(11/3)=4. Marquees: 1 of 1. Section 14 pre-flight run: see the V1.12 report.

## v1-incident-console / page templates (P1)

| Template | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- |
| Service | Document column + sticky conversion rail (lg); stacked hero with browser frame; labelled verb grid | No | No | Node intent primary + CHAT (hero, rail, band) |
| Guide | Single-column article (760px), mono error block, warning callout | No | No | BOOK (parent service + guide), CHECK |
| Hub | Two-column ledger list of services, urgent-guide link list | No | No | Node intent primary + CHAT |
| City / city index | Long-form article with inline service index and a remote-delivery panel / link index | No | No | QUOTE + CHAT |
| Compare | Verdict ledger then a data table | No | No | Closest service intent + CHAT |
| Free site check | Lead magnet + form: 2x2 coverage grid beside a minimal form | No | No | CHECK (submit) |
| Case studies | Composed empty state | No | No | CHAT |
| Pricing | Rate tables per hub | No | No | CHAT + CHECK |
| About | Short statement with a hub index | No | No | Node intent primary + CHAT |
| Contact (P2) | Tabbed form surface: 4-screen emergency ticket and a one-screen project enquiry, contact card at lg | No | No | BOOK (ticket submit), QUOTE (enquiry submit), CHAT |

None reuses a home layout family. Thin-content scan over all 95 sitemap pages: 0 repeated paragraphs.

## v1-incident-console / collection and utility pages (design pass after the P1 audit)

| Page | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- |
| /guides/ | Grouped directory, two columns of per-service guide lists | No | No | BOOK, CHAT, CHECK in the band |
| /compare/ | Plain directory list, quieter than the guides grid | No | No | Node intent primary + CHAT |
| /legal/* | Long-form legal article, .legal-prose in globals.css | No | No | None |

/contact/thanks/ deleted: P2 moved the success state into the ticket flow, so nothing linked to it.

## v1-incident-console / service and timeline imagery (external-image pass)

| Slot | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- |
| Service hero image (32 pages) | Unframed 16:10 photograph, 12px radius, hairline border, directly under the hero CTA pair | No | No | None |
| Timeline Diagnose / Verify | Same photograph treatment, in the right / left grid cell from 768px | No | No | None |

The browser frame is gone from both until a real capture exists in `public/screens/`; `ScreenOrPhoto` switches
back to the framed capture automatically. Chrome around a stock photo would read as a screenshot of the
customer's own site, which rule 6 bans. Photographs are decorative, so `alt` is empty. Twelve IT photographs
cover the 32 services: `docs/image-credits.md`.
