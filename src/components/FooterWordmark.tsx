"use client";

import { usePathname } from "next/navigation";
import { Reveal } from "@/components/motion";

/**
 * The footer wordmark, re-armed on every navigation.
 *
 * **Why this needs to exist at all.** `SiteFooter` is a sibling of `<main>` in the root layout, so
 * Next keeps the same DOM node across a soft navigation: nothing remounts, and the reveal engine
 * has already run and called `io.unobserve` on it. The mark therefore animated on whichever page
 * the visitor landed on and never again, however many routes they then clicked through.
 *
 * `key={pathname}` is the whole fix. A changed key makes React throw the old element away and
 * build a new one, which is a node the engine has never seen, so it is scanned, observed and
 * animated again. The engine's `seen` WeakSet keys off the node itself, so a fresh node is fresh to
 * it with no bookkeeping to reset.
 *
 * **It stays `once` within a page.** Brief rule 2 is that nothing replays when you scroll back up,
 * and this does not: the only thing that re-arms it is a route change. The alternative,
 * `once={false}`, would also have replayed it every time the footer scrolled back into view on a
 * single page, which is the behaviour the rule exists to prevent.
 *
 * The second half of the fix is in `app/layout.tsx`: the engine's `MutationObserver` watched `#main`
 * only, so a new node in the footer went unnoticed. It now watches the footer as well.
 *
 * This is the only client code in the footer, and it costs almost nothing: `usePathname` is already
 * in the bundle on every route because `StickyCTA` in `SiteShell` uses it.
 */
export function FooterWordmark({ name }: { name: string }) {
  const pathname = usePathname();
  return (
    <Reveal key={pathname} as="div" direction="clip" duration={900} className="mt-12 overflow-hidden md:mt-20">
      <span aria-hidden className="brand-wordmark">
        {name}
      </span>
    </Reveal>
  );
}
