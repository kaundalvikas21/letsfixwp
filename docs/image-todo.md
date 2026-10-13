# Image to-do

Every placeholder on the site, with the art direction its real photograph has to satisfy
(docs/section-contract.md rule 7, design-system/letsfixwp-v2/MASTER.md under Imagery).

House art direction: black and white documentary photography, natural light, real hands on real
keyboards. One red element only when it is genuinely in the scene. No stock gloss, no device
mockups, no faux-OS window chrome, no fabricated dashboards.

| Where | Placeholder | Size | Aspect | Art direction |
| --- | --- | --- | --- | --- |
| Home hero, right column (`src/components/sections/v2-swiss-precision/Hero.tsx`) | `/site_images/hero-console-bg.jpg`, placed from the v1-incident-console set | 1600x1200 | 4:5 on md and up, cropped to 16:9 below 768px | **Still open.** The placed photograph is a person at a monitor reading a real PHP fatal error, rendered through `grayscale`, so it satisfies the black-and-white rule and the real-screen rule. It does not satisfy the rest: the scene is lit after hours by the screen, not by natural window light, and there are no hands on a keyboard. It is also 4:3, so the 4:5 slot crops roughly a third of the width. Replace with: an engineer mid-repair, hands on a laptop keyboard, natural window light from one side, the real WordPress admin open on screen. Shoot the screen, never composite one. Frame with headroom top and bottom so the 16:9 crop still reads. |

| Home case file, before half (`src/components/sections/v2-swiss-precision/CaseFile.tsx`) | none, section hidden | 1600x1000 | 16:10 | `public/screens/critical-error-on-this-website.png`, produced by `npm run capture`. The real WordPress critical-error page on a real install. Never a mockup. |
| Home case file, after half | none, section hidden | 1600x1000 | 16:10 | `public/screens/restored.png`, the same install healthy, captured by the same run before anything is broken. |

`npm run capture` needs Docker running, then `npx playwright install chromium` once. Until both files
exist the whole case-file section returns null: contract rule 7 wants a real visual, and rule 6 bans a
stand-in dressed up as a screenshot, so there is nothing honest to render in between.

The `images.remotePatterns` block is gone from `next.config.ts`: nothing is fetched from picsum any
more. Delete the hero row once a photograph that matches the house art direction replaces the placed
one.

## Service and hub pages: placed, direction still open

The 6 hub pages render a photograph too, mapped by hub id in `hubPhotos` (they have a route node,
not a content file, so there is no slot to carry it). All 32 `service-*` slots now render a photograph from `public/site_images/services/`, mapped in
`src/content/service-photos.ts` (the mapping is v1's). Eleven photographs cover thirty-two services,
so frames repeat across related work. They are decorative, so they ship with an empty alt; the written
`alt` in the content file describes a screen state and is kept for the capture that replaces it.

Same gap as the hero: these are lit for v1's after-hours direction, not this variation's natural
light. Replacing them is 11 photographs, not 38.

`emergency.jpg` is the weak frame: the whole image is out of focus, no plane is sharp. It carries the
two highest-intent pages, `critical-error` and `emergency`, and is held left so the laptop and hands
survive the 4:5 crop. It is the first one to reshoot.

## Guide pages: 37 slots still render nothing

`RealScreen` resolves anything that is not `service-*` to `public/screens/<slot>.png`, and that
directory does not exist, so every guide page is short an image.

- 5 slots are reachable by `npm run capture`: `critical-error-on-this-website`,
  `error-establishing-database-connection`, `white-screen-of-death`, `stuck-in-maintenance-mode`,
  `too-many-redirects`. It needs Docker running, then `npx playwright install chromium` once.
- 32 `illustration-*` slots are not reachable by it at all: they describe evidence from outside the
  install, like a Google "Deceptive site ahead" warning, a Search Console Core Web Vitals report, a
  declined payment or a server load graph. Breaking a local WordPress cannot produce these. They need
  contract rule 7 step (a), an image-generation tool, or the slot should come out of the schema.
