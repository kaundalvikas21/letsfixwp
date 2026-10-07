import { type ChatProvider, loadScript, w } from "./types";

// Each adapter hides the vendor's default bubble: our own launcher is the only entry point.

const crisp = (websiteId: string): ChatProvider => ({
  name: "crisp",
  load: async () => {
    w().$crisp = w().$crisp ?? [];
    w().CRISP_WEBSITE_ID = websiteId;
    w().$crisp.push(["do", "chat:hide"]);
    w().$crisp.push(["on", "chat:closed", () => w().$crisp.push(["do", "chat:hide"])]);
    await loadScript("https://client.crisp.chat/l.js");
  },
  open: (ctx) => {
    w().$crisp.push(["set", "session:data", [Object.entries(ctx).filter(([, v]) => v)]]);
    w().$crisp.push(["do", "chat:show"]);
    w().$crisp.push(["do", "chat:open"]);
  },
  close: () => w().$crisp.push(["do", "chat:close"]),
});

const intercom = (appId: string): ChatProvider => ({
  name: "intercom",
  load: async () => {
    w().intercomSettings = { app_id: appId, hide_default_launcher: true };
    await loadScript(`https://widget.intercom.io/widget/${appId}`);
    w().Intercom("boot", w().intercomSettings);
  },
  open: (ctx) => {
    w().Intercom("update", { page_path: ctx.page, problem: ctx.problem, site_url: ctx.site });
    w().Intercom("show");
  },
  close: () => w().Intercom("hide"),
});

const tawk = (propertyId: string, widgetId: string): ChatProvider => ({
  name: "tawk",
  load: () =>
    new Promise<void>((resolve, reject) => {
      const api = (w().Tawk_API = w().Tawk_API ?? {});
      api.onLoad = () => {
        api.hideWidget();
        resolve();
      };
      api.onChatMinimized = () => api.hideWidget();
      loadScript(`https://embed.tawk.to/${propertyId}/${widgetId}`).catch(reject);
    }),
  open: (ctx) => {
    const api = w().Tawk_API;
    api.setAttributes({ page: ctx.page, problem: ctx.problem ?? "", site: ctx.site ?? "" }, () => {});
    api.showWidget();
    api.maximize();
  },
  close: () => w().Tawk_API.minimize(),
});

const chatwoot = (baseUrl: string, token: string): ChatProvider => ({
  name: "chatwoot",
  load: () =>
    new Promise<void>((resolve, reject) => {
      w().chatwootSettings = { hideMessageBubble: true, position: "right" };
      window.addEventListener("chatwoot:ready", () => resolve(), { once: true });
      loadScript(`${baseUrl}/packs/js/sdk.js`)
        .then(() => w().chatwootSDK.run({ websiteToken: token, baseUrl }))
        .catch(reject);
    }),
  open: (ctx) => {
    w().$chatwoot.setCustomAttributes({ page: ctx.page, problem: ctx.problem ?? "", site: ctx.site ?? "" });
    w().$chatwoot.toggle("open");
  },
  close: () => w().$chatwoot.toggle("close"),
});

/**
 * The provider named by NEXT_PUBLIC_CHAT_PROVIDER, or null when unset or missing its public id.
 * Each process.env.NEXT_PUBLIC_* is written out in full: Next.js only inlines literal accesses into client code.
 */
export function selectProvider(): ChatProvider | null {
  switch (process.env.NEXT_PUBLIC_CHAT_PROVIDER) {
    case "crisp":
      return process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID ? crisp(process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID) : null;
    case "intercom":
      return process.env.NEXT_PUBLIC_INTERCOM_APP_ID ? intercom(process.env.NEXT_PUBLIC_INTERCOM_APP_ID) : null;
    case "tawk":
      return process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID && process.env.NEXT_PUBLIC_TAWK_WIDGET_ID ? tawk(process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID, process.env.NEXT_PUBLIC_TAWK_WIDGET_ID) : null;
    case "chatwoot":
      return process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL && process.env.NEXT_PUBLIC_CHATWOOT_TOKEN ? chatwoot(process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL, process.env.NEXT_PUBLIC_CHATWOOT_TOKEN) : null;
    default:
      return null;
  }
}
