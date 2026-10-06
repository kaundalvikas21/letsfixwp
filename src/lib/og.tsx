import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";

export const ogSize = { width: 1200, height: 630 };

// Incident Console tokens (design-system/fixmywp-v1/MASTER.md). Locked dark like the site.
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
          background: "#0B0B0D",
          borderTop: `16px solid ${brand.accent}`,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: "#EDEDEF", lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 32, color: "#A1A1AA" }}>{brand.name}</div>
      </div>
    ),
    ogSize,
  );
}
