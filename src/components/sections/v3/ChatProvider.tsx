"use client";

import { ChatCircleIcon } from "@phosphor-icons/react/ssr";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { BookLink } from "@/components/Cta";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { brand } from "@/config/brand";
import { CTA } from "@/config/cta";
import { DRAFT_KEY } from "@/app/contact/booking-schema";
import { chatConfigured, openVendorChat, preloadChat } from "@/lib/chat";
import { track } from "@/lib/track";

type OpenChat = (location: string, service?: string) => void;
const ChatCtx = createContext<OpenChat>(() => {});

/** Opens live chat from anywhere on the page. Falls back to a dialog when no vendor can be reached. */
export const useChat = () => useContext(ChatCtx);

/** The site address the visitor typed into a booking form, if they got that far. */
function draftSiteUrl(): string | undefined {
  for (const type of ["fix", "project", "check"]) {
    try {
      const raw = sessionStorage.getItem(`${DRAFT_KEY}:${type}`);
      const url = raw ? (JSON.parse(raw) as { siteUrl?: string }).siteUrl : "";
      if (url) return url;
    } catch {
      // Storage blocked or corrupt: context is a nice-to-have, never a blocker.
    }
  }
  return undefined;
}

/** The service or guide a page is about, taken from its path. Undefined on pages that are about nothing specific. */
function problemFromPath(path: string): string | undefined {
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "guides" && parts[1]) return parts[1];
  // A service lives at /<hub>/<service>/; one segment is a hub, three is a city.
  if (parts.length === 2) return parts[1];
  return undefined;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [fallback, setFallback] = useState<{ service?: string } | null>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  // Warm the vendor script when the browser is idle, never during the critical path.
  useEffect(() => {
    if (!chatConfigured) return;
    const id = window.setTimeout(preloadChat, 0);
    return () => window.clearTimeout(id);
  }, []);

  const open = useCallback<OpenChat>(
    (location, service) => {
      track("cta_chat_open", { location, service });
      lastTrigger.current = document.activeElement as HTMLElement | null;
      // The caller knows the slug on a CTA; from the floating launcher, the page itself is the context.
      const problem = service ?? problemFromPath(path);
      void openVendorChat({ path, problem, siteUrl: draftSiteUrl() }).then((ok) => {
        if (!ok) setFallback({ service });
      });
    },
    [path],
  );

  return (
    <ChatCtx.Provider value={open}>
      {children}
      <ChatLauncher ref={launcher} onOpen={() => open("launcher")} />
      <Dialog
        open={!!fallback}
        onOpenChange={(o) => {
          if (!o) {
            setFallback(null);
            // Escape or a click outside puts focus back where it came from, usually the launcher.
            setTimeout(() => (lastTrigger.current ?? launcher.current)?.focus(), 0);
          }
        }}
      >
        <DialogContent className="max-w-md p-6">
          <DialogTitle>Chat is not available right now</DialogTitle>
          <DialogDescription className="mt-2">
            {chatConfigured
              ? "The chat window could not load, often because of a browser extension or a blocked script."
              : "Live chat is not switched on yet. These reach an engineer just as quickly."}
          </DialogDescription>
          <div className="mt-6 grid gap-3">
            <BookLink location="chat-fallback" service={fallback?.service} className="btn-primary w-full" />
            {!brand.email.includes("{{") && (
              <a href={`mailto:${brand.email}`} className="btn-secondary w-full">
                Email {brand.email}
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </ChatCtx.Provider>
  );
}

// Pages whose own submit button sits bottom-right of the form: a floating launcher would land on top of it.
const FORM_PAGES = ["/contact", "/free-site-check"];

/**
 * Our launcher, not the vendor's. Hidden under md, where the fixed bottom bar already carries a chat button, so
 * it can never cover that bar. The label shows from md up; the icon alone carries the CTA label for screen readers.
 */
function ChatLauncher({ ref, onOpen }: { ref: React.Ref<HTMLButtonElement>; onOpen: () => void }) {
  const path = usePathname();
  if (FORM_PAGES.some((p) => path.startsWith(p))) return null;
  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      aria-label={CTA.CHAT}
      className="btn-primary fixed right-6 bottom-6 z-30 hidden shadow-lift md:inline-flex"
    >
      <ChatCircleIcon weight="duotone" className="size-5" aria-hidden />
      <span>{CTA.CHAT}</span>
    </button>
  );
}
