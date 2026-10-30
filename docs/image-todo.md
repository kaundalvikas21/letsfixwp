# Image to-do

Every placeholder on the v3 variation, with the art direction its real photograph has to satisfy
(docs/section-contract.md rule 7, design-system/letsfixwp-v3/MASTER.md under Imagery).

House art direction (v3): bright daylight lifestyle-tech photography, natural window light, clean desks,
neutral and green tones, no red. Real screens only: shoot the screen, never composite one.

## Photo library

All 15 v1-incident-console photographs are in `public/site_images/` and listed in `src/content/photos.ts`
with size, alt, crop focus and a `tone`. Use them with `<Photo id="..." sizes="..." />`
(`src/components/sections/v3/Photo.tsx`); pages map services through `servicePhotos`.

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
| Guide detail, capture slot (`src/components/templates/GuideTemplate.tsx`, `RealScreen`) | nothing renders: `public/screens/<slot>.png` does not exist, so the existence gate returns null and the page opens on the diagnostic panel instead | 1600x1000 capture | 16:10 inside the device frame (20px outer, 12px inner radius) | `npm run capture` (needs Docker; not available) writes one PNG per guide slot named after the guide, a real browser window showing that real error on a real WordPress install. One per guide, 37 slots. Never a div-built or retouched screenshot: contract rule 6 and MASTER.md:189. Each swaps itself in on the next build with no code change. Descriptive alt comes from `guide.image.alt`, which is already written for all 37. |
| Service hero, right column (`src/components/templates/ServiceTemplate.tsx`) | `<Photo id={servicePhotos[s.id]}>`, one of the 15 v1 frames mapped per service in `src/content/photos.ts`; 29 of the 32 land on a dark or mono stand-in, only elementor-issues, redesign and website-design get the one daylight frame | 1600x1000 source | 16:10 under 1024px, then a portrait frame whose height follows the title block (about 432x416 at 1440) | Daylight, per service: the calm *after* state of that job, not the failure. A laptop by a window with the site loading normally, a shop owner checking orders on a phone, hands on a keyboard in natural light. Subject centred, because the frame crops to portrait at 1024px and up. Decorative: keep `alt=""`. |

## Current state: Unsplash illustrations, no placeholders

Seven illustrations in `public/site_images/illustrations/`, registered in `src/content/photos.ts` with their
source ids, authors and licence, rendered through `<Illustration>`. Downloaded rather than hotlinked, so
next.config.ts carries no `remotePatterns` and no third-party image host ships in production (measured: 0
off-origin image requests on all nine page types).

Licence: every file is `images.unsplash.com/vector-*`, the free Unsplash Licence, and
`settings-and-gears` is additionally Public Domain. The `plus.unsplash.com/premium_vector-*` assets that fill
the same searches are Unsplash+ subscription and are excluded.

Assignment is by subject, not by page order. Hubs map per hub id (`hubArt` in HubTemplate), and service heroes
map hub first then intent (`serviceArt` in ServiceTemplate), so a security service shows the shield whatever its
intent and a fix service shows the browser. Before this every hub showed the same team scene.

Open points, in order of how much they matter:

1. **Mostly blue and orange, against the single green accent.** A recorded exception, not drift.
   `shield-and-firewall` is the first green-family one and was chosen partly for that, so the direction of
   travel is replacing the rest with green equivalents rather than recolouring.
2. **Finding more on-style ones is harder than it looks, which is why the set is seven and not twenty.** The
   Unsplash illustration search is dominated by black line icons and by `plus.unsplash.com/premium_vector-*`
   (Unsplash+ subscription, excluded). Of eight free security results pulled on 2026-10-30, seven were line
   icons and one was a usable illustration. Searching a matching illustrator's feed looked like the better
   strategy and was not: YuguDesign's recent work is abstract dot patterns on black. Budget a sheet-and-pick
   pass per subject rather than expecting a search to return a set.
3. Seven files cover nine page types, so some still repeat (charts-and-plans on both /pricing/ and /compare/,
   desk-with-laptop on both /about/ and the city pages). More files would remove the repeats.
4. `public/screens/` real captures (`npm run capture`, needs Docker) are still the way the home step tabs stop
   using stand-in artwork and show the actual error and the actual fix.
5. The v1 photo library is still registered in photos.ts but nothing renders it. It can be deleted once there
   is no intention of going back to photography.
