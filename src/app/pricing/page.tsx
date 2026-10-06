import type { Metadata } from "next";
import Link from "next/link";
import { BookLink, ChatButton, CheckLink, PlansLink } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/templates/parts";
import { hubNodes, routes } from "@/config/routes";
import { services } from "@/content";

export const metadata: Metadata = {
  title: "Pricing",
  description: "WordPress fixes, care plans and projects. Each service shows its starting price once published.",
  alternates: { canonical: routes.pricing },
};

export default function Pricing() {
  return (
    <>
      <Breadcrumbs items={nodeCrumbs(routes.pricing)} />
      <h1>Pricing</h1>
      {hubNodes.map((hub) => {
        const list = services.filter((s) => s.path.startsWith(hub.path));
        return (
          <section key={hub.path} aria-labelledby={`p-${hub.path}`}>
            <h2 id={`p-${hub.path}`}>{hub.title}</h2>
            <ul>
              {list.map((s) => (
                <li key={s.id}>
                  <Link href={s.path}>{s.title}</Link>
                  {s.priceFrom && <>: from {s.priceFrom}</>}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <p>
        <BookLink location="pricing" /> <ChatButton location="pricing" /> <PlansLink location="pricing" />{" "}
        <CheckLink location="pricing" />
      </p>
    </>
  );
}
