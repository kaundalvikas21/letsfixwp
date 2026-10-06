"use client";

import { List } from "@phosphor-icons/react";
import { useState } from "react";
import { BookLink, ChatButton, ctaStyles } from "@/components/Cta";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavLinks } from "./NavLinks";

/** Below lg: the same links plus both CTAs in a right-side Sheet. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={`${ctaStyles.icon} lg:hidden`} aria-label="Open menu">
        <List size={22} aria-hidden />
      </SheetTrigger>
      <SheetContent aria-describedby={undefined}>
        <SheetTitle className="flex h-16 items-center px-6 text-sm text-muted">Menu</SheetTitle>
        <nav aria-label="Menu">
          <NavLinks
            onNavigate={close}
            listClassName="flex flex-col border-t border-line"
            linkClassName="flex min-h-14 items-center border-b border-line px-6 text-lg font-medium text-text aria-[current=page]:text-accent-ink"
          />
        </nav>
        <div className="mt-auto flex flex-col gap-2 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]" onClick={close}>
          <BookLink location="menu" className="w-full" />
          <ChatButton location="menu" className="w-full" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
