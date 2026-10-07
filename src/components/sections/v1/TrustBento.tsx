import Image from "next/image";
import type { ReactNode } from "react";
import { brand } from "@/config/brand";
import { BentoCell } from "./BentoCell";

/** A claim the owner has not confirmed yet renders with a visible token (and fails a production deploy). */
function Claim({ text, confirmed }: { text: string; confirmed: boolean }) {
  return (
    <>
      {text}
      {!confirmed && <span className="ml-2 align-middle font-mono text-[13px] font-normal text-muted">{"{{CONFIRM}}"}</span>}
    </>
  );
}

const headline = "font-semibold tracking-tight text-text";

/** Photo background with a --bg scrim so the text stays readable. Placeholder until real photos land (image-todo). */
function Photo({ seed, sizes }: { seed: string; sizes: string }) {
  return (
    <>
      <Image src={`https://picsum.photos/seed/fixmywp-${seed}/1200/1200`} alt="" fill sizes={sizes} className="-z-10 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-bg via-bg/70 to-bg/20" />
    </>
  );
}

function Body({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex h-full flex-col justify-end p-6 md:p-8 ${className}`}>{children}</div>;
}

/**
 * V1.6. Layout family: bento grid, exactly 5 cells in a 3x3 grid (9 units = 4 + 2 + 1 + 1 + 1):
 *   [A A B]
 *   [A A C]   columns read A/A/D, A/A/E, B/C/E, so no column repeats.
 *   [D E E]
 * Under 768px: one column in DOM order, the 2x2 first.
 */
export function TrustBento() {
  const days = brand.legacy.facts?.guaranteeDays;
  return (
    <section aria-labelledby="trust" className="border-t border-line py-20 md:py-28">
      <h2 id="trust" className="sr-only">
        Why owners trust us with a broken site
      </h2>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-3 md:grid-rows-[repeat(3,minmax(13rem,auto))] md:px-6">
        {/* A: 2x2, real photo with scrim, text bottom-left. The guarantee belongs to the legacy business. */}
        <BentoCell className="min-h-[22rem] md:col-span-2 md:row-span-2">
          <Photo seed="bento-guarantee" sizes="(min-width: 768px) 66vw, 100vw" />
          <Body>
            <h3 className={`max-w-[18ch] text-[clamp(1.75rem,1.3rem+2vw,2.75rem)] leading-[1.05] ${headline}`}>
              {days ? `${days}-day guarantee on every fix` : <Claim text="Guarantee on every fix" confirmed={false} />}
            </h3>
          </Body>
        </BentoCell>

        {/* B: 1x1, accent tinted at 8%. */}
        <BentoCell className="min-h-52 bg-[color-mix(in_srgb,var(--accent)_8%,var(--bg))]">
          <Body>
            <h3 className={`text-xl ${headline}`}>
              <Claim text="Full backup before any change" confirmed={brand.claims.fullBackup} />
            </h3>
          </Body>
        </BentoCell>

        {/* C: 1x1, real macro photo. */}
        <BentoCell className="min-h-52">
          <Photo seed="bento-keyboard" sizes="(min-width: 768px) 33vw, 100vw" />
          <Body>
            <h3 className={`text-xl ${headline}`}>WordPress only. Nothing else.</h3>
          </Body>
        </BentoCell>

        {/* D: 1x1, --surface. */}
        <BentoCell className="min-h-52 bg-surface">
          <Body>
            <h3 className={`text-xl ${headline}`}>
              <Claim text="Credentials deleted when we finish" confirmed={brand.claims.credentialsDeleted} />
            </h3>
          </Body>
        </BentoCell>

        {/* E: 2x1, --surface-2. */}
        <BentoCell className="min-h-52 bg-surface-2 md:col-span-2">
          <Body>
            <h3 className={`text-2xl ${headline}`}>
              <Claim text="Fixed price before we start" confirmed={brand.claims.fixedPrice} />
            </h3>
          </Body>
        </BentoCell>
      </div>
    </section>
  );
}
