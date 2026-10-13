import type { Metadata } from "next";
import Link from "next/link";
import { ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Band, Breadcrumbs } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { routes, serviceIds } from "@/config/routes";
import { serviceForOldSlug } from "@/config/redirects";
import { getGuide, matchIndex, services } from "@/content";
import { BookingFlow } from "./BookingFlow";
import { type RequestType } from "./booking-schema";

export const metadata: Metadata = {
  title: "Contact and Emergency Ticket",
  description: "Book a WordPress fix, ask for a project quote, or chat with an engineer. Tell us what is wrong and which site it is on.",
  alternates: { canonical: routes.contact },
  openGraph: { title: "Contact and Emergency Ticket", url: routes.contact, type: "website" },
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

// Two tabs, built as real links rather than a JS tablist: each is a shareable URL, each renders on
// the server, and switching never loses the other tab's draft (both sit in sessionStorage by type).
const TABS = [
  { type: "fix" as const, href: routes.book(), label: "Emergency ticket" },
  { type: "project" as const, href: routes.quote(), label: "Project enquiry" },
];

/** Hosts the booking flow. Reads routes.book() / routes.quote() params: service, guide, url, type. */
export default async function Contact({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const type: RequestType = one(sp.type) === "project" ? "project" : "fix";
  // `problem` is the foundation-era param on shared /app?problem=<old-slug> links.
  const requested = one(sp.service) || serviceForOldSlug(one(sp.problem)) || "";
  const service = serviceIds.includes(requested) ? requested : "";
  const guide = getGuide(one(sp.guide))?.slug ?? "";
  const url = one(sp.url).slice(0, 300);
  const options = services
    .filter((s) => (type === "project" ? s.intent !== "fix" : s.intent === "fix"))
    .map((s) => ({ id: s.id, title: s.title }));

  return (
    <article>
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-10">
        <Breadcrumbs items={nodeCrumbs(routes.contact)} />
        <h1 className="mt-8 max-w-[20ch] text-[clamp(2rem,4.2vw,3.25rem)]">
          {type === "project" ? "Tell us what you want built." : "Tell us what is broken."}
        </h1>

        <nav aria-label="Request type" className="mt-8">
          <ul className="flex flex-wrap">
            {TABS.map((t) => (
              <li key={t.type}>
                <Link
                  href={t.href}
                  aria-current={t.type === type ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center border px-5 text-[0.9375rem] font-medium transition-colors duration-200 ${
                    t.type === type
                      ? "border-text bg-text text-bg"
                      : "border-muted text-muted hover:border-text hover:text-text"
                  }`}
                >
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <Band>
        <div className="max-w-[44rem]">
          <BookingFlow type={type} options={options} index={matchIndex} initial={{ service, guide, url }} />
        </div>
      </Band>

      <Band>
        <p className="text-[0.9375rem] text-muted">
          Rather talk first? <ChatButton location="contact" service={service || undefined} className="btn-secondary ml-2" />
        </p>
        <p className="mt-6 text-[0.9375rem] text-muted">
          Or email {brand.email.includes("{{") ? brand.email : <a href={`mailto:${brand.email}`} className="border-b border-muted hover:text-text">{brand.email}</a>}
        </p>
      </Band>
    </article>
  );
}
