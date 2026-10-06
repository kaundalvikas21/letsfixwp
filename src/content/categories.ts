export const categories = [
  "down",
  "security",
  "errors",
  "access",
  "updates",
  "performance",
  "woocommerce",
  "email",
  "recovery",
] as const;

export type Category = (typeof categories)[number];

export const categoryLabels: Record<Category, string> = {
  down: "Site down",
  security: "Hacked or infected",
  errors: "Errors",
  access: "Can't log in",
  updates: "Broke after an update",
  performance: "Slow site",
  woocommerce: "WooCommerce",
  email: "Email",
  recovery: "Migration and backups",
};
