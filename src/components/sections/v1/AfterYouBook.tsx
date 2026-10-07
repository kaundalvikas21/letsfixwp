import { ScreenOrPhoto } from "./BrowserFrame";
import { StepReveal } from "./StepReveal";

type Step = {
  verb: string;
  engineer: string;
  owner: string;
  /** A photograph in public/site_images/services/. Every step has one, so the five rows read as one repeating unit. */
  photo: string;
  /**
   * `slot` names the real capture this step will get, and `alt` describes it. Diagnose and Verify are the before
   * and after of the same site, so both are captured. The other three have no screen state worth capturing and
   * stay photographs for good.
   */
  slot?: string;
  url?: string;
  alt?: string;
};

// Verbs as labels, never numbers. One sentence on the engineer's work, one on what the owner receives.
const steps: Step[] = [
  {
    verb: "Diagnose",
    engineer: "An engineer reads your PHP and server error logs and recent changes to find the exact plugin, file or setting that broke the site.",
    owner: "You get a plain explanation of the cause before anything is changed.",
    photo: "terminal",
    slot: "critical-error-on-this-website",
    url: "https://example.com/",
    alt: "A WordPress site showing the message: There has been a critical error on this website.",
  },
  {
    verb: "Back up",
    engineer: "We copy your files and database before touching anything.",
    owner: "You get a restore point, so every change can be undone.",
    photo: "racks",
  },
  {
    verb: "Repair",
    engineer: "The engineer fixes or replaces the failing plugin, theme file or setting without deleting your content.",
    owner: "You get your site back with posts, orders and settings intact.",
    photo: "keys",
  },
  {
    verb: "Verify",
    engineer: "We load your key pages, wp-admin, forms and checkout to confirm each one works.",
    owner: "You get a short written report of what broke and what changed.",
    photo: "monitors",
    slot: "restored-site",
    url: "https://example.com/",
    alt: "The same WordPress site loading normally again after the repair.",
  },
  {
    verb: "Harden",
    engineer: "We update or remove what caused the break and switch debugging output back off.",
    owner: "You get clear advice on how to stop it happening again.",
    photo: "workspace",
  },
];

/**
 * V1.5. Layout family: sticky card stack. Each step is one card; from 768px every card sticks 12px lower than the
 * one before, so scrolling deals them over each other and the covered steps stay visible as a deck of edges. That
 * is the sequence made physical: you cannot reach Harden without passing Diagnose. Inside the cards the photo
 * zigzags, right on Diagnose then alternating, so two cards never look like the same slide twice.
 * Under 768px the cards are a plain stacked list, photo above text, because a card taller than the viewport
 * cannot stack. Reduced motion: `.step-stack` in globals.css drops the sticky back to static and removes the
 * scroll budget with it, so it reads as that same plain list.
 */
export function AfterYouBook() {
  return (
    <section aria-labelledby="after-book" className="border-t border-line py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 id="after-book" className="text-[clamp(1.875rem,1.4rem+2vw,2.75rem)] leading-[1.05] font-semibold tracking-tight text-text">
          What happens after you book
        </h2>

        <ol className="step-stack mt-12">
          {steps.map((s, i) => {
            // Zigzag: Diagnose right, Back up left, and so on. The photo column swaps sides, the card does not.
            const photoRight = i % 2 === 0;
            return (
              <StepReveal key={s.verb} className="md:sticky" style={{ top: `calc(6rem + ${i} * 0.75rem)` }}>
                <article
                  className={`grid overflow-hidden rounded-card border border-line bg-surface shadow-card md:min-h-[19rem] md:items-center ${
                    photoRight ? "md:grid-cols-[minmax(0,1fr)_24rem]" : "md:grid-cols-[24rem_minmax(0,1fr)]"
                  }`}
                >
                  <ScreenOrPhoto
                    slot={s.slot}
                    url={s.url}
                    alt={s.alt}
                    photo={s.photo}
                    sizes="(min-width: 768px) 24rem, 100vw"
                    className={`!rounded-none !border-0 md:!h-full md:row-start-1 md:object-cover ${photoRight ? "md:col-start-2" : "md:col-start-1"}`}
                  />
                  <div className={`p-6 md:row-start-1 md:p-8 ${photoRight ? "md:col-start-1" : "md:col-start-2"}`}>
                    <h3 className="text-2xl font-semibold tracking-tight text-text">{s.verb}</h3>
                    <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-text">{s.engineer}</p>
                    <p className="mt-2 max-w-[60ch] text-[16px] leading-relaxed text-muted">{s.owner}</p>
                  </div>
                </article>
              </StepReveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
