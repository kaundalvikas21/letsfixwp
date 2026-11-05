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
| daylight | drafting | off direction, and since Task 9 used by nothing: see below |
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

### Bands on the five inner templates (Task 9)

Every inner page now opens on a photographic band, so three templates that had no picture at all
needed a frame. None is a new asset: each is the nearest honest mapping the catalogue already
offers, and each is a stand-in for a photograph that has still to be shot on the v4 direction.

| Where | Stand-in | Size | Aspect | Art direction the real frame has to satisfy |
| --- | --- | --- | --- | --- |
| Compare template (`src/components/templates/CompareTemplate.tsx`) | `<PageMasthead photo="cables">` (mono, a patch panel in black and white) | 1600x1000 source | no aspect ratio; the band is content height, `md:min-h-[24rem]` | The catalogue holds no frame of two technologies being weighed against each other, and inventing one is not an option. Mono is the only tone that cannot imply a verdict on a page that declares no winner. A real frame would be neutral and night-lit: two identical screens side by side on one desk, no branding legible on either. |
| City hub (`CityTemplates.tsx`, `CityHubTemplate`) | `<PageMasthead photo="racks">` (mono) | 1600x1000 | same | The work is remote and there is no office in any city, so no city gets a photograph of itself and none may be favoured. A real frame would be night-lit infrastructure, no signage, no skyline. |
| City page (`CityTemplates.tsx`, `CityTemplate`) | `servicePhotos[c.servicesHighlighted[0]]`, the first service the city asks for | 1600x1000 | same | Shows the work rather than the place, for the same reason. No city landmark, no map, no flag: a landmark would assert a local presence that does not exist. |
| Guide template, all 37 (`GuideTemplate.tsx`) | `servicePhotos[g.parentService]` | 1600x1000 | same | Unchanged direction from the 336px panel this replaces, now at band size. The photograph does not depict the error, so it stays `decorative` with an empty alt; `g.image.alt` describes a capture that does not exist on 33 of these pages. |

Still outstanding from the v4 list above and unchanged by this pass: a phone lighting up with an
alert on a dark desk, an owner's face lit by a laptop, and the matching restored-site capture for
each of the four error captures in `public/screens/`.

`drafting` now maps to no service and no hub. It was on `website-design`, `redesign`,
`elementor-issues` and the development hub, which put the one daylight frame on three service pages,
a hub and every city page once the photograph became the band. Each moved to the nearest frame on
direction (`terminal`, `workspace`, `night-desk`, `final-cta`); `docs/layout-ledger.md` under Task 9
has the table. The file stays in the catalogue because v3 lists it as its first choice.

### The 33 guides with no capture (Task 19)

"What you are seeing" shows the guide's own capture from `public/screens/<image.slot>.png`, and
only four of those files exist. The other 33 guides render no image in that section at all, which
is correct rather than broken: `RealScreen` returns `null` when the PNG is absent, contract rule 7
says every visual is real, and the page's masthead already carries the parent service's photograph.

**The parent service photo is deliberately not reused here.** It is the band at the top of the same
page, so dropping it into this section would put one picture on screen twice.

**How to fill them:** `npm run capture` drives `scripts/capture-errors.mjs`, which stands up a
throwaway WordPress with `@wordpress/env`, breaks it one way at a time, and screenshots each result
at 1600x1000 into `public/screens/<slot>.png`. The names already match `image.slot` in
`src/content/guides/*.ts`, so a capture appears on its guide the moment its file lands, with no
code change. **It needs Docker, and Docker is not available on this machine** (checked again this
pass; the same note was made on 2026-10-13).

Note the slot names, because they change what "fill them" means. **31 of the 33 are prefixed
`illustration-`**, which is the content's own signal that those were never meant to be screenshots
of a real error but drawings of one. `capture-errors.mjs` cannot produce those: they need the rule
7a image-generation route, which is still unavailable (0 Higgsfield credits), or real photography.

**Exactly two are genuine browser states the script can reach**: `stuck-in-maintenance-mode` and
`too-many-redirects`. Those are the only two that a working Docker would turn into real files.

So the realistic position is that 31 of these 33 sections stay imageless until an image-generation
budget or an illustrator exists, and that is the honest outcome rather than a gap to paper over.

---

## v4 hub card banners (Task 28)

Eight 359x149 renders were supplied in `public/site_images/services/`. Four are live on the
`/about/` hub grid through `hubBanners` in `src/content/photos.ts`. Four are **not used** and two
hubs have no banner at all.

### Not used: a blue glow is a second accent

v4 has a one-accent lock (ember). These four glow cool, measured as the warm/cool split of their
lit pixels, so putting them on the page would introduce a second accent that CLAUDE.md says to
strip on sight:

| File | Cool | Subject | Needed as |
| --- | --- | --- | --- |
| `malware-cleanup.png` | 77% | shield with a tick | the `wordpress-security` banner |
| `hacked-site-cleanup.png` | 75% | padlock in front of server racks | spare for security |
| `backup-recovery.png` | 69% | database stack with a cloud | spare for maintenance |
| `site-migration.png` | 90% | two arrows crossing between slabs | spare for performance and migration |

