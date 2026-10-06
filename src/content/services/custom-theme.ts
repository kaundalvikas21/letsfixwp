import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "custom-theme",
  path: "/wordpress-development/custom-theme/",
  hub: "wordpress-development",
  intent: "project",
  title: "Custom WordPress theme development",
  h1: "Custom WordPress theme development",
  summary:
    "We code a WordPress theme from your design, built only for what your site needs, so it stays light, fast and easy for your team to edit.",
  whoItsFor:
    "Businesses and agencies with a finished design, or a site held back by a heavy multipurpose theme.",
  symptoms: [],
  whatWeDo: [
    { verb: "Plan", detail: "Break your design into templates, blocks and patterns, and agree which parts editors can change." },
    { verb: "Build", detail: "Code a block theme or classic theme following WordPress coding standards, with custom blocks where the design needs them." },
    { verb: "Optimize", detail: "Load only the scripts and styles each page uses, and size images properly for Core Web Vitals." },
    { verb: "Test", detail: "Check layouts across browsers and devices, keyboard navigation and colour contrast before handover." },
    { verb: "Handover", detail: "Deliver the theme in a Git repository with notes on structure and how to add new pages." },
  ],
  deliverables: [
    "A custom WordPress theme built from your design",
    "Custom blocks and block patterns for your editors",
    "Source code in a Git repository that you own",
    "Developer notes on theme structure and build steps",
    "Editor guidance on using blocks and patterns",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Block theme or classic theme?", a: "For most new builds we use a block theme so layouts, headers and footers can be edited in the Site Editor. We use a classic theme when the site depends on plugins or workflows that need it." },
    { q: "Can you build from a Figma file?", a: "Yes. Figma is the most common starting point. We can also work from Adobe XD, Sketch or a PDF." },
    { q: "Will the theme work with my plugins?", a: "We list the plugins you rely on at the start and test the theme with them, including WooCommerce if you sell online." },
    { q: "Do I own the code?", a: "Yes. The theme is yours, delivered in a repository you control, with no licence fees to us." },
    { q: "Why not just buy a premium theme?", a: "A premium theme can be the right choice for a simple site. A custom theme makes sense when the design is specific or a multipurpose theme is slowing the site down." },
  ],
  guideSlugs: [],
  relatedPaths: [
    "/wordpress-development/website-design/",
    "/wordpress-development/custom-plugin/",
    "/wordpress-performance-migration/speed-optimization/",
  ],
  seo: {
    title: "Custom WordPress Theme Development",
    description: "Custom WordPress block and classic themes coded from your design, light and fast, with custom blocks, Git source code and full ownership.",
  },
  image: { slot: "service-custom-theme", alt: "Code editor showing a WordPress block theme's theme.json and template files" },
});
