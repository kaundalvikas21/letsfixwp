import type { Metadata } from "next";
import { ChatLauncher } from "@/components/ChatLauncher";
import { JsonLd, organizationLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileBookBar, SiteHeader } from "@/components/SiteHeader";
import { brand } from "@/config/brand";
import { SITE_URL } from "@/config/sitemap";
import { jetbrainsMono, satoshi } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${brand.name}: WordPress fixes, care plans and development`, template: `%s | ${brand.name}` },
  description: "Broken WordPress site? Pick your problem and book a fix, or chat with an engineer.",
  openGraph: { siteName: brand.name, type: "website", locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${satoshi.variable} ${jetbrainsMono.variable}`}>
      {/* Bottom padding clears MobileBookBar under 768px (nothing hidden behind fixed chrome). */}
      <body className="pb-[calc(var(--bottombar-h)+env(safe-area-inset-bottom))] md:pb-0">
        <JsonLd data={organizationLd()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-text focus:px-4 focus:py-3 focus:text-bg"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <ChatLauncher />
        <MobileBookBar />
      </body>
    </html>
  );
}
