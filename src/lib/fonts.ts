import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

// design-system/letsfixwp-v2/MASTER.md, Typography: Satoshi for everything, JetBrains Mono for
// figures and error strings. next/font only (docs/foundation.md STACK): no CSS @import of a webfont.

/** Satoshi (Indian Type Foundry, ITF Free Font License). Self-hosted from src/fonts/. */
export const satoshi = localFont({
  src: [
    { path: "../fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Helvetica Neue", "Arial", "sans-serif"],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});
