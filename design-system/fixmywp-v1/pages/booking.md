# Booking Page Overrides

> **PROJECT:** fixmywp-v1
> **Generated:** 2026-10-07 07:23:45
> **Page Type:** General

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

- Avoid: No feedback after submit
- Avoid: Placeholder-only inputs

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Forms: Show loading then success/error state
- Accessibility: Use label with for attribute or wrap input

## V1 booking rules (P2, src/app/contact/)

- Max width 1200px. Layout family: tabbed form surface (Radix Tabs: Emergency ticket, Project enquiry) beside a contact card at lg.
- Ticket screens: Problem, Your site, Contact, Confirm. Progress shows screen names only, never "Step 1 of 4"; completed names are buttons back.
- Labels above inputs, helper text under each label, errors inline under the field (aria-invalid + aria-describedby) and a summary in an aria-live alert. Focus moves to each new screen's heading.
- State lives in a reducer mirrored to sessionStorage: Back, progress navigation and refresh never lose data. Draft cleared on success.
- One zod schema file shared by the client (per-screen schemas) and the Server Actions (full schema). Passwords are never collected; pasted credentials are rejected. Honeypot field. Double submit guarded by a pending lock and a requestId the server de-duplicates.
- Confirm shows price or "Quote before work begins" ({{CONFIRM}} until confirmed), the guarantee line only while legacy is on, and the handoff provider from src/lib/booking.ts ({{CONFIRM}} until brand.bookingProvider is set and its keys exist).

