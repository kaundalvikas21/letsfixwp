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
      <head>
        {/*
          The entrance in globals.css hides [data-reveal] until Reveal.tsx's observer adds .revealed.
          With scripts off, that observer never runs, so this restores every element to its final state.
          It lives in the document head because it has to apply on the first paint, before any hidden
          element has been painted.

          clip-path is here because [data-reveal="image"] opens a frame instead of fading: resetting
          only opacity and transform left every photograph clipped to its middle 76% with scripts off.
          Measured, not assumed: 9 of 9 images on the home page stayed clipped until this line existed.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
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
