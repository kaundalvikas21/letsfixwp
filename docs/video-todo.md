# Video to do

Pending clips, the same way `docs/image-todo.md` tracks pending images (contract rule 7). One row per
slot in `src/content/videos.ts`. A slot renders a dashed empty state naming what will play there until
its files land, so nothing here blocks a page shipping.

## The rule that governs all of it

A client clip is that client, on camera, filmed with their consent, or the slot stays empty. No actor,
no voiceover over stock footage, no reconstruction, no clip belonging to another company. PRODUCT.md
lists client testimonials under what must not be fabricated by any future work, and section contract
rule 6 bans invented brands outright. `scripts/check-confirmed.ts` fails a production build while the
matching quote in `src/content/testimonials.ts` is still a placeholder.

Get written permission to publish before filming, and keep it. The clip is a named person saying what
happened to their business.

## Specs

| | Client clips | Capture clips |
| --- | --- | --- |
| Slots | `client-story-1` to `client-story-4` | `how-a-rescue-runs`, `a-site-brought-back` |
| Shape | 9:16 portrait, 1080 x 1920 | 16:10 landscape, 1600 x 1000 |
| | | (the brand film is the exception: 16:9, 1920 x 1080) |
| Length | 20 to 35 seconds | up to 90 seconds |
| Container | mp4, H.264 video, AAC audio | same |
| Target size | under 4MB | under 8MB |
| Poster | a real frame from the clip, jpg, same pixel size | same |
| Captions | WebVTT, English, required | required |
| Poster frame | mid tone, not blown out (see below) | same |

**Pick the poster frame with the play button in mind.** A light badge sits in the middle of every
poster. On a mid tone or dark frame it reads immediately; on a blown out one, a white wall or a
window behind the speaker, it can wash out. Choose a frame where the centre of the shot is not the
brightest thing in it, and the badge carries its own shadow for the rest. This is a shoot decision
rather than a code one: the alternative was a permanent scrim over every clip, which would dull the
footage you paid for on every card to cover a frame you can simply not choose.

Filmed on a phone, held upright, in the client's own setting. Good light on the face and usable audio
matter more than production value: the point of the format is that it does not look like an ad.

## Filenames

All three files per slot go in `public/videos/`, named after the slot id:

```
public/videos/client-story-1.mp4
public/videos/client-story-1.jpg
public/videos/client-story-1.vtt
```

## Wiring one up

Write the paths into the slot in `src/content/videos.ts`. No component changes, no new code:

```ts
"client-story-1": {
  ratio: "9/16",
  label: "A client on what broke and how it was handled.",
  clip: {
    src: "/videos/client-story-1.mp4",
    poster: "/videos/client-story-1.jpg",
    captions: "/videos/client-story-1.vtt",
    width: 1080,
    height: 1920,
    alt: "Priya Nair on the morning her checkout stopped taking orders.",
    seconds: 28,
  },
},
```

Paths have to live in that file: `scripts/check-content.ts` fails a hardcoded internal path anywhere
outside `src/content` and `src/config`. `VideoFrame.tsx` checks the files are on disk before it renders
a player, so a slot wired up ahead of the upload falls back to the empty state rather than shipping a
broken source.

Replace the matching entry in `src/content/testimonials.ts` at the same time: delete its
`placeholder: true` and write the client's real words, name, role and company. The clip and the quote
are the same person, and the attribution on the card comes from the quote.

## Slots

| Slot | What it has to show | Used on |
| --- | --- | --- |
| `client-story-1` | A client on one emergency: what broke, what they had already tried, how long the site was down, what happened after the fix. | `/`, `/pricing/`, `/case-studies/`, service pages |
| `client-story-2` | A client whose job was not an emergency, so it is not the same point twice. A care plan or a build. | `/`, `/pricing/`, `/case-studies/` |
| `client-story-3` | A client on a hacked or infected site: what they first noticed, who told them, what it took to clear the warnings. | `/`, `/pricing/`, `/case-studies/` |
| `client-story-4` | A client on a move or a store: what they were afraid of losing, and whether anything was lost. | `/`, `/pricing/`, `/case-studies/` |
| `client-story-5` | A site that went down right after an update: what they clicked, what they saw, how long to get the page back. | `/case-studies/` |
| `client-story-6` | A care plan month to month: what actually arrives in their inbox, and what has not gone wrong since. | `/case-studies/` |
| `client-story-7` | A site that was slow rather than broken: what the speed was costing them, and what changed. | `/case-studies/` |
| `client-story-8` | A change of hosting: what they were afraid would happen on the day, and what it was actually like. | `/case-studies/` |
| `client-story-9` | A checkout that had stopped taking payments: how they found out, and what it cost before it was fixed. | `/case-studies/` |
| `client-story-10` | A PHP upgrade that took the page builder with it: who told them to upgrade, and what broke. | `/case-studies/` |
| `client-story-11` | A redesign: what they wanted to keep, and whether the pages they already ranked for survived. | `/case-studies/` |
| `client-story-12` | An agency handing WordPress support over: what they stopped doing, and what their own clients noticed. | `/case-studies/` |
| `how-a-rescue-runs` | A rescue from the first message to the site loading again. Our own work, no client needed. | `/about/` |
| `a-site-brought-back` | A WordPress site going from a fatal error back to loading normally. Our own work, no client needed. | `/case-studies/` |
| `what-a-fix-looks-like` | **Done.** The brand film, *Back Online Today*: a broken site, the team, a fixed price, a login the client creates, a full backup, the fix, access removed, back online. 3D voxel figures drawn in code, not recorded. 16:9 in the home page's film section. | `/` |

**Twelve client slots, and the pages do not all show twelve.** `/case-studies/` is the library and
shows every clip that exists, four across on a desktop and two across on a phone. The home and pricing
pages tease: the first four only, then a link here. So clips 1 to 4 carry the most weight and are worth
filming first; 5 to 12 fill the library out.

The two capture clips need nobody's approval, which is why they are the evidence those pages can carry
before any client clip exists.

**One slot is filled.** `what-a-fix-looks-like` is on the home page: *Back Online Today*, 45 seconds,
English voice-over with burned-in subtitles and a WebVTT track, poster composed for the play button.
It is drawn rather than recorded and its label says so, so it explains the service without claiming to
be evidence of any particular job. It states only the owner-confirmed promises from PRODUCT.md and the
home H1. It does not retire `how-a-rescue-runs` or `a-site-brought-back`: a real rescue recorded on a
real site is evidence in a way a drawn film is not. Source and rebuild script: `letsfixwp-film/`
(`sh build.sh`, needs the Lemo-Opuscar library at `~/lemo-opuscar`). It replaced an earlier 40 second
film whose source lives in `~/films/letsfixwp-rescue`.

## Briefing a client

Keep it loose. A prescribed script is why most testimonial video reads as an ad. Four prompts are enough:

1. What were you looking at when you realised something was wrong?
2. What did you try first?
3. What did it cost you while it was down?
4. What would you tell someone it happened to tomorrow?

Ask them not to say the company name in the first sentence, and not to read anything. One take is fine.
