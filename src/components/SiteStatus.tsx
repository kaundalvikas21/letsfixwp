import { ChatPresence } from "@/components/sections/v3/ChatPresence";
import { getSiteStatus } from "@/lib/status";

// Renders only the fields that have real values. The server fields are all null until a provider exposes them;
// live operator presence comes from the chat vendor in the browser (ChatPresence), or not at all.
export async function SiteStatus() {
  const s = await getSiteStatus();
  const items: string[] = [];
  if (s.engineersOnline !== null) items.push(s.engineersOnline ? "Engineers online now" : "Engineers offline");
  if (s.medianResponseMinutes !== null) items.push(`Median first response: ${s.medianResponseMinutes} min`);

  return (
    <>
      {items.length > 0 && (
        <p className="mt-4 text-sm text-muted">
          {items.join(". ")}
          {s.asOf && (
            <>
              {" "}
              (as of <time dateTime={s.asOf.toISOString()}>{s.asOf.toLocaleTimeString("en-US")}</time>)
            </>
          )}
        </p>
      )}
      <ChatPresence />
    </>
  );
}
