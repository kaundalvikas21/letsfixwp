"use server";

import { checkSchema } from "./check-schema";

export async function submitCheck(input: unknown): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = checkSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Check the site address and email, then try again." };
  // ponytail: nothing is delivered from here yet; the form hands the request to the visitor's email app.
  // Send parsed.data to the CRM or email provider here when one is chosen.
  return { ok: true };
}
