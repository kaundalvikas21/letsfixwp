# Image to-do

Every placeholder on the site, with the art direction its real photograph has to satisfy
(docs/section-contract.md rule 7, design-system/letsfixwp-v2/MASTER.md under Imagery).

House art direction: black and white documentary photography, natural light, real hands on real
keyboards. One red element only when it is genuinely in the scene. No stock gloss, no device
mockups, no faux-OS window chrome, no fabricated dashboards.

| Where | Placeholder | Size | Aspect | Art direction |
| --- | --- | --- | --- | --- |
| Home hero, right column (`src/components/sections/v2-swiss-precision/Hero.tsx`) | `picsum.photos/seed/letsfixwp-hero-1` | 880x1100 | 4:5 on md and up, cropped to 16:9 below 768px | An engineer mid-repair: hands on a laptop keyboard, natural window light from one side, the real WordPress admin open on screen. Shoot the screen, never composite one. Frame with headroom at the top and bottom so the 16:9 crop still reads. |

| Home case file, before half (`src/components/sections/v2-swiss-precision/CaseFile.tsx`) | none, section hidden | 1600x1000 | 16:10 | `public/screens/critical-error-on-this-website.png`, produced by `npm run capture`. The real WordPress critical-error page on a real install. Never a mockup. |
| Home case file, after half | none, section hidden | 1600x1000 | 16:10 | `public/screens/restored.png`, the same install healthy, captured by the same run before anything is broken. |

`npm run capture` needs Docker running, then `npx playwright install chromium` once. Until both files
exist the whole case-file section returns null: contract rule 7 wants a real visual, and rule 6 bans a
stand-in dressed up as a screenshot, so there is nothing honest to render in between.

When a real photograph lands: drop the `images.remotePatterns` block from `next.config.ts` (it exists
only for picsum) and delete that row.
