# Image to-do

Every placeholder on the v3 variation, with the art direction its real photograph has to satisfy
(docs/section-contract.md rule 7, design-system/letsfixwp-v3/MASTER.md under Imagery).

House art direction (v3): bright daylight lifestyle-tech photography, natural window light, clean desks,
neutral and green tones, no red. Real screens only: shoot the screen, never composite one.

## Photo library

All 15 v1-incident-console photographs are in `public/site_images/` and listed in `src/content/photos.ts`
with size, alt, crop focus and a `tone`. Use them with `<Photo id="..." sizes="..." />`
(`src/components/sections/v3/Photo.tsx`); pages map services and hubs through `servicePhotos` and `hubPhotos`.

| Tone | Photos | On v3 |
| --- | --- | --- |
| daylight | drafting | first choice |
| mono | cables, keys, racks | fine anywhere |
| dark | workspace, terminal, emergency, night-desk, store, hero-console, final-cta | usable stand-ins, off the daylight direction |
| red | monitors, alert, keyboard-red, laptop-hands | do not use: v3 color lock |

Only one frame is daylight, so most v3 sections will place a dark or mono stand-in. Each one placed gets a row
below. Reshooting about 6 daylight frames (laptop on a clean desk, shop owner on a phone, hands on a keyboard by a
window, a healthy WordPress dashboard on screen) would cover the services and hubs.

Image generation was tried first (rule 7a): the Higgsfield account has 0 credits (2026-10-13), one 4:3 image costs 0.25.

| Where | Placeholder | Size | Aspect | Art direction |
| --- | --- | --- | --- | --- |
| Home hero, right column (`src/components/sections/v3/Hero.tsx`) | `<Photo id="drafting">` (daylight, hand sketching a wireframe on a tablet at a wooden desk), held at `object-[60%_50%]` so the tablet survives the crop | 1600x1000 source | 4:3 at every width | A laptop on a clean light desk by a window, daylight from one side, a healthy WordPress site open on screen (real site, real screen). Calm, uncluttered, a plant or coffee at most. Subject in the left two thirds so nothing important sits in the 48px that overlaps the next section. Decorative: keep `alt=""`. |
| Home bento, cell 2 "White screens and fatal errors" (`src/components/sections/v3/Bento.tsx`) | `<Photo id="hero-console">` behind a scrim (a real photo of a WordPress fatal error on a monitor, after-hours) | 1600x1000 capture | device frame, 16:10 | `public/screens/critical-error-on-this-website.png` from `npm run capture` (needs Docker; not available on 2026-10-13). The cell switches to the capture in a device frame on the next build once the file exists. |
| Home bento, cell 1 "Hacked and malware" | `<Photo id="keys">` (mono) behind a scrim | 1600x1000 | 2x2 cell, about 1:1 | Daylight: a laptop by a window with a security scan finished clean on screen. |
| Home bento, cell 5 "WooCommerce checkout and payments" | `<Photo id="store">` (dark) behind a scrim | 1000x1600 | 1x2 cell, about 1:2 portrait | Daylight: a shop owner checking new orders on a phone at a counter. Portrait frame. |
| Home steps, Describe (`src/components/sections/v3/Steps.tsx`) | `<Photo id="terminal">` (dark) | 1600x1000 capture | 16:10 device frame | `public/screens/booking.png`: a real screenshot of `/contact` (booking, step 1) once v3 styles that page. Switches on the next build. |
| Home steps, Approve | `<Photo id="emergency">` (dark, soft focus) | 1600x1000 capture | 16:10 device frame | `public/screens/quote.png`: no quote-approval screen exists in the product yet (quotes are a reply, not a page). Capture it once one exists; until then the stand-in stays. |
| Home steps, Fix (before) | `<Photo id="racks">` (mono) | 1600x1000 capture | 16:10 device frame | `public/screens/critical-error-on-this-website.png` from `npm run capture` (needs Docker). |
| Home steps, Verify (after) | `<Photo id="workspace">` (dark) | 1600x1000 capture | 16:10 device frame | `public/screens/restored.png`, now written by the same `npm run capture` run (healthy site, captured before anything is broken). |
| Home compare, one-time fix (`src/components/sections/v3/PlanCompare.tsx`) | `<Photo id="night-desk">` (dark) | 1600x1200 | half card, about 4:3 | Daylight: an engineer's hands on a laptop, the site loading normally again on screen. |
| Home compare, care plan | `<Photo id="cables">` (mono) | 1600x1200 | half card, about 4:3 | Daylight: a calm, tidy desk with a WordPress dashboard showing everything up to date. |
