import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "memory-exhausted-error",
  category: "errors",
  title: "WordPress memory exhausted error",
  h1: "Fix the WordPress memory exhausted error",
  symptoms: [
    "A page shows \"Fatal error: Allowed memory size of 268435456 bytes exhausted (tried to allocate 20480 bytes)\"",
    "Only some pages fail, such as large product lists, reports or the media library, while others load",
    "Imports, exports, backups or bulk edits stop partway through",
    "The error appears together with \"There has been a critical error on this website.\"",
  ],
  likelyCauses: [
    "WP_MEMORY_LIMIT or the host's PHP memory_limit set lower than the site now needs",
    "A plugin with a memory leak or a loop that keeps loading data until memory runs out",
    "Heavy operations such as large imports, WooCommerce reports or image processing",
    "Too many plugins loading large amounts of data on every request",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Find which request and which plugin or theme function is using the memory, using the error log and memory profiling." },
    { verb: "Back up", detail: "Copy files and database before changing wp-config.php or any plugin." },
    { verb: "Repair", detail: "Fix or replace the code that uses too much memory, and set WP_MEMORY_LIMIT to a sensible value within what your host allows." },
    { verb: "Verify", detail: "Rerun the pages and tasks that failed, such as imports or reports, and confirm they finish." },
    { verb: "Harden", detail: "Tell you which plugin was responsible and whether your hosting plan has enough memory for how the site is used." },
  ],
  safeChecks: [
    "Look in your host's control panel under PHP settings and note the current memory_limit value. Do not change it yet, just record it.",
    "Write down exactly which page or action triggers the error. If it only happens on one task, that narrows the cause a lot.",
  ],
  urgency: "high",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Should I just raise the memory limit?", a: "Raising it can get you running again, but if a plugin is leaking memory it will eventually use up the new limit too. We raise it where appropriate and fix the cause." },
    { q: "What does the number in the error mean?", a: "It is the memory limit in bytes. For example 268435456 bytes is 256 MB. The second number is how much more PHP tried to use when it hit the limit." },
    { q: "I raised WP_MEMORY_LIMIT and nothing changed. Why?", a: "WordPress cannot go above the PHP memory_limit your host sets. If the host caps it lower, the setting in wp-config.php has no effect until the server limit is changed." },
    { q: "Does this mean I need a bigger hosting plan?", a: "Not always. Often a single plugin is the problem. We tell you honestly if the site has outgrown its plan once the faulty code is ruled out." },
  ],
  relatedSlugs: ["php-fatal-error", "white-screen-of-death", "high-server-load", "plugin-conflict"],
  seo: {
    title: "Fix WordPress Memory Exhausted Error | FixMyWP",
    description: "Getting \"Allowed memory size exhausted\" in WordPress? We find the plugin or task using the memory, fix it and set safe limits for your host.",
  },
  image: { slot: "illustration-memory-exhausted-error", alt: "A memory gauge filled to the top next to a WordPress error message" },
});
