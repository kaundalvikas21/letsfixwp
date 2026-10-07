import type { Metadata } from "next";
import { CtaPair } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { body, CtaBand, h1, h2, pageWrap } from "@/components/sections/v1/page-kit";
import { Breadcrumbs, LinkList } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { primaryCtaFor } from "@/config/cta";
import { hubNodes, nodeByPath, routes } from "@/config/routes";
import { getHub } from "@/content";
import { pageCopy } from "@/content/pages";

export const metadata: Metadata = {
  title: "About",
  description: "WordPress engineers for sites that are down, hacked or slow, plus care plans and development.",
  alternates: { canonical: routes.about },
};

const c = pageCopy.about;

/** Layout family: short statement with a hub index. No invented team, offices or numbers. */
export default function About() {
  return (
    <>
      <div className={pageWrap}>
        <Breadcrumbs items={nodeCrumbs(routes.about)} />
        <div className="mx-auto max-w-[47.5rem]">
          <h1 className={`pt-8 md:pt-12 ${h1}`}>About {brand.name}</h1>
          <div className="mt-8 space-y-5">
            {c.paragraphs.map((p) => (
              <p key={p} className={body}>
                {p}
              </p>
            ))}
          </div>
          <section aria-labelledby="what" className="mt-16">
            <h2 id="what" className={h2}>
              What we do
            </h2>
            <div className="mt-8">
              <LinkList items={hubNodes.map((h) => ({ href: h.path, title: h.title, meta: getHub(h.path.split("/")[1])?.seo.description }))} />
            </div>
          </section>
        </div>
      </div>
      <CtaBand line={c.band}>
        <CtaPair intent={primaryCtaFor(nodeByPath.get(routes.about)?.intent)} location="about:band" />
      </CtaBand>
    </>
  );
}
