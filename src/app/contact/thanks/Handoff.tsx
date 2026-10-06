"use client";

import { useSyncExternalStore } from "react";
import { brand } from "@/config/brand";
import { HANDOFF_KEY } from "../booking-schema";

const read = () => {
  try {
    return sessionStorage.getItem(HANDOFF_KEY);
  } catch {
    return null;
  }
};

// ponytail: the booking is handed to the visitor's email app until a CRM or email provider is wired in actions.ts.
export function Handoff() {
  const mailto = useSyncExternalStore(() => () => {}, read, () => null);
  return mailto ? (
    <p>
      Your details are ready. <a href={mailto}>Email this request to {brand.email}</a>
    </p>
  ) : (
    <p>
      Email your request to <a href={`mailto:${brand.email}`}>{brand.email}</a> with your site address and what you see.
    </p>
  );
}
