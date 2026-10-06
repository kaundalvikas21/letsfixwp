import type { Metadata } from "next";
import { BookLink, ChatButton } from "@/components/Cta";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "WordPress Maintenance Services and Hosting",
  description: `WordPress hosting and maintenance plan from FixMyWP. Includes one free fix (${site.plan.freeFixValue} value) and a ${site.guaranteeDays}-day guarantee on services.`,
  alternates: { canonical: "/wordpress-maintenance-services" },
};

export default function MaintenanceServices() {
  return (
    <>
      <h1>WordPress maintenance services</h1>
      <p>Keep the site that just broke from breaking again.</p>

      <section aria-labelledby="plan">
        <h2 id="plan">{site.plan.name}</h2>
        <ul>
          <li>One free fix included ({site.plan.freeFixValue} value)</li>
          <li>{site.guaranteeDays}-day guarantee on services</li>
        </ul>
        <p>
          Ask an engineer which plan fits your site. <ChatButton location="plans" />
        </p>
      </section>

      <section aria-labelledby="broken-now">
        <h2 id="broken-now">Broken right now?</h2>
        <p>Fix it first, then decide on a plan.</p>
        <p>
          <BookLink location="plans:broken-now" />
        </p>
      </section>
    </>
  );
}
