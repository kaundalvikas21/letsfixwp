import Link from "next/link";
import { ChatButton, CheckLink } from "@/components/Cta";
import { brand } from "@/config/brand";
import { nodes, routes } from "@/config/routes";

// Footer = every SITEMAP node (including inNav: false ones) plus the utility routes.
const top = nodes.filter((n) => n.parentPath === routes.home);
const childrenOf = (path: string) => nodes.filter((n) => n.parentPath === path);

export function SiteFooter() {
  const facts = brand.legacy.facts;
  return (
    // Bottom padding under md clears the fixed mobile action bar.
    <footer className="pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      <nav aria-label="Footer">
        {top
          .filter((n) => n.kind === "hub")
          .map((hub) => (
            <section key={hub.path} aria-labelledby={`f-${hub.path}`}>
              <h2 id={`f-${hub.path}`}>
                <Link href={hub.path}>{hub.title}</Link>
              </h2>
              <ul>
                {childrenOf(hub.path).map((n) => (
                  <li key={n.path}>
                    <Link href={n.path}>{n.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        <ul>
          {top
            .filter((n) => n.kind !== "hub")
            .map((n) => (
              <li key={n.path}>
                <Link href={n.path}>{n.title}</Link>
              </li>
            ))}
          <li>
            <Link href={routes.legal.terms}>Terms of Service</Link>
          </li>
          <li>
            <Link href={routes.legal.privacy}>Privacy Policy</Link>
          </li>
          {facts && (
            <li>
              <Link href={routes.legal.guarantee}>{facts.guaranteeDays}-day guarantee</Link>
            </li>
          )}
        </ul>
      </nav>
      <p>
        <ChatButton location="footer" /> <CheckLink location="footer" />
      </p>
      <address>
        <a href={`mailto:${brand.email}`}>{brand.email}</a>
        {facts && (
          <>
            <br />
            {facts.address.street}, {facts.address.locality} {facts.address.region} {facts.address.postalCode}
            <br />
            Hours: {facts.hours}
          </>
        )}
      </address>
      <p>This website is not affiliated with or sponsored by Automattic or the WordPress Open Source project</p>
    </footer>
  );
}
