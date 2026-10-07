# Image credits

Every image the site renders is a local file. Nothing is hotlinked.

## Service and timeline photographs

`public/site_images/services/*.jpg`. Downloaded from Unsplash on 2026-10-07, resized to 1600x1000 (cover crop)
and re-encoded as JPEG quality 72 with mozjpeg.

Licensed under the [Unsplash licence](https://unsplash.com/license): free for commercial use, no permission and
no attribution required. Credit is given here anyway, and because it is the only record of where each file came
from. **Only `images.unsplash.com` results are used.** `plus.unsplash.com` is Unsplash+, a paid licence, and was
excluded.

| File | Unsplash photo id | Processing |
| --- | --- | --- |
| `emergency.jpg` | `photo-1758773263238-1989d0cc788c` | crop only |
| `alert.jpg` | `photo-1739799088045-7b715b372b46` | crop only |
| `monitors.jpg` | `photo-1457305237443-44c3d5a30b89` | crop only |
| `racks.jpg` | `photo-1558494949-ef010cbdcc31` | crop, **desaturated** to take the green and amber out of the fibre runs |
| `cables.jpg` | `photo-1544197150-b99a580bb7a8` | crop, **desaturated** to take the blue out of the patch cables |
| `terminal.jpg` | `photo-1678728245335-244ffd160d54` | crop only |
| `keys.jpg` | `photo-1649875951876-59484d9a43e5` | crop only |
| `night-desk.jpg` | `photo-1654023442884-30f6bea363fd` | crop only |
| `workspace.jpg` | `photo-1735948055457-8d816fb80a87` | crop only |
| `drafting.jpg` | `photo-1586717791821-3f44a563fa4c` | crop only |
| `store.jpg` | `photo-1488509082528-cefbba5ad692` | crop only |

The source file for any id is `https://images.unsplash.com/<id>`; the photo page is reachable by searching that
id on unsplash.com. Unsplash blocks automated requests to its HTML pages (401), so these were found through
image search and fetched from the CDN directly.

### Why these subjects

Servers, racks, patch panels, monitors, keyboards and developer desks: IT and web work. Candidates showing
padlocks, bench vices or hand tools were rejected because they read as a physical repair shop rather than a
WordPress service.

Rejected for not being IT at all: a red-lit industrial stairwell of pipes and gantries (it also leaked cyan
daylight through the windows) and a darkroom photo lab under a red safelight. Red light alone does not make a
picture about a website being down.

Rejected for carrying someone else's brand: a bank card whose face showed a Visa mark and legible Portuguese
ad copy for XP Investimentos, Amazon-branded parcels, `imgIX` logos on a data-centre rack, a watch
manufacturer's dial. A page selling WordPress repair must not carry another company's marketing.

Rejected on brand grounds: anything with a second colour (blue keyboard backlighting, teal light trails, green
status LEDs, a bright white dashboard), a visible brand mark (an `imgIX` logo on a server rack, a watch
manufacturer's dial), or a legible interface. The theme allows one accent, and section-contract rule 6 bans
images that look like UI.

## Home page photographs

`public/site_images/*.jpg`, four images generated to the briefs in `docs/image-briefs.md`, not stock. See
`docs/image-todo.md` for the crop applied to `bento-guarantee.jpg`.

## Screenshots

`public/screens/*.png` is empty. Those must be real captures from `npm run capture` (needs Docker), never
generated and never stock. See `docs/image-todo.md`.
