// src/config/sitemap.ts
// Information architecture for letsfixwp.com, from "letsfixwp.com Sitemap Hierarchy".
// Routes, nav, footer, breadcrumbs and sitemap.xml are all generated from this tree.
// Trailing slashes everywhere. "Supporting Pages" in the diagram is a grouping only:
// there is no /supporting/ page.

export type NodeKind = "home" | "hub" | "service" | "cityHub" | "city" | "page" | "collection";
export type Intent = "fix" | "plan" | "project" | "info";

export type SiteNode = {
  title: string;
  path: string;
  kind: NodeKind;
  intent?: Intent;   // primary CTA: fix = BOOK, plan = PLANS, project = QUOTE, info = BOOK
  priority?: number; // city build order
  inNav?: boolean;   // false = footer and sitemap.xml only
  children?: SiteNode[];
};

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://letsfixwp.com";

export const SITEMAP: SiteNode = {
  title: "Home", path: "/", kind: "home",
  children: [
    {
      title: "WordPress Fixes & Error Resolution", path: "/wordpress-fix/", kind: "hub", intent: "fix",
      children: [
        { title: "Emergency WordPress Fix (site down)", path: "/wordpress-fix/emergency/", kind: "service", intent: "fix" },
        { title: "Critical & Fatal Error Fix", path: "/wordpress-fix/critical-error/", kind: "service", intent: "fix" },
        { title: "White Screen of Death Fix", path: "/wordpress-fix/white-screen/", kind: "service", intent: "fix" },
        { title: "Database Connection Error Fix", path: "/wordpress-fix/database-connection-error/", kind: "service", intent: "fix" },
        { title: "500 / 502 / 503 Server Error Fix", path: "/wordpress-fix/server-errors/", kind: "service", intent: "fix" },
        { title: "Plugin & Theme Conflict Fix", path: "/wordpress-fix/plugin-theme-conflict/", kind: "service", intent: "fix" },
        { title: "Broken After Update / PHP Upgrade Fix", path: "/wordpress-fix/update-php-errors/", kind: "service", intent: "fix" },
        { title: "Admin Login & Redirect Loop Fix", path: "/wordpress-fix/login-redirect-issues/", kind: "service", intent: "fix" },
        { title: "WordPress Email Not Sending Fix", path: "/wordpress-fix/email-not-sending/", kind: "service", intent: "fix" },
        { title: "Elementor & Page Builder Fix", path: "/wordpress-fix/elementor-issues/", kind: "service", intent: "fix" },
        { title: "Site Recovery & Backup Restore", path: "/wordpress-fix/site-recovery/", kind: "service", intent: "fix" },
      ],
    },
    {
      title: "WordPress Security", path: "/wordpress-security/", kind: "hub", intent: "fix",
      children: [
        { title: "Hacked Site Repair & Malware Removal", path: "/wordpress-security/malware-removal/", kind: "service", intent: "fix" },
        { title: "Google Blacklist Removal", path: "/wordpress-security/blacklist-removal/", kind: "service", intent: "fix" },
        { title: "SEO Spam / Japanese Hack Cleanup", path: "/wordpress-security/seo-spam-cleanup/", kind: "service", intent: "fix" },
        { title: "Security Audit & Hardening", path: "/wordpress-security/audit-hardening/", kind: "service", intent: "project" },
      ],
    },
    {
      title: "WordPress Maintenance & Care Plans", path: "/wordpress-maintenance/", kind: "hub", intent: "plan",
      children: [
        { title: "Care Plans (Basic / Pro / Business)", path: "/wordpress-maintenance/care-plans/", kind: "service", intent: "plan" },
        { title: "WooCommerce Maintenance", path: "/wordpress-maintenance/woocommerce/", kind: "service", intent: "plan" },
        { title: "White-Label Support for Agencies", path: "/wordpress-maintenance/white-label/", kind: "service", intent: "project" },
        { title: "Pay-As-You-Go Support Hours", path: "/wordpress-maintenance/support-hours/", kind: "service", intent: "plan" },
      ],
    },
    {
      title: "Performance & Migration", path: "/wordpress-performance-migration/", kind: "hub", intent: "project",
      children: [
        { title: "Speed & Core Web Vitals Optimization", path: "/wordpress-performance-migration/speed-optimization/", kind: "service", intent: "project" },
        { title: "Hosting / Server Migration", path: "/wordpress-performance-migration/hosting-migration/", kind: "service", intent: "project" },
        { title: "Wix / Squarespace / Blogger to WordPress", path: "/wordpress-performance-migration/platform-migration/", kind: "service", intent: "project" },
      ],
    },
    {
      title: "WordPress Development", path: "/wordpress-development/", kind: "hub", intent: "project",
      children: [
        { title: "WordPress Website Design", path: "/wordpress-development/website-design/", kind: "service", intent: "project" },
        { title: "Custom Theme Development", path: "/wordpress-development/custom-theme/", kind: "service", intent: "project" },
        { title: "Custom Plugin Development", path: "/wordpress-development/custom-plugin/", kind: "service", intent: "project" },
        { title: "Website Redesign", path: "/wordpress-development/redesign/", kind: "service", intent: "project" },
        { title: "Hire Dedicated WordPress Developer", path: "/wordpress-development/hire-developer/", kind: "service", intent: "project" },
        { title: "WordPress SEO Services", path: "/wordpress-development/seo-services/", kind: "service", intent: "project" },
        {
          title: "City Pages (Tier 1)", path: "/wordpress-development/cities/", kind: "cityHub", intent: "project", inNav: false,
          children: [
            { title: "Chennai", path: "/wordpress-development/cities/chennai/", kind: "city", intent: "project", priority: 1 },
            { title: "Delhi NCR", path: "/wordpress-development/cities/delhi-ncr/", kind: "city", intent: "project", priority: 2 },
            { title: "Bengaluru", path: "/wordpress-development/cities/bengaluru/", kind: "city", intent: "project", priority: 3 },
            { title: "Ahmedabad", path: "/wordpress-development/cities/ahmedabad/", kind: "city", intent: "project", priority: 4 },
            { title: "Kolkata", path: "/wordpress-development/cities/kolkata/", kind: "city", intent: "project", priority: 5 },
            { title: "Pune", path: "/wordpress-development/cities/pune/", kind: "city", intent: "project", priority: 6 },
            { title: "Mumbai", path: "/wordpress-development/cities/mumbai/", kind: "city", intent: "project", priority: 7 },
            { title: "Hyderabad", path: "/wordpress-development/cities/hyderabad/", kind: "city", intent: "project", priority: 8 },
          ],
        },
      ],
    },
    {
      title: "WooCommerce", path: "/woocommerce/", kind: "hub", intent: "project",
      children: [
        { title: "WooCommerce Store Development", path: "/woocommerce/development/", kind: "service", intent: "project" },
        { title: "WooCommerce Fixes", path: "/woocommerce/fixes/", kind: "service", intent: "fix" },
        { title: "Indian Payment Gateways & GST Setup", path: "/woocommerce/payment-gateway-gst/", kind: "service", intent: "project" },
        { title: "Shopify to WooCommerce Migration", path: "/woocommerce/shopify-migration/", kind: "service", intent: "project" },
      ],
    },
    // Supporting pages (the diagram's /supporting/ group is not a page)
    { title: "Pricing", path: "/pricing/", kind: "page", intent: "info" },
    { title: "Free Site Check", path: "/free-site-check/", kind: "page", intent: "info" },
    { title: "Knowledge Base", path: "/guides/", kind: "collection", intent: "info" }, // items at /guides/[slug]/
    { title: "Comparisons", path: "/compare/", kind: "collection", intent: "info" },   // items at /compare/[a-vs-b]/
    { title: "Case Studies", path: "/case-studies/", kind: "page", intent: "info" },
    { title: "About / Team", path: "/about/", kind: "page", intent: "info", inNav: false },
    { title: "Contact / Emergency Ticket", path: "/contact/", kind: "page", intent: "fix" },
  ],
};
