import { ChatButton } from "@/components/Cta";
import { brand } from "@/config/brand";
import { getSiteStatus } from "@/lib/status";
import { CountUp } from "./CountUp";

const Confirm = () => <span className="font-mono text-[14px] text-muted">{"{{CONFIRM}}"}</span>;

/**
 * V1.7. Layout family: full-width single statement row. Reads getSiteStatus().
 * Live (engineersOnline true): the page's only dot (aria-hidden; the text says the same), and the median first
 * reply in large Geist Mono only when that number is real. Otherwise: desk hours and how to reach the desk, never
 * a number. Right side: CHAT, the only CTA. Under 768px the row stacks, CTA last.
 * ponytail: the home page is static, so status is read at build time. Once getSiteStatus() returns live data,
 * render this dynamically (await connection() from next/server) or wrap it in <Suspense> with revalidation.
 */
export async function DeskStatus() {
  const s = await getSiteStatus();
  const live = s.engineersOnline === true;
  const hours = brand.support.hours ?? brand.legacy.facts?.hours ?? null;

  return (
    <section aria-labelledby="desk" className="border-y border-line bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:gap-10 md:px-6 md:py-12">
        {live ? (
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-10">
            <h2 id="desk" className="flex items-center gap-3 text-xl font-semibold tracking-tight text-text">
              <span aria-hidden className="size-2 shrink-0 rounded-full bg-accent" />
              Engineers online now
            </h2>
            {s.medianResponseMinutes !== null && (
              <p className="flex items-baseline gap-3">
                <span className="font-mono text-5xl leading-none text-text">
                  <CountUp value={s.medianResponseMinutes} />
                  <span className="text-2xl text-muted"> min</span>
                </span>
                <span className="text-[15px] text-muted">
                  median first reply
                  {s.asOf && (
                    <>
                      , as of{" "}
                      <time dateTime={s.asOf.toISOString()}>
                        {s.asOf.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata", timeZoneName: "short" })}
                      </time>
                    </>
                  )}
                </span>
              </p>
            )}
          </div>
        ) : (
          <div>
            <h2 id="desk" className="text-xl font-semibold tracking-tight text-text">
              Support desk hours: {hours ?? <Confirm />}
            </h2>
            <p className="mt-2 text-[15px] text-muted">
              Reach the desk by chat, or email{" "}
              <a href={`mailto:${brand.email}`} className="text-text underline underline-offset-4">
                {brand.email}
              </a>
              .
            </p>
          </div>
        )}
        <ChatButton location="desk-status" className="shrink-0 self-start md:self-auto" />
      </div>
    </section>
  );
}
