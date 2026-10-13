"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useReducer, useRef, useState, useTransition } from "react";
import { brand } from "@/config/brand";
import { CTA } from "@/config/cta";
import { routes } from "@/config/routes";
import { matchProblem, type MatchCandidate } from "@/lib/match-problem";
import { track } from "@/lib/track";
import { submitBooking } from "./actions";
import {
  ACCESS_LABEL,
  accessMethods,
  BUDGET_LABEL,
  budgets,
  CONTACT_LABEL,
  contactMethods,
  DRAFT_KEY,
  HANDOFF_KEY,
  TIMELINE_LABEL,
  timelines,
  type Booking,
  bookingSchema,
  emptyBooking,
  type RequestType,
  screensFor,
} from "./booking-schema";

type Option = { id: string; title: string };

const SUBMIT_LABEL: Record<RequestType, string> = { fix: CTA.BOOK, project: CTA.QUOTE, check: CTA.CHECK };

type State = { values: Booking; screen: number; errors: Record<string, string> };
type Action =
  | { t: "set"; field: keyof Booking; value: string }
  | { t: "restore"; values: Booking }
  | { t: "errors"; errors: Record<string, string> }
  | { t: "go"; screen: number };

// All flow state lives here, so Back is lossless by construction and a reload can be replayed
// from sessionStorage without the fields ever being the source of truth.
function reducer(s: State, a: Action): State {
  switch (a.t) {
    case "set":
      return { ...s, values: { ...s.values, [a.field]: a.value }, errors: { ...s.errors, [a.field]: "" } };
    case "restore":
      return { ...s, values: a.values };
    case "errors":
      return { ...s, errors: a.errors };
    case "go":
      return { ...s, screen: a.screen, errors: {} };
  }
}

/** Parse the whole booking, then keep only the issues belonging to this screen's fields. */
function screenErrors(values: Booking, fields: readonly string[]): Record<string, string> {
  const parsed = bookingSchema.safeParse(values);
  if (parsed.success) return {};
  const out: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0] ?? "");
    if (fields.includes(key) && !out[key]) out[key] = issue.message;
  }
  return out;
}

const field = "min-h-11 w-full border border-muted bg-surface px-3 py-2 text-base text-text transition-colors duration-200 placeholder:text-muted focus-visible:border-text aria-invalid:border-accent-text";

function Field({
  id,
  label,
  help,
  error,
  children,
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <label htmlFor={id} className="block font-medium">
        {label}
      </label>
      {help && (
        <p id={`${id}-help`} className="mt-1 text-sm text-muted">
          {help}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-2 font-mono text-sm text-accent-text">
          {error}
        </p>
      )}
    </div>
  );
}

