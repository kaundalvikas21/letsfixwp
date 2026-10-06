type CtaProps = { location: string; service?: string };

type Events = {
  cta_book_click: CtaProps;
  cta_chat_open: CtaProps;
  cta_plans_click: CtaProps;
  cta_quote_click: CtaProps;
  cta_check_click: CtaProps;
  problem_search: { query: string };
  booking_step: { step: string };
  booking_complete: Record<string, never>;
};

export type TrackEvent = keyof Events;

export function track<E extends TrackEvent>(event: E, props: Events[E]) {
  // ponytail: no analytics vendor yet. Forward to it here when one is chosen.
  if (process.env.NODE_ENV !== "production") console.debug("[track]", event, props);
}
