"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useChat } from "@/components/chat/ChatProvider";
import { CTA, type CtaIntent } from "@/config/cta";
import { routes } from "@/config/routes";
import { track } from "@/lib/track";

// Labels come only from CTA, targets only from routes. These components take no children on purpose.

type Loc = { location: string; service?: string };

// onClick runs alongside the tracking call, so a host that is in the way (the full-screen menu) can close itself.
export function BookLink({ location, service, guide, url, className, onClick, icon }: Loc & { guide?: string; url?: string; className?: string; onClick?: () => void; icon?: ReactNode }) {
  return (
    <Link
      href={routes.book({ service, guide, url })}
      className={className}
      onClick={() => {
        onClick?.();
        track("cta_book_click", { location, service });
      }}
    >
      {CTA.BOOK}
      {/* Decoration only, never words: the label still comes from CTA and nothing else may. */}
      {icon}
    </Link>
  );
}

export function PlansLink({ location, service, className }: Loc & { className?: string }) {
  return (
    <Link href={routes.plans(service)} className={className} onClick={() => track("cta_plans_click", { location, service })}>
      {CTA.PLANS}
    </Link>
  );
}

export function QuoteLink({ location, service, className }: Loc & { className?: string }) {
  return (
    <Link href={routes.quote(service)} className={className} onClick={() => track("cta_quote_click", { location, service })}>
      {CTA.QUOTE}
    </Link>
  );
}

export function CheckLink({ location, service, className }: Loc & { className?: string }) {
  return (
    <Link href={routes.check} className={className} onClick={() => track("cta_check_click", { location, service })}>
      {CTA.CHECK}
    </Link>
  );
}

// onClick runs before the chat opens, so a host that is in the way (the full-screen menu) can close itself.
export function ChatButton({ location, service, className, onClick }: Loc & { className?: string; onClick?: () => void }) {
  const openChat = useChat();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onClick?.();
        openChat(location, service);
      }}
    >
      {CTA.CHAT}
    </button>
  );
}

/** The page's primary CTA (from its node intent) followed by CHAT as the secondary. */
export function CtaPair({ intent, location, service }: Loc & { intent: CtaIntent }) {
  const Primary = intent === "PLANS" ? PlansLink : intent === "QUOTE" ? QuoteLink : BookLink;
  return (
    <p>
      <Primary location={location} service={service} /> <ChatButton location={location} service={service} />
    </p>
  );
}
