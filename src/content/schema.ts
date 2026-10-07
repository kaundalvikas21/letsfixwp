import { z } from "zod";

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);
const path = z.string().regex(/^\/([a-z0-9-]+\/)*$/, "path must start and end with /");
const text = z.string().min(1);
const faq = z.object({ q: text, a: text });
const seo = z.object({ title: z.string().min(1).max(60), description: z.string().min(1).max(155) });
const image = z.object({ slot: text, alt: text });
const intent = z.enum(["fix", "plan", "project", "info"]);

/** One per SITEMAP service leaf: src/content/services/<id>.ts */
export const serviceSchema = z
  .object({
    id: slug,
    path,
    hub: slug,
    intent,
    title: text, // the phrase people search
    h1: text,
    heroLine: text.refine((t) => t.trim().split(/\s+/).length <= 20, "heroLine must be 20 words or fewer"), // hero subtext
    summary: text,
    whoItsFor: text,
    symptoms: z.array(text), // fix intent only
    whatWeDo: z.array(z.object({ verb: text, detail: text })).min(3).max(5),
    deliverables: z.array(text).min(1),
    typicalTurnaround: z.string().nullable(),
    priceFrom: z.string().nullable(),
    faqs: z.array(faq).min(4).max(6),
    guideSlugs: z.array(slug),
    relatedPaths: z.array(path),
    seo,
    image,
  })
  .refine((s) => (s.intent === "fix" ? s.symptoms.length > 0 : s.symptoms.length === 0), {
    message: "symptoms are required for fix intent and must be empty otherwise",
    path: ["symptoms"],
  });

/** One per specific error (informational intent): src/content/guides/<slug>.ts */
export const guideSchema = z.object({
  slug,
  title: text, // the exact error phrase
  h1: text,
  errorText: text.optional(), // literal message as WordPress prints it
  symptoms: z.array(text).min(1),
  likelyCauses: z.array(text).min(1),
  safeChecks: z.array(text).min(2).max(3), // never editing core files
  whenToCallUs: text,
  parentService: slug,
  urgency: z.enum(["critical", "high", "standard"]),
  faqs: z.array(faq).min(3).max(4),
  seo,
  image,
});

/** src/content/cities/<slug>.ts. Substantially unique per city; no invented clients, offices or reviews. */
export const citySchema = z.object({
  slug,
  city: text,
  priority: z.number().int().min(1),
  localContext: z.array(text).min(2), // paragraphs
  remoteDelivery: text, // how remote delivery works for this city (time zone, meetings, handover); unique per city
  servicesHighlighted: z.array(slug).min(2),
  faqs: z.array(faq).min(3).max(5),
  seo,
});

/** src/content/compares/<slug>.ts. Factual and neutral. */
export const compareSchema = z.object({
  slug,
  a: text,
  b: text,
  closestService: slug, // the service whose intent sets this page's primary CTA
  verdictByScenario: z.array(z.object({ scenario: text, verdict: text })).min(3),
  rows: z.array(z.object({ criterion: text, a: text, b: text })).min(5),
  seo,
});

/** One per SITEMAP hub: src/content/hubs.ts */
export const hubSchema = z.object({ id: slug, intro: text, seo });

export type Service = z.infer<typeof serviceSchema>;
export type Hub = z.infer<typeof hubSchema>;
export type Guide = z.infer<typeof guideSchema>;
export type City = z.infer<typeof citySchema>;
export type Compare = z.infer<typeof compareSchema>;
