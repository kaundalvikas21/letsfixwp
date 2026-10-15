import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { JsonLd, organizationLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteShell } from "@/components/sections/v4/SiteShell";
import { brand } from "@/config/brand";
import { SITE_URL } from "@/config/sitemap";
import "./globals.css";

// opsz is the only extra axis the site actually sets; wght comes with the variable font. Dropping wdth,
// which nothing uses, takes the display face from 129KB to the size measured in docs/qa-report.md.
const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--font-bricolage" });
const body = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${brand.name}: WordPress fixes, care plans and development`, template: `%s | ${brand.name}` },
  description: "Broken WordPress site? Pick your problem and book a fix, or chat with an engineer.",
  openGraph: { siteName: brand.name, type: "website", locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="pb-[calc(4.75rem+env(safe-area-inset-bottom))] font-sans antialiased md:pb-0">
        <JsonLd data={organizationLd()} />
        <SiteShell>
          <main id="main">{children}</main>
          <SiteFooter />
        </SiteShell>
      </body>
    </html>
  );
}
