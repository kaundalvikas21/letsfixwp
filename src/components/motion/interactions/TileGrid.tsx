"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChatButton } from "@/components/Cta";
import { rankProblems } from "@/app/palette-search";
import { useSearchTracking } from "@/lib/use-search-tracking";
import { cn } from "@/lib/utils";

export type Tile = { key: string; category: string; critical: boolean; node: ReactNode };

const ALL = "Everything";

// The unfiltered grid is 52 tiles: 4.2 viewports on a desktop and about 14 on a phone, which buries
// the rest of the page behind a wall of scrolling. The first nine are the critical ones (the sort in
// ProblemTiles puts emergencies first), which fills roughly one desktop viewport and is the set a
// visitor whose site is down actually needs. The rest are one button away. Only the default view is
// capped: picking a category or typing has already narrowed the grid, so those show everything.
const CAP = 9;

/**
 * The problem grid: type to narrow it with the same matcher the site uses everywhere, or pick a
 * category. Tiles keep their place with a Motion layout animation so the eye can follow one tile
 * from the full grid into a filtered one. Reduced motion skips the animation and just re-renders.
 */
export function TileGrid({ tiles, categories }: { tiles: Tile[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  // Ranked keys for the query they answer. The scoring runs on the server, so the grid holds the
  // tiles it already rendered and only learns what order to put them in.
  const [ranked, setRanked] = useState<{ q: string; keys: string[] } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const reduce = useReducedMotion();
  useSearchTracking(query);

  useEffect(() => {
    const q = query.trim();
    // Nothing to clear when the field empties: `shown` already ignores the ranking for an empty
    // query, so the stale keys simply go unread until the next one arrives.
    if (!q) return;
    let live = true;
    const t = setTimeout(() => {
      rankProblems(q)
        .then((keys) => live && setRanked({ q, keys }))
        .catch(() => live && setRanked({ q, keys: [] }));
    }, 150);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [query]);

  const shown = useMemo(() => {
    const byCategory = category === ALL ? tiles : tiles.filter((t) => t.category === category);
    if (!query.trim() || !ranked) return byCategory;
    // Matcher order, best first, so a search re-ranks the grid instead of only thinning it. While a
    // newer query is still in flight the previous ranking stays on screen: blanking 57 tiles for
    // 150ms on every keystroke reads as a fault, and the grid narrowing a beat late does not.
    const rank = new Map(ranked.keys.map((k, i) => [k, i]));
    return byCategory.filter((t) => rank.has(t.key)).sort((a, b) => rank.get(a.key)! - rank.get(b.key)!);
  }, [tiles, category, query, ranked]);

  const capped = !expanded && category === ALL && !query.trim() && shown.length > CAP;
  const visible = capped ? shown.slice(0, CAP) : shown;
  const showToggle = category === ALL && !query.trim() && shown.length > CAP;

  return (
    <>
      {/* Chips left, search right, on one line from md up. The DOM keeps the search first and the row
          is reversed, so a keyboard reaches the primary affordance before the category filters at
          every width, and the phone layout (search above the chips) is unchanged. items-end puts the
          field on the same baseline as the last row of chips when they wrap. */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row-reverse md:items-end md:gap-6">
        <label className="block md:w-[22rem] md:shrink-0">
          <span className="text-[15px] text-muted">Describe what your site is doing</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="white screen, database error, hacked"
            className="mt-2 block min-h-11 w-full rounded-[14px] border border-line-strong bg-surface px-4 py-3 text-base text-text placeholder:text-muted"
          />
        </label>

        <ul className="flex flex-wrap gap-2 md:flex-1">
          {[ALL, ...categories].map((c) => (
            <li key={c}>
              <button
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={cn(
                  "min-h-11 cursor-pointer rounded-[14px] border px-4 text-[15px] font-medium active:scale-[0.98]",
                  category === c
                    ? "border-accent bg-accent text-on-accent"
                    : "border-line-strong bg-surface text-text hover:bg-surface-2",
                )}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* The grid changing from 57 tiles to 9 is feedback a sighted visitor gets for free and a screen
          reader gets not at all. Same polite-region convention as src/components/Finder.tsx. */}
      <p aria-live="polite" className="sr-only">
        {visible.length} of {tiles.length} problems shown
      </p>

      {shown.length === 0 ? (
        <div className="mt-10 rounded-[14px] border border-line bg-surface p-8">
          <p className="font-display text-xl font-bold">Nothing here matches that</p>
          <p className="mt-2 max-w-[52ch] text-muted">
            Describe it to an engineer instead. If it is a WordPress site, it is something we have seen.
          </p>
          <ChatButton location="home:problem-tiles" className="btn-secondary mt-6" />
        </div>
      ) : (
        <motion.ul
          id="problem-grid"
          // The container resizes instantly and only the tiles animate: giving the grid its own
          // layout animation leaves the tiles projected against a box that is still collapsing.
          // dense flow plus a taller span for the critical tiles: a masonry that keeps whole boxes,
          // so a layout animation has something stable to move between.
          className="mt-10 grid auto-rows-[9rem] grid-flow-row-dense grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence initial={false}>
            {visible.map((t) => (
              <motion.li
                key={t.key}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                // A filter can remove 44 tiles at once, so they leave quickly and the rest take the spring.
                exit={reduce ? undefined : { opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={cn("row-span-1", t.critical && "row-span-2")}
              >
                {t.node}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      {/* A toggle rather than a one-way reveal: a button that deletes itself on click drops keyboard
          focus to the body, and 52 tiles is a long way to scroll back from with no way to close. */}
      {showToggle && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={!capped}
            aria-controls="problem-grid"
            className="btn-secondary"
          >
            {capped ? `Show all ${shown.length} problems` : "Show fewer problems"}
          </button>
        </div>
      )}
    </>
  );
}
