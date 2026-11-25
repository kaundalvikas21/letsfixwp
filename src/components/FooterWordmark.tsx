"use client";

import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/Logo";
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
 * The mark itself is `Wordmark`, so the drop in "Fix" scales to this size with the letters. The outer
 * span stays `aria-hidden`, which also silences the component's own `sr-only` name: the footer already
 * names the business a few lines above, and this is the same word set large.
 *
 * This is the only client code in the footer, and it costs almost nothing: `usePathname` is already
 * in the bundle on every route because `StickyCTA` in `SiteShell` uses it.
 */
export function FooterWordmark() {
  const pathname = usePathname();
  return (
    <Reveal key={pathname} as="div" direction="clip" duration={900} className="mt-12 overflow-hidden md:mt-20">
      <span aria-hidden className="brand-wordmark">
        {/* The letters are a 36% mix of `--text`, and the drop was set to match at 40% ember. On this
            near-black page that much alpha takes the chroma out of it and what rendered was a dull
            maroon, which is a colour the site does not have. 70% keeps it recognisably the accent
            while staying under the solid ember of a button. */}
        <Wordmark dropClass="fill-accent/70" />
      </span>
    </Reveal>
  );
}
