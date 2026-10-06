import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "migration-failed",
  category: "recovery",
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
  ourFix: [
    { verb: "Diagnose", detail: "Compare the old and new copies, check wp-config.php, the database and DNS and find where the move went wrong." },
    { verb: "Back up", detail: "Save both the source site and the broken copy before changing either, so neither is lost." },
    { verb: "Restore", detail: "Complete the transfer from the source copy, correct the configuration and run a serialization safe URL replacement with WP-CLI." },
    { verb: "Verify", detail: "Check pages, images, forms, logins, SSL and checkout on the new server before DNS is finalized." },
    { verb: "Harden", detail: "Confirm DNS and SSL are settled, remove leftover staging copies and tell you when it is safe to cancel the old hosting." },
  ],
  safeChecks: [
    "Do not cancel your old hosting yet. Leave the original site where it is until the new one is confirmed working.",
    "Write down which migration tool you used, what DNS changes were made and roughly when. It speeds up the diagnosis.",
  ],
  urgency: "critical",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Is my site lost?", a: "Rarely. As long as the old host or a full backup still has the original files and database, the site can be moved again correctly." },
    { q: "Why does the site keep redirecting to the old domain?", a: "WordPress stores its address in the database, and many plugins and builders store full URLs too. Those all need updating in a way that does not break serialized data." },
    { q: "Can I point DNS back to the old host?", a: "If the old site is still intact, yes. That brings the site back while the migration is fixed. Bear in mind that DNS changes take time to reach every visitor." },
    { q: "Will orders or posts made during the move be lost?", a: "Anything created on the old site after the copy was taken is not in the new one. We check for that gap and bring the newer records across before switching over." },
  ],
  relatedSlugs: ["error-establishing-database-connection", "too-many-redirects", "restore-from-backup", "posts-returning-404"],
  seo: {
    title: "WordPress Migration Failed? We Fix It | FixMyWP",
    description: "Site broken after moving host or domain? We repair database settings, URLs, redirects and missing files so your migrated WordPress site works.",
  },
  image: { slot: "illustration-migration-failed", alt: "Two servers with a broken arrow between them and files spilling out of a moving box" },
});
