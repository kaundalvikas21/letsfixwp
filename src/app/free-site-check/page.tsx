import { CheckIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import { ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, h1, page, pageY } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import { BookingFlow } from "../contact/BookingFlow";

export const metadata: Metadata = {
  title: "Free WordPress Site Check",
  description: "Not an emergency? Ask for a free check of your WordPress site: updates, backups, security basics and speed.",
  alternates: { canonical: routes.check },
};

// ui-ux-pro-max Lead Magnet + Form: benefit headline, a preview of the magnet, then the smallest form that can
// deliver it. The form is the shared BookingFlow in "check" mode (site address, what to look at, contact).
const COVERED = [
  "WordPress core, plugin and theme versions",
  "Whether backups exist and where they are stored",
  "Security basics: admin accounts, file permissions, known vulnerable plugins",
  "Page speed and Core Web Vitals",
];

export default function FreeSiteCheck() {
  return (
    <div className={cn(page, pageY, "max-w-5xl")}>
      <Breadcrumbs items={nodeCrumbs(routes.check)} />

      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <h1 className={h1}>Free WordPress site check</h1>
          <p className="mt-5 max-w-[60ch] text-lg text-muted">
            For sites that work today. Tell us the address and an engineer looks at updates, backups, security basics and speed.
          </p>

          <section aria-labelledby="covered" className="mt-8 rounded-[14px] bg-surface-2 p-6">
            <h2 id="covered" className="font-display text-lg font-bold">
              What the check covers
            </h2>
            <ul className="mt-4 grid gap-3">
              {COVERED.map((x) => (
                <li key={x} className="flex gap-3 text-sm">
                  <CheckIcon weight="duotone" className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-line pt-4 text-sm text-muted">
              What arrives: a written summary of what we found and what to do first, within {brand.claims.checkTurnaround}. No call needed.
            </p>
          </section>

          <p className="mt-6 text-sm text-muted">
            Questions first? <ChatButton location="free-site-check" />
          </p>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-[14px] border border-line bg-surface p-6 shadow-card md:p-8">
            <BookingFlow type="check" options={[]} problems={[]} initial={{ service: "", guide: "", url: "" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
