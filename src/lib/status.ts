export type SiteStatus = {
  engineersOnline: boolean | null;
  medianResponseMinutes: number | null;
  asOf: Date | null;
};

const NONE: SiteStatus = { engineersOnline: null, medianResponseMinutes: null, asOf: null };

/**
 * Live desk status from the chat provider's availability API. Only Crisp exposes one over REST; for Intercom,
 * Tawk and Chatwoot (or no provider) this returns nulls, so no "online" indicator renders anywhere.
 * Never invent numbers: medianResponseMinutes stays null until a provider reports it.
 */
export async function getSiteStatus(): Promise<SiteStatus> {
  const id = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
  const user = process.env.CRISP_API_IDENTIFIER;
  const key = process.env.CRISP_API_KEY;
  if (process.env.NEXT_PUBLIC_CHAT_PROVIDER !== "crisp" || !id || !user || !key) return NONE;
  try {
    // ponytail: endpoint per Crisp REST API v1 (website availability); verify the response shape on first real key.
    const res = await fetch(`https://api.crisp.chat/v1/website/${id}/availability/status`, {
      headers: { Authorization: `Basic ${btoa(`${user}:${key}`)}`, "X-Crisp-Tier": "plugin" },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return NONE;
    const body = (await res.json()) as { data?: { status?: string } };
    const status = body.data?.status;
    return status ? { engineersOnline: status === "online", medianResponseMinutes: null, asOf: new Date() } : NONE;
  } catch {
    return NONE;
  }
}
