import { site } from "@/content/site";
import { track } from "./track";

export function openChat(location: string) {
  track("cta_chat_open", { location });
  // ponytail: email until the chat provider (Crisp, Intercom, ...) is chosen. Swap this line for its open() call.
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Help with my WordPress site")}`;
}
