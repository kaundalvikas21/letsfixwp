"use client";

import { useEffect, useState } from "react";
import { ChatButton } from "@/components/Cta";
import { brand } from "@/config/brand";
import type { Handoff as HandoffPayload } from "@/lib/booking";
import { HANDOFF_KEY } from "../booking-schema";

// The success screen. Three short lines about what happens next, then the one action that actually
// delivers the request. The adapter in src/lib/booking.ts decides what that action is: a mailto
// today, a payment or scheduling link once the owner picks a provider.
const NEXT = [
  "An engineer reads your request and replies to the address you gave.",
  "You get a fixed price and a scope before anyone touches the site.",
  "Nothing is charged, and nothing changes on your site, until you approve it.",
];

export function Handoff() {
  const [handoff, setHandoff] = useState<HandoffPayload | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(HANDOFF_KEY);
      if (raw) setHandoff(JSON.parse(raw) as HandoffPayload);
    } catch {
      // Storage blocked or corrupt: fall back to the plain address below.
    }
    setReady(true);
  }, []);

  return (
    <div className="max-w-[60ch]">
      <h2 className="text-2xl">What happens next</h2>
      <ol className="mt-6">
        {NEXT.map((line) => (
          <li key={line} className="border-t border-line py-3 text-[0.9375rem]">
            {line}
          </li>
        ))}
      </ol>

      <div className="mt-10 border border-line bg-surface p-6">
        {!ready ? (
          // Loading state: the draft lives in sessionStorage, which is not readable until hydration.
          <p className="font-mono text-sm text-muted">Preparing your request</p>
        ) : handoff ? (
          <>
            <p className="font-medium">One last step</p>
            <p className="mt-2 text-[0.9375rem] text-muted">
              Your details are ready to send. Nothing reaches us until you do this.
            </p>
            <p className="mt-6">
              <a href={handoff.href} className="btn-primary">
                {handoff.label}
              </a>
            </p>
          </>
        ) : (
          // Empty state: arriving here directly, or with storage blocked.
          <>
            <p className="font-medium">We do not have your details</p>
            <p className="mt-2 text-[0.9375rem] text-muted">
              This page only works straight after the booking form. Send us the site address and what you see, and an
              engineer will pick it up.
            </p>
            {!brand.email.includes("{{") && (
              <p className="mt-6">
                <a href={`mailto:${brand.email}`} className="btn-primary">
                  Email {brand.email}
                </a>
              </p>
            )}
          </>
        )}
      </div>

      {/* Email confirmation stub: nothing is sent from the server yet (see actions.ts). */}
      <p className="mt-8 text-sm text-muted">
        A confirmation email is not sent automatically yet. Your own copy of the request is the message you send above.
      </p>

      <p className="mt-8 text-[0.9375rem] text-muted">
        Something urgent in the meantime? <ChatButton location="contact:thanks" className="btn-secondary ml-2" />
      </p>
    </div>
  );
}
