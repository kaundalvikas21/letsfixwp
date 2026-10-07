"use client";

import { ChatCircleText } from "@phosphor-icons/react";
import Link from "next/link";
import { CTA, type CtaIntent } from "@/config/cta";
import { routes } from "@/config/routes";
import { openChat } from "@/lib/chat";
import { track } from "@/lib/track";
import { ctaStyles } from "./cta-styles";

// Labels come only from CTA, targets only from routes. These components take no children on purpose.

type Variant = "solid" | "ghost" | "text";
type Common = { location: string; service?: string; variant?: Variant; className?: string };

const cls = (variant: Variant, className = "") => `${ctaStyles[variant]} ${className}`;

export function BookLink({ location, service, guide, url, variant = "solid", className }: Common & { guide?: string; url?: string }) {
  return (
    <Link
      href={routes.book({ service, guide, url })}
      onClick={() => track("cta_book_click", { location, service })}
      className={cls(variant, className)}
    >
      {CTA.BOOK}
    </Link>
  );
}

export function PlansLink({ location, service, variant = "solid", className }: Common) {
  return (
    <Link href={routes.plans(service)} onClick={() => track("cta_plans_click", { location, service })} className={cls(variant, className)}>
      {CTA.PLANS}
    </Link>
  );
}

export function QuoteLink({ location, service, variant = "solid", className }: Common) {
  return (
    <Link href={routes.quote(service)} onClick={() => track("cta_quote_click", { location, service })} className={cls(variant, className)}>
      {CTA.QUOTE}
    </Link>
  );
}

export function CheckLink({ location, service, variant = "ghost", className }: Common) {
  return (
    <Link href={routes.check} onClick={() => track("cta_check_click", { location, service })} className={cls(variant, className)}>
      {CTA.CHECK}
    </Link>
  );
}

export function ChatButton({ location, service, variant = "ghost", iconOnly = false, className = "" }: Common & { iconOnly?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => openChat(location, service)}
      aria-label={iconOnly ? CTA.CHAT : undefined}
      className={iconOnly ? `${ctaStyles.icon} ${className}` : cls(variant, className)}
    >
      {iconOnly ? <ChatCircleText size={22} aria-hidden /> : CTA.CHAT}
    </button>
  );
}

/** The page's primary CTA (from its node intent) followed by CHAT as the secondary. `hero` marks it for the mobile bar. */
export function CtaPair({ intent, location, service, hero = false }: { intent: CtaIntent; location: string; service?: string; hero?: boolean }) {
  const Primary = intent === "PLANS" ? PlansLink : intent === "QUOTE" ? QuoteLink : BookLink;
  return (
    <p className="flex flex-wrap gap-2" data-hero-cta={hero || undefined}>
      <Primary location={location} service={service} /> <ChatButton location={location} service={service} />
    </p>
  );
}
