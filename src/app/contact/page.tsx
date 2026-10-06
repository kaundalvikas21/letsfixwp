import type { Metadata } from "next";
import { ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { serviceForOldSlug } from "@/config/redirects";
import { CTA } from "@/config/cta";
import { routes, serviceIds } from "@/config/routes";
import { getGuide, services } from "@/content";
import { BookingFlow } from "./BookingFlow";
import { type RequestType } from "./booking-schema";

export const metadata: Metadata = {
  title: "Contact and Emergency Ticket",
  description: "Book a WordPress fix, ask for a project quote, or chat with an engineer. Tell us what is wrong and which site it is on.",
  alternates: { canonical: routes.contact },
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

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
    <>
      <Breadcrumbs items={nodeCrumbs(routes.contact)} />
      <h1>{type === "project" ? CTA.QUOTE : "Contact and emergency ticket"}</h1>
      <p>
        Rather talk first? <ChatButton location="contact" service={service || undefined} />
      </p>
      <BookingFlow type={type} options={options} initial={{ service, guide, url }} />
      <p>
        Email: <a href={`mailto:${brand.email}`}>{brand.email}</a>
      </p>
    </>
  );
}
