import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JsonLd, organizationLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileActionBar } from "@/components/sections/v1/MobileActionBar";
import { SiteNav } from "@/components/sections/v1/SiteNav";
import { brand } from "@/config/brand";
import { SITE_URL } from "@/config/sitemap";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Theme locked dark (design-system/fixmywp-v1/MASTER.md override 1).
export const viewport: Viewport = { themeColor: "#0B0B0D", colorScheme: "dark", viewportFit: "cover" };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${brand.name}: WordPress fixes, care plans and development`, template: `%s | ${brand.name}` },
  description: "Broken WordPress site? Pick your problem and book a fix, or chat with an engineer.",
  openGraph: { siteName: brand.name, type: "website", locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-control focus:bg-surface-2 focus:px-4 focus:text-text"
        >
          Skip to content
        </a>
        <JsonLd data={organizationLd()} />
        <SiteNav />
        <main id="content" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <SiteFooter />
        <MobileActionBar />
      </body>
    </html>
  );
}
