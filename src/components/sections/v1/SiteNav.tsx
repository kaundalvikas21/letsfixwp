import Link from "next/link";
import { BookLink, ChatButton } from "@/components/Cta";
import { routes } from "@/config/routes";
import { MobileMenu } from "./MobileMenu";
import { NavBackdrop } from "./NavBackdrop";
import { DesktopNav } from "./DesktopNav";
import { desktopNav, mobileNav } from "./nav-model";

/** Bracketed dot: one path, accent fill (3.83:1 on --bg, passes 3:1 for graphics). */
function Mark() {
  return (
    <svg viewBox="0 0 24 24" className="size-[22px] text-accent" aria-hidden>
      <path
        fill="currentColor"
        d="M3 3h5v2.5H5.5v13H8V21H3zM21 3h-5v2.5h2.5v13H16V21h5zM14.5 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"
      />
    </svg>
  );
}

/**
 * Global nav, 64px. Desktop (lg+): wordmark | Fixes, Security, Care plans, Pricing, More | CHAT ghost + BOOK solid, one line.
 * md to lg: wordmark | BOOK + menu. Under md: wordmark | menu (BOOK lives in the bottom action bar).
 */
export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 isolate">
      <NavBackdrop />
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 md:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href={routes.home}
          aria-label="fixmywp home"
          className="inline-flex min-h-11 items-center gap-2 justify-self-start rounded-control text-[17px] font-semibold tracking-tight text-text"
        >
          <Mark />
          fixmywp
        </Link>

        <DesktopNav items={desktopNav()} />

        <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:justify-self-end">
          <ChatButton location="nav" className="max-lg:hidden" />
          <BookLink location="nav" className="max-md:hidden" />
          <MobileMenu {...mobileNav()} />
        </div>
      </div>
    </header>
  );
}
