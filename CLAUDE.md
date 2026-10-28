@AGENTS.md

Before building or editing any section: re-read docs/section-contract.md, the active design-system/<slug>/MASTER.md, and any design-system/<slug>/pages/<page>.md override. Update docs/layout-ledger.md after every section.

The business is LetsFixWP at letsfixwp.com (`brand` in `src/config/brand.ts`); use `brand.name`, never a
hardcoded name. `fixmywp.com` is a different company that is still trading: never reuse its content, claims,
testimonials, address or legal text, on any design variation. `scripts/check-content.ts` fails the build on it.

## 21st.dev components

Search 21st before writing any new UI from scratch. Check the component's own export name before
importing it; the filename and the export rarely match.

Every installed component is rewritten onto our tokens. No hardcoded hex, no raw zinc/slate/indigo,
no shadcn token names (`bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`,
`border-border`, `bg-primary`, `text-primary-foreground`). None of those exist here. The map:

| shadcn | ours |
| --- | --- |
| `bg-background` | `bg-bg` |
| `text-foreground` | `text-text` |
| `bg-card` | `bg-surface` |
| `text-muted-foreground` | `text-muted` |
| `border-border` | `border-line` |
| `bg-primary` | `bg-accent` |
| `text-primary-foreground` | the accent-label token in the active `@theme` block |

Those six are on every variation. Everything past them differs: the accent-label token is
`text-on-accent` on v3 and v4, `text-accent-ink` on v1, `text-accent-on` on v2, and tokens like
`surface-2`, `line-strong` and the scrim set exist on some variations only. Read the `@theme` block in
`src/app/globals.css` on the branch you are on rather than assuming a name from another variation.

Type scale, spacing rhythm, container width and the one-accent lock come from the active
design-system MASTER.md, not from whatever the component shipped with. If a component ships a second
accent, strip it.

After each install: `npm run build` and `npx tsc --noEmit`.
