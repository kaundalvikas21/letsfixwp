import { ScreenOrPhoto } from "./BrowserFrame";
import { TimelineLine } from "./TimelineLine";

type Step = {
  verb: string;
  engineer: string;
  owner: string;
  /**
   * `slot` names the real capture this step will get, and `alt` describes it. Diagnose and Verify are the
   * before and after of the same site, so both are captured. Repair has no screen state worth capturing, so it
   * stays a photograph for good and carries no slot.
   */
  image?: { photo: string; side: "right" | "left"; slot?: string; url?: string; alt?: string };
};

// Verbs as labels, never numbers. One sentence on the engineer's work, one on what the owner receives.
const steps: Step[] = [
  {
    verb: "Diagnose",
    engineer: "An engineer reads your PHP and server error logs and recent changes to find the exact plugin, file or setting that broke the site.",
    owner: "You get a plain explanation of the cause before anything is changed.",
    image: {
      slot: "critical-error-on-this-website",
      url: "https://example.com/",
      alt: "A WordPress site showing the message: There has been a critical error on this website.",
      photo: "terminal",
      side: "right",
    },
  },
  {
    verb: "Back up",
    engineer: "We copy your files and database before touching anything.",
    owner: "You get a restore point, so every change can be undone.",
  },
  {
    verb: "Repair",
    engineer: "The engineer fixes or replaces the failing plugin, theme file or setting without deleting your content.",
    owner: "You get your site back with posts, orders and settings intact.",
    image: { photo: "keys", side: "left" },
  },
  {
    verb: "Verify",
    engineer: "We load your key pages, wp-admin, forms and checkout to confirm each one works.",
    owner: "You get a short written report of what broke and what changed.",
    image: {
      slot: "restored-site",
      url: "https://example.com/",
      alt: "The same WordPress site loading normally again after the repair.",
      photo: "workspace",
      side: "right",
    },
  },
  {
    verb: "Harden",
    engineer: "We update or remove what caused the break and switch debugging output back off.",
    owner: "You get clear advice on how to stop it happening again.",
  },
];

/**
 * V1.5. Layout family: vertical timeline with a scroll-drawn line.
 * Three entries carry an image, alternating from 768px (Diagnose right, Repair left, Verify right); under 768px
 * everything stacks in one column with the image after the text. Repair and Verify are the only adjacent pair,
 * which is the contract's cap of 2 consecutive image-plus-text splits. Until the real captures exist these are
 * plain photographs, never framed.
 */
export function AfterYouBook() {
  return (
    <section aria-labelledby="after-book" className="border-t border-line py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 id="after-book" className="text-[clamp(1.875rem,1.4rem+2vw,2.75rem)] leading-[1.05] font-semibold tracking-tight text-text">
          What happens after you book
        </h2>

        <TimelineLine>
          <ol className="mt-12 space-y-14 md:space-y-20">
            {steps.map((s) => (
              <li key={s.verb} className={`pl-10 ${s.image ? "grid items-center gap-8 md:grid-cols-2 md:gap-12" : ""}`}>
                <div className={s.image?.side === "left" ? "md:order-last" : ""}>
                  <h3 className="text-2xl font-semibold tracking-tight text-text">{s.verb}</h3>
                  <p className="mt-3 max-w-[60ch] text-[16px] leading-relaxed text-text">{s.engineer}</p>
                  <p className="mt-2 max-w-[60ch] text-[16px] leading-relaxed text-muted">{s.owner}</p>
                </div>
                {s.image && <ScreenOrPhoto slot={s.image.slot} url={s.image.url} alt={s.image.alt} photo={s.image.photo} />}
              </li>
            ))}
          </ol>
        </TimelineLine>
      </div>
    </section>
  );
}
