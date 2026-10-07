import { hubSchema } from "./schema";

export const hubsList = [
  hubSchema.parse({
    id: "wordpress-fix",
    intro:
      "Repairs for WordPress sites that are down, throwing errors or partly broken, from the critical error message and white screens to login loops and failed updates. For owners who need the site working again with the cause fixed, not hidden.",
    seo: {
      title: "WordPress Fixes and Error Repair",
      description: "Site down, critical error, white screen, database or 500 errors, login loops or a broken update? We find the cause in the logs and fix it.",
    },
  }),
  hubSchema.parse({
    id: "wordpress-security",
    intro:
      "Help for WordPress sites that have been hacked, flagged by Google or filled with spam pages, plus audits that close weak points before an attack. For owners dealing with an infection now and those who want to avoid one.",
    seo: {
      title: "WordPress Security: Hack Cleanup and Hardening",
      description: "Hacked WordPress site, Google warning or Japanese spam pages? We clean the infection, close the entry point and harden the site against the next attempt.",
    },
  }),
  hubSchema.parse({
    id: "wordpress-maintenance",
    intro:
      "Ongoing care for WordPress and WooCommerce sites: updates, backups, monitoring and fixes, on a monthly plan or as pay-as-you-go hours. For businesses that rely on their site, and agencies that want support under their own name.",
    seo: {
      title: "WordPress Maintenance and Care Plans",
      description: "Monthly WordPress care plans, WooCommerce maintenance, pay-as-you-go support hours and white-label help for agencies, covering updates and backups.",
    },
  }),
  hubSchema.parse({
    id: "wordpress-performance-migration",
    intro:
      "Work that makes a WordPress site faster or moves it somewhere new: Core Web Vitals fixes, host and server moves, and migrations from Wix, Squarespace or Blogger. For owners whose site is slow or who have outgrown their hosting or platform.",
    seo: {
      title: "WordPress Speed Optimization and Migration",
      description: "Speed up a slow WordPress site, pass Core Web Vitals, move to a new host, or switch from Wix, Squarespace or Blogger to WordPress with redirects in place.",
    },
  }),
  hubSchema.parse({
    id: "wordpress-development",
    intro:
      "New WordPress websites, redesigns, custom themes and plugins, technical SEO and dedicated developers. For businesses that need a site built or rebuilt properly, and teams with a steady flow of WordPress work and no spare developer time.",
    seo: {
      title: "WordPress Development and Website Design",
      description: "WordPress website design, redesigns, custom themes and plugins, SEO and dedicated developers for businesses across India, built so your team can edit it.",
    },
  }),
  hubSchema.parse({
    id: "woocommerce",
    intro:
      "Building, fixing and moving WooCommerce stores, including Indian payment gateways, GST invoices and migrations from Shopify. For businesses selling online in India, from new stores to established ones losing sales to a broken checkout.",
    seo: {
      title: "WooCommerce Development, Fixes and Migration",
      description: "WooCommerce stores built and fixed for India: Razorpay, PayU and UPI payments, GST invoices, checkout repairs and Shopify to WooCommerce migration.",
    },
  }),
];
