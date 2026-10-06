import { compareSchema } from "../schema";

export default compareSchema.parse({
  slug: "wordpress-vs-wix",
  a: "WordPress",
  b: "Wix",
  rows: [
    {
      criterion: "Ownership and hosting",
      a: "Self-hosted WordPress is open-source software installed on hosting you choose. You hold the files and the database.",
      b: "Wix is a hosted platform. Your site runs on Wix's servers under its terms and cannot be moved to another host.",
    },
    {
      criterion: "Cost structure",
      a: "The software is free. You pay for hosting, a domain, and any premium themes, plugins or development work.",
      b: "A subscription that bundles hosting, with higher tiers for ecommerce and extra features, plus paid apps where needed.",
    },
    {
      criterion: "Getting started",
      a: "More setup: hosting, a theme and plugins have to be chosen and configured, by you or someone you hire.",
      b: "A drag-and-drop editor and templates let a non-technical owner publish a basic site without outside help.",
    },
    {
      criterion: "Flexibility and extensions",
      a: "A very large library of plugins and themes, plus full code access for custom features, content types and integrations.",
      b: "Apps from the Wix App Market and Velo for custom code, within the limits of what the platform exposes.",
    },
    {
      criterion: "SEO control",
      a: "Full control of URLs, markup, structured data, redirects, server settings and performance, with plugins such as Yoast or Rank Math.",
      b: "Built-in settings cover titles, descriptions, redirects and structured data for common cases. Server-level settings are managed by Wix.",
    },
    {
      criterion: "Maintenance burden",
      a: "You or a provider handle core, theme and plugin updates, backups and security.",
      b: "Wix handles platform updates, hosting security and uptime. You manage content and app settings.",
    },
    {
      criterion: "Portability",
      a: "The whole site, files and database, can move to any host that runs PHP and MySQL.",
      b: "There is no full site export. Moving away usually means rebuilding the design elsewhere and moving content across, some of it by hand.",
    },
    {
      criterion: "Selling online in India",
      a: "WooCommerce adds a full store, with plugins for Razorpay, PayU, Cashfree, CCAvenue and other Indian gateways.",
      b: "Online selling needs a business plan. Supported payment providers vary by country, so check which Indian options your account offers.",
    },
    {
      criterion: "Regional language sites",
      a: "Plugins such as WPML, Polylang or TranslatePress handle Hindi, Tamil, Gujarati and other languages with separate URLs per language.",
      b: "Wix Multilingual is built in. Check that the specific regional language you need is supported before committing.",
    },
  ],
  verdictByScenario: [
    {
      scenario: "A sole owner wants a simple site and will edit it alone",
      verdict: "Wix is the easier start. Hosting, security and the editor come in one package with little to configure.",
    },
    {
      scenario: "A business site expected to grow in content, SEO and integrations",
      verdict: "WordPress gives more room: full SEO control, custom features and no ceiling set by a platform.",
    },
    {
      scenario: "You want no responsibility for updates or hosting",
      verdict: "Wix handles that by default. WordPress can match it only if someone maintains the site for you under a care plan or managed hosting.",
    },
    {
      scenario: "An Indian store with specific gateway, GST invoice and shipping needs",
      verdict: "WordPress with WooCommerce covers Indian gateways, GST invoice plugins and shipping integrations with more choice.",
    },
    {
      scenario: "You are already on Wix and have outgrown it",
      verdict: "Moving to WordPress makes sense, but plan it as a rebuild with URL redirects so search rankings carry over.",
    },
  ],
  seo: {
    title: "WordPress vs Wix: Which Suits Your Business?",
    description: "WordPress vs Wix compared on ownership, costs, SEO control, maintenance, portability and selling online in India, with verdicts by situation.",
  },
});
