import { nodeByPath, serviceIdOf } from "@/config/routes";
import { track } from "../track";
import { selectProvider } from "./providers";
import type { ChatContext } from "./types";

/**
 * Provider-agnostic live chat. NEXT_PUBLIC_CHAT_PROVIDER picks Crisp, Intercom, Tawk or Chatwoot ({{CONFIRM}}
 * until set). The vendor script never sits in the critical path: preloadChat() runs from requestIdleCallback
 * after hydration, and openChat() loads it on first use. Blocked, slow or missing: our fallback dialog opens.
 */

const provider = typeof window === "undefined" ? null : selectProvider();
const LOAD_TIMEOUT_MS = 8000;
let loading: Promise<void> | null = null;

export const FALLBACK_EVENT = "chat:fallback";
export const OPENED_EVENT = "chat:opened";

function ensureLoaded(): Promise<void> {
  if (!provider) return Promise.reject(new Error("no chat provider"));
  loading ??= Promise.race([
    provider.load(),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("chat load timeout")), LOAD_TIMEOUT_MS)),
  ]).catch((err) => {
    loading = null; // allow a retry on the next click
    throw err;
  });
  return loading;
}

/** Called once the page is idle. Errors are swallowed: the click path reports them. */
export function preloadChat() {
  if (provider) ensureLoaded().catch(() => {});
}

/** The visitor's situation: current path, problem slug if any, and the site URL they typed in the ticket. */
function chatContext(service?: string): ChatContext {
  const path = window.location.pathname;
  const q = new URLSearchParams(window.location.search);
  const node = nodeByPath.get(path.endsWith("/") ? path : `${path}/`);
  const guide = path.match(/^\/guides\/([^/]+)\/?$/)?.[1];
  const problem = q.get("guide") || q.get("service") || guide || service || (node?.kind === "service" ? serviceIdOf(node.path) : undefined);
  let site: string | undefined;
  try {
    site = (JSON.parse(sessionStorage.getItem("ticket-draft-v1") ?? "null") as { siteUrl?: string } | null)?.siteUrl || undefined;
  } catch {}
  return { page: path, problem, site };
}

export async function openChat(location: string, service?: string) {
  track("cta_chat_open", { location, service });
  try {
    await ensureLoaded();
    provider!.open(chatContext(service));
    window.dispatchEvent(new Event(OPENED_EVENT));
  } catch {
    window.dispatchEvent(new Event(FALLBACK_EVENT));
  }
}

export function closeChat() {
  provider?.close();
}

export const hasChatProvider = () => provider !== null;
