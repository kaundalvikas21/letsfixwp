import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "posts-returning-404",
  title: "WordPress posts returning 404",
  h1: "Fix WordPress posts and pages returning 404",
  symptoms: [
    "The home page loads but every post or page shows \"Page not found\" or \"404 Not Found\"",
    "Links worked yesterday and broke after a migration, permalink change or server move",
    "Posts load with ?p=123 style links but not with their pretty permalinks",
    "Only one post type fails, such as products, portfolio items or events",
  ],
  likelyCauses: [
    "Missing or overwritten WordPress rewrite rules in .htaccess",
    "mod_rewrite disabled on Apache, or Nginx missing the try_files rule WordPress needs",
    "Stored rewrite rules out of date after a plugin added or removed a custom post type",
    "A migration that changed the site path or left the old URL in the database",
    "A slug that clashes with another page, category or plugin route",
  ],
  safeChecks: [
    "Go to Settings > Permalinks and click Save Changes without changing anything. This rebuilds WordPress rewrite rules and often fixes the 404s.",
    "Check whether the home page and wp-admin still load. If they do, your content is safe and the problem is with how links are routed.",
  ],
  whenToCallUs:
    "If saving permalinks does not bring the posts back, the problem is in the server configuration, .htaccess or Nginx rules rather than in WordPress settings. Editing those by trial and error can take the whole site down with a 500 error. That is where an engineer should take over.",
  parentService: "site-recovery",
  urgency: "high",
  faqs: [
    { q: "Have my posts been deleted?", a: "Almost certainly not. If you can see the posts listed in wp-admin, they are in the database. The 404 means WordPress is not receiving or matching the request for them." },
    { q: "Why did saving permalinks not fix it?", a: "Saving permalinks rebuilds WordPress's rules, but if the server ignores .htaccess, mod_rewrite is off or Nginx is missing its rule, the request never reaches WordPress. That needs a server side fix." },
    { q: "Will this hurt my Google rankings?", a: "If pages return 404 for long, search engines may start dropping them. Fixing the routing quickly and checking old URLs still resolve protects existing rankings." },
    { q: "Only my WooCommerce products are 404. Why?", a: "Product URLs depend on the shop and product base settings and on WooCommerce registering its rules. A clash with a page slug or a stale rule set is the usual cause." },
  ],
  seo: {
    title: "Fix WordPress Posts Returning 404",
    description: "Home page works but posts show 404 Not Found? We repair WordPress rewrite rules and server config so every post, page and product loads again.",
  },
  image: { slot: "illustration-posts-returning-404", alt: "A list of blog post links, each leading to a 404 page not found screen" },
});
