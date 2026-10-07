# Image generation briefs: v1-incident-console

Ready-to-paste prompts for the four photographic placeholders. Each one is written against how the image is
actually cropped, dimmed and overlaid in the build, not just against the slot size.

**Business:** on-demand WordPress emergency repair, care plans and development, India, remote delivery.
**Visual language:** `design-system/fixmywp-v1/MASTER.md`, theme locked dark.

---

## Shared brand block

Paste this into every prompt. It carries the palette and the lighting logic.

```
Low-key documentary photograph, night interior, single-source lighting.
Palette: near-black charcoal background (#0B0B0D) and dark graphite surfaces (#131316 to #1A1A1F);
cool neutral monitor glow as the key light (#EDEDEF); exactly one warm red practical in frame (#CC3333),
small and contained, used as an accent only. No other colour anywhere: no blue, teal, purple, green, orange or neon.
Deep crushed shadows, high dynamic range between the bright screen glow and the black surroundings.
Shot on 35mm, shallow depth of field, natural film grain, realistic skin and materials, no gloss, no studio polish.
Indian workplace context, plausible and unstaged.
```

### Why the lighting is specified this way

The palette is one accent on near-black. A photo with a second colour source fights the single-accent rule and
makes the page look like a different brand. The red must read as a *practical light in the scene* (a desk lamp,
an LED strip, a router light), never as a colour grade over the whole frame.

### Typography: do not render any

No text, numbers, logos or UI labels in any image. Three reasons:

1. The section contract bans pills and labels on images.
2. Generated text is unreliable and would sit next to real Geist type, making the fake text obvious.
3. Geist headlines are placed **over** these images by CSS. Typography therefore shapes the *composition*:
   each prompt below reserves the exact region where Geist text lands, and asks for that region to stay dark
   and quiet.

### Shared negative prompt

```
text, letters, words, numbers, watermark, logo, brand name, UI mockup, screenshot overlay, user interface panels,
captions, subtitles, neon signs, RGB keyboard lighting, blue or purple or teal or green light, colour gradients,
lens flare, bokeh balls, stock-photo smiles, posed handshake, thumbs up, headset call-centre agent,
multiple coloured lights, oversaturated, HDR look, clip art, 3D render, illustration, cartoon, AI artefacts,
extra fingers, distorted hands, duplicated screens
```

---

## 1. `hero-console-bg`

| | |
| --- | --- |
| **File** | `public/hero-console-bg.jpg` (then set the Hero `src`) |
| **Source size** | 1600 x 1200 (4:3) |
| **Used in** | `src/components/sections/v1/Hero.tsx`, the home page hero |
| **Rendered as** | `object-cover`, **25% opacity**, plus two scrims: left-to-right (solid bg → 20% → 60%) and top-to-bottom (solid bg → clear → solid bg) |
| **Reserved region** | The triage console card covers the right 7 of 12 columns; the Geist H1 and CTA pair sit on the left |

**The constraint that matters:** at 25% opacity over `#0B0B0D`, only the brightest pixels survive. A uniformly
dim photo disappears completely. This image needs a few very bright points and a lot of black.

```
Low-key documentary photograph, night interior, single-source lighting.
Palette: near-black charcoal background (#0B0B0D) and dark graphite surfaces (#131316 to #1A1A1F);
cool neutral monitor glow as the key light (#EDEDEF); exactly one warm red practical in frame (#CC3333),
small and contained, used as an accent only. No other colour anywhere: no blue, teal, purple, green, orange or neon.
Deep crushed shadows, high dynamic range between the bright screen glow and the black surroundings.
Shot on 35mm, shallow depth of field, natural film grain, realistic skin and materials, no gloss, no studio polish.
Indian workplace context, plausible and unstaged.

Subject: a WordPress engineer in their early thirties seen from behind and three-quarters, seated close to a desk
at night, leaning in to read a wall of dense log output on a large monitor. Their face and shoulder are rim-lit by
the screen. A small warm red LED on a router or a desk lamp glows in the deep background on the right.
Composition: the subject and the bright monitor occupy the right half of the frame; the left third is almost pure
black with only a faint edge of the desk catching light. Horizontal format, eye level, camera slightly behind the
shoulder. Very high contrast: brilliant screen highlights against near-black, with no mid-grey haze.
```

**Acceptance check:** open the file at 25% opacity on a `#0B0B0D` background. The monitor glow and rim light should
still be clearly visible; everything else may vanish. If the whole frame goes flat black, the source was too dim.

---

## 2. `bento-guarantee`

| | |
| --- | --- |
| **File** | `public/bento-guarantee.jpg` |
| **Source size** | 1200 x 1200 (1:1) |
| **Used in** | `src/components/sections/v1/TrustBento.tsx`, the 2x2 guarantee cell |
| **Rendered as** | Full opacity, `object-cover`, scrim bottom-to-top (solid bg → 70% → 20%) |
| **Reserved region** | The large Geist headline sits **bottom-left**. Keep the bottom third empty and dark |
| **Crop warning** | A square source renders in a landscape cell (about 816 x 432 at 1440px). Only the **horizontal centre band** survives: put nothing important in the top or bottom of the square |

