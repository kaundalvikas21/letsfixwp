@AGENTS.md

Before building or editing any section: re-read docs/section-contract.md, the active design-system/<slug>/MASTER.md, and any design-system/<slug>/pages/<page>.md override. Update docs/layout-ledger.md after every section.

The business is LetsFixWP at letsfixwp.com (`brand` in `src/config/brand.ts`); use `brand.name`, never a
hardcoded name. `fixmywp.com` is a different company that is still trading: never reuse its content, claims,
testimonials, address or legal text, on any design variation. `scripts/check-content.ts` fails the build on it.
