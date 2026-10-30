import Link from "next/link";
import type { ReactNode } from "react";
import { BookLink } from "@/components/Cta";
import { brand } from "@/config/brand";
import { nodeByPath, routes } from "@/config/routes";
import { getGuide, getService, matchIndex } from "@/content";
import { ChatProvider } from "./ChatProvider";
import { ChatIconButton, MobileMenu } from "./MobileNav";
import { Reveal } from "./Reveal";
import { ProblemSearch, SearchTrigger, type ProblemItem } from "./ProblemSearch";

const links = [
  { href: routes.hub("wordpress-fix"), label: "Problems" },
  { href: routes.pricing, label: "Pricing" },
  { href: routes.plans(), label: "Care plans" },
  { href: routes.reviews, label: "Reviews" },
];

// Every problem the matcher knows (guides and fix services), grouped in the palette by its hub.
const problems: ProblemItem[] = matchIndex.map((c) => {
  const svc = getService(c.serviceSlug)!;
  const guide = c.guideSlug ? getGuide(c.guideSlug) : undefined;
  return {
    ...c,
    title: guide?.title ?? svc.title,
    href: guide ? routes.guide(guide.slug) : svc.path,
    category: nodeByPath.get(routes.hub(svc.hub))!.title,
  };
});

const Wordmark = () => (
  <Link href={routes.home} className="flex h-11 items-center font-display text-xl font-extrabold tracking-tight">
    {brand.name}
  </Link>
);

/**
 * v3 global shell: floating glass pill nav at md and up; top bar plus fixed bottom action bar below 768px.
 * Wraps the whole page so any client island (search trigger, bento "see all") can open the problem palette.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <Reveal />
      <ProblemSearch items={problems}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-full focus:bg-surface focus:px-4 focus:py-3">
        Skip to content
      </a>

      <header className="nav-glass sticky top-4 z-40 mx-auto mt-4 hidden h-[60px] w-[calc(100%-2rem)] max-w-5xl items-center gap-2 rounded-full pr-2 pl-6 md:flex">
        <Wordmark />
        <nav aria-label="Primary" className="mx-auto">
          <ul className="flex items-center">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="flex h-11 items-center rounded-full px-3 text-[15px] font-medium hover:bg-surface-2">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SearchTrigger variant="pill" />
        <BookLink location="nav" className="btn-primary" />
      </header>

      {/* gap-2, not gap-1: rule 5 asks for 8px between targets and the search trigger and the menu button sat 4px
          apart at 375. Measured at 375 the row is 246px of a 375px bar, so the extra 4px costs nothing. */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-line bg-surface pr-2 pl-4 md:hidden">
        <Wordmark />
        <span className="ml-auto" />
        <SearchTrigger variant="icon" />
        <MobileMenu links={links} />
      </header>

      {/* A labelled landmark, not a bare div: this bar is the persistent CTA below 768px, and as a div its two
          targets were the only content on the page outside any landmark (axe `region`, moderate, at 375). */}
      <nav
        aria-label="Get help"
        className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-line bg-surface px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-card md:hidden"
      >
        <BookLink location="bottom-bar" className="btn-primary h-12 flex-1" />
        <ChatIconButton location="bottom-bar" />
      </nav>

        {children}
      </ProblemSearch>
    </ChatProvider>
  );
}
