import { getSiteStatus } from "@/lib/status";

// Renders only the fields that have real values. All null today, so this renders nothing.
export async function SiteStatus() {
  const s = await getSiteStatus();
  const items: string[] = [];
  if (s.engineersOnline !== null) items.push(s.engineersOnline ? "Engineers online now" : "Engineers offline");
  if (s.medianResponseMinutes !== null) items.push(`Median first response: ${s.medianResponseMinutes} min`);
  if (!items.length) return null;
  return (
    <p>
      {items.join(". ")}
      {s.asOf && (
        <>
          {" "}
          (as of <time dateTime={s.asOf.toISOString()}>{s.asOf.toLocaleTimeString("en-US")}</time>)
        </>
      )}
    </p>
  );
}
