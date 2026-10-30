"use client";

import {
  ChatCircleDotsIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  StethoscopeIcon,
  WrenchIcon,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useChat } from "@/components/sections/v3/ChatProvider";
import { CTA, type CtaIntent } from "@/config/cta";
import { routes } from "@/config/routes";
import { track } from "@/lib/track";

// Labels come only from CTA, targets only from routes. These components take no children on purpose.

/**
 * One icon per CTA intent, chosen for what the action actually is rather than for decoration: a wrench for
 * having the site fixed, a speech bubble for talking to someone, a shield for ongoing cover, a receipt for a
 * quote, and a stethoscope for a check-up on a site that is still working.
 *
 * `btn-primary` and `btn-secondary` already set `gap: 0.5rem`, so the icon needs no spacing of its own.
 *
 * `icon` defaults on and is turned off at the four places a CTA renders as a quiet inline text link inside a
 * sentence ("Nothing down right now? Get a free site check"), where a glyph mid-sentence reads as debris.
 */
const Glyph = ({ as: Icon }: { as: typeof WrenchIcon }) => (
  <Icon weight="duotone" className="size-5 shrink-0" aria-hidden />
);

type Loc = { location: string; service?: string };
type WithIcon = { icon?: boolean };

export function BookLink({ location, service, guide, url, className, icon = true }: Loc & WithIcon & { guide?: string; url?: string; className?: string }) {
  return (
    <Link
      href={routes.book({ service, guide, url })}
      className={className}
      onClick={() => track("cta_book_click", { location, service })}
    >
      {icon && <Glyph as={WrenchIcon} />}
      {CTA.BOOK}
    </Link>
  );
}

export function PlansLink({ location, service, className, icon = true }: Loc & WithIcon & { className?: string }) {
  return (
    <Link href={routes.plans(service)} className={className} onClick={() => track("cta_plans_click", { location, service })}>
      {icon && <Glyph as={ShieldCheckIcon} />}
      {CTA.PLANS}
    </Link>
  );
}

export function QuoteLink({ location, service, className, icon = true }: Loc & WithIcon & { className?: string }) {
  return (
    <Link href={routes.quote(service)} className={className} onClick={() => track("cta_quote_click", { location, service })}>
      {icon && <Glyph as={ReceiptIcon} />}
      {CTA.QUOTE}
    </Link>
  );
}

export function CheckLink({ location, service, className, icon = true }: Loc & WithIcon & { className?: string }) {
  return (
    <Link href={routes.check} className={className} onClick={() => track("cta_check_click", { location, service })}>
      {icon && <Glyph as={StethoscopeIcon} />}
      {CTA.CHECK}
    </Link>
  );
}

export function ChatButton({ location, service, className, icon = true }: Loc & WithIcon & { className?: string }) {
  const openChat = useChat();
  return (
    <button type="button" className={className} onClick={() => openChat(location, service)}>
      {icon && <Glyph as={ChatCircleDotsIcon} />}
      {CTA.CHAT}
    </button>
  );
}

/** The page's primary CTA (from its node intent) followed by CHAT as the secondary. */
export function CtaPair({ intent, location, service }: Loc & { intent: CtaIntent }) {
  const Primary = intent === "PLANS" ? PlansLink : intent === "QUOTE" ? QuoteLink : BookLink;
  return (
    <p>
      <Primary location={location} service={service} icon={false} /> <ChatButton location={location} service={service} icon={false} />
    </p>
  );
}
