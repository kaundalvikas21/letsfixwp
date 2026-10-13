// Vendor adapters. Each one knows three things: how to inject its script, how to open its panel,
// and how to attach our context to the session. Nothing else in the codebase knows a vendor name.

export type ChatProviderId = "crisp" | "intercom" | "tawk" | "chatwoot";

export type ChatContext = {
  /** The page the visitor opened chat from. */
  path: string;
  /** Service or guide slug, when the visitor is on a problem page or came from one. */
  problem?: string;
  /** Only when the visitor typed it themselves. We never guess it. */
  siteUrl?: string;
};

export type ChatConfig = {
  provider: ChatProviderId;
  /** Crisp website id, Intercom app id, Tawk "property/widget", or the Chatwoot website token. */
  id: string;
  /** Chatwoot only: the base URL of the install. */
  baseUrl?: string;
};

export type ChatAdapter = {
  /** Injects the vendor script and resolves once its API is usable. Rejects if blocked or slow. */
  load: (cfg: ChatConfig) => Promise<void>;
  open: () => void;
  setContext: (c: ChatContext) => void;
};

/** One script tag, one timeout, one rejection path. A blocked script must fail fast, not hang. */
function inject(src: string, timeoutMs = 8000): Promise<void> {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    const timer = setTimeout(() => reject(new Error("chat script timed out")), timeoutMs);
    el.onload = () => {
      clearTimeout(timer);
      resolve();
    };
    el.onerror = () => {
      clearTimeout(timer);
      reject(new Error("chat script blocked"));
    };
    document.head.appendChild(el);
  });
}

/** Vendor globals are untyped by design: each adapter is the only place that touches them. */
type Win = Window & Record<string, unknown>;
const w = () => window as unknown as Win;

const crisp: ChatAdapter = {
  load: async (cfg) => {
    const win = w();
    win.$crisp = win.$crisp ?? [];
    win.CRISP_WEBSITE_ID = cfg.id;
    await inject("https://client.crisp.chat/l.js");
    // Our launcher is the only launcher. Hide the vendor bubble as soon as the API exists.
    (win.$crisp as unknown[][]).push(["do", "chat:hide"]);
  },
  open: () => {
    const q = w().$crisp as unknown[][];
    q.push(["do", "chat:show"]);
    q.push(["do", "chat:open"]);
  },
  setContext: (c) => {
    const q = w().$crisp as unknown[][];
    q.push(["set", "session:data", [Object.entries(c).filter(([, v]) => v)]]);
  },
};

const intercom: ChatAdapter = {
  load: async (cfg) => {
    const win = w();
    win.intercomSettings = { app_id: cfg.id, hide_default_launcher: true };
    await inject(`https://widget.intercom.io/widget/${encodeURIComponent(cfg.id)}`);
    (win.Intercom as (...a: unknown[]) => void)("boot", { app_id: cfg.id, hide_default_launcher: true });
  },
  open: () => (w().Intercom as (...a: unknown[]) => void)("show"),
  setContext: (c) => (w().Intercom as (...a: unknown[]) => void)("update", c),
};

const tawk: ChatAdapter = {
  load: async (cfg) => {
    const win = w();
    const api = (win.Tawk_API ?? {}) as Record<string, unknown>;
    win.Tawk_API = api;
    // Hide the vendor bubble the moment the widget is ready; ours is the only launcher.
    api.onLoad = () => (api.hideWidget as (() => void) | undefined)?.();
    await inject(`https://embed.tawk.to/${cfg.id}`);
  },
  open: () => {
    const api = w().Tawk_API as Record<string, unknown>;
    (api.showWidget as (() => void) | undefined)?.();
    (api.maximize as (() => void) | undefined)?.();
  },
  setContext: (c) => {
    const api = w().Tawk_API as Record<string, unknown>;
    (api.setAttributes as ((a: Record<string, string>, cb?: unknown) => void) | undefined)?.(
      Object.fromEntries(Object.entries(c).filter(([, v]) => v)) as Record<string, string>,
    );
  },
};

const chatwoot: ChatAdapter = {
  load: async (cfg) => {
    const win = w();
    const base = cfg.baseUrl ?? "https://app.chatwoot.com";
    win.chatwootSettings = { hideMessageBubble: true, position: "right", type: "standard" };
    await inject(`${base}/packs/js/sdk.js`);
    (win.chatwootSDK as { run: (o: Record<string, string>) => void }).run({ websiteToken: cfg.id, baseUrl: base });
  },
  open: () => (w().$chatwoot as { toggle: (s: string) => void }).toggle("open"),
  setContext: (c) =>
    (w().$chatwoot as { setCustomAttributes: (a: Record<string, string>) => void }).setCustomAttributes(
      Object.fromEntries(Object.entries(c).filter(([, v]) => v)) as Record<string, string>,
    ),
};

export const ADAPTERS: Record<ChatProviderId, ChatAdapter> = { crisp, intercom, tawk, chatwoot };
