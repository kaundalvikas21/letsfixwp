import Image from "next/image";
import { BookLink, ChatButton } from "@/components/Cta";

/**
 * V1.12 final CTA. Layout family: full-bleed photo panel. Photo under a --bg scrim at 70%, H2 and the CTA pair,
 * nothing else. The photo is decorative under a flat scrim, so alt stays empty.
 */
export function FinalCta() {
  return (
    <section aria-labelledby="final-cta" className="relative isolate overflow-hidden border-t border-line">
      <Image src="/site_images/final-cta.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-bg/70" />
      <div className="mx-auto flex min-h-[28rem] max-w-7xl flex-col items-center justify-center gap-8 px-4 py-24 text-center md:min-h-[32rem] md:px-6">
        <h2 id="final-cta" className="text-[clamp(2.25rem,1.6rem+3vw,4rem)] leading-[1.05] font-semibold tracking-tight text-text">
          Get your site back.
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          <BookLink location="final-cta" />
          <ChatButton location="final-cta" />
        </div>
      </div>
    </section>
  );
}
