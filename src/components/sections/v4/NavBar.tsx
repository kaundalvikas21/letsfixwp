"use client";

import { ChatCircleIcon } from "@phosphor-icons/react/ssr";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { BookLink } from "@/components/Cta";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { brand } from "@/config/brand";
import { CTA } from "@/config/cta";
import { routes } from "@/config/routes";
import { useChat } from "@/components/chat/ChatProvider";
import type { ProblemItem } from "@/lib/match-problem";
import { CommandPalette } from "./CommandPalette";
import { MegaMenu, type MenuCategory, type MenuLink } from "./MegaMenu";

/**
 * Two rules: level on the button that opens the menu, crossed on the one that closes it. They do not
 * morph into each other, because the full-screen menu covers the trigger the moment it opens and an
 * animated trigger would animate where nobody is looking.
 */
const Rules = ({ crossed = false }: { crossed?: boolean }) => (
  <span aria-hidden className="relative block h-3 w-4">
    <span className={`absolute inset-x-0 top-[2px] h-[2px] rounded-[14px] bg-current ${crossed ? "translate-y-[3px] rotate-45" : ""}`} />
    <span className={`absolute inset-x-0 bottom-[2px] h-[2px] rounded-[14px] bg-current ${crossed ? "-translate-y-[3px] -rotate-45" : ""}`} />
  </span>
);

const Wordmark = ({ onClick }: { onClick?: () => void }) => (
  <Link
    href={routes.home}
    onClick={onClick}
    className="group relative flex h-11 items-center font-display text-xl font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_20]"
  >
    {brand.name}
    {/* The one ember on the left of the bar, and only when you reach for it. */}
    <span
      aria-hidden
      className="absolute inset-x-0 bottom-1.5 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-200 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
    />
  </Link>
);

/**
 * The 64px bar, the menu it opens and the bottom action bar under 768px.
 * One client leaf, Motion only: `useScroll` reads the scroll position without a scroll listener.
 * The bar carries no link list, so every page is reached through the menu.
 */
export function NavBar({ categories, support, problems }: { categories: MenuCategory[]; support: MenuLink[]; problems: ProblemItem[] }) {
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  // 8px of scroll is the switch: transparent over the hero, --bg at 90% with blur after that. The
  // backdrop is its own layer and only its opacity moves, so there is no state and no scroll listener.
  const backdrop = useTransform(scrollY, [0, 8], [0, 1]);

  const close = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <header className="fixed inset-x-0 top-0 z-40 h-16">
        <motion.div aria-hidden style={{ opacity: backdrop }} className="nav-blur absolute inset-0 border-b border-line" />
        {/* How far through the page you are. The page runs to about 18,000px and the two pinned scenes
            make the scrollbar lie about it, so the bar says it instead. Scale only, and it tracks the
            visitor's own scrolling 1:1, which is why reduced motion keeps it. */}
        <motion.div
          aria-hidden
          style={{ scaleX: scrollYProgress, opacity: backdrop }}
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent"
        />
        <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center gap-2 px-4 md:px-6">
          <Wordmark />
          <div className="ml-auto flex items-center gap-2">
            <CommandPalette problems={problems} />
            {/* Under 768px the bottom bar carries BOOK, so the bar does not show it twice. */}
            <BookLink location="nav" className="btn-primary hidden md:inline-flex" />
            <DialogTrigger className="btn-secondary gap-2.5">
              <Rules />
              Menu
            </DialogTrigger>
          </div>
        </div>
      </header>

      <DialogContent
        showCloseButton={false}
        className="inset-0 top-0 left-0 flex h-dvh w-full max-w-none translate-x-0 flex-col rounded-none border-0 bg-bg p-0 shadow-none motion-safe:data-[state=open]:animate-[fade-in_160ms_ease-out]"
      >
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <DialogDescription className="sr-only">Everything on the site, by what has gone wrong</DialogDescription>
        <div className="mx-auto flex h-16 w-full max-w-6xl shrink-0 items-center gap-2 px-4 md:px-6">
          <Wordmark onClick={close} />
          <button type="button" onClick={close} className="btn-secondary ml-auto gap-2.5">
            <Rules crossed />
            Close
          </button>
        </div>
        <MegaMenu categories={categories} support={support} onNavigate={close} />
      </DialogContent>

      {!open && (
        // A landmark, so the bar is not page content sitting outside one (axe: region).
        <nav
          aria-label="Quick actions"
          className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-line bg-surface px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden"
        >
          <BookLink location="bottom-bar" className="btn-primary h-12 flex-1" />
          <ChatIconButton />
        </nav>
      )}
    </Dialog>
  );
}

/** CHAT as an icon in the bottom bar. The label still comes from CTA, for screen readers. */
function ChatIconButton() {
  const openChat = useChat();
  return (
    <button
      type="button"
      onClick={() => openChat("bottom-bar")}
      aria-label={CTA.CHAT}
      className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-[14px] border border-line-strong bg-surface active:scale-[0.98]"
    >
      <ChatCircleIcon weight="duotone" className="size-5" aria-hidden />
    </button>
  );
}
