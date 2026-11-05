"use client";

import type { Icon } from "@phosphor-icons/react";
import { ChatCircleTextIcon, ListChecksIcon, MagnifyingGlassIcon, ReceiptIcon, WrenchIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import type { ReactNode } from "react";
import { useChat } from "@/components/chat/ChatProvider";
import { CTA, type CtaIntent } from "@/config/cta";
import { routes } from "@/config/routes";
import { track } from "@/lib/track";

// Labels come only from CTA, targets only from routes. These components take no children on purpose.

type Loc = { location: string; service?: string };

/**
 * One mark per intent, and each one is about the thing the button does rather than about buttons.
 *
 * A wrench repairs, a speech bubble talks to a person, a checklist is what a care plan is, a receipt
 * is what a quote becomes, a magnifier looks the site over. Not an arrow on all five: five arrows
 * say only "forward" five times, which is a decoration, and the MASTER's one icon set is Phosphor
 * so these are the same family as every other mark on the site.
 *
 * Deliberately not colour-coded. One accent, and shape is what distinguishes them.
 */
const CTA_ICON = {
  BOOK: WrenchIcon,
  CHAT: ChatCircleTextIcon,
  PLANS: ListChecksIcon,
  QUOTE: ReceiptIcon,
  CHECK: MagnifyingGlassIcon,
} as const satisfies Record<keyof typeof CTA, Icon>;

/**
 * The chip a CTA wears, unless the call site passes `icon={null}`.
 *
 * `aria-hidden`, always: the label beside it already says what the button does, and a screen reader
 * announcing "wrench" in front of that label is noise. It is decoration that means something, which
 * is not the same as content. (No CTA label is written out here, in this comment or anywhere else
 * in this file beyond the `CTA` import: `scripts/check-content.ts` fails the build on one, and it
 * caught this comment's first draft.)
 *
 * The movement and the chip's own background live in `globals.css` on `.cta-chip` and on the two
 * button utilities, so a chip cannot be given a hover that the button does not know about.
 */
function CtaChip({ of }: { of: keyof typeof CTA }) {
  const Mark = CTA_ICON[of];
  return (
    <span className="cta-chip">
      <Mark weight="duotone" className="size-4" aria-hidden />
    </span>
  );
}

/**
 * `undefined` means "wear your own mark", `null` means "wear none".
 *
 * The second is for the call sites that are not buttons: the underlined text CTA in the home page's
 * final block, the links in the footer and the menu. A chip inside a run of underlined text reads
 * as a bullet that wandered in.
 */
const markFor = (of: keyof typeof CTA, icon: ReactNode | undefined) => (icon === undefined ? <CtaChip of={of} /> : icon);

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
      {markFor("BOOK", icon)}
    </Link>
  );
}

export function PlansLink({ location, service, className, icon }: Loc & { className?: string; icon?: ReactNode }) {
  return (
    <Link href={routes.plans(service)} className={className} onClick={() => track("cta_plans_click", { location, service })}>
      {CTA.PLANS}
      {markFor("PLANS", icon)}
    </Link>
  );
}

export function QuoteLink({ location, service, className, icon }: Loc & { className?: string; icon?: ReactNode }) {
  return (
    <Link href={routes.quote(service)} className={className} onClick={() => track("cta_quote_click", { location, service })}>
      {CTA.QUOTE}
      {markFor("QUOTE", icon)}
    </Link>
  );
}

export function CheckLink({ location, service, className, icon }: Loc & { className?: string; icon?: ReactNode }) {
  return (
    <Link href={routes.check} className={className} onClick={() => track("cta_check_click", { location, service })}>
      {CTA.CHECK}
      {markFor("CHECK", icon)}
    </Link>
  );
}

// onClick runs before the chat opens, so a host that is in the way (the full-screen menu) can close itself.
export function ChatButton({ location, service, className, onClick, icon }: Loc & { className?: string; onClick?: () => void; icon?: ReactNode }) {
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
      {markFor("CHAT", icon)}
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