```
[shared brand block]

Subject: a pair of hands resting still on a laptop keyboard at the moment a repair finishes, no typing, no motion
blur. The laptop screen is out of frame or heavily defocused so no interface is readable. One warm red practical
light glows softly behind the hands on the right. Human presence is calm and unhurried, suggesting the work is done.
Composition: square frame, but the subject must sit inside the horizontal centre band because the image is cropped
to a wide letterbox. Keep the bottom third of the frame almost pure black and empty, with no object or hand
entering it: large Geist headline type is placed there. Centre-right weighting, left side dark and quiet.
```

**Acceptance check:** crop the square to the middle 53% of its height. The subject should still be centred and
readable, and the bottom of that crop should be dark enough for white text.

---

## 3. `bento-keyboard`

| | |
| --- | --- |
| **File** | `public/bento-keyboard.jpg` |
| **Source size** | 1200 x 1200 (1:1) |
| **Used in** | `src/components/sections/v1/TrustBento.tsx`, the small "WordPress only. Nothing else." cell |
| **Rendered as** | Full opacity, `object-cover`, same bottom-up scrim |
| **Reserved region** | One line of Geist text bottom-left |
| **Crop warning** | Renders about 400 x 208, a strong landscape crop of the square. Centre band only |

```
[shared brand block]

Subject: an extreme macro of a laptop keyboard at night, lit only by the monitor above it. Three or four keys are
in sharp focus and the rest of the board falls away into shallow blur and darkness. The key surfaces are matte
dark grey with faint cool highlights along their top edges. A single warm red reflection grazes the far right of
the frame from an out-of-frame practical light.
Composition: square frame with the sharp keys in the horizontal centre band, since the image is cropped to a wide
letterbox. The lower third stays dark and uncluttered for a line of type. No hands, no fingers, no visible letters
or symbols on the keycaps: shoot at an angle and depth of field where key legends are not legible.
```

**Acceptance check:** no keycap letter should be readable. The contract bans text in images, and legible QWERTY
legends read as text.

---

## 4. `final-cta`

| | |
| --- | --- |
| **File** | `public/final-cta.jpg` |
| **Source size** | 2400 x 1200 (2:1) |
| **Used in** | `src/components/sections/v1/FinalCta.tsx`, the closing full-bleed panel |
| **Rendered as** | Full-bleed `object-cover` under a flat 70% `#0B0B0D` scrim |
| **Reserved region** | A large centred Geist headline plus two buttons sit in the **middle** of the frame |

**The constraint that matters:** the scrim is flat, not graded, so the image keeps its shape everywhere. The centre
must therefore be calm on its own, or it will fight the headline.

```
[shared brand block]

Subject: a wide night view of a small working space after a repair: an empty chair pushed slightly back from a
desk, a monitor still awake and casting cool light across the desk surface, a single warm red standby LED glowing
at the edge of the frame. Quiet, resolved, nobody in shot.
Composition: wide 2:1 panoramic frame. The monitor and desk sit in the left third and the right third holds a dark
empty wall; the centre of the frame is deliberately calm, low detail and evenly dark, because large centred
headline type and two buttons are placed there. No strong edges, no bright highlights and no busy texture crossing
the middle of the frame. Horizon and desk line kept low.
```

**Acceptance check:** lay a 70% black layer over it and place a centred white headline across the middle third.
The headline should read cleanly without a second scrim.

---

## Tool settings

| Tool | Settings |
| --- | --- |
| Higgsfield `gpt_image_2_5` | `aspect_ratio: "4:3"` (hero), `"1:1"` (bento), `"2:1"` (final CTA). Paste the negative list as "avoid: ..." at the end of the prompt |
| Midjourney v6+ | append `--ar 4:3` / `--ar 1:1` / `--ar 2:1` `--style raw --stylize 150`, and `--no text, logo, neon, blue light, purple, teal, green, watermark, hands with extra fingers` |
| DALL-E 3 | Prepend `Photograph, not an illustration.` It ignores negative prompts, so state exclusions positively: "the only coloured light in the frame is one small warm red practical" |
| Stable Diffusion / Flux | Use the shared negative prompt verbatim. CFG 4 to 6, and a photographic checkpoint rather than an artistic one |

## After generating

1. Save as JPEG at the source size above, quality 80, into `public/`.
2. Point the component at the local file: replace the `https://picsum.photos/seed/...` src with `/<file>.jpg`.
3. The hero backdrop is the home page's LCP element. Keep it under about 150KB; it already renders at `quality={35}`.
4. Alt text: these four are decorative (they sit behind text and carry no information), so keep `alt=""`.
   The error-screen captures are different: those are informative and need real alt text.
5. Remove the row from `docs/image-todo.md` and re-run `npm run build`.

## Not covered here: the error screens

`critical-error-on-this-website`, `restored-site`, `too-many-redirects` and the 32 `service-<id>` slots must be
**real screenshots**, never generated. `npm run capture` (needs Docker) starts a throwaway WordPress, breaks it one
way at a time and captures each state at 1600 x 1000 into `public/screens/`. A generated picture of an error
message is a fake screenshot, which the contract bans and which customers would spot.
