"use client";

import { ChatCircleIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { BookLink } from "@/components/Cta";
import { brand } from "@/config/brand";
import { CTA } from "@/config/cta";
import { CHAT_FALLBACK_EVENT, openChat, preloadChat } from "@/lib/chat";

// Our launcher, never the vendor's. Each adapter hides its own bubble on load, so there is exactly
// one chat affordance on the page and it is in the variation's style.
//
// Position: above MobileBookBar under 768px, and far enough from the content column that it never
// sits over the booking form's buttons, which are left aligned.
export function ChatLauncher() {
  const [offline, setOffline] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Warm the vendor script once the browser is idle, never on first paint.
  useEffect(() => {
    preloadChat();
  }, []);

  useEffect(() => {
    const onFallback = () => setOffline(true);
    window.addEventListener(CHAT_FALLBACK_EVENT, onFallback);
    return () => window.removeEventListener(CHAT_FALLBACK_EVENT, onFallback);
  }, []);

  // <dialog> gives Escape and a focus trap for free. Returning focus to the launcher is ours to do.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (offline && !el.open) el.showModal();
    if (!offline && el.open) el.close();
  }, [offline]);

  const close = () => {
    setOffline(false);
    buttonRef.current?.focus();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => openChat("launcher")}
        aria-label={CTA.CHAT}
        className="fixed right-4 bottom-[calc(var(--bottombar-h)+1rem)] z-30 inline-flex size-14 items-center justify-center gap-2 bg-text text-bg transition-colors duration-200 hover:bg-accent hover:text-accent-on md:right-6 md:bottom-6 md:size-auto md:min-h-14 md:px-5"
      >
        <ChatCircleIcon aria-hidden size={24} weight="bold" />
        <span className="hidden text-base font-medium md:inline">{CTA.CHAT}</span>
      </button>

      <dialog
        ref={dialogRef}
        onClose={close}
        aria-labelledby="chat-offline-title"
        className="m-auto w-[min(28rem,calc(100vw-2rem))] border border-line bg-surface p-0 text-text backdrop:bg-[rgb(14_14_16/0.6)]"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id="chat-offline-title" className="text-xl font-bold">
              Chat is not available
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="-mt-1 -mr-1 flex size-11 shrink-0 items-center justify-center text-muted transition-colors duration-200 hover:text-text"
            >
              <XIcon aria-hidden size={20} weight="bold" />
            </button>
          </div>
          <p className="mt-3 text-[0.9375rem] text-muted">
            The chat window could not load, usually because a browser extension blocked it. These both reach a real
            engineer.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <BookLink location="chat:offline" className="btn-primary" />
            {brand.email.includes("{{") ? (
              <p className="font-mono text-sm text-muted">{brand.email}</p>
            ) : (
              <a href={`mailto:${brand.email}`} className="btn-secondary">
                Email {brand.email}
              </a>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
