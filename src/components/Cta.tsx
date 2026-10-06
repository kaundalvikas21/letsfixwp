"use client";

import Link from "next/link";
import { CTA, type CtaIntent } from "@/config/cta";
import { routes } from "@/config/routes";
import { openChat } from "@/lib/chat";
import { track } from "@/lib/track";

// Labels come only from CTA, targets only from routes. These components take no children on purpose.

type Loc = { location: string; service?: string };

export function BookLink({ location, service, guide, url }: Loc & { guide?: string; url?: string }) {
  return (
    <Link href={routes.book({ service, guide, url })} onClick={() => track("cta_book_click", { location, service })}>
      {CTA.BOOK}
    </Link>
  );
}

export function PlansLink({ location, service }: Loc) {
  return (
    <Link href={routes.plans(service)} onClick={() => track("cta_plans_click", { location, service })}>
      {CTA.PLANS}
    </Link>
  );
}

export function QuoteLink({ location, service }: Loc) {
  return (
    <Link href={routes.quote(service)} onClick={() => track("cta_quote_click", { location, service })}>
      {CTA.QUOTE}
    </Link>
  );
}

export function CheckLink({ location, service }: Loc) {
  return (
    <Link href={routes.check} onClick={() => track("cta_check_click", { location, service })}>
      {CTA.CHECK}
    </Link>
  );
}

export function ChatButton({ location, service }: Loc) {
  return (
    <button type="button" onClick={() => openChat(location, service)}>
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
