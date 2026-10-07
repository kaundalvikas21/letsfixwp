"use client";

import { ChatCircle, X } from "@phosphor-icons/react";
import { Dialog } from "radix-ui";
import { useEffect, useRef, useState } from "react";
import { BookLink } from "@/components/Cta";
import { brand } from "@/config/brand";
import { CTA } from "@/config/cta";
import { pageCopy } from "@/content/pages";
import { closeChat, FALLBACK_EVENT, OPENED_EVENT, openChat, preloadChat } from "@/lib/chat";

/**
 * Our chat launcher (the vendor bubble is hidden). From 768px, fixed bottom-right with a visible label.
 * Under 768px the bottom action bar's CHAT icon is the launcher, so nothing floats over that bar or the booking
 * form. The vendor script preloads on requestIdleCallback after hydration, never in the critical path.
 */
export function ChatLauncher() {
  const button = useRef<HTMLButtonElement>(null);
  const [vendorOpen, setVendorOpen] = useState(false);

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2000));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => preloadChat(), { timeout: 5000 });
    const opened = () => setVendorOpen(true);
    window.addEventListener(OPENED_EVENT, opened);
    return () => {
      cancel(id);
      window.removeEventListener(OPENED_EVENT, opened);
    };
  }, []);

  // Escape closes the vendor panel (when the key reaches our page) and returns focus to the launcher.
  useEffect(() => {
    if (!vendorOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      closeChat();
      setVendorOpen(false);
      button.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [vendorOpen]);

  return (
    <button
      ref={button}
      type="button"
      onClick={() => openChat("launcher")}
      aria-label={CTA.CHAT}
      className="fixed right-6 bottom-6 z-40 hidden min-h-12 cursor-pointer items-center gap-2 rounded-control border border-line bg-surface-2 px-4 text-[15px] font-semibold text-text shadow-card transition-transform duration-150 hover:-translate-y-px active:scale-[0.98] md:inline-flex"
    >
      <ChatCircle size={22} aria-hidden />
      <span>{CTA.CHAT}</span>
    </button>
  );
}

/** Opens when the chat script is missing, blocked or slow. On close, focus returns to whatever opened it. */
export function ChatFallback() {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const show = () => {
      opener.current = document.activeElement as HTMLElement | null; // the launcher or CHAT button that opened it
      setOpen(true);
    };
    window.addEventListener(FALLBACK_EVENT, show);
    return () => window.removeEventListener(FALLBACK_EVENT, show);
  }, []);
  const c = pageCopy.chat;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay fixed inset-0 z-50 bg-bg/70" />
        <Dialog.Content
          onCloseAutoFocus={(e) => {
            // No Dialog.Trigger here (opened by an event), so hand focus back explicitly.
            e.preventDefault();
            opener.current?.focus();
          }}
          className="fixed top-1/2 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-card border border-line bg-surface p-6 shadow-card data-[state=open]:animate-[fade-in_150ms_ease-out] motion-reduce:animate-none">
          <Dialog.Title className="pr-10 text-xl font-semibold tracking-tight text-text">{c.fallbackTitle}</Dialog.Title>
          <Dialog.Description className="mt-2 text-[15px] leading-relaxed text-muted">{c.fallbackBody}</Dialog.Description>
          <p className="mt-5">
            <a href={`mailto:${brand.email}`} className="inline-flex min-h-11 items-center text-[16px] text-text underline underline-offset-4">
              {brand.email}
            </a>
          </p>
          <div className="mt-5" onClick={() => setOpen(false)}>
            <BookLink location="chat-fallback" className="w-full" />
          </div>
          <Dialog.Close className="absolute top-3 right-3 inline-flex size-11 cursor-pointer items-center justify-center rounded-control text-muted hover:text-text">
            <X size={20} aria-hidden />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
