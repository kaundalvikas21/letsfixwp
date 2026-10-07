import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "custom-plugin",
  path: "/wordpress-development/custom-plugin/",
  hub: "wordpress-development",
  intent: "project",
  title: "Custom WordPress plugin development",
  h1: "Custom WordPress plugin development",
  heroLine: "A feature or integration no existing plugin covers, built as one focused plugin that follows WordPress coding standards.",
  summary:
    "When no existing plugin does what you need, we build one: a custom feature, an API integration or a WooCommerce extension, written to WordPress standards.",
  whoItsFor:
    "Businesses that need a feature or integration no off-the-shelf plugin covers, or that want to replace several plugins with one focused one.",
  symptoms: [],
  whatWeDo: [
    { verb: "Scope", detail: "Write down exactly what the plugin must do, the data it stores and the systems it connects to." },
    { verb: "Build", detail: "Write the plugin using WordPress hooks, the REST API and proper data sanitization, escaping and nonces." },
    { verb: "Integrate", detail: "Connect to the services you use, such as CRMs, ERPs, SMS gateways or shipping providers." },
    { verb: "Test", detail: "Test on a staging site with your theme and plugins, across supported PHP and WordPress versions." },
    { verb: "Document", detail: "Hand over the code in Git with setup notes and an explanation of each setting." },
  ],
  deliverables: [
    "A custom plugin that does the agreed job and nothing more",
    "Source code in a Git repository you own",
    "Admin settings screens where options need to change",
    "Setup and usage documentation",
    "Test notes covering supported WordPress and PHP versions",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Should this be a plugin or part of the theme?", a: "Features that must keep working if you change design, such as integrations, custom post types and business logic, belong in a plugin. Only presentation belongs in the theme." },
    { q: "Can you extend an existing plugin instead?", a: "Often, yes. Many plugins offer hooks and filters, so we can add to them without editing their code and losing changes at the next update." },
    { q: "Can you build WooCommerce extensions?", a: "Yes. Custom shipping rules, product options, checkout fields, order exports and integrations with Indian couriers or ERPs are common requests." },
    { q: "Who maintains the plugin after launch?", a: "You own the code, so any developer can maintain it. We can also keep it updated as WordPress, WooCommerce and PHP change." },
    { q: "Will a custom plugin slow my site down?", a: "Not when built well. We load code only where it is needed and avoid adding database queries to every page." },
  ],
  guideSlugs: [],
  relatedPaths: ["/wordpress-development/custom-theme/", "/wordpress-development/hire-developer/", "/woocommerce/development/"],
  seo: {
    title: "Custom WordPress Plugin Development",
    description: "Custom WordPress plugins, API integrations and WooCommerce extensions built to WordPress standards, with Git source code you own.",
  },
  image: { slot: "service-custom-plugin", photo: "terminal", alt: "Code editor showing a custom WordPress plugin file with registered hooks" },
});
