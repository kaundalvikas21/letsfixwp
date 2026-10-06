import { z } from "zod";
import { categories } from "./categories";

export { categories, type Category } from "./categories";

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

export const problemSchema = z.object({
  slug,
  legacySlug: slug.optional(),
  category: z.enum(categories),
  title: z.string().min(1),
  h1: z.string().min(1),
  symptoms: z.array(z.string().min(1)).min(1),
  likelyCauses: z.array(z.string().min(1)).min(1),
  ourFix: z
    .array(z.object({ verb: z.string().min(1), detail: z.string().min(1) }))
    .min(3)
    .max(5),
  safeChecks: z.array(z.string().min(1)).length(2),
  urgency: z.enum(["critical", "high", "standard"]),
  typicalTurnaround: z.string().nullable(),
  priceFrom: z.string().nullable(),
  faqs: z
    .array(z.object({ q: z.string().min(1), a: z.string().min(1) }))
    .min(4)
    .max(6),
  relatedSlugs: z.array(slug),
  seo: z.object({
    title: z.string().min(1).max(60),
    description: z.string().min(1).max(155),
  }),
  image: z.object({ slot: z.string().min(1), alt: z.string().min(1) }),
});

export type Problem = z.infer<typeof problemSchema>;
