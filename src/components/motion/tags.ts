import { m } from "motion/react";

/**
 * The elements a Motion primitive's `as` prop may render.
 *
 * Built once at module scope, never inside a component. `m(Tag)` called during render returns a
 * **new component type on every pass**, so React unmounts and remounts the subtree each time: the
 * animation restarts, any focus inside it is lost and the DOM node is replaced. A fixed map has
 * none of that, and the closed set is no real restriction, since these primitives wrap layout
 * boxes and text containers rather than arbitrary markup.
 *
 * `Reveal` and `Stagger` are not here. They are Server Components with no Motion in them at all and
 * take any `ElementType` directly.
 */
export const motionTags = {
  div: m.div,
  span: m.span,
  section: m.section,
  article: m.article,
  aside: m.aside,
  header: m.header,
  footer: m.footer,
  p: m.p,
  ul: m.ul,
  ol: m.ol,
  li: m.li,
  figure: m.figure,
} as const;

export type MotionTag = keyof typeof motionTags;
