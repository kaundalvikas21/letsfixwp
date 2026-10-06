import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "site-recovery",
  path: "/wordpress-fix/site-recovery/",
  hub: "wordpress-fix",
  intent: "fix",
  title: "WordPress site recovery",
  h1: "Recover a broken WordPress site after a failed migration or restore",
  summary:
    "A migration that went wrong, a restore that stopped halfway or posts that suddenly return 404 can leave a site half working. We rebuild it from what you have, fix URLs and permalinks, and check the content is complete.",
  whoItsFor:
    "Owners whose site broke during a move to a new host or domain, whose backup restore failed, or whose posts and pages stopped loading.",
  symptoms: [
    "The site broke after moving to a new host or domain",
    "Images are missing or links still point to the old domain",
    "A backup restore failed or finished with errors",
    "The home page works but every post or page returns a 404 error",
    "You have backup files but no working site",
  ],
  whatWeDo: [
    { verb: "Assess", detail: "Inventory what exists on the server and in your backups, and find where the migration or restore stopped." },
    { verb: "Back up", detail: "Preserve the current state first, so nothing that survived is overwritten." },
    { verb: "Restore", detail: "Rebuild files and database from the best copies available and replace old URLs with a search and replace that handles serialised data." },
    { verb: "Repair", detail: "Fix permalinks, rewrite rules, file permissions and broken media paths." },
    { verb: "Verify", detail: "Check posts, pages, media, users and orders against the backup, and test forms and checkout." },
  ],
  deliverables: [
    "A working site on the right host and domain",
    "Backups taken before and after the recovery",
    "Permalinks and media loading correctly",
    "A written note of what was recovered and anything that could not be",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Can you recover a site with no backup?", a: "Sometimes. Your host may keep its own backups, and files or the database may still be on the old server. We check every source, then tell you plainly what can and cannot be recovered." },
    { q: "Why do my posts return 404 after a migration?", a: "WordPress relies on server rewrite rules for pretty permalinks. If .htaccess did not come across, or the new server uses Nginx without matching rules, every URL except the home page fails. Saving Settings, Permalinks in wp-admin often regenerates the rules on Apache." },
    { q: "Why not just find and replace the domain in the SQL file?", a: "WordPress stores many settings as serialised PHP data that records the length of each text value. Changing the text without updating the length corrupts those settings, which breaks widgets, theme options and builder layouts. WP-CLI search-replace handles this correctly." },
    { q: "Which backup files do you need?", a: "Ideally both a copy of wp-content and a database export, usually a .sql file. Backups made by plugins such as UpdraftPlus or All-in-One WP Migration also work." },
  ],
  guideSlugs: ["migration-failed", "restore-from-backup", "posts-returning-404"],
  relatedPaths: ["/wordpress-maintenance/care-plans/", "/wordpress-performance-migration/hosting-migration/", "/guides/migration-failed/", "/guides/posts-returning-404/"],
  seo: {
    title: "WordPress Site Recovery After Migration or Restore",
    description: "Site broken after a failed migration or restore, or posts returning 404? We rebuild it from your backups, fix URLs and permalinks, and check your content.",
  },
  image: { slot: "service-site-recovery", alt: "A server file manager showing a WordPress backup archive and database export ready to restore" },
});
