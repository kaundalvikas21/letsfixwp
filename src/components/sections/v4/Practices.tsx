import { ShieldCheckIcon } from "@phosphor-icons/react/ssr";
import { brand } from "@/config/brand";

// Every line is a claim gated in brand.claims (src/config/brand.ts), which is what {{CONFIRM}} means
// here: a production deploy fails until the owner confirms each one, and setting a claim to false
// removes its line from the page rather than softening the wording.
const PRACTICES = [
  { on: brand.claims.vetted, title: "Vetted engineers", text: "The person working on your site has been checked before they get near it." },
  { on: brand.claims.fixedPrice, title: "Nothing starts without your yes", text: "You approve a fixed price before any work begins." },
  { on: brand.claims.backupFirst, title: "A backup before any change", text: "Files and database are copied before we touch anything." },
  { on: brand.claims.ownLogin, title: "Your login stays yours", text: "We work through an account you create for us, and never ask for your password." },
  { on: brand.claims.accessRemoved, title: "Access ends with the job", text: "When the work is done, our account comes off your site." },
].filter((p) => p.on);

/** Quiet by design: this follows the guarantee, which is the loudest thing on the page. */
export function Practices() {
  if (!PRACTICES.length) return null;
  return (
    <section aria-labelledby="practices" className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <h2 id="practices" className="font-display text-2xl leading-tight font-bold tracking-[-0.02em]">
        How we work on your site
      </h2>
      <ul className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {PRACTICES.map((p) => (
          <li key={p.title} className="flex gap-3">
            <ShieldCheckIcon weight="duotone" className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />
            <span>
              <span className="block text-[15px] font-semibold">{p.title}</span>
              <span className="mt-1 block text-[15px] text-muted">{p.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
