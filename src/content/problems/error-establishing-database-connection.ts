import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "error-establishing-database-connection",
  category: "down",
  title: "Error establishing a database connection",
  h1: "Fix \"Error establishing a database connection\" in WordPress",
  symptoms: [
    "Every page shows only the line \"Error establishing a database connection\"",
    "wp-admin shows \"One or more database tables are unavailable. The database may need to be repaired.\"",
    "The site works for a while, then the error comes back at busy times",
    "The error started right after moving hosts or changing the database password",
  ],
  likelyCauses: [
    "Wrong DB_NAME, DB_USER, DB_PASSWORD or DB_HOST values in wp-config.php",
    "The MySQL or MariaDB server is down, restarting or refusing new connections",
    "Corrupted database tables, often after a crash or a full disk",
    "The database user lost its privileges or was removed in the hosting panel",
    "The hosting account hit its database connection or resource limits",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Test the credentials in wp-config.php against the database server and check whether the server, the user or the tables are the problem." },
    { verb: "Back up", detail: "Export the database and copy the files before any repair, so nothing can be made worse." },
    { verb: "Repair", detail: "Correct the connection details, restore user privileges or repair damaged tables, then remove any temporary repair settings." },
    { verb: "Verify", detail: "Check the front end, wp-admin, logins and forms, and confirm recent posts and orders are all present." },
    { verb: "Harden", detail: "Find what caused the drop, such as a full disk or connection limit, and tell you exactly what needs to change with your host." },
  ],
  safeChecks: [
    "Check your host's status page or support channel for a database or MySQL outage. If the server itself is down, only the host can bring it back.",
    "Log in to your hosting control panel and open phpMyAdmin or the database section. Confirm your WordPress database is listed, without changing anything inside it.",
  ],
  urgency: "critical",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Has my content been deleted?", a: "Almost always no. This error means WordPress cannot reach the database, not that the database is empty. Once the connection works, the content is there." },
    { q: "Does this mean I was hacked?", a: "Usually not. Wrong credentials, a struggling database server or damaged tables are far more common. If credentials changed and nobody on your side changed them, we check for a compromise too." },
    { q: "Why did it start after moving my site?", a: "The new host has its own database name, user, password and host address. If wp-config.php still has the old values, or the import was incomplete, WordPress cannot connect." },
    { q: "Can my host fix this?", a: "If their database server is down, yes, and they should. If the server is fine and WordPress still cannot connect, the cause is in your site's configuration or tables, which is where we come in." },
    { q: "Why does it only happen sometimes?", a: "An intermittent error usually means the database server runs out of connections or memory under load. Slow queries or heavy bot traffic are common triggers." },
  ],
  relatedSlugs: ["migration-failed", "500-internal-server-error", "high-server-load", "restore-from-backup"],
  seo: {
    title: "Fix Error Establishing a Database Connection | FixMyWP",
    description: "WordPress showing \"Error establishing a database connection\"? We check credentials, the database server and damaged tables, then get your site back online.",
  },
  image: { slot: "screen-db-connection-error", alt: "A browser showing the WordPress message: Error establishing a database connection" },
});
