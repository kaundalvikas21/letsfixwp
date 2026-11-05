# Motion

Every scroll animation on the site comes from this folder. Pages and sections import from
`@/components/motion`, never from `motion/react`; `npm run check:motion` fails if one does.

## Which primitive

| Situation | Use | Notes |
| --- | --- | --- |
| One element arriving | `<Reveal>` | Server Component. No JS shipped. |
| A group arriving in order | `<Stagger>` | Server Component. Each child is its own trigger. |
| A layer with depth behind content | `<Parallax>` | Off below 768px and under reduced motion. |
| A real figure counting up | `<CountUp>` | Value must come from `src/content` or `getSiteStatus()`. |
| Reading progress on an article | `<ScrollProgress>` | `/guides/<slug>/` only. See the rule 6 note below. |
| A persistent CTA late in a page | `<StickyCTA>` | Desktop only. Dismissible. |
| An endless logo strip | `<Marquee>` | One per page (contract rule 3). |
| A headline arriving line by line | `<TextReveal>` | Never on the LCP element. |

## Two engines, and why

`Reveal` and `Stagger` are **not** Motion components. They emit a class and some data attributes,
and the inline script in `app/layout.tsx` applies the hidden state and plays the animation.

That split is the most important thing in this folder. Motion's `whileInView` writes `opacity: 0`
into the server HTML and waits for hydration to clear it, so a blocked bundle, a slow network or a
thrown module leaves the page blank. These two primitives wrap body copy on all 99 routes, where
that failure is worse than having no animation at all. Because the hidden state is applied by a
script the HTML parser has already run, no script means no hidden state, and the page renders
complete and unanimated.

They are also Server Components, so wrapping a section does not make it a client component
(rule 6), and they ship no JavaScript of their own.

Everything else in the folder is Motion inside `LazyMotion` + `domAnimation`, using `m` components.
`Marquee` is a third case: plain CSS, because a linear loop that never gets interrupted runs better
off the main thread. Each exception is argued in its own file's doc comment.

## Usage

```tsx
import { Reveal, Stagger, Parallax, CountUp, ScrollProgress, StickyCTA, Marquee, TextReveal } from "@/components/motion";
```

**Reveal**: one element, fade and rise.

```tsx
<Reveal as="section" delay={70} direction="up">
  <h2>What we work on</h2>
</Reveal>
```

**Stagger**: a group, index-ordered. Put it on the list, not on each item.

```tsx
<Stagger as="ul" className="grid gap-4 sm:grid-cols-2">
  {services.map((s) => (
    <li key={s.id}>{s.title}</li>
  ))}
</Stagger>
```

**Parallax**: the outer element is measured and static, the inner one moves.

```tsx
<Parallax className="absolute inset-0 -z-10" distance={60} direction="up">
  <Photo id="racks" decorative sizes={bannerSizes} />
</Parallax>
```

**CountUp**: the real number is in the server HTML; the count replaces it on the client.

```tsx
<CountUp value={cities.length} className="font-display text-[1.75rem] font-extrabold" suffix=" cities" />
```

**ScrollProgress**: pass the article so the bar reports the article's length, not the document's.

```tsx
const article = useRef<HTMLElement>(null);
<ScrollProgress target={article} />
```

**StickyCTA**: desktop only, dismissed into `sessionStorage`.

```tsx
<StickyCTA hiddenOn={[routes.contact, routes.check]} label="Quick quote">
  <QuoteLink location="sticky" className="btn-primary" />
</StickyCTA>
```

**Marquee**: one copy of the children; the primitive makes the rest.

```tsx
<Marquee label="Platforms we repair" seconds={40}>
  {logos.map((l) => (
    <li key={l.name}>{l.mark}</li>
  ))}
</Marquee>
```

**TextReveal**: a plain string, never markup, and never above the fold.

```tsx
<TextReveal as="h2" split="word" className={h2}>
  Back online today
</TextReveal>
```

## Rules these primitives already keep for you

1. `transform` and `opacity` only. No `layout` prop anywhere (`domAnimation` does not ship it).
2. `once: true` is the default on everything.
3. `useReducedMotion()` collapses each one to its final state. `Marquee` becomes a static wrapped
   row. `Parallax` switches off entirely.
4. Nothing in the first viewport animates on scroll. `TextReveal` must not be put on an LCP `h1`:
   the primitive cannot check this for you.
5. Zero CLS. Every animated element occupies its final box from the first paint.
6. Pages stay Server Components. Only the primitives carry `"use client"`.
7. No hydration flash. `Reveal`/`Stagger` have no client state at all; the others render their
   resting state on the server and only move after an effect.
10. Below 768px, travel steps down to 14px and `Parallax` is off.

## Exceptions on record

- **`ScrollProgress` is a scroll cue**, which `docs/section-contract.md` rule 6 bans. The exception
  is owner-instructed and scoped to article pages. Recorded in `docs/layout-ledger.md`.
- **`StickyCTA` is desktop only** because a phone already carries the mobile action bar and the
  chat widget.
- **`Marquee` is CSS, not Motion**, for off-main-thread smoothness.
- **The testimonials marquee is built but not mounted.** `src/content/testimonials.ts` holds
  placeholders and `next.config.ts` fails a production deploy while any remain.

## Tokens

`tokens.ts` is the source. `globals.css` mirrors the subset CSS needs under "Motion tokens", and
`npm run check:motion` fails the build if the two drift. `design-system/letsfixwp-v4/MASTER.md`
documents the same values in prose; change all three together.
