import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";

export const ogSize = { width: 1200, height: 630 };

// v3 palette, from design-system/letsfixwp-v3/MASTER.md. Not brand.accent: that is the company red, which this
// variation locks out (one accent, back-online green).
const V3 = { bg: "#FCFCFD", text: "#0F1115", muted: "#555B66", accent: "#15803D" };
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
          background: V3.bg,
          borderTop: `16px solid ${V3.accent}`,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: V3.text, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 32, color: V3.muted }}>{brand.name}</div>
      </div>
    ),
    ogSize,
  );
}
