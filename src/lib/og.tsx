import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";
import { RasterMonogram, V4 } from "./brand-raster";

export const ogSize = { width: 1200, height: 630 };

/**
 * The share card.
 *
 * It was on the v3 palette until Task 102: a near-white page with a green rule along the top, which is the
 * one thing a visitor sees of the site before they arrive and the only surface still telling them it is
 * light and green. It is now the v4 page it belongs to, with the mark on it.
 *
 * Colours come from `brand-raster.tsx`, which explains why they are literals here and tokens everywhere
 * else: Satori has no stylesheet to read them from.
 */
export function ogImage(title: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: V4.bg,
          // The ember rule reads as the one accent on the card. On the near-black page it also keeps the
          // card from looking like a crop of something larger.
          borderTop: `16px solid ${V4.accent}`,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: V4.text, lineHeight: 1.1 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <RasterMonogram width={44} />
          <div style={{ fontSize: 32, color: V4.muted }}>{brand.name}</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
