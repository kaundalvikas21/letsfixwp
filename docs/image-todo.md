# Image to-do

Placeholders that must be replaced with real images (docs/section-contract.md rule 7).
Image generation was tried first (Higgsfield `gpt_image_2_5`, 2026-10-06) and refused: "Requires basic plan or higher."

| Slot | Placeholder | Size | Aspect | Art direction (MASTER.md) | Used in |
| --- | --- | --- | --- | --- | --- |
| hero-console-bg | https://picsum.photos/seed/fixmywp-hero-1/1600/1200 | 1600x1200 | 4:3 | Low-key real photo: an engineer at a desk lit by monitor light, one warm red practical lamp in frame, deep charcoal shadows, no text or logos. Shown at 25% opacity behind the triage console, so keep the subject in the right two thirds | src/components/sections/v1/Hero.tsx |
| timeline-diagnose (`critical-error-on-this-website`) | https://picsum.photos/seed/fixmywp-critical-error-on-this-website/1600/1000 | 1600x1000 | 16:10 | Real capture: WordPress "There has been a critical error on this website." screen. Run `npm run capture` (needs Docker) to write public/screens/critical-error-on-this-website.png; the frame switches automatically | src/components/sections/v1/AfterYouBook.tsx |
| timeline-verify (`restored-site`) | https://picsum.photos/seed/fixmywp-restored-site/1600/1000 | 1600x1000 | 16:10 | Real capture: the same WordPress site working again (default theme home page). `npm run capture` writes public/screens/restored-site.png | src/components/sections/v1/AfterYouBook.tsx |
| bento-guarantee | https://picsum.photos/seed/fixmywp-bento-guarantee/1200/1200 | 1200x1200 (2x2 cell, cropped by object-cover) | 1:1 to 16:10 | Low-key photo: an engineer at a desk lit by monitor light, one warm red practical lamp in frame. Keep the lower left dark for the headline | src/components/sections/v1/TrustBento.tsx |
| bento-keyboard | https://picsum.photos/seed/fixmywp-bento-keyboard/1200/1200 | 1200x1200 (1x1 cell) | 1:1 | Macro of a laptop keyboard in monitor light, shallow depth of field, dark lower edge for the text | src/components/sections/v1/TrustBento.tsx |
| final-cta | https://picsum.photos/seed/fixmywp-final-cta/2400/1200 | 2400x1200 (full-bleed, object-cover) | 2:1 | Low-key real photo: an engineer at a desk lit by monitor light, one warm red practical lamp in frame; subject off-centre so the centred H2 and buttons sit on darker space under the 70% --bg scrim | src/components/sections/v1/FinalCta.tsx |
