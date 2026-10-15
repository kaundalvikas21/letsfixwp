"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState, type ReactNode } from "react";
import { ChatButton } from "@/components/Cta";
import { matchProblem, type MatchCandidate } from "@/lib/match-problem";
import { useSearchTracking } from "@/lib/use-search-tracking";
import { cn } from "@/lib/utils";

export type Tile = { key: string; category: string; critical: boolean; node: ReactNode };

const ALL = "Everything";
const keyOf = (r: { serviceSlug: string; guideSlug?: string }) => `${r.serviceSlug}:${r.guideSlug ?? ""}`;

/**
 * The problem grid: type to narrow it with the same matcher the site uses everywhere, or pick a
 * category. Tiles keep their place with a Motion layout animation so the eye can follow one tile
 * from the full grid into a filtered one. Reduced motion skips the animation and just re-renders.
 */
export function TileGrid({ tiles, categories, index }: { tiles: Tile[]; categories: string[]; index: MatchCandidate[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const reduce = useReducedMotion();
  useSearchTracking(query);

  const shown = useMemo(() => {
    const byCategory = category === ALL ? tiles : tiles.filter((t) => t.category === category);
    const q = query.trim();
    if (!q) return byCategory;
    // Matcher order, best first, so a search re-ranks the grid instead of only thinning it.
    const rank = new Map(matchProblem(q, index, index.length).map((r, i) => [keyOf(r), i]));
    return byCategory.filter((t) => rank.has(t.key)).sort((a, b) => rank.get(a.key)! - rank.get(b.key)!);
  }, [tiles, index, category, query]);

  return (
    <>
      <div className="mt-8 flex flex-col gap-4">
        <label className="block max-w-xl">
          <span className="text-[15px] text-muted">Describe what your site is doing</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="white screen, database error, hacked"
            className="mt-2 block min-h-11 w-full rounded-[14px] border border-line-strong bg-surface px-4 py-3 text-base text-text placeholder:text-muted"
          />
        </label>

        <ul className="flex flex-wrap gap-2">
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
          // The container resizes instantly and only the tiles animate: giving the grid its own
          // layout animation leaves the tiles projected against a box that is still collapsing.
          // dense flow plus a taller span for the critical tiles: a masonry that keeps whole boxes,
          // so a layout animation has something stable to move between.
          className="mt-10 grid auto-rows-[9rem] grid-flow-row-dense grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence initial={false}>
            {shown.map((t) => (
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
    </>
  );
}
