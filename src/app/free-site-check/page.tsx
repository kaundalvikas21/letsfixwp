import type { Metadata } from "next";
import { CheckIcon } from "@phosphor-icons/react/ssr";
import { ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Band, BandTitle, Breadcrumbs } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { routes } from "@/config/routes";
import { matchIndex } from "@/content";
import { BookingFlow } from "../contact/BookingFlow";

// ui-ux-pro-max `lead-magnet-form`: Hero (benefit) > magnet preview > minimal form > submit.
// "Ask only for information necessary to deliver the lead magnet": the check form collects the site
// address, an email and what is worrying you, nothing else.
export const metadata: Metadata = {
  title: "Free WordPress Site Check",
  description: "Not an emergency? Ask for a free check of your WordPress site: updates, backups, security basics and speed.",
  alternates: { canonical: routes.check },
  openGraph: { title: "Free WordPress Site Check", url: routes.check, type: "website" },
};

const covers = [
  "WordPress core, plugin and theme versions, and which of them are behind",
  "Whether backups exist at all, where they are stored and how old the newest one is",
  "Security basics: admin accounts, file permissions and known vulnerable plugins",
  "Page speed and Core Web Vitals on your slowest template",
];

export default function FreeSiteCheck() {
  return (
    <article>
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-12 md:pb-16">
        <Breadcrumbs items={nodeCrumbs(routes.check)} />
        <h1 className="mt-8 max-w-[18ch] text-[clamp(2rem,4.2vw,3.25rem)]">Find out what is wrong before it breaks.</h1>
        <p className="mt-6 max-w-[54ch] text-lg text-muted">
          For sites that still work today. An engineer looks at your site and writes back with what needs attention.
        </p>
      </div>

      <Band labelledBy="covers">
        <BandTitle id="covers">What the check covers</BandTitle>
        <ul className="mt-6 grid gap-px sm:grid-cols-2 sm:gap-x-10">
          {covers.map((c) => (
            <li key={c} className="flex gap-3 border-t border-line py-3">
              <CheckIcon aria-hidden size={18} weight="bold" className="mt-1 shrink-0 text-accent-text" />
              <span className="text-[0.9375rem]">{c}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[60ch] border border-muted p-4 text-[0.9375rem]">
          <span className="font-medium">What you get back. </span>
          <span className="text-muted">{brand.promises.checkDelivery}</span>
        </p>
      </Band>

      <Band labelledBy="check-form">
        <BandTitle id="check-form">Ask for the check</BandTitle>
        <div className="mt-8 max-w-[40rem]">
          <BookingFlow type="check" options={[]} index={matchIndex} initial={{ service: "", guide: "", url: "" }} />
        </div>
        <p className="mt-8 text-[0.9375rem] text-muted">
          Questions first? <ChatButton location="free-site-check" className="btn-secondary ml-2" />
        </p>
      </Band>
    </article>
  );
}
