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

## v4 (branch `v4-rescue-story`)

The direction inverts: design-system/letsfixwp-v4/MASTER.md asks for night-time photography, so the `dark`
tone is now first choice and `daylight` is the odd one out. `red` frames are still out, because v4's single
accent is ember and a second red in frame competes with it.

| Tone | Photos | On v4 |
| --- | --- | --- |
| dark | hero-console, emergency, terminal, night-desk, store, workspace, final-cta | first choice |
| mono | cables, keys, racks | fine anywhere |
| daylight | drafting | off direction |
| red | monitors, alert, keyboard-red, laptop-hands | do not use: ember is the only accent |

No placeholder is outstanding for the hero: `hero-console` (an engineer in a dark room reading a WordPress
fatal error and stack trace) is a real frame on the v4 direction, held at `object-[60%_50%]`. Image
generation stays unavailable (0 Higgsfield credits, 2026-10-13), so rule 7b real photography is the route.

Still to source for the sections after the hero: a phone lighting up with an alert on a dark desk, an owner's
face lit by a laptop, and the matching restored-site capture for every error capture in `public/screens/`
(that folder holds only the four error captures so far).

### v4 error captures (`public/screens/`, all four filled 2026-10-19)

The home page's funnel stage one (`src/components/sections/v4/ErrorStack.tsx`) shows one card per error.
Each card renders the capture the moment its file exists, with no code change; until then the card shows the
error's own words on a plain panel (never a div-built browser window), and the white screen card shows a
blank panel, which is what that screen is.

| Slot (`public/screens/<slot>.png`) | Card | How to produce it |
| --- | --- | --- |
| `white-screen-of-death` | blank white page | `npm run capture` (needs Docker) **Filled 2026-10-19** with a designed graphic of the error supplied by the owner, not a capture, so `npm run capture` would overwrite it. |
| `critical-error-on-this-website` | "There has been a critical error on this website." | `npm run capture` (needs Docker) **Filled 2026-10-19** with a designed graphic of the error supplied by the owner, not a capture, so `npm run capture` would overwrite it. |
| `error-establishing-database-connection` | "Error establishing a database connection" | `npm run capture` (needs Docker) **Filled 2026-10-19** with a designed graphic of the error supplied by the owner, not a capture, so `npm run capture` would overwrite it. |
| `illustration-google-deceptive-site-warning` | Chrome's "Deceptive site ahead" | **Filled 2026-10-19** with a real screenshot of the interstitial, supplied by the owner. Still not reachable from `scripts/capture-errors.mjs`: you cannot make Google flag a site on demand, so this one is never regenerated by `npm run capture`. |

`scripts/capture-errors.mjs` also writes `stuck-in-maintenance-mode`, `too-many-redirects` and `restored.png`
(the matching restored-site frame the MASTER brief asks for next to every error). Docker is not available in
the environment this branch was built in, so none of them exist yet.

### v4 fix captures (`public/screens/`, same folder, only the Diagnose capture exists, `restored.png` does not)

Funnel stage two (`src/components/sections/v4/FixPan.tsx`) pans five panels past: Diagnose, Back up,
Repair, Verify, Harden. Two of them are the before and after of the same site and show their capture the
moment the file exists; the other three carry a real night or mono frame, chosen so the pan reuses nothing
the hero or the error cards already show.

| Panel | Image now | What it should be |
| --- | --- | --- |
| Diagnose | `/screens/critical-error-on-this-website.png`, or `terminal` until it exists | The before capture: `npm run capture` (needs Docker) |
| Back up | `racks` (server racks, mono) | Fine as it is, or a real frame of an engineer taking a backup |
| Repair | `keys` (keyboard close-up, mono) | Fine as it is, or an engineer's hands at a keyboard, which is the v4 art direction |
| Verify | `/screens/restored.png`, or `workspace` until it exists | The after capture: `npm run capture` writes it beside the error captures |
| Harden | `cables` (patch panel, mono) | Fine as it is |

`booking.png` and `quote.png` are no longer referenced by v4: the fix panels tell the process, and the
booking screens belong to the v3 Steps section that is still on the page below.

### v4 problem tiles

`src/components/sections/v4/ProblemTiles.tsx` gives every critical problem an image-backed tile. It uses the
guide's own capture (`/screens/<image.slot>.png`) once that exists, and until then the service's night frame
from `servicePhotos`. Several guides share one service, so filtering to a single category can show the same
frame three times in a row. That is the clearest argument for running `npm run capture`: each guide then
carries its own screen and the repetition disappears without a code change.

### v4 restored-site capture

`src/components/sections/v4/Restored.tsx` is the section whose whole content is one image: the same site,
loading. It needs `/screens/restored.png`, which `npm run capture` writes alongside the error captures
(it screenshots the healthy WordPress before breaking it). Until then it shows the `store` frame with an
empty alt, which is a lit screen rather than a dark one: under the heading "Same site. Working again." an
unlit monitor reads as the site still being down. This is the capture worth producing first, because here
the stand-in cannot carry the meaning at all.

### What the library can and cannot carry (measured 2026-10-15)

Mean luminance of each frame, sampled in the browser, which decided the closing section's photograph:

| Frame | Mean | Pixels over 120 | Reads behind a scrim? |
| --- | --- | --- | --- |
| cables | 106 | 39.5% | yes (mono) |
| racks | 59 | 5.7% | yes (mono) |
| emergency | 56 | 18.8% | yes, the brightest real scene |
| hero-console | 40 | 8.6% | just |
| store / terminal / workspace | 25 to 28 | 1 to 5% | no |
| final-cta | 17 | 0.8% | no |
| night-desk | 13 | 1.8% | no |
| keys | 16 | 0% | no |

The lesson for the next shoot: a night frame needs a real light source inside it, not just a dark room. Two
of the darkest frames were tried behind the closing section's scrim first and both rendered as a black
panel. `emergency` also has all its light in the left fifth (mean 143 there against 7 at the right), so the
closing section mirrors it to put that light in the half the scrim does not cover.
