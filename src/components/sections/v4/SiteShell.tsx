import type { ReactNode } from "react";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { hubNodes, routes, serviceNodes } from "@/config/routes";
import { NavBar } from "./NavBar";
import type { MenuCategory } from "./MegaMenu";

// Short labels for the SITEMAP hubs, whose own titles are written for search, not for a 48px heading
// or a filter chip. Order is the SITEMAP order: fixes first, development never ahead of them.
// Exported because the problem tiles filter by the same six names.
export const HUB_LABELS: Record<string, string> = {
  [routes.hub("wordpress-fix")]: "Fixes",
  [routes.hub("wordpress-security")]: "Security",
  [routes.hub("wordpress-maintenance")]: "Care plans",
  [routes.hub("wordpress-performance-migration")]: "Speed and migration",
  [routes.hub("wordpress-development")]: "Development",
  [routes.hub("woocommerce")]: "WooCommerce",
};

const categories: MenuCategory[] = hubNodes
  .filter((h) => h.inNav !== false)
  .map((h) => ({
    label: HUB_LABELS[h.path] ?? h.title,
    href: h.path,
    links: serviceNodes
      .filter((s) => s.parentPath === h.path && s.inNav !== false)
      .map((s) => ({ label: s.title, href: s.path })),
  }));

// The rest of the tree. With no link list in the 64px bar, the menu is the only way to reach these.
const support = [
  { label: "Pricing", href: routes.pricing },
  { label: "Free site check", href: routes.check },
  { label: "Guides", href: routes.guides },
  { label: "Comparisons", href: routes.compares },
  { label: "Case studies", href: routes.reviews },
  { label: "About", href: routes.about },
  { label: "Contact", href: routes.contact },
];

/**
 * v4 global shell: a 64px bar that is transparent over the hero and goes to --bg at 90% with blur
 * once the page scrolls, a full-screen mega menu behind the Menu button, and a fixed bottom action
 * bar under 768px. Server component; the scroll state, the menu and the chat button are client leaves.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-[14px] focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <NavBar categories={categories} support={support} />
      {children}
    </ChatProvider>
  );
}
