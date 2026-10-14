"use client";

import { useState } from "react";
import { PillRadio } from "./PillRadio";

type Billing = "monthly" | "annual";

/** Care plan price with a monthly/annual PillRadio. Rendered only when both prices are published. */
export function PlanPrice({ monthly, annual, saving }: { monthly: string; annual: string; saving: string | null }) {
  const [billing, setBilling] = useState<Billing>("monthly");
  return (
    <div>
      <PillRadio
        value={billing}
        onChange={setBilling}
        options={[
          { value: "monthly", label: "Monthly" },
          { value: "annual", label: "Annual" },
        ]}
        label="Care plan billing"
        layoutId="billing-thumb"
      />
      <p className="mt-4" aria-live="polite">
        <span className="font-display text-4xl font-extrabold">From {billing === "monthly" ? monthly : annual}</span>{" "}
        <span className="whitespace-nowrap text-muted">{billing === "monthly" ? "a month" : "a year"}</span>
      </p>
      {billing === "annual" && saving && <p className="mt-1 text-sm font-semibold text-accent-text">Saves {saving} a year</p>}
    </div>
  );
}
