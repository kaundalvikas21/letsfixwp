import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";

export const ogSize = { width: 1200, height: 630 };

// v2-swiss-precision: the light-theme tokens from design-system/letsfixwp-v2/MASTER.md, with the
// accent as a top rule. No Satoshi here: ImageResponse needs an embeddable font buffer and the
// self-hosted files are woff2, so the card falls back to the renderer default.
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
          background: "#F6F6F7",
          borderTop: `16px solid ${brand.accent}`,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: "#111113", lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 32, color: "#5B5B66" }}>{brand.name}</div>
      </div>
    ),
    ogSize,
  );
}
