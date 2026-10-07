import { z } from "zod";

// Free site check: only what is needed to run the check (Lead Magnet + Form pattern).
export const checkSchema = z.object({
  siteUrl: z
    .string()
    .trim()
    .min(1, "Enter your site address")
    .max(300)
    .regex(/^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i, "Enter your site address, like example.com"),
  email: z.email("Enter a valid email address").max(254),
  worry: z.string().trim().max(500),
});

export type CheckRequest = z.infer<typeof checkSchema>;
