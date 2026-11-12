import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * `cn` has to be told about `max-w-page`, or every page that narrows the spine silently stops
 * narrowing.
 *
 * The site spine is a theme token (`--container-page` in globals.css), so Tailwind generates
 * `max-w-page` from it. tailwind-merge only knows the widths that ship with Tailwind, so to it
 * `max-w-page` is an unrelated class rather than a member of the `max-w` group: given
 * `cn(page, pageY, "max-w-4xl")` it kept **both**, and with equal specificity the generated
 * stylesheet's own order then decided the winner. Measured on the production build the moment the
 * token landed: the city templates render `max-w-4xl` in their class list and measured 1200px, with
 * their h1 on the spine's left edge instead of their own. `/contact/` and `/free-site-check/` (5xl)
 * and `/case-studies/` (3xl) were on the spine the same way.
 *
 * That is the exact failure docs/layout-ledger.md records twice under "Container widths: three, on
 * purpose": a container quietly changing on pages nobody re-measured. It cannot be caught by tsc,
 * eslint, the content check or the build, because every one of them sees a valid class string.
 *
 * Verified against tailwind-merge 3.7: without the extension `twMerge("max-w-page max-w-4xl")`
 * returns both classes; with it, `max-w-4xl`, and `"max-w-4xl max-w-page"` returns `max-w-page`,
 * so last-wins works in both directions.
 *
 * Any future `--container-*` token needs its name added here too.
 */
const twMerge = extendTailwindMerge({ extend: { classGroups: { "max-w": ["max-w-page"] } } });

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * A guide sentence block split into its first sentence and the rest, so the first can be set as the
 * bold lead that a reader scans and the rest as the muted detail they read only if it applies.
 *
 * A sentence ends at a full stop followed by a space and a capital. That rule is what keeps
 * "wp-content/plugins." or "yoursite.com/wp-admin." intact: a dot inside a path is never followed by
 * a space. A block with one sentence returns it as the lead and an empty rest.
 */
export const leadSentence = (text: string): [lead: string, rest: string] => {
  const at = text.search(/\.\s+(?=[A-Z"])/);
  return at === -1 ? [text, ""] : [text.slice(0, at + 1), text.slice(at + 1).trim()];
};
