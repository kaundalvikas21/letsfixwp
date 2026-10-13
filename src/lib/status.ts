import { ADAPTERS } from "./chat/providers";

export type SiteStatus = {
  engineersOnline: boolean | null;
  medianResponseMinutes: number | null;
  asOf: Date | null;
};

/**
 * Availability comes from the chat provider, server side, when that provider has an API for it.
 *
 * None is wired: Crisp and Chatwoot expose operator availability over their REST APIs, Intercom
 * exposes admin away status, and Tawk has no public endpoint at all. Each needs a private API key,
 * which is a server secret the owner has not issued, so this returns nulls.
 *
 * Nulls are not a placeholder to fill in later with a guess. SiteStatus renders nothing for a null
 * field (docs/section-contract.md rule 8), so no "engineers online" indicator appears anywhere until
 * a real signal exists. Never invent numbers here.
 */
export async function getSiteStatus(): Promise<SiteStatus> {
  // When a provider is wired: read CHAT_API_KEY here, call that provider's availability endpoint,
  // and map the answer onto the fields below. ADAPTERS is imported so the provider list stays the
  // single source of truth for which vendors this site knows about.
  void ADAPTERS;
  return { engineersOnline: null, medianResponseMinutes: null, asOf: null };
}