export function BookingFlow({
  type,
  options,
  index,
  initial,
}: {
  type: RequestType;
  options: Option[];
  index: MatchCandidate[];
  initial: { service: string; guide: string; url: string };
}) {
  const router = useRouter();
  const screens = screensFor(type);
  const uid = useId();
  const [state, dispatch] = useReducer(reducer, undefined, (): State => ({
    values: emptyBooking(type, initial),
    screen: 0,
    errors: {},
  }));
  const [query, setQuery] = useState("");
  const [serverError, setServerError] = useState("");
  const [pending, startTransition] = useTransition();
  const submitted = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  const current = screens[state.screen];
  const isLast = state.screen === screens.length - 1;
  const v = state.values;
  const titleOf = (id: string) => options.find((o) => o.id === id)?.title ?? "";

  // Restore an in-progress booking after a reload. Done in an effect so the server and the first
  // client render agree, then the draft replaces them.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Partial<Booking>;
      if (draft.type === type) dispatch({ t: "restore", values: { ...emptyBooking(type, initial), ...draft } });
    } catch {
      // Storage blocked or corrupt: carry on with a fresh form.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(v));
    } catch {
      // Storage blocked: the reducer still holds everything for this visit.
    }
  }, [v]);

  useEffect(() => {
    track("booking_step", { step: `${type}:${current.id}` });
    // Not on first paint: moving focus on load would steal it from the page.
    if (mounted.current) headingRef.current?.focus();
    mounted.current = true;
  }, [type, current.id]);

  const go = (n: number) => dispatch({ t: "go", screen: n });

  const next = () => {
    const errs = screenErrors(v, current.fields);
    if (Object.keys(errs).length) return dispatch({ t: "errors", errors: errs });
    go(state.screen + 1);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pending || submitted.current) return; // double-submit guard
    const errs = screenErrors(v, Object.keys(v));
    if (Object.keys(errs).length) {
      setServerError("Some details are missing. Go back and check the highlighted fields.");
      return dispatch({ t: "errors", errors: errs });
    }
    submitted.current = true;
    setServerError("");
    startTransition(async () => {
      const res = await submitBooking(v, titleOf(v.service));
      if (!res.ok) {
        submitted.current = false;
        dispatch({ t: "errors", errors: res.fieldErrors });
        return setServerError(res.error);
      }
      track("booking_complete", {});
      try {
        sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(res.handoff));
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        // Storage blocked: /contact/thanks/ falls back to the plain email address.
      }
      router.push(routes.contactThanks);
    });
  };

  // Ranked matches for the searchable problem select. Empty query shows everything.
  const ids = new Set(options.map((o) => o.id));
  const ranked = query.trim().length > 2 ? matchProblem(query, index, 20).map((r) => r.serviceSlug) : [];
  const matches = query.trim()
    ? [
        ...ranked.filter((id) => ids.has(id)),
        ...options.filter((o) => o.title.toLowerCase().includes(query.trim().toLowerCase())).map((o) => o.id),
      ].filter((id, i, a) => a.indexOf(id) === i)
    : options.map((o) => o.id);

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby={`${uid}-heading`}>
      {/* Progress by name. Never "Step 1 of 4" (contract rule 6). */}
      <ol className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted">
        {screens.map((s, i) => (
          <li
            key={s.id}
            aria-current={i === state.screen ? "step" : undefined}
            className={i === state.screen ? "text-accent-text" : i < state.screen ? "text-text" : ""}
          >
            {s.label}
          </li>
        ))}
      </ol>

      <h2 id={`${uid}-heading`} ref={headingRef} tabIndex={-1} className="mt-4 text-2xl outline-none">
        {current.label}
      </h2>

      {current.id === "problem" && (
        <fieldset>
          <legend className="sr-only">What do you need?</legend>
          {initial.service && v.service === initial.service ? (
            <p className="mt-6 border border-line bg-surface p-4">
              <span className="font-medium">{titleOf(initial.service)}</span>
              <button
                type="button"
                onClick={() => dispatch({ t: "set", field: "service", value: "" })}
                className="ml-3 min-h-11 border-b border-muted text-sm text-muted hover:text-text"
              >
                Change
              </button>
            </p>
          ) : (
            <>
              <Field id={`${uid}-q`} label="What is happening?" help="Type a few words, or pick from the list below.">
                <input
                  id={`${uid}-q`}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="white screen, checkout, redirect"
                  autoComplete="off"
                  aria-describedby={`${uid}-q-help`}
                  className={field}
                />
              </Field>
              <p aria-live="polite" className="mt-2 font-mono text-xs text-muted">
                {query.trim() ? `${matches.length} ${matches.length === 1 ? "match" : "matches"}` : ""}
              </p>
              <ul className="mt-2 max-h-72 overflow-y-auto border-t border-line">
                {matches.map((id) => (
                  <li key={id} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => dispatch({ t: "set", field: "service", value: id })}
                      aria-pressed={v.service === id}
                      className={`flex min-h-11 w-full items-center px-1 py-2 text-left text-[0.9375rem] transition-colors duration-200 hover:text-accent-text ${v.service === id ? "font-medium text-accent-text" : ""}`}
                    >
                      {titleOf(id)}
                    </button>
                  </li>
                ))}
                {matches.length === 0 && (
                  <li className="px-1 py-4 text-[0.9375rem] text-muted">
                    Nothing matches that wording. Describe it below and an engineer will read it.
                  </li>
                )}
                <li className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => dispatch({ t: "set", field: "service", value: "" })}
                    aria-pressed={!v.service}
                    className={`flex min-h-11 w-full items-center px-1 py-2 text-left text-[0.9375rem] transition-colors duration-200 hover:text-accent-text ${!v.service ? "font-medium text-accent-text" : ""}`}
                  >
                    Something else
                  </button>
                </li>
              </ul>
            </>
          )}

          <Field
            id={`${uid}-description`}
            label={v.service ? "Anything else we should know? (optional)" : "Tell us what you see"}
            help={v.service ? "The exact error text helps most." : "A sentence or two. Paste the exact error if you have it."}
            error={state.errors.description}
          >
            <textarea
              id={`${uid}-description`}
              rows={4}
              value={v.description}
              onChange={(e) => dispatch({ t: "set", field: "description", value: e.target.value })}
              aria-invalid={state.errors.description ? true : undefined}
              aria-describedby={state.errors.description ? `${uid}-description-error` : `${uid}-description-help`}
              className={field}
            />
          </Field>

          {type === "project" && (
            <div className="grid gap-x-6 sm:grid-cols-2">
              <Field id={`${uid}-budget`} label="Budget range" help="In rupees. A range is fine." error={state.errors.budget}>
                <select
                  id={`${uid}-budget`}
                  value={v.budget}
                  onChange={(e) => dispatch({ t: "set", field: "budget", value: e.target.value })}
                  aria-invalid={state.errors.budget ? true : undefined}
                  aria-describedby={state.errors.budget ? `${uid}-budget-error` : `${uid}-budget-help`}
                  className={field}
                >
                  <option value="">Choose a range</option>
                  {budgets.map((b) => (
                    <option key={b} value={b}>
                      {BUDGET_LABEL[b]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id={`${uid}-timeline`} label="Timeline" help="When you want to start." error={state.errors.timeline}>
                <select
                  id={`${uid}-timeline`}
                  value={v.timeline}
                  onChange={(e) => dispatch({ t: "set", field: "timeline", value: e.target.value })}
                  aria-invalid={state.errors.timeline ? true : undefined}
                  aria-describedby={state.errors.timeline ? `${uid}-timeline-error` : `${uid}-timeline-help`}
                  className={field}
                >
                  <option value="">Choose a timeline</option>
                  {timelines.map((t) => (
                    <option key={t} value={t}>
                      {TIMELINE_LABEL[t]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          )}
        </fieldset>
      )}

      {current.id === "site" && (
        <fieldset>
          <legend className="sr-only">Which site?</legend>
          <Field
            id={`${uid}-siteUrl`}
            label="Site address"
            help="With or without https."
            error={state.errors.siteUrl}
          >
            <input
              id={`${uid}-siteUrl`}
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="example.com"
              value={v.siteUrl}
              onChange={(e) => dispatch({ t: "set", field: "siteUrl", value: e.target.value })}
              aria-invalid={state.errors.siteUrl ? true : undefined}
              aria-describedby={state.errors.siteUrl ? `${uid}-siteUrl-error` : `${uid}-siteUrl-help`}
              className={field}
            />
          </Field>

          <Field id={`${uid}-host`} label="Host (optional)" help="Who the site is hosted with, if you know.">
            <input
              id={`${uid}-host`}
              value={v.host}
              onChange={(e) => dispatch({ t: "set", field: "host", value: e.target.value })}
              aria-describedby={`${uid}-host-help`}
              className={field}
            />
          </Field>

          <fieldset className="mt-8">
            <legend className="font-medium">How will we get access?</legend>
            <p className="mt-1 text-sm text-muted">
              Never send passwords in this form, or by email. We will not ask for them here.
            </p>
            <div className="mt-3">
              {accessMethods.map((a) => (
                <label key={a} className="flex min-h-11 cursor-pointer items-center gap-3 border-t border-line py-2">
                  <input
                    type="radio"
                    name="access"
                    value={a}
                    checked={v.access === a}
                    onChange={() => dispatch({ t: "set", field: "access", value: a })}
                    className="size-4 accent-[var(--accent)]"
                  />
                  <span className="text-[0.9375rem]">{ACCESS_LABEL[a]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </fieldset>
      )}

      {current.id === "contact" && (
        <fieldset>
          <legend className="sr-only">How do we reach you?</legend>
          <div className="grid gap-x-6 sm:grid-cols-2">
            <Field id={`${uid}-name`} label="Name" help="What we should call you." error={state.errors.name}>
              <input
                id={`${uid}-name`}
                autoComplete="name"
                value={v.name}
                onChange={(e) => dispatch({ t: "set", field: "name", value: e.target.value })}
                aria-invalid={state.errors.name ? true : undefined}
                aria-describedby={state.errors.name ? `${uid}-name-error` : `${uid}-name-help`}
                className={field}
              />
            </Field>
            <Field id={`${uid}-email`} label="Email" help="Where the confirmation goes." error={state.errors.email}>
              <input
                id={`${uid}-email`}
                type="email"
                autoComplete="email"
                value={v.email}
                onChange={(e) => dispatch({ t: "set", field: "email", value: e.target.value })}
                aria-invalid={state.errors.email ? true : undefined}
                aria-describedby={state.errors.email ? `${uid}-email-error` : `${uid}-email-help`}
                className={field}
              />
            </Field>
            <Field id={`${uid}-phone`} label="Phone (optional)" help="Only used if you pick phone below." error={state.errors.phone}>
              <input
                id={`${uid}-phone`}
                type="tel"
                autoComplete="tel"
                value={v.phone}
                onChange={(e) => dispatch({ t: "set", field: "phone", value: e.target.value })}
                aria-invalid={state.errors.phone ? true : undefined}
                aria-describedby={state.errors.phone ? `${uid}-phone-error` : `${uid}-phone-help`}
                className={field}
              />
            </Field>
          </div>

          <fieldset className="mt-8">
            <legend className="font-medium">Preferred contact method</legend>
            <div className="mt-3 max-w-[20rem]">
              {contactMethods.map((m) => (
                <label key={m} className="flex min-h-11 cursor-pointer items-center gap-3 border-t border-line py-2">
                  <input
                    type="radio"
                    name="contactMethod"
                    value={m}
                    checked={v.contactMethod === m}
                    onChange={() => dispatch({ t: "set", field: "contactMethod", value: m })}
                    className="size-4 accent-[var(--accent)]"
                  />
                  <span className="text-[0.9375rem]">{CONTACT_LABEL[m]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </fieldset>
      )}

      {current.id === "confirm" && (
        <div>
          <dl className="mt-6">
            {type !== "check" && (
              <div className="grid gap-1 border-t border-line py-3 sm:grid-cols-[12rem_1fr]">
                <dt className="text-muted">Service</dt>
                <dd>{titleOf(v.service) || "Something else"}</dd>
              </div>
            )}
            {v.description && (
              <div className="grid gap-1 border-t border-line py-3 sm:grid-cols-[12rem_1fr]">
                <dt className="text-muted">Details</dt>
                <dd className="whitespace-pre-wrap">{v.description}</dd>
              </div>
            )}
            {type === "project" && (
              <>
                <div className="grid gap-1 border-t border-line py-3 sm:grid-cols-[12rem_1fr]">
                  <dt className="text-muted">Budget</dt>
                  <dd>{BUDGET_LABEL[v.budget as (typeof budgets)[number]] ?? v.budget}</dd>
                </div>
                <div className="grid gap-1 border-t border-line py-3 sm:grid-cols-[12rem_1fr]">
                  <dt className="text-muted">Timeline</dt>
                  <dd>{TIMELINE_LABEL[v.timeline as (typeof timelines)[number]] ?? v.timeline}</dd>
                </div>
              </>
            )}
            <div className="grid gap-1 border-t border-line py-3 sm:grid-cols-[12rem_1fr]">
              <dt className="text-muted">Site</dt>
              <dd className="font-mono break-all">{v.siteUrl}</dd>
            </div>
            {v.host && (
              <div className="grid gap-1 border-t border-line py-3 sm:grid-cols-[12rem_1fr]">
                <dt className="text-muted">Host</dt>
                <dd>{v.host}</dd>
              </div>
            )}
            <div className="grid gap-1 border-t border-line py-3 sm:grid-cols-[12rem_1fr]">
              <dt className="text-muted">Access</dt>
              <dd>{ACCESS_LABEL[v.access]}</dd>
            </div>
            <div className="grid gap-1 border-t border-line py-3 sm:grid-cols-[12rem_1fr]">
              <dt className="text-muted">Contact</dt>
              <dd>
                {v.name}, {v.email}
                {v.phone ? `, ${v.phone}` : ""} ({CONTACT_LABEL[v.contactMethod]})
              </dd>
            </div>
            <div className="grid gap-1 border-t border-line py-3 sm:grid-cols-[12rem_1fr]">
              <dt className="text-muted">Price</dt>
              <dd>{brand.promises.pricing ?? "Quote before work begins"}</dd>
            </div>
            {brand.promises.guaranteeDays !== null && (
              <div className="grid gap-1 border-t border-line py-3 sm:grid-cols-[12rem_1fr]">
                <dt className="text-muted">Guarantee</dt>
                <dd>Every fix carries a {brand.promises.guaranteeDays} day guarantee.</dd>
              </div>
            )}
          </dl>
          <p className="mt-6 max-w-[60ch] text-sm text-muted">
            Nothing is charged now. {brand.quoteFlow}
          </p>
        </div>
      )}

      <p aria-live="assertive" className="mt-6">
        {serverError && (
          <span className="block border border-accent-text p-4 font-mono text-sm text-accent-text">{serverError}</span>
        )}
      </p>

      {/*
        The keys matter. Without them React reconciles Continue and the submit button into the SAME
        <button> node and flips type="button" to type="submit" while the click is still dispatching,
        so the browser submits the form a screen early. Distinct keys force a fresh node.
      */}
      <div className="mt-8 flex flex-wrap gap-2">
        {state.screen > 0 && (
          <button key="back" type="button" onClick={() => go(state.screen - 1)} className="btn-secondary">
            Back
          </button>
        )}
        {isLast ? (
          <button key="submit" type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
            {pending ? "Sending" : SUBMIT_LABEL[type]}
          </button>
        ) : (
          <button key="next" type="button" onClick={next} className="btn-primary">
            Continue
          </button>
        )}
      </div>
    </form>
  );
}
