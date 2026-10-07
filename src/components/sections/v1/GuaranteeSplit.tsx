import { ArrowRight, ShieldCheck } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { ctaStyles } from "@/components/cta-styles";
import { brand } from "@/config/brand";
import { routes } from "@/config/routes";

const Confirm = ({ what }: { what?: string }) => (
  <span className="ml-2 align-middle font-mono text-[13px] font-normal tracking-normal text-muted">
    {what ? `{{CONFIRM ${what}}}` : "{{CONFIRM}}"}
  </span>
);

// Each practice is a confirmable claim in brand.ts; unconfirmed ones show a token and block a production deploy.
const practices = [
  { text: "A full backup before any work starts", confirmed: brand.claims.fullBackup },
  { text: "Site access only through two-factor authentication", confirmed: brand.claims.twoFactorAccess },
  { text: "Risky changes tried on a staging copy first", confirmed: brand.claims.stagingFirst },
  { text: "Our access and credentials removed when the job ends", confirmed: brand.claims.credentialsDeleted },
  { text: "A written report of what broke and what we changed", confirmed: brand.claims.writtenReport },
];

/**
 * V1.10. Layout family: split statement + checklist, the page's only image-free split. Second eyebrow: "Guarantee".
 * Left: statement, one sentence, link to /legal/guarantee/ (only exists while brand.legacy.enabled).
 * Right: five practices with ShieldCheck. Stacked under 768px, statement first.
 */
export function GuaranteeSplit() {
  const days = brand.legacy.facts?.guaranteeDays;
  return (
    <section aria-labelledby="guarantee" className="border-t border-line py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-[5fr_7fr] md:gap-16 md:px-6">
        <div>
          <p className="font-mono text-[13px] text-muted">Guarantee</p>
          <h2 id="guarantee" className="mt-3 text-[clamp(1.875rem,1.4rem+2vw,2.75rem)] leading-[1.05] font-semibold tracking-tight text-text">
            Fixed, or we keep working. For {days ?? "{{CONFIRM}}"} days.
            {!brand.claims.guaranteeWording && <Confirm what="wording" />}
          </h2>
          <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-muted">
            If the problem we fixed comes back within that window, tell us and the same job reopens.
          </p>
          {days && (
            <p className="mt-4">
              <Link href={routes.legal.guarantee} className={ctaStyles.text}>
                How the guarantee works
                <ArrowRight size={16} aria-hidden />
              </Link>
            </p>
          )}
        </div>

        <ul className="space-y-1 md:pt-10">
          {practices.map((p) => (
            <li key={p.text} className="flex gap-4 border-b border-line py-5 last:border-b-0">
              <ShieldCheck size={22} aria-hidden className="mt-0.5 shrink-0 text-muted" />
              <span className="text-[17px] leading-relaxed text-text">
                {p.text}
                {!p.confirmed && <Confirm />}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
