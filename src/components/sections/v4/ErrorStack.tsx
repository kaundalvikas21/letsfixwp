import { BrowserIcon, DatabaseIcon, ShieldWarningIcon, WarningOctagonIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { BookLink } from "@/components/Cta";
import { hasScreen } from "@/components/Photo";
import { getGuide } from "@/content";
import { ErrorPanels, type ErrorPanel } from "./ErrorPanels";

// What you see, in the software's own words. These are quotes of WordPress and Chrome, not our copy,
// which is why they are the only mono text here. The white screen has no words at all, so its line is
// the guide's first symptom instead, set in the body face.
// What it usually means is each guide's most likely cause, so this section cannot drift from the guide.
// One icon per screen, from Phosphor, the site's one icon family: four identical warning triangles
// would carry no information in the one place a closed panel has room for a mark and a name.
const CARDS = [
  { slug: "white-screen-of-death", name: "White screen", quote: null, Icon: BrowserIcon },
  {
    slug: "critical-error-on-this-website",
    name: "Critical error",
    quote: "There has been a critical error on this website.",
    Icon: WarningOctagonIcon,
  },
  {
    slug: "error-establishing-database-connection",
    name: "Database error",
    quote: "Error establishing a database connection",
    Icon: DatabaseIcon,
  },
  // Chrome's interstitial, not a WordPress screen, so scripts/capture-errors.mjs cannot produce it:
  // its slot is prefixed `illustration-` and needs a drawn asset dropped at
  // /screens/illustration-google-deceptive-site-warning.png. Logged in docs/image-todo.md. Until then
  // this panel keeps the quoted-words fallback while the other three become real captures.
  { slug: "google-deceptive-site-warning", name: "Deceptive site", quote: "Deceptive site ahead", Icon: ShieldWarningIcon },
] as const;

const panels: ErrorPanel[] = CARDS.map(({ slug, name, quote, Icon }) => {
  const guide = getGuide(slug)!;
  const src = `/screens/${guide.image.slot}.png`;
  const captured = hasScreen(src);
  return {
    id: slug,
    name,
    quote,
    captured,
    symptom: guide.symptoms[0],
    cause: guide.likelyCauses[0],
    icon: <Icon weight="duotone" className="size-5" />,
    screen: captured ? (
      // fill, not a declared width and height: the captures from scripts/capture-errors.mjs are
      // 1600x1000 but a hand-supplied screen is whatever shape it was, and the panel crops it either
      // way. 48rem, not the 72rem container: the open panel is 748px at its widest and every panel
      // shares one sizes hint, so 72rem had all four of them asking for a 1200w variant, three of
      // them to fill a 107px sliver.
      <Image src={src} alt="" fill sizes="(min-width: 768px) 48rem, 92vw" className="object-cover" />
    ) : quote ? (
      // No capture yet, so the panel is a plain dark screen and ErrorPanels sets the error's own
      // words on it. Never a div-built browser window.
      <span className="block bg-bg" />
    ) : (
      // The white screen has nothing on it, so the panel has nothing on it. It is also the one panel
      // that reads as itself at sliver width: a strip of blinding white among three dark ones.
      <span className="block bg-text" />
    ),
  };
});

/**
 * Funnel stage one, the break: the four screens people actually arrive with, side by side, with the
 * one you pick opened and the rest still legible as slivers.
 *
 * This used to be a pinned GSAP sticky-stack that scrolled the same four screens past the visitor one
 * at a time. Same content, but the visitor now picks the screen that is theirs instead of scrolling
 * until it appears, which also returns one of the page's two pin budgets and about 3400px of height.
 */
export function ErrorStack() {
  return (
    <section aria-labelledby="sound-familiar" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      {/* The ask sits on the heading's line, at the far end of the spine, rather than under the row.
          The heading ran the full width with nothing beside it, and the question only makes sense
          once you have seen the screens, so below md it stays in reading order: heading, ask,
          screens. On one line from md up, both blocks sharing a bottom edge. */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
        <h2
          id="sound-familiar"
          className="font-display text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_30] sm:text-5xl sm:[font-variation-settings:'opsz'_48]"
        >
          Sound familiar?
        </h2>

        <div className="flex shrink-0 flex-wrap items-center gap-4">
          <p className="text-lg">Seeing one of these?</p>
          <BookLink location="home:error-stack" className="btn-primary" />
        </div>
      </div>

      <ErrorPanels panels={panels} />
    </section>
  );
}
