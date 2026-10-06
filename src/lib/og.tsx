import { ImageResponse } from "next/og";
import type { Problem } from "@/content/schema";
import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };

// Incident Console tokens (design-system/fixmywp-v1/MASTER.md). Locked dark like the site.
export function problemOg(p: Problem) {
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
          borderTop: `16px solid ${site.colors.primary}`,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: "#EDEDEF", lineHeight: 1.1 }}>{p.h1}</div>
        <div style={{ fontSize: 32, color: "#A1A1AA" }}>{site.name}</div>
      </div>
    ),
    ogSize,
  );
}
