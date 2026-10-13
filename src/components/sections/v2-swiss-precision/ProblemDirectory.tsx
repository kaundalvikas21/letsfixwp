import { ProblemDirectoryList, type Category } from "./ProblemDirectoryList";
import { hubNodes, routes } from "@/config/routes";
import { guides, services } from "@/content";

// Layout family: grouped directory columns, three at lg, two at md, disclosure items below 768px.
// Categories are SITEMAP hubs (contract rule 16: problem categories = SITEMAP hubs, and
// /fix?category= resolves to the matching hub). Counts come from the content, never from a guess.

// Display names only. The SITEMAP titles are the page titles and stay as they are; these are the
// short forms a column heading and an "All ... problems" link can carry. Falls back to the title.
const SHORT: Record<string, string> = {
  "wordpress-fix": "Errors and outages",
  "wordpress-security": "Security",
  "wordpress-performance-migration": "Performance",
  woocommerce: "WooCommerce",
};

const ALL_LABEL: Record<string, string> = {
  "wordpress-fix": "All error and outage problems",
  "wordpress-security": "All security problems",
  "wordpress-performance-migration": "All performance problems",
  woocommerce: "All WooCommerce problems",
};

const hubOfService = new Map(services.map((s) => [s.id, s.hub]));

const categories: Category[] = hubNodes
  .map((hub) => {
    const id = hub.path.split("/").filter(Boolean).at(-1)!;
    const problems = guides
      .filter((g) => hubOfService.get(g.parentService) === id)
      .map((g) => ({
        slug: g.slug,
        title: g.title,
        href: routes.guide(g.slug),
        critical: g.urgency === "critical",
        search: `${g.title} ${g.errorText ?? ""}`.toLowerCase(),
      }));
    return {
      id,
      name: SHORT[id] ?? hub.title,
      hubHref: routes.hub(id),
      allLabel: ALL_LABEL[id] ?? `All ${SHORT[id] ?? hub.title} problems`,
      count: problems.length,
      problems,
    };
  })
  // A hub with no guides is not a problem category. Render nothing for it (contract rule 8).
  .filter((c) => c.count > 0);

export function ProblemDirectory() {
  return (
    <section aria-labelledby="problems" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-24">
        <p className="text-xs font-medium tracking-[0.06em] text-muted uppercase">Problems we fix</p>
        <h2 id="problems" className="mt-3 max-w-[20ch] text-[clamp(1.75rem,3vw,2.5rem)]">
          Every WordPress emergency, in one place.
        </h2>
        <ProblemDirectoryList categories={categories} />
      </div>
    </section>
  );
}
