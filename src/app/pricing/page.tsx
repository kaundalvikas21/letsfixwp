import type { Metadata } from "next";
import Link from "next/link";
import { ChatButton, CheckLink } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { CtaBand, h1, h2, lead, pageWrap } from "@/components/sections/v1/page-kit";
import { Breadcrumbs } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { hubNodes, routes } from "@/config/routes";
import { services } from "@/content";
import { pageCopy } from "@/content/pages";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Starting prices for WordPress fixes, care plans and projects. Each service shows its price once published.",
  alternates: { canonical: routes.pricing },
};

const symbol = brand.currency === "USD" ? "$" : "₹";
const c = pageCopy.pricing;

/** Layout family: rate tables, one per hub. Prices come only from service content and show {{CONFIRM}} until set. */
export default function Pricing() {
  const anyTurnaround = services.some((s) => s.typicalTurnaround);
  return (
    <>
      <div className={pageWrap}>
        <Breadcrumbs items={nodeCrumbs(routes.pricing)} />
        <header className="pt-8 md:pt-12">
          <h1 className={h1}>{c.h1}</h1>
          <p className={`mt-5 ${lead}`}>{c.intro}</p>
        </header>
        {hubNodes.map((hub) => {
          const list = services.filter((s) => s.path.startsWith(hub.path));
          return (
            <section key={hub.path} aria-labelledby={`p-${hub.path}`} className="mt-16">
              <h2 id={`p-${hub.path}`} className={h2}>
                <Link href={hub.path} className="inline-flex min-h-11 items-center hover:underline">
                  {hub.title}
                </Link>
              </h2>
              <div className="mt-6 overflow-x-auto rounded-card border border-line">
                <table className="w-full min-w-[32rem] border-collapse text-left text-[15px]">
                  <thead className="bg-surface font-mono text-[12px] text-muted">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-normal">Service</th>
                      <th scope="col" className="w-48 px-5 py-3 font-normal">From</th>
                      {anyTurnaround && <th scope="col" className="w-48 px-5 py-3 font-normal">Turnaround</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((s) => (
                      <tr key={s.id} className="border-t border-line">
                        <th scope="row" className="px-5 py-4 font-medium">
                          <Link href={s.path} className="text-text hover:underline">
                            {s.title}
                          </Link>
                        </th>
                        <td className="px-5 py-4 text-text">
                          {s.priceFrom ?? (
                            <>
                              {symbol} <span className="font-mono text-[13px] text-muted">{"{{CONFIRM}}"}</span>
                            </>
                          )}
                        </td>
                        {anyTurnaround && <td className="px-5 py-4 text-muted">{s.typicalTurnaround}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
      <CtaBand line={c.band}>
        <div className="flex flex-wrap justify-center gap-2">
          <ChatButton location="pricing:band" variant="solid" />
          <CheckLink location="pricing:band" />
        </div>
      </CtaBand>
    </>
  );
}
