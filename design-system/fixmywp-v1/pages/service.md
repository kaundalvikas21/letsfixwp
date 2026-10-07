# Service Page Overrides

> **PROJECT:** fixmywp-v1
> **Generated:** 2026-10-07 07:01:10
> **Page Type:** Landing / Marketing

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1200px
- **Layout:** Responsive grid

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- No overrides — use Master colors

### Component Overrides

- No overrides — use Master component specs

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Refer to MASTER.md for all design rules
- Add specific overrides as needed for this page

## V1 template rules (P1, src/components/templates/ServiceTemplate.tsx)

- Max width 1200px (`pageWrap`). Layout family: document column with a sticky conversion rail at lg (18rem card: title, turnaround and price only when non-null, primary CTA from node intent, CHAT). Under 768px the global bottom bar is the only rail.
- Hero is stacked (H1, `heroLine` max 20 words, CTA pair, browser frame), never the home asymmetric split.
- "What we do" is a labelled two-column grid (mono verb label in --accent-ink), never the home timeline.
- Testimonials only while brand.legacy.enabled, and only where the quote matches the job (malware-removal, care-plans), so no quote repeats across pages.
- Closing band: centered line from `seo.description` + CTA pair on --surface-2 with an accent top rule.
