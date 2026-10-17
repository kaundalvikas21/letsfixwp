import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { hasScreen, Photo } from "@/components/Photo";
import { getGuide, getService, matchIndex } from "@/content";
import { servicePhotos } from "@/content/photos";
import { HUB_LABELS, nodeByPath, routes } from "@/config/routes";
import { TileGrid, type Tile } from "./TileGrid";

const keyOf = (r: { serviceSlug: string; guideSlug?: string }) => `${r.serviceSlug}:${r.guideSlug ?? ""}`;

// Every problem the matcher knows, as a tile. A guide is one error; a fix service is the family it
// belongs to. Critical guides get the taller tile with a real image behind the words.
const tiles: Tile[] = matchIndex.map((c) => {
  const service = getService(c.serviceSlug)!;
  const guide = c.guideSlug ? getGuide(c.guideSlug) : undefined;
  const critical = guide?.urgency === "critical";
  const capture = guide ? `/screens/${guide.image.slot}.png` : "";
  const title = guide?.title ?? service.title;
  const symptom = (guide?.symptoms ?? service.symptoms)[0];
  return {
    key: keyOf(c),
    category: HUB_LABELS[routes.hub(service.hub)] ?? nodeByPath.get(routes.hub(service.hub))!.title,
    critical,
    node: (
      <a
        href={guide ? routes.guide(guide.slug) : service.path}
        className={`group relative flex size-full flex-col justify-end overflow-hidden rounded-[14px] border border-line p-5 ${
          critical ? "bg-surface-2" : "bg-surface"
        }`}
      >
        {critical &&
          (hasScreen(capture) ? (
            <Image src={capture} alt="" width={1600} height={1000} sizes="(min-width: 1024px) 30vw, 92vw" className="absolute inset-0 size-full object-cover" />
          ) : (
            // No capture yet (docs/image-todo.md): the service's own night frame stands in, so the
            // tile still reads as a screen you would recognise rather than an empty box.
            <Photo id={servicePhotos[service.id]} decorative sizes="(min-width: 1024px) 30vw, 92vw" className="absolute inset-0" />
          ))}
        {/* Flat scrim, never a gradient. --text over it measures 5.6:1 against the brightest photo,
            which is why both lines on an image tile use --text and not --muted (2.55:1 there). */}
        {critical && <span aria-hidden className="absolute inset-0 bg-photo-scrim" />}
        <span className="relative flex items-start justify-between gap-3">
          <span className="line-clamp-2 font-display text-lg leading-tight font-bold text-balance">{title}</span>
          <ArrowUpRightIcon weight="duotone" className="mt-1 size-5 shrink-0 text-accent-text" aria-hidden />
        </span>
        <span className={`relative mt-2 line-clamp-3 text-[15px] ${critical ? "text-text" : "text-muted"}`}>{symptom}</span>
      </a>
    ),
  };
});

// Critical first, at every width: the brief asks for it in the single column, and it is the order the
// site uses everywhere else (emergency before everything). Sorting the data rather than reordering with
// CSS keeps the reading order and the tab order the same.
const ordered = [...tiles].sort((a, b) => Number(b.critical) - Number(a.critical));

const categories = [...new Set(ordered.map((t) => t.category))];

/**
 * Funnel stage three, the action: every problem we fix as a tile, searchable and filterable, each one
 * a link to the page about it. Server component; the search, the chips and the layout animation are an
 * isolated Motion island, and no GSAP goes near this tree.
 */
export function ProblemTiles() {
  return (
    <section aria-labelledby="pick-your-problem" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <h2
        id="pick-your-problem"
        className="max-w-[18ch] font-display text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_30] sm:text-5xl sm:[font-variation-settings:'opsz'_48]"
      >
        Pick your problem. We take it from there.
      </h2>
      <TileGrid tiles={ordered} categories={categories} index={matchIndex} />
    </section>
  );
}
