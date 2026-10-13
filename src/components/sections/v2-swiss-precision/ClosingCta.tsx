import { HeroUrlForm } from "./HeroUrlForm";

// Layout family: typographic closing statement. The same URL form the hero uses, because it is the
// same intent: one component, one label, one CTA label, one validation rule. The chat link is off
// here so the page does not carry a fourth control saying the same thing as the docked launcher.
export function ClosingCta() {
  return (
    <section aria-labelledby="closing" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-20 md:py-32">
        <h2 id="closing" className="max-w-[16ch] text-[clamp(2.25rem,6vw,3.75rem)]">
          Send us the URL. We will take it from here.
        </h2>
        <div className="mt-10 max-w-[32rem]">
          <HeroUrlForm location="home:closing" chat={false} />
        </div>
      </div>
    </section>
  );
}
