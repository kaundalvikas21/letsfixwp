"use client";

import { ArrowRight, CaretDown, List } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Accordion } from "radix-ui";
import { useState } from "react";
import { BookLink, ChatButton } from "@/components/Cta";
import { ctaStyles } from "@/components/cta-styles";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { NavGroup, NavLeaf } from "./nav-model";

/**
 * Below lg: every hub as an Accordion (shadcn structure on the Radix primitive, MASTER tokens), the standalone
 * pages after them, and both CTAs pinned at the bottom. Accordion content fades in (opacity only), no height animation.
 */
export function MobileMenu({ hubs, pages }: { hubs: NavGroup[]; pages: NavLeaf[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const pathname = usePathname();
  const here = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const current = (href: string) => (here === href ? "page" : undefined);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={`${ctaStyles.icon} lg:hidden`} aria-label="Open menu">
        <List size={22} aria-hidden />
      </SheetTrigger>
      <SheetContent aria-describedby={undefined}>
        <SheetTitle className="flex h-16 shrink-0 items-center px-6 text-sm text-muted">Menu</SheetTitle>
        <nav aria-label="Menu" className="min-h-0 flex-1 overflow-y-auto border-t border-line">
          <Accordion.Root type="single" collapsible>
            {hubs.map((h) => (
              <Accordion.Item key={h.id} value={h.id} className="border-b border-line">
                <Accordion.Header>
                  <Accordion.Trigger className="group flex min-h-14 w-full cursor-pointer items-center justify-between px-6 text-left text-lg font-medium text-text">
                    {h.label}
                    <CaretDown size={18} aria-hidden className="text-muted transition-transform duration-150 group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="pb-3 data-[state=open]:animate-[fade-in_150ms_ease-out] motion-reduce:animate-none">
                  <ul>
                    {h.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={close}
                          aria-current={current(l.href)}
                          className="flex min-h-11 items-center px-6 text-[15px] text-muted hover:text-text aria-[current=page]:text-accent-ink"
                        >
                          {l.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {h.all && (
                    <Link
                      href={h.all.href}
                      onClick={close}
                      className="flex min-h-11 items-center gap-1.5 px-6 text-[15px] font-medium text-accent-ink"
                    >
                      {h.all.label}
                      <ArrowRight size={14} aria-hidden />
                    </Link>
                  )}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
          <ul>
            {pages.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  onClick={close}
                  aria-current={current(p.href)}
                  className="flex min-h-14 items-center border-b border-line px-6 text-lg font-medium text-text aria-[current=page]:text-accent-ink"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex shrink-0 flex-col gap-2 border-t border-line p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]" onClick={close}>
          <BookLink location="menu" className="w-full" />
          <ChatButton location="menu" className="w-full" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
