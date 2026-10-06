import type { Metadata } from "next";
import { JsonLd, organizationLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "FixMyWP: WordPress emergency repair", template: "%s | FixMyWP" },
  description:
    "Broken WordPress site? Pick your problem and book a fix, or chat with an engineer. Hacked sites restored in a day or less, with a 30-day guarantee.",
  openGraph: { siteName: site.name, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", site: "@fixmywp" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={organizationLd()} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
