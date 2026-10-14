/**
 * One row per supported chat vendor. Nothing here runs until a provider is selected with
 * NEXT_PUBLIC_CHAT_PROVIDER and its id with NEXT_PUBLIC_CHAT_ID, so an unconfigured site ships no vendor code.
 *
 * Each vendor gets the same four jobs: load its script, hide its own bubble (we have our own launcher), open the
 * panel, and attach context. `available` is optional: only a vendor that really exposes operator presence gets
 * one, because getSiteStatus() must never invent an "online" state.
 */
export const CHAT_PROVIDERS = ["crisp", "intercom", "tawk", "chatwoot"] as const;
export type ChatProviderId = (typeof CHAT_PROVIDERS)[number];

export type ChatContext = {
  /** Where the visitor opened chat from. */
  path: string;
  /** The service or guide slug the page is about, when it is about one. */
  problem?: string;
  /** The site address the visitor typed into the booking form, if they got that far. */
  siteUrl?: string;
};

export type ChatProvider = {
  /** The vendor script. `id` is NEXT_PUBLIC_CHAT_ID: a website id, app id or property id depending on the vendor. */
  src: (id: string) => string;
  /** Runs before the script, to set whatever global the vendor reads on boot. */
  boot?: (id: string) => void;
  /** CSS that hides the vendor's own launcher. Ours replaces it. */
  hideBubbleCss: string;
  open: () => void;
  /** Attach the page context to the conversation, so an engineer sees it without asking. */
  setContext: (ctx: ChatContext) => void;
  /** Only where the vendor exposes real operator presence. Undefined means "we do not know". */
  available?: () => boolean | null;
};

type W = Window & Record<string, unknown>;
const w = () => window as unknown as W;
const call = (path: string, ...args: unknown[]) => {
  const fn = path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], w());
  if (typeof fn === "function") (fn as (...a: unknown[]) => unknown)(...args);
};

export const providers: Record<ChatProviderId, ChatProvider> = {
  crisp: {
    src: () => "https://client.crisp.chat/l.js",
    boot: (id) => {
      w().$crisp = [];
      w().CRISP_WEBSITE_ID = id;
    },
    hideBubbleCss: ".crisp-client .cc-kv6t, .crisp-client .cc-unoo { display: none !important; }",
    open: () => (w().$crisp as unknown[])?.push(["do", "chat:open"]),
    setContext: (ctx) => {
      const c = w().$crisp as unknown[] | undefined;
      c?.push(["set", "session:data", [Object.entries(ctx).filter(([, v]) => v)]]);
    },
    // Crisp exposes operator presence on the session.
    available: () => {
      const c = w().$crisp as { get?: (k: string) => unknown } | undefined;
      const v = c?.get?.("website:availability:online");
      return typeof v === "boolean" ? v : null;
    },
  },
  intercom: {
    src: (id) => `https://widget.intercom.io/widget/${id}`,
    boot: (id) => {
      w().intercomSettings = { app_id: id, hide_default_launcher: true };
    },
    hideBubbleCss: ".intercom-lightweight-app-launcher, .intercom-launcher { display: none !important; }",
    open: () => call("Intercom", "show"),
    setContext: (ctx) => call("Intercom", "update", ctx),
  },
  tawk: {
    src: (id) => `https://embed.tawk.to/${id}`,
    boot: () => {
      w().Tawk_API = { ...((w().Tawk_API as object) ?? {}), customStyle: { visibility: { desktop: { xOffset: -9999 } } } };
    },
    hideBubbleCss: "#tawkchat-container, .tawk-min-container { display: none !important; }",
    open: () => call("Tawk_API.maximize"),
    setContext: (ctx) => call("Tawk_API.addEvent", "page-context", ctx),
    available: () => {
      const s = (w().Tawk_API as { getStatus?: () => string } | undefined)?.getStatus?.();
      return s ? s === "online" : null;
    },
  },
  chatwoot: {
    src: () => `${process.env.NEXT_PUBLIC_CHAT_HOST ?? "https://app.chatwoot.com"}/packs/js/sdk.js`,
    boot: (id) => {
      w().chatwootSettings = { hideMessageBubble: true, position: "right" };
      w().__chatwootToken = id;
    },
    hideBubbleCss: ".woot-widget-bubble { display: none !important; }",
    open: () => call("$chatwoot.toggle", "open"),
    setContext: (ctx) => call("$chatwoot.setCustomAttributes", ctx),
  },
};
