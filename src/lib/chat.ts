import { brand } from "@/config/brand";
import { track } from "./track";

export function openChat(location: string, service?: string) {
  track("cta_chat_open", { location, service });
  // ponytail: email until the chat provider (Crisp, Intercom, ...) is chosen. Swap this line for its open() call.
  window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent("Help with my WordPress site")}`;
}
