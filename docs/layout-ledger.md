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

Status: S1, S2 built in V1.1. Eyebrows used: 0. Marquees used: 0.

## v1-incident-console / home

| # | Section | Layout family | Eyebrow | Marquee | CTA intents |
| --- | --- | --- | --- | --- | --- |
| H1 | Hero with live triage | Asymmetric split 5/7 (text / interactive console); stacked under 768px, console after headline | No | No | BOOK (solid), CHAT (ghost); console result adds BOOK (service + guide) and the HOW text link; no-match shows CHAT + CHECK text link |

Status: H1 built in V1.2. Home sections so far: 1. Eyebrows used: 0 of ceil(n/3). Marquees used: 0. Image-plus-text splits in a row: 1.

V1 SYNC (after merging main): S1 and H1 rows updated for the sitemap model. Layout families unchanged. Eyebrows used: 0. Marquees used: 0.
