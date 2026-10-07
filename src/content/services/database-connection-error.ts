import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "database-connection-error",
  path: "/wordpress-fix/database-connection-error/",
  hub: "wordpress-fix",
  intent: "fix",
  title: "Error establishing a database connection fix",
  h1: "Fix \"Error establishing a database connection\" in WordPress",
  heroLine: "WordPress cannot reach its database. We find out whether it is credentials, the server or damaged tables, and fix it.",
  summary:
    "This error means WordPress cannot reach its MySQL or MariaDB database, because of wrong credentials, a database server that is down or overloaded, or corrupted tables. We find which one it is, fix it and check your data is intact.",
  whoItsFor:
    "Owners whose whole site, including wp-admin, has been replaced by the database connection error, or who see it come and go during busy periods.",
  symptoms: [
    "\"Error establishing a database connection\" on every page",
    "wp-admin shows \"One or more database tables are unavailable. The database may need to be repaired.\"",
    "The error appears and disappears, often when traffic is high",
    "It started after a migration, a host change or a database password change",
  ],
  whatWeDo: [
    { verb: "Diagnose", detail: "Check DB_NAME, DB_USER, DB_PASSWORD and DB_HOST in wp-config.php against the host, and test whether the database server is up and accepting connections." },
    { verb: "Back up", detail: "Export the database and copy the files as soon as the database can be reached, before any repair." },
    { verb: "Repair", detail: "Correct the credentials, repair crashed tables, or work with your host when the database server itself is down or out of connections." },
    { verb: "Verify", detail: "Confirm posts, pages, users and orders are present and that the front end and wp-admin both load." },
    { verb: "Report", detail: "Explain the cause and whether traffic, connection limits or the host plan make it likely to happen again." },
  ],
  deliverables: [
    "The site reconnected to its database and loading again",
    "A fresh database export and file backup",
    "Any crashed tables repaired and checked",
    "A written note of the cause and what would stop it recurring",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Is my content gone?", a: "Usually not. The error means WordPress cannot reach the database, not that the data was deleted. In most cases the tables are still there and become reachable once the connection is fixed." },
    { q: "Why does the error come and go?", a: "Shared hosting plans often cap how many database connections a site can open at once. During traffic spikes or bot crawls the cap is reached and new visitors get the error until connections free up." },
    { q: "Should I use WP_ALLOW_REPAIR?", a: "Adding define('WP_ALLOW_REPAIR', true) to wp-config.php enables a repair page at /wp-admin/maint/repair.php. It can fix crashed tables, but anyone can open that page while the line is there, so remove it as soon as the repair is done." },
    { q: "Is this my host's fault?", a: "Sometimes. If the credentials are correct and the database server does not respond, the problem is on the host's side. We collect the evidence so your host can act on it." },
  ],
  guideSlugs: ["error-establishing-database-connection"],
  relatedPaths: ["/wordpress-maintenance/care-plans/", "/wordpress-fix/server-errors/", "/guides/error-establishing-database-connection/"],
  seo: {
    title: "Fix Error Establishing a Database Connection",
    description: "WordPress showing \"Error establishing a database connection\"? We fix credentials, crashed tables or host limits and check your posts and orders are intact.",
  },
  image: { slot: "service-database-connection-error", alt: "A browser showing the WordPress message \"Error establishing a database connection\"" },
});
