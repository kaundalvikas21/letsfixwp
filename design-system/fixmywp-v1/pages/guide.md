# Guide Page Overrides

> **PROJECT:** fixmywp-v1
> **Generated:** 2026-10-07 07:01:11
> **Page Type:** Blog / Article

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Sections:** Hero with search bar > Popular categories > FAQ accordion > Contact/support CTA

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- **Strategy:** Clean, high readability. Minimal color. Category icons in brand color. Success green for resolved.

### Component Overrides

- Avoid: Blank empty screens
- Avoid: Move help controls to different locations on each page
- Avoid: Block or ignore autofill

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Feedback: Show helpful message and action
- Accessibility: Keep contact self-help and automated help in consistent locations
- Forms: Use autocomplete attribute properly
- CTA Placement: Search bar prominent + Contact CTA for unresolved questions

## V1 template rules (P1, src/components/templates/GuideTemplate.tsx)

- Single-column article, max width 760px. H1 is the exact error phrase (`title`).
- `errorText` in a Geist Mono block on --surface, exactly as WordPress prints it. Real capture only (BrowserFrame realOnly), never a placeholder.
- Core-files warning names the guide's error, so the sentence differs on every guide (no repeated paragraphs).
- "When to call us": BOOK to the parent service with the guide, CHECK as the secondary. No hero CTA: the mobile bottom bar covers it.
