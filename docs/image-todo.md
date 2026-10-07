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

**Still outstanding: the screenshots.** Those must be real captures, never generated.

| Slot | Placeholder | Size | Aspect | Art direction (MASTER.md) | Used in |
| --- | --- | --- | --- | --- | --- |
| timeline-diagnose (`critical-error-on-this-website`) | https://picsum.photos/seed/fixmywp-critical-error-on-this-website/1600/1000 | 1600x1000 | 16:10 | Real capture: WordPress "There has been a critical error on this website." screen. Run `npm run capture` (needs Docker) to write public/screens/critical-error-on-this-website.png; the frame switches automatically | src/components/sections/v1/AfterYouBook.tsx |
| timeline-verify (`restored-site`) | https://picsum.photos/seed/fixmywp-restored-site/1600/1000 | 1600x1000 | 16:10 | Real capture: the same WordPress site working again (default theme home page). `npm run capture` writes public/screens/restored-site.png | src/components/sections/v1/AfterYouBook.tsx |
| service-<id> (32 slots, one per service) | https://picsum.photos/seed/fixmywp-service-<id>/1600/1000 | 1600x1000 | 16:10 | Real screenshot inside the browser frame on each service hero: the WordPress admin or front end showing that service's problem or result (e.g. the critical error notice for critical-error, a Search Console Core Web Vitals report for speed-optimization). Save as public/screens/service-<id>.png and the frame switches automatically | src/components/templates/ServiceTemplate.tsx |