**To make them usable:** regenerate with the glow in the ember accent (`--accent`, `#ff5a36`)
instead of blue, same framing, same 359x149, same dark bokeh background. The four that work
(`emergency-fixes`, `speed-optimization`, `woocommerce-help`, `maintenance-care`) are the reference
for the direction. Dropping a regenerated file in at the same path and adding one line to
`hubBanners` is the whole change; the card already reserves the box.

### Missing

| Hub | Status |
| --- | --- |
| `wordpress-security` | falls back to its shield icon until `malware-cleanup` is regenerated warm |
| `wordpress-development` | **no render exists.** Wants one in the same set: something that reads as building rather than repairing, lit in ember, 359x149 |

### Two notes on the set itself

- **359x149 is small for this job.** On a 2x phone the banner renders about 652 device pixels wide
  from a 359px source, a 1.8x upscale; on a 1440 desktop card it is about 1.5x. It holds because
  these are soft renders with one lit subject, but a 720x299 source would need no upscaling at all.
- They are PNG at 8-bit palette. Fine for flat-ish renders, but these have long gradient falloffs,
  so a higher bit depth or a WebP would band less and weigh less.

---

## v4 video slots (Task 53)

The first moving assets the site has asked for. **Six slots exist in `src/content/videos.ts` and all
six are placed** (Task 54 took the home carousel from two client slots to four); every `clip` is null,
so each renders a composed empty state naming what will play there and saying it is not filmed yet.
Filling one is a data change: write the paths into that slot and the player appears, the same way a
capture appears when its PNG lands in `public/screens/`.

Files go in `public/videos/`, posters and captions beside them. Do not reference those paths from a
component: `scripts/check-content.ts` fails any hardcoded internal path outside `src/content` and
`src/config`, so the paths belong in `src/content/videos.ts` only.

| Where | Placeholder | Size | Aspect | Art direction |
| --- | --- | --- | --- | --- |
| `/about/`, "Watch a rescue" (`src/app/about/page.tsx`) | dashed empty state, caption "How a rescue runs, from the first message to the site loading again. Not filmed yet." | 1600x1000 source, poster at the same size | 16:10, fixed, matching the capture ratio | **60 to 90 seconds.** One real job, start to finish, on the v4 night direction: the message arriving, an engineer's hands at a keyboard under one warm light, the error on screen, then the site loading. Real screens only, shot, never composited. No face needed and no voiceover required; if there is narration it is the engineer's own. The one light source has to be inside frame: the library's measured failure is that a dark room without a lamp renders as a black panel (mean luminance table above). |
| `/case-studies/` (`src/app/case-studies/page.tsx`) | dashed empty state, caption "A WordPress site going from a fatal error back to loading normally. Not filmed yet." | 1600x1000 source, poster at the same size | 16:10, fixed | **10 to 20 seconds, no audio needed.** A screen recording, not a shoot: the same WordPress site showing a fatal error, the fix applied, the page loading normally. This is the cheapest asset on the whole list and the one with no permission problem, which is why it is on the page that has no published case study yet. It is also the clip `Restored.tsx` would want if that section could host a player; see the Task 53 ledger entry for why it cannot. |
| `/` home, the four carousel slides (`src/components/sections/v4/Proof.tsx` through `QuoteCarousel`) | dashed empty state in each card's left column, captions "A client on what broke and how it was handled.", "A second client, on work that was not an emergency.", "A third client, on a hacked site and what the cleanup involved.", "A fourth client, on moving a store without losing orders." | 1280x800 is enough at the card's `md:col-span-5` width; poster to match | 16:10, fixed | **30 to 45 seconds each.** The client on camera, in their own words, filmed with written consent. **Four different jobs, not four versions of one:** an emergency, a planned piece of work, a hacked site, a store move. That is the split `src/content/testimonials.ts` asks of the written quotes, and it is what stops four slides making the same point. **A client slot may not be filled with an actor, a voiceover over stock footage, or a reconstruction.** `PRODUCT.md` lists client testimonials under what must not be fabricated by any future work. Lit however the client's own room is lit: a real person's kitchen or shop beats the night direction here. Shoot landscape; a portrait phone clip will letterbox inside a 16:10 box. |

All six slots are placed, so nothing is defined and waiting for a host. The service template's
`<Section id="quote">` renders only non-placeholder quotes, so it stays empty until a real client
exists either way, and it needs no slot of its own until then.

**Four client clips is the largest single ask on this page.** If only one client ever agrees to be
filmed, do not pad the carousel: delete the unused entries from `src/content/testimonials.ts` and the
carousel renders what is left, controls and counter adjusting themselves.

### The gate that is deliberately not satisfied

**A clip cannot ship without captions.** `Clip` in `src/components/VideoFrame.tsx` always writes a
`<track kind="captions">`, and `src/content/videos.ts` types `captions` as a required string rather
than an optional one, so the day someone adds a clip TypeScript asks for the `.vtt` path instead of
letting an uncaptioned video onto the page. Budget transcription time with the shoot, not after it.

The empty state needs no track: its text alternative is the `figcaption` under the frame, and its icon
is `aria-hidden`.
