import { track } from "@/lib/track";
import { ADAPTERS, type ChatConfig, type ChatContext, type ChatProviderId } from "./providers";

/**
 * Provider-agnostic live chat.
 *
 * The vendor script is never in the critical path. It loads on the first click of our launcher, or
 * earlier during an idle callback once the page is interactive, whichever comes first. Nothing is
 * requested on first paint, so LCP and INP are unaffected by a chat vendor.
 *
 * NEXT_PUBLIC_CHAT_PROVIDER picks the adapter. With no provider configured, or if the script is
 * blocked or times out, openChat() reports failure and the caller shows the offline dialog.
 */

const PROVIDERS: ChatProviderId[] = ["crisp", "intercom", "tawk", "chatwoot"];

function config(): ChatConfig | null {
  const provider = process.env.NEXT_PUBLIC_CHAT_PROVIDER as ChatProviderId | undefined;
  const id = process.env.NEXT_PUBLIC_CHAT_ID;
  if (!provider || !PROVIDERS.includes(provider) || !id) return null;
  return { provider, id, baseUrl: process.env.NEXT_PUBLIC_CHAT_BASE_URL };
}

type Status = "idle" | "loading" | "ready" | "failed";
let status: Status = "idle";
let loading: Promise<void> | null = null;

function ensureLoaded(): Promise<void> {
  const cfg = config();
  if (!cfg) return Promise.reject(new Error("no chat provider configured"));
  if (status === "ready") return Promise.resolve();
  if (loading) return loading;
  status = "loading";
  loading = ADAPTERS[cfg.provider]
    .load(cfg)
    .then(() => {
      status = "ready";
    })
    .catch((e) => {
      status = "failed";
      loading = null;
      throw e;
    });
  return loading;
}

/**
 * Warm the vendor script once the page is quiet. Safe to call on every page: it is a no-op without
 * a provider, and it never runs before the browser says it is idle.
 */
export function preloadChat() {
  if (!config() || status !== "idle") return;
  const start = () => {
    ensureLoaded().catch(() => {
      // Blocked or offline. openChat() will fall back to the dialog.
    });
  };
  if ("requestIdleCallback" in window) {
    (window as unknown as { requestIdleCallback: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback(
      start,
      { timeout: 4000 },
    );
  } else {
    setTimeout(start, 2500);
  }
}

/** What the session should know: where the visitor is, what they are stuck on, which site. */
export function chatContext(problem?: string): ChatContext {
  const ctx: ChatContext = { path: window.location.pathname };
  const params = new URLSearchParams(window.location.search);
  const slug = problem || params.get("service") || params.get("guide") || "";
  if (slug) ctx.problem = slug;
  // Only a URL the visitor typed themselves: the ?url= param the hero form sets, or their booking draft.
  let siteUrl = params.get("url") ?? "";
  if (!siteUrl) {
    try {
      siteUrl = (JSON.parse(sessionStorage.getItem("booking-draft") ?? "{}") as { siteUrl?: string }).siteUrl ?? "";
    } catch {
      siteUrl = "";
    }
  }
  if (siteUrl) ctx.siteUrl = siteUrl;
  return ctx;
}

/** The launcher listens for this and opens its offline dialog, so every CHAT button shares one. */
export const CHAT_FALLBACK_EVENT = "letsfixwp:chat-offline";

/**
 * Opens the chat panel. Resolves true when the vendor took it. When it cannot, it dispatches
 * CHAT_FALLBACK_EVENT so the launcher's offline dialog opens instead, and callers need no error
 * handling of their own. Fires cta_chat_open first either way: the intent happened.
 */
export async function openChat(location: string, service?: string): Promise<boolean> {
  track("cta_chat_open", { location, service });
  const fallback = () => {
    window.dispatchEvent(new CustomEvent(CHAT_FALLBACK_EVENT));
    return false;
  };
  const cfg = config();
  if (!cfg) return fallback();
  try {
    await ensureLoaded();
    ADAPTERS[cfg.provider].setContext(chatContext(service));
    ADAPTERS[cfg.provider].open();
    return true;
  } catch {
    return fallback();
  }
}

export const chatConfigured = () => config() !== null;
export type { ChatContext, ChatProviderId };
