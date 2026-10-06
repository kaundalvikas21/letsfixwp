import type { Metadata } from "next";
import { ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/templates/parts";
import { routes } from "@/config/routes";
import { BookingFlow } from "../contact/BookingFlow";

export const metadata: Metadata = {
  title: "Free WordPress Site Check",
  description: "Not an emergency? Ask for a free check of your WordPress site: updates, backups, security basics and speed.",
  alternates: { canonical: routes.check },
};

export default function FreeSiteCheck() {
  return (
    <>
      <Breadcrumbs items={nodeCrumbs(routes.check)} />
      <h1>Free WordPress site check</h1>
      <p>For sites that work today. Tell us the address and an engineer looks at updates, backups, security basics and speed.</p>
      <ul>
        <li>WordPress core, plugin and theme versions</li>
        <li>Whether backups exist and where they are stored</li>
        <li>Security basics: admin accounts, file permissions, known vulnerable plugins</li>
        <li>Page speed and Core Web Vitals</li>
      </ul>
      <BookingFlow type="check" options={[]} initial={{ service: "", guide: "", url: "" }} />
      <p>
        Questions first? <ChatButton location="free-site-check" />
      </p>
    </>
  );
}
