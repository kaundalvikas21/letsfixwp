# Image to-do

Placeholders that must be replaced with real images (docs/section-contract.md rule 7).
Image generation was tried first (Higgsfield `gpt_image_2_5`, 2026-10-06) and refused: "Requires basic plan or higher."

**The four photographic slots are DONE** (2026-10-07). Real images live in `public/site_images/` and the
components point at them. Prompts that produced them: `docs/image-briefs.md`.

| Slot | File | Notes |
| --- | --- | --- |
| hero-console-bg | `site_images/hero-console-bg.jpg` 1600x1200 | Engineer reading a PHP stack trace. Needed opacity 50% and `object-position 35% 95%`: the photo is genuinely low-key, so the 25% tuned for a daylight placeholder made it invisible |
| bento-guarantee | `site_images/bento-guarantee.jpg` 1200x1200 | **Cropped** from the supplied file to remove legible signage (see below) |
| bento-keyboard | `site_images/bento-keyboard.jpg` 1200x1200 | As supplied |
| final-cta | `site_images/final-cta.jpg` 2400x1200 | As supplied |

**One supplied image needed a crop.** The original `bento-guarant.png` carried readable signage: "TRUST IS
EARNED", "DO IT RIGHT. EVERY TIME.", "ONE JOB AT A TIME", a mug reading "FIXED. TESTED. DELIVERED.", a notepad
reading "DIAGNOSE / REPAIR / TEST / TEST / RETURN", a box marked "PARTS", and a garbled "KINTA CARE". That breaks
the no-text-on-images rule, makes service claims nobody has confirmed, and "PARTS / RETURN" implies physical
device repair rather than WordPress. It is cropped to the hands-and-laptop region, which has no text. Regenerate
it without signage if you want the wider framing back.

**No external images remain.** Every rendered image is a local file (2026-10-07). The 34 picsum placeholders
(32 service heroes plus the two timeline slots) are gone; `BrowserFrame` no longer has a placeholder branch.

**The service and timeline slots now show a photograph, not a frame.** Browser chrome around a stock photo
would read as a screenshot of the customer's own site, which section-contract rule 6 bans. So
`ScreenOrPhoto` renders a plain, unframed photograph from `public/site_images/services/` and only puts the
browser frame back once the real capture exists in `public/screens/`. The photographs are decorative mood, not
information, so their `alt` is empty; each service keeps its `image.alt` for the day its capture lands.

**Still outstanding: the screenshots.** Those must be real captures, never generated. Run `npm run capture`
(needs Docker, absent on this machine) to write `public/screens/<slot>.png`; each slot then switches from the
photograph to the framed capture with no code change.

| Slot | Size | Art direction (MASTER.md) | Used in |
| --- | --- | --- | --- |
| `critical-error-on-this-website` | 1600x1000 | WordPress "There has been a critical error on this website." screen. Shows `services/terminal.jpg` until then | src/components/sections/v1/AfterYouBook.tsx |
| `restored-site` | 1600x1000 | The same WordPress site working again (default theme home page). Shows `services/monitors.jpg` until then | src/components/sections/v1/AfterYouBook.tsx |

All five timeline steps carry a photograph, because identical rows are what make the section read as a rhythm:
Diagnose `terminal`, Back up `racks`, Repair `keys`, Verify `monitors`, Harden `workspace`, an arc from
investigating to resolved. Only Diagnose and Verify carry a capture slot. They are the before and after of one
site, which is the pair the section argues with; Back up, Repair and Harden have no screen state worth capturing
while files are being copied or edited, so those three stay photographs permanently and will never switch.
| `service-<id>` (32 slots) | 1600x1000 | The WordPress admin or front end showing that service's problem or result. Shows the service's `image.photo` until then | src/components/templates/ServiceTemplate.tsx |
| `illustration-<slug>` / error slots (37 guide slots) | 1600x1000 | Guide pages render nothing until the capture exists; no stand-in | src/components/templates/GuideTemplate.tsx |

**next.config.ts `images.qualities` must list every quality a component passes.** An unlisted one makes
`/_next/image` answer 400 and the prop is dropped silently, which is how the hero sat at 55 and the step
photographs at 65 for several commits while the optimiser served Next's default. The list is now
`[35, 55, 65, 75]`. There are no `remotePatterns`: every image is local, and an allowed remote host would leave
the optimiser able to fetch and serve arbitrary images from it.

## The service photographs

Twelve photographs cover the 32 services, in `public/site_images/services/`, all 1600x1000 JPEG q72. Sourced
from Unsplash under the Unsplash licence (free, commercial use, no attribution required); `plus.unsplash.com`
results were excluded because Unsplash+ is a paid licence. Full list with source links:
`docs/image-credits.md`.

Subjects are IT and web work only: servers, racks, patch panels, monitors, keyboards, developer desks. Earlier
candidates showing padlocks, bench vices and hand tools were rejected for reading as a physical repair shop
rather than a WordPress service. Anything carrying a second colour (blue backlighting, teal light trails, green
status LEDs), a visible brand mark, or a legible interface was rejected too: the theme allows one accent and the
contract bans images that look like UI.

| Photo | Subject | Services |
| --- | --- | --- |
| `emergency` | Engineer over the shoulder at a laptop of code, city at night behind | critical-error, emergency |
| `alert` | Wall of red server LEDs | server-errors |
| `monitors` | Two screens of code against a red wall | malware-removal, blacklist-removal, seo-spam-cleanup |
| `racks` | Rows of server racks, desaturated off the green and amber fibre | database-connection-error, hosting-migration, site-recovery |
| `cables` | Patch panel, desaturated off the blue cables | speed-optimization, platform-migration |
| `terminal` | Hands on a laptop, code on screen | audit-hardening, custom-plugin, hire-developer, login-redirect-issues |
| `keys` | Black keyboard macro | plugin-theme-conflict, update-php-errors |
| `night-desk` | Dark room, one lit desk | custom-theme, seo-services, white-label, white-screen |
| `workspace` | Dark home office, monitor and lamp | care-plans, email-not-sending, maintenance-woocommerce, support-hours |
| `drafting` | Tablet with a wireframe sketch | elementor-issues, redesign, website-design |
| `store` | Hands holding a phone in a dark room | payment-gateway-gst, shopify-migration, woocommerce-development, woocommerce-fixes |
