"use client";

import { useEffect, useState } from "react";
import { chatAvailability, chatConfigured, loadChat } from "@/lib/chat";

/**
 * Operator presence, straight from the chat vendor. Only a vendor that really reports it returns anything, so
 * with no provider configured this renders nothing at all: the site never claims someone is online.
 * One live dot is the single exception to the contract's no-decorative-dots rule, and only with real data.
 */
export function ChatPresence() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    if (!chatConfigured) return;
    let cancelled = false;
    const read = () => !cancelled && setOnline(chatAvailability());
    read();
    void loadChat().then(read);
    // Presence changes while the page is open, so re-read when the visitor comes back to the tab.
    window.addEventListener("focus", read);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", read);
    };
  }, []);

  if (online === null) return null;
  return (
    <p className="mt-4 flex items-center gap-2 text-sm text-muted">
      <span aria-hidden className={`size-2 rounded-full ${online ? "bg-accent" : "bg-line-strong"}`} />
      {online ? "An engineer is online now" : "Chat is offline. Tickets are still read."}
    </p>
  );
}
