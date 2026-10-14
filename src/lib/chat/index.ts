import { CHAT_PROVIDERS, type ChatContext, type ChatProvider, type ChatProviderId } from "./providers";

export type { ChatContext, ChatProviderId };

const envId = process.env.NEXT_PUBLIC_CHAT_PROVIDER;
/** null until the owner picks a vendor. Everything below then falls back to the dialog. */
export const chatProviderId: ChatProviderId | null = CHAT_PROVIDERS.includes(envId as ChatProviderId) ? (envId as ChatProviderId) : null;
const chatId = process.env.NEXT_PUBLIC_CHAT_ID ?? "";
export const chatConfigured = !!chatProviderId && !!chatId;

type LoadState = "idle" | "loading" | "ready" | "failed";
let state: LoadState = "idle";
let loading: Promise<boolean> | null = null;
/** The provider table is imported only once a vendor is actually in use, so it stays out of the main bundle. */
let impl: ChatProvider | null = null;

export const chatState = () => state;

/**
 * Loads the vendor script once. Never called during render or in the critical path: either on the first click of
 * our launcher, or from requestIdleCallback after the page is interactive, so LCP and INP are not paid for it.
 * Resolves false when the script is missing, blocked by an extension, or simply never arrives.
 */
export function loadChat(): Promise<boolean> {
  if (state === "ready") return Promise.resolve(true);
  if (state === "failed") return Promise.resolve(false);
  if (loading) return loading;
  if (!chatConfigured || !chatProviderId) {
    state = "failed";
    return Promise.resolve(false);
  }

  state = "loading";
  loading = (async () => {
    const { providers } = await import("./providers");
    const p = providers[chatProviderId];
    impl = p;
    return new Promise<boolean>((resolve) => {
    const done = (ok: boolean) => {
      state = ok ? "ready" : "failed";
      loading = null;
      resolve(ok);
    };
    try {
      p.boot?.(chatId);
      // Our launcher replaces the vendor's, so its bubble is hidden before the script can paint one.
      const style = document.createElement("style");
      style.dataset.chat = chatProviderId;
      style.textContent = p.hideBubbleCss;
      document.head.append(style);

      const s = document.createElement("script");
      s.src = p.src(chatId);
      s.async = true;
      s.addEventListener("load", () => done(true));
      s.addEventListener("error", () => done(false));
      // An ad blocker can leave the request hanging rather than erroring, so do not wait forever.
      setTimeout(() => state === "loading" && done(false), 8000);
      document.head.append(s);
    } catch {
      done(false);
    }
    });
  })();
  return loading;
}

/**
 * Warms the script once the page has finished loading and the browser goes idle, so the vendor never competes
 * with the images and fonts that decide LCP. Safe to call repeatedly.
 */
export function preloadChat() {
  if (!chatConfigured || state !== "idle") return;
  const idle = () => {
    if ("requestIdleCallback" in window) window.requestIdleCallback(() => void loadChat(), { timeout: 4000 });
    else setTimeout(() => void loadChat(), 2000);
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

/** Opens the vendor panel with the page context attached. False means the caller should show the fallback. */
export async function openVendorChat(ctx: ChatContext): Promise<boolean> {
  if (!chatConfigured || !chatProviderId) return false;
  const ok = await loadChat();
  if (!ok || !impl) return false;
  try {
    impl.setContext(ctx);
    impl.open();
    return true;
  } catch {
    return false;
  }
}

/** Operator presence, only from a vendor that really reports it. null means "we do not know", and nothing renders. */
export function chatAvailability(): boolean | null {
  if (state !== "ready" || !impl) return null;
  try {
    return impl.available?.() ?? null;
  } catch {
    return null;
  }
}
