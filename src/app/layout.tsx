import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import localFont from "next/font/local";
import { JsonLd, organizationLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteShell } from "@/components/sections/v3/SiteShell";
import { brand } from "@/config/brand";
import { SITE_URL } from "@/config/sitemap";
import "./globals.css";

const display = localFont({
  src: [
    { path: "../fonts/CabinetGrotesk-Bold.woff2", weight: "700" },
    { path: "../fonts/CabinetGrotesk-Extrabold.woff2", weight: "800" },
  ],
  variable: "--font-cabinet",
});
const body = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${brand.name}: WordPress fixes, care plans and development`, template: `%s | ${brand.name}` },
  description: "Broken WordPress site? Pick your problem and book a fix, or chat with an engineer.",
  openGraph: { siteName: brand.name, type: "website", locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
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
