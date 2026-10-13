import type { Metadata } from "next";
import { routes } from "@/config/routes";
import { Band, Breadcrumbs } from "@/components/templates/parts";
import { nodeCrumbs } from "@/components/JsonLd";
import { Handoff } from "./Handoff";

export const metadata: Metadata = {
  title: "Request ready",
  alternates: { canonical: routes.contactThanks },
  robots: { index: false, follow: false },
};

export default function Thanks() {
  return (
    <article>
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-10">
        <Breadcrumbs items={[...nodeCrumbs(routes.contact), { name: "Request ready", path: routes.contactThanks }]} />
        <h1 className="mt-8 max-w-[20ch] text-[clamp(2rem,4.2vw,3.25rem)]">Request ready.</h1>
      </div>
      <Band>
        <Handoff />
      </Band>
    </article>
  );
}
