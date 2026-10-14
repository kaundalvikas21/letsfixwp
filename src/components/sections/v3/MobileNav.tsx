"use client";

import { ChatCircleIcon, ListIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CTA } from "@/config/cta";
import { useChat } from "./ChatProvider";

/** Under 768px: menu icon opens a top sheet with the primary links. */
export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger aria-label="Open menu" className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-surface-2">
        <ListIcon weight="duotone" className="size-5" aria-hidden />
      </DialogTrigger>
      <DialogContent className="top-0 left-0 w-full max-w-none translate-x-0 rounded-none rounded-b-[20px] px-4 pt-3 pb-6 motion-safe:data-[state=open]:animate-[sheet-in_180ms_ease-out]">
        <DialogTitle className="flex h-11 items-center">Menu</DialogTitle>
        <DialogDescription className="sr-only">Main sections of the site</DialogDescription>
        <nav aria-label="Primary" className="mt-2">
          <ul className="divide-y divide-line">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="flex min-h-14 items-center font-display text-xl font-bold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </DialogContent>
    </Dialog>
  );
}

/** CHAT as an icon button for the mobile bottom bar. The label still comes from CTA. */
export function ChatIconButton({ location }: { location: string }) {
  const openChat = useChat();
  return (
    <button
      type="button"
      onClick={() => openChat(location)}
      aria-label={CTA.CHAT}
      className="grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border border-line-strong bg-surface active:scale-[0.98]"
    >
      <ChatCircleIcon weight="duotone" className="size-5" aria-hidden />
    </button>
  );
}
