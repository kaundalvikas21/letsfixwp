import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "migration-failed",
  title: "WordPress migration failed",
  h1: "Fix a failed WordPress migration",
  symptoms: [
    "The new host shows \"Error establishing a database connection\"",
    "The site loads but keeps redirecting to the old domain or a staging URL",
    "Images are missing, links point to the old address or pages load without styling",
    "The migration plugin stopped partway through or reported that the import failed",
    "The home page works, but every other page returns a 404",
  ],
  likelyCauses: [
    "Database name, user, password, host or table prefix in wp-config.php not matching the new server",
    "Old URLs left in the database, or a plain find and replace that broke serialized settings and widgets",
    "An incomplete transfer caused by upload size limits or timeouts on large sites",
    "Missing .htaccess or server rewrite rules, or a different PHP version and extensions on the new host",
    "DNS pointing some visitors to the old server and some to the new one",
  ],
  safeChecks: [
    "Do not cancel your old hosting yet. Leave the original site where it is until the new one is confirmed working.",
    "Write down which migration tool you used, what DNS changes were made and roughly when. It speeds up the diagnosis.",
  ],
  whenToCallUs:
    "If the site is broken on the new host and the migration tool's log does not explain why, stop re-running the import or editing the database by hand. A plain find and replace on URLs can break serialized settings in ways that are hard to reverse. Keep the old site untouched and let an engineer finish the move from the original copy.",
  parentService: "site-recovery",
  urgency: "critical",
  faqs: [
    { q: "Is my site lost?", a: "Rarely. As long as the old host or a full backup still has the original files and database, the site can be moved again correctly." },
    { q: "Why does the site keep redirecting to the old domain?", a: "WordPress stores its address in the database, and many plugins and builders store full URLs too. Those all need updating in a way that does not break serialized data." },
    { q: "Can I point DNS back to the old host?", a: "If the old site is still intact, yes. That brings the site back while the migration is fixed. Bear in mind that DNS changes take time to reach every visitor." },
    { q: "Will orders or posts made during the move be lost?", a: "Anything created on the old site after the copy was taken is not in the new one. We check for that gap and bring the newer records across before switching over." },
  ],
  seo: {
    title: "WordPress Migration Failed? We Fix It",
    description: "Site broken after moving host or domain? We repair database settings, URLs, redirects and missing files so your migrated WordPress site works.",
  },
  image: { slot: "illustration-migration-failed", alt: "Two servers with a broken arrow between them and files spilling out of a moving box" },
});
