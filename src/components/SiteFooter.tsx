import Link from "next/link";
import { ChatButton, PlansLink } from "@/components/Cta";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer>
      <address>
        <strong>{site.name}</strong>
        <br />
        {site.address.street}
        <br />
        {site.address.locality} {site.address.region} {site.address.postalCode}
        <br />
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <br />
        Hours: {site.hours}
      </address>
      <p>
        <ChatButton location="footer" /> <PlansLink />
      </p>
      <nav aria-label="Footer">
        <ul>
          <li>
            <Link href="/fix">All WordPress problems</Link>
          </li>
          <li>
            <Link href="/wordpress-maintenance-services">WordPress maintenance services</Link>
          </li>
          <li>
            <Link href="/legal/terms">Terms of Service</Link>
          </li>
          <li>
            <Link href="/legal/privacy">Privacy Policy</Link>
          </li>
          <li>
            <Link href="/legal/guarantee">{site.guaranteeDays}-day guarantee</Link>
          </li>
        </ul>
      </nav>
      <p>This website is not affiliated with or sponsored by Automattic or the WordPress Open Source project</p>
    </footer>
  );
}
