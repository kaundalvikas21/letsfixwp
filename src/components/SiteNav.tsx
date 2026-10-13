"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { CaretDownIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Primary nav plus the hub panel. One panel serves both breakpoints: at lg and up it is opened by
// the "Problems" disclosure, below lg by the menu button, so no hub is unreachable at any width.
// No enter animation: the motion budget in design-system/letsfixwp-v2/MASTER.md spends `motion` on
// the accordion, the before/after slider and the booking flow only.

export type NavItem = { label: string; href: string };

const PANEL_ID = "site-nav-panel";

export function SiteNav({ links, hubs }: { links: NavItem[]; hubs: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = (href: string) => (pathname === href ? "page" : undefined);
  const close = () => setOpen(false);

  const trigger = {
    "aria-expanded": open,
    "aria-controls": PANEL_ID,
    "aria-haspopup": "menu",
    onClick: () => setOpen((v) => !v),
  } as const;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <nav aria-label="Primary" className="flex items-center gap-1 md:gap-2">
        {/* lg and up: the four primary items inline. */}
        <ul className="hidden items-center gap-6 lg:flex">
          <li>
            <button type="button" className="nav-link gap-1" {...trigger}>
              Problems
              <CaretDownIcon aria-hidden size={14} weight="bold" />
            </button>
          </li>
          {links.map((l) => (
            <li key={l.href}>
              <Link className="nav-link" href={l.href} aria-current={current(l.href)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Below lg: everything collapses behind one menu button. */}
        <button
          type="button"
          className="nav-link lg:hidden size-11 justify-center p-0"
          aria-label="Open menu"
          {...trigger}
        >
          <ListIcon aria-hidden size={22} weight="bold" />
        </button>
      </nav>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[rgb(14_14_16/0.6)]" />
        <Dialog.Content
          id={PANEL_ID}
          aria-describedby={undefined}
          className="fixed inset-x-0 top-[var(--nav-h)] z-50 max-h-[calc(100dvh-var(--nav-h))] overflow-y-auto border-b border-line bg-surface"
        >
          <Dialog.Title className="sr-only">Site menu</Dialog.Title>

          <div className="mx-auto w-full max-w-[1200px] px-6 py-8">
            {/* The four primary items, for the widths where they are not in the bar. */}
            <ul className="mb-8 grid gap-px border-y border-line lg:hidden">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    className="flex min-h-11 items-center py-3 text-lg font-medium"
                    href={l.href}
                    aria-current={current(l.href)}
                    onClick={close}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="mb-4 text-xs font-medium tracking-[0.06em] text-muted uppercase">What we fix and build</h2>
            <ul className="grid gap-x-6 gap-y-px sm:grid-cols-2 lg:grid-cols-3">
              {hubs.map((h) => (
                <li key={h.href} className="border-t border-line">
                  <Link
                    className="flex min-h-11 items-center py-3 font-medium transition-colors duration-200 hover:text-accent-text"
                    href={h.href}
                    aria-current={current(h.href)}
                    onClick={close}
                  >
                    {h.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Dialog.Close
            className="absolute top-4 right-4 flex size-11 items-center justify-center text-muted transition-colors duration-200 hover:text-text"
            aria-label="Close menu"
          >
            <XIcon aria-hidden size={20} weight="bold" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
