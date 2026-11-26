"use client";

import { ChatCircleIcon } from "@phosphor-icons/react/ssr";
import { MotionFeatures } from "../MotionFeatures";
import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookLink } from "@/components/Cta";
import { Wordmark } from "@/components/Logo";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CTA } from "@/config/cta";
import { routes } from "@/config/routes";
import { useChat } from "@/components/chat/ChatProvider";
import { CommandPalette } from "@/components/sections/v4/CommandPalette";
import { actionBarRevealVh, duration, easing } from "../tokens";
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

/** The mark, as the link home. The mark itself is `Wordmark`; this is the box around it. */
const MarkLink = ({ onClick }: { onClick?: () => void }) => (
  <Link
    href={routes.home}
    onClick={onClick}
    className="group relative flex h-11 items-center font-display text-xl font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_20]"
  >
    <Wordmark />
    {/* The one ember on the left of the bar, and only when you reach for it. */}
    <span
      aria-hidden
      className="absolute inset-x-0 bottom-1.5 h-[2px] origin-left scale-x-0 bg-accent transition-[scale] duration-200 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
    />
  </Link>
);

/**
 * The 64px bar, the menu it opens and the bottom action bar under 768px.
 * One client leaf, Motion only: `useScroll` reads the scroll position without a scroll listener.
 * The bar carries no link list, so every page is reached through the menu.
 */
export function NavBar({ categories, support }: { categories: MenuCategory[]; support: MenuLink[] }) {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  // No bottom bar on /contact/: its BOOK already points here, so the bar would sit a no-op button and a
  // second chat trigger on top of the one form the page exists for. `data-action-bar` on the header is
  // what globals.css reserves the bar's space from, so the space goes with it. The header renders on
  // every route and never unmounts, so the reservation does not flicker when the mega menu opens.
  // routes.contact carries the trailing slash next.config sets; compared both ways so a pathname
  // without one cannot put the bar back.
  const path = usePathname();
  const actionBar = path !== routes.contact && `${path}/` !== routes.contact;

  // 8px of scroll is the switch: transparent over the hero, --bg at 90% with blur after that. The
  // backdrop is its own layer, so there is no state and no scroll listener.
  //
  // It arrives rather than fading in, which is the reference's `sticky-menu` keyframe put on the
  // thing that actually appears. Its own header slides from `top: -50%` when it becomes sticky;
  // ours is fixed from the first pixel and never leaves, so there is no bar to slide, only this
  // panel. `top` would be wrong here anyway: it is not compositor-animatable, so it would relayout
  // a full-width fixed overlay every frame at first paint on all 99 routes, and contract rule 10
  // allows transform and opacity only. At rest the panel sits exactly one bar above the viewport,
  // so it is never caught half-drawn across the type. The spring is the site's one spring, so an
  // 8px switch reads as a slide and a settle rather than a snap.
  //
  // `-100%` of the panel's own height and not a pixel count. This was `-64`, commented "the bar's
  // own height", and the bar has since become `--header-h` at 5rem: the panel then rested 16px
  // inside the viewport and its `border-b` drew a hairline sliding down the page, which is exactly
  // what the paragraph above says cannot happen. A percentage is the height, whatever the token
  // says. The spring still runs on a number, 0 to 1, because `useSpring` has no physics for a
  // string; the percentage is mapped after it settles.
  //
  // What it communicates: the page has left the hero, and this is now a surface over content.
  const reduce = useReducedMotion();
  const backdrop = useTransform(scrollY, [0, 8], [0, 1]);
  const settle = useSpring(useTransform(scrollY, [0, 8], [0, 1]), { stiffness: 100, damping: 20 });
  const slide = useTransform(settle, (v) => `${(v - 1) * 100}%`);

  // The bar waits for the reader to leave the first screen. Until then the hero's own CTA is on
  // screen and the bar would be the same words a second time, sitting on top of them: the state the
  // owner reported from a phone. `useMotionValueEvent` rather than a scroll listener, which is the
  // same reading of `scrollY` the backdrop above already subscribes to, and the state flips at most
  // twice per visit because it is a boolean and not a position.
  const [pastFirstScreen, setPastFirstScreen] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setPastFirstScreen(v > window.innerHeight * actionBarRevealVh));

  const close = () => setOpen(false);

  return (
    // `m` renders nothing outside a feature set, so this boundary is required, not packaging.
    <MotionFeatures>
      <Dialog open={open} onOpenChange={setOpen}>
        <header data-action-bar={actionBar ? "" : undefined} className="fixed inset-x-0 top-0 z-40 h-[var(--header-h)]">
          <m.div aria-hidden style={{ opacity: backdrop, y: reduce ? 0 : slide }} className="nav-blur absolute inset-0 border-b border-line" />
          <div className="relative mx-auto flex h-[var(--header-h)] w-full max-w-page items-center gap-2 px-4 md:px-6">
            <MarkLink />
            <div className="ml-auto flex items-center gap-2">
              <CommandPalette />
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
          <div className="mx-auto flex h-[var(--header-h)] w-full max-w-page shrink-0 items-center gap-2 px-4 md:px-6">
            <MarkLink onClick={close} />
            <button type="button" onClick={close} className="btn-secondary ml-auto gap-2.5">
              <Rules crossed />
              Close
            </button>
          </div>
          <MegaMenu categories={categories} support={support} onNavigate={close} />
        </DialogContent>

        <AnimatePresence>
          {actionBar && !open && pastFirstScreen && (
            // A landmark, so the bar is not page content sitting outside one (axe: region).
            //
            // It arrives from under the fold on its own height, so the travel is right at any text
            // size and is a transform, which is all rule 10 allows. Reduced motion cross-fades in
            // place: the arrival is information, not decoration, so it still happens.
            <m.nav
              key="action-bar"
              aria-label="Quick actions"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: "100%" }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: "100%" }}
              transition={{ duration: reduce ? 0 : duration.smallUi, ease: [...easing] }}
              className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-line bg-surface px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden"
            >
              <BookLink location="bottom-bar" className="btn-primary h-12 flex-1" />
              <ChatIconButton />
            </m.nav>
          )}
        </AnimatePresence>
      </Dialog>
    </MotionFeatures>
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
