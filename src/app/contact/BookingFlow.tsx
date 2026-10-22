"use client";

import { ArrowLeftIcon, CaretRightIcon, CheckCircleIcon, MagnifyingGlassIcon, WarningCircleIcon } from "@phosphor-icons/react/ssr";
import { useEffect, useMemo, useReducer, useRef, useState, useTransition } from "react";
import { ChatButton } from "@/components/Cta";
import type { ProblemItem } from "@/components/sections/v3/ProblemSearch";
import { brand } from "@/config/brand";
import { CTA } from "@/config/cta";
import { accessMethods, budgets, contactMethods, timelines } from "@/content/booking-options";
import { claimLine } from "@/content/notices";
import { bookingText, getHandoff } from "@/lib/booking";
import { matchProblem } from "@/lib/match-problem";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";
import { submitBooking } from "./actions";
import {
  type Booking,
  type BookingField,
  DRAFT_KEY,
  emptyBooking,
  type RequestType,
  screensFor,
  validateScreen,
} from "./booking-schema";

type Option = { id: string; title: string };
type Errors = Partial<Record<BookingField, string>>;
type State = { booking: Booking; index: number; errors: Errors; serverError: string; done: { ref: string } | null };

type Action =
  | { t: "set"; patch: Partial<Booking> }
  | { t: "goto"; index: number }
  | { t: "errors"; errors: Errors; serverError?: string }
  | { t: "done"; ref: string }
  | { t: "restore"; booking: Booking };

function reducer(s: State, a: Action): State {
  switch (a.t) {
    case "set":
      // Typing in a field clears that field's error: an error should describe the field as it is now.
      return { ...s, booking: { ...s.booking, ...a.patch }, errors: Object.fromEntries(Object.entries(s.errors).filter(([k]) => !(k in a.patch))) };
    case "goto":
      return { ...s, index: a.index, errors: {}, serverError: "" };
    case "errors":
      return { ...s, errors: a.errors, serverError: a.serverError ?? "" };
    case "done":
      return { ...s, done: { ref: a.ref } };
    case "restore":
      return { ...s, booking: a.booking };
  }
}

const label = "block text-sm font-semibold";
const help = "mt-1 text-sm text-muted";
const field = "mt-1.5 min-h-11 w-full rounded-[12px] border border-line-strong bg-surface px-4 py-3 text-base";
const errorText = "mt-1.5 flex items-start gap-1.5 text-sm font-semibold";
const group = "mt-6 first:mt-0";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className={errorText}>
      <WarningCircleIcon weight="duotone" className="mt-0.5 size-4 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

/** Radio list where each option can carry a line of help. Native radios: arrow keys and labels for free. */
function RadioList<T extends string>({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string; help?: string }[];
}) {
  return (
    <div className="mt-2 grid gap-2">
      {options.map((o) => (
        <label
          key={o.value}
          className={cn(
            "flex min-h-11 cursor-pointer gap-3 rounded-[12px] border p-3.5",
            value === o.value ? "border-accent bg-accent-tint" : "border-line-strong bg-surface",
          )}
        >
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
            className="mt-1 size-4 shrink-0 accent-accent"
          />
          <span>
            <span className="block text-sm font-semibold">{o.label}</span>
            {o.help && <span className="mt-0.5 block text-sm text-muted">{o.help}</span>}
          </span>
        </label>
      ))}
    </div>
  );
}

export function BookingFlow({
  type,
  options,
  problems,
  initial,
}: {
  type: RequestType;
  options: Option[];
  problems: ProblemItem[];
  initial: { service: string; guide: string; url: string };
}) {
  // Memoised: a fresh array each render made the focus effect below re-run on every keystroke, which pulled
  // focus out of the field you were typing in and back to the heading after one character.
  const screens = useMemo(() => screensFor(type), [type]);
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    booking: emptyBooking(type, { service: initial.service, guide: initial.guide, siteUrl: initial.url }),
    index: 0,
    errors: {} as Errors,
    serverError: "",
    done: null,
  }));
  const [pending, startTransition] = useTransition();
  const sending = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const { booking: b, index, errors, serverError, done } = state;
  const screen = screens[index];
  const isLast = index === screens.length - 1;
  const titleOf = (id: string) => options.find((o) => o.id === id)?.title ?? "";

  // Restore a draft (Back, reload, or a tab that got bumped). Anything in the URL still wins.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`${DRAFT_KEY}:${type}`);
      if (!raw) return;
      const saved = JSON.parse(raw) as Booking;
      dispatch({ t: "restore", booking: { ...saved, type, ...(initial.service ? { service: initial.service, guide: initial.guide } : {}), ...(initial.url ? { siteUrl: initial.url } : {}) } });
    } catch {
      // Storage blocked or corrupt: start from an empty form rather than failing.
    }
  }, [type, initial.service, initial.guide, initial.url]);

  useEffect(() => {
    try {
      sessionStorage.setItem(`${DRAFT_KEY}:${type}`, JSON.stringify(b));
    } catch {
      // Storage blocked: the draft is not kept, the form still works.
    }
  }, [b, type]);

  // Move focus to the new screen's heading so a screen reader and the keyboard both land in the right place.
  useEffect(() => {
    track("booking_step", { step: `${type}:${screens[index].id}` });
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [index, type, screens]);

  useEffect(() => {
    if (done) headingRef.current?.focus();
  }, [done]);

  const next = () => {
    const found = validateScreen(b, screen.fields);
    if (Object.keys(found).length) return dispatch({ t: "errors", errors: found });
    dispatch({ t: "goto", index: index + 1 });
  };

  const submit = () => {
    if (sending.current || pending) return; // double-submit guard: a second click is ignored, not queued
    sending.current = true;
    startTransition(async () => {
      const res = await submitBooking(b);
      sending.current = false;
      if (!res.ok) {
        // Send them back to the first screen that actually has a problem, then show the errors there.
        const firstScreen = screens.findIndex((sc) => sc.fields.some((f) => f in res.fieldErrors));
        if (firstScreen >= 0) dispatch({ t: "goto", index: firstScreen });
        dispatch({ t: "errors", errors: res.fieldErrors, serverError: res.error });
        return;
      }
      track("booking_complete", {});
      try {
        sessionStorage.removeItem(`${DRAFT_KEY}:${type}`);
      } catch {
        // Nothing to clean up if storage is blocked.
      }
      dispatch({ t: "done", ref: res.ref });
    });
  };

  if (done) return <Success booking={b} serviceTitle={titleOf(b.service)} reference={done.ref} type={type} headingRef={headingRef} />;

  const errorCount = Object.keys(errors).length;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isLast) submit();
        else next();
      }}
      noValidate
      aria-labelledby="booking-heading"
    >
      <h2 id="booking-heading" ref={headingRef} tabIndex={-1} className="font-display text-xl font-bold outline-none">
        {screen.label}
      </h2>

      {/* Progress by name, never a numbered counter: the names say what is being asked. */}
      <ol className="mt-3 flex gap-1.5" aria-label="Where you are">
        {screens.map((s, i) => (
          <li key={s.id} className="flex-1" aria-current={i === index ? "step" : undefined}>
            <span className={cn("block h-1 rounded-full", i <= index ? "bg-accent" : "bg-surface-2")} />
            <span className={cn("mt-1.5 block text-xs", i === index ? "font-semibold text-text" : "text-muted")}>{s.label}</span>
          </li>
        ))}
      </ol>

      <p aria-live="polite" className="sr-only">
        {errorCount ? `${errorCount} ${errorCount === 1 ? "detail needs" : "details need"} attention on this screen.` : ""}
      </p>

      <div className="mt-7">
        {screen.id === "problem" && <ProblemScreen b={b} errors={errors} problems={problems} dispatch={dispatch} />}
        {screen.id === "project" && <ProjectScreen b={b} errors={errors} options={options} dispatch={dispatch} />}
        {screen.id === "site" && <SiteScreen b={b} errors={errors} type={type} dispatch={dispatch} />}
        {screen.id === "contact" && <ContactScreen b={b} errors={errors} dispatch={dispatch} />}
        {screen.id === "confirm" && <ConfirmScreen b={b} serviceTitle={titleOf(b.service)} type={type} />}
      </div>

      {serverError && (
        <p role="alert" className="mt-6 flex gap-2.5 rounded-[12px] border border-line-strong bg-surface-2 p-4 text-sm font-semibold">
          <WarningCircleIcon weight="duotone" className="mt-0.5 size-5 shrink-0" aria-hidden />
          {serverError}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {index > 0 && (
          <button type="button" onClick={() => dispatch({ t: "goto", index: index - 1 })} className="btn-secondary gap-2">
            <ArrowLeftIcon weight="duotone" className="size-4" aria-hidden />
            Back
          </button>
        )}
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-70">
          {isLast ? (pending ? "Sending" : CTA[type === "project" ? "QUOTE" : type === "check" ? "CHECK" : "BOOK"]) : "Continue"}
        </button>
      </div>
    </form>
  );
}

type ScreenProps = { b: Booking; errors: Errors; dispatch: React.Dispatch<Action> };

function ProblemScreen({ b, errors, problems, dispatch }: ScreenProps & { problems: ProblemItem[] }) {
  const [query, setQuery] = useState("");
  const chosen = problems.find((p) => p.serviceSlug === b.service && (p.guideSlug ?? "") === b.guide);
  const key = (p: { serviceSlug: string; guideSlug?: string }) => `${p.serviceSlug}:${p.guideSlug ?? ""}`;
  const byKey = new Map(problems.map((p) => [key(p), p]));
  const shown = query.trim() ? matchProblem(query, problems, 8).map((r) => byKey.get(key(r))!) : problems.slice(0, 8);
  const somethingElse = !b.service;

  return (
    <fieldset>
      <legend className={label}>What is your site doing?</legend>
      <p className={help}>Pick the closest match. The engineer confirms it before any work starts.</p>

      <div className="mt-3 flex items-center gap-3 rounded-[12px] border border-line-strong bg-surface px-4 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
        <MagnifyingGlassIcon weight="duotone" className="size-5 shrink-0 text-muted" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="blank page, hacked, checkout"
          aria-label="Filter problems"
          autoComplete="off"
          className="h-11 w-full bg-transparent text-base outline-none placeholder:text-muted"
        />
      </div>

      {chosen && !query && (
        <p className="mt-3 flex items-center justify-between gap-3 rounded-[12px] border border-accent bg-accent-tint p-3.5 text-sm">
          <span className="font-semibold">{chosen.title}</span>
          <button type="button" onClick={() => dispatch({ t: "set", patch: { service: "", guide: "" } })} className="shrink-0 min-h-11 font-semibold underline underline-offset-4">
            Change
          </button>
        </p>
      )}

      {(!chosen || query) &&
        (shown.length ? (
          <div className="mt-2 grid gap-2">
            {shown.map((p) => (
              <label
                key={key(p)}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center gap-3 rounded-[12px] border p-3.5 text-sm",
                  key(p) === `${b.service}:${b.guide}` ? "border-accent bg-accent-tint" : "border-line-strong bg-surface",
                )}
              >
                <input
                  type="radio"
                  name="problem"
                  checked={key(p) === `${b.service}:${b.guide}`}
                  onChange={() => dispatch({ t: "set", patch: { service: p.serviceSlug, guide: p.guideSlug ?? "" } })}
                  className="size-4 shrink-0 accent-accent"
                />
                <span className="font-medium">{p.title}</span>
              </label>
            ))}
          </div>
        ) : (
          /* Designed empty state: a filter that matches nothing still has a way forward. */
          <div className="mt-3 rounded-[12px] border border-dashed border-line-strong p-5 text-center">
            <p className="font-semibold">No problem matches &ldquo;{query.trim()}&rdquo;</p>
            <p className="mt-1 text-sm text-muted">Describe it in your own words instead. An engineer reads every ticket.</p>
          </div>
        ))}

      <div className="mt-4 border-t border-line pt-4">
        <label htmlFor="description" className={label}>
          {somethingElse ? "Describe the problem" : "Anything else we should know? (optional)"}
        </label>
        <p className={help}>What you saw, when it started, and anything you already tried.</p>
        <textarea
          id="description"
          rows={4}
          value={b.description}
          onChange={(e) => dispatch({ t: "set", patch: { description: e.target.value } })}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
          className={field}
        />
        <FieldError id="description-error" message={errors.description} />
      </div>
    </fieldset>
  );
}

function ProjectScreen({ b, errors, options, dispatch }: ScreenProps & { options: Option[] }) {
  return (
    <fieldset>
      <legend className="sr-only">About the project</legend>

      <div className={group}>
        <label htmlFor="service" className={label}>
          What do you need? (optional)
        </label>
        <p className={help}>Pick the closest, or leave it and describe the work below.</p>
        <select id="service" value={b.service} onChange={(e) => dispatch({ t: "set", patch: { service: e.target.value } })} className={field}>
          <option value="">Not sure yet</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.title}
            </option>
          ))}
        </select>
      </div>

      <div className={group}>
        <label htmlFor="description" className={label}>
          What are you building?
        </label>
        <p className={help}>What the site has to do, and anything it has to connect to.</p>
        <textarea
          id="description"
          rows={5}
          value={b.description}
          onChange={(e) => dispatch({ t: "set", patch: { description: e.target.value } })}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
          className={field}
        />
        <FieldError id="description-error" message={errors.description} />
      </div>

      <div className={group} role="group" aria-labelledby="budget-label" aria-describedby={errors.budget ? "budget-error" : undefined}>
        <span id="budget-label" className={label}>
          Budget range
        </span>
        <p className={help}>A range is enough. It tells us what is worth proposing.</p>
        <RadioList name="budget" value={b.budget} onChange={(v) => dispatch({ t: "set", patch: { budget: v } })} options={budgets} />
        <FieldError id="budget-error" message={errors.budget} />
      </div>

      <div className={group} role="group" aria-labelledby="timeline-label" aria-describedby={errors.timeline ? "timeline-error" : undefined}>
        <span id="timeline-label" className={label}>
          Timeline
        </span>
        <RadioList name="timeline" value={b.timeline} onChange={(v) => dispatch({ t: "set", patch: { timeline: v } })} options={timelines} />
        <FieldError id="timeline-error" message={errors.timeline} />
      </div>
    </fieldset>
  );
}

function SiteScreen({ b, errors, type, dispatch }: ScreenProps & { type: RequestType }) {
  return (
    <fieldset>
      <legend className="sr-only">Your site</legend>

      <div className={group}>
        <label htmlFor="siteUrl" className={label}>
          Site address
        </label>
        <p className={help}>The address visitors use, even if it is down right now.</p>
        <input
          id="siteUrl"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="example.com"
          value={b.siteUrl}
          onChange={(e) => dispatch({ t: "set", patch: { siteUrl: e.target.value } })}
          aria-invalid={!!errors.siteUrl}
          aria-describedby={errors.siteUrl ? "siteUrl-error" : undefined}
          className={field}
        />
        <FieldError id="siteUrl-error" message={errors.siteUrl} />
      </div>

      <div className={group}>
        <label htmlFor="host" className={label}>
          Who hosts it? (optional)
        </label>
        <p className={help}>Hostinger, GoDaddy, Cloudways, your own server. Skip it if you do not know.</p>
        {/* No autofill token names a hosting provider, and "organization" offered the visitor's own employer. */}
        <input
          id="host"
          type="text"
          autoComplete="off"
          value={b.host}
          onChange={(e) => dispatch({ t: "set", patch: { host: e.target.value } })}
          className={field}
        />
      </div>

      {type === "fix" && (
        <div className={group} role="group" aria-labelledby="access-label">
          <span id="access-label" className={label}>
            How will you share access?
          </span>
          <p className={help}>Never type a password into this form. We will not ask for one here.</p>
          <RadioList name="access" value={b.access} onChange={(v) => dispatch({ t: "set", patch: { access: v } })} options={accessMethods} />
        </div>
      )}
    </fieldset>
  );
}

function ContactScreen({ b, errors, dispatch }: ScreenProps) {
  return (
    <fieldset>
      <legend className="sr-only">How we reach you</legend>

      <div className={group}>
        <label htmlFor="name" className={label}>
          Name
        </label>
        <input
          id="name"
          autoComplete="name"
          value={b.name}
          onChange={(e) => dispatch({ t: "set", patch: { name: e.target.value } })}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={field}
        />
        <FieldError id="name-error" message={errors.name} />
      </div>

      <div className={group}>
        <label htmlFor="email" className={label}>
          Email
        </label>
        <p className={help}>Where the confirmation and the written summary go.</p>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={b.email}
          onChange={(e) => dispatch({ t: "set", patch: { email: e.target.value } })}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={field}
        />
        <FieldError id="email-error" message={errors.email} />
      </div>

      <div className={group}>
        <label htmlFor="phone" className={label}>
          Phone {b.contactMethod === "phone" ? "" : "(optional)"}
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          value={b.phone}
          onChange={(e) => dispatch({ t: "set", patch: { phone: e.target.value } })}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={field}
        />
        <FieldError id="phone-error" message={errors.phone} />
      </div>

      <div className={group} role="group" aria-labelledby="contact-label">
        <span id="contact-label" className={label}>
          How should we reply?
        </span>
        <RadioList name="contactMethod" value={b.contactMethod} onChange={(v) => dispatch({ t: "set", patch: { contactMethod: v } })} options={contactMethods} />
      </div>
    </fieldset>
  );
}

const labelFor = <T extends { value: string; label: string }>(list: readonly T[], v: string) => list.find((x) => x.value === v)?.label ?? "";

function ConfirmScreen({ b, serviceTitle, type }: { b: Booking; serviceTitle: string; type: RequestType }) {
  const rows = [
    type !== "check" && { k: type === "project" ? "Project" : "Problem", v: serviceTitle || "Described below" },
    b.description && { k: "Details", v: b.description },
    b.siteUrl && { k: "Site", v: b.siteUrl },
    b.host && { k: "Host", v: b.host },
    type === "fix" && { k: "Access", v: labelFor(accessMethods, b.access) },
    type === "project" && { k: "Budget", v: labelFor(budgets, b.budget) },
    type === "project" && { k: "Timeline", v: labelFor(timelines, b.timeline) },
    { k: "Name", v: b.name },
    { k: "Email", v: b.email },
    b.phone && { k: "Phone", v: b.phone },
    { k: "Reply by", v: labelFor(contactMethods, b.contactMethod) },
  ].filter((r): r is { k: string; v: string } => !!r);

  // brand.claims.fixedPrice: both lines of the note below assert it, so both go when it is off, and the box
  // with them unless the guarantee still has something to say.
  const priceNote = type === "check" ? "No charge for a site check." : brand.claims.fixedPrice ? "Quote before work begins." : "";

  return (
    <div>
      <dl className="divide-y divide-line border-y border-line text-sm">
        {rows.map((r) => (
          <div key={r.k} className="flex gap-4 py-3">
            <dt className="w-28 shrink-0 text-muted">{r.k}</dt>
            <dd className="min-w-0 flex-1 font-medium break-words whitespace-pre-line">{r.v}</dd>
          </div>
        ))}
      </dl>

      {(priceNote || brand.guarantee) && (
        <div className="mt-5 rounded-[12px] bg-surface-2 p-4 text-sm">
          {priceNote && <p className="font-semibold">{priceNote}</p>}
          {type !== "check" && priceNote && <p className="mt-1 text-muted">An engineer reviews this and prices the work. {claimLine.fixedPrice}.</p>}
          {brand.guarantee && (
            <p className="mt-2 text-muted">
              {brand.guarantee.placeholder && <span className="font-semibold">Placeholder: </span>}
              {brand.guarantee.summary}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn-primary mt-3 w-full"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
        } catch {
          setCopied(false); // Clipboard blocked: the full ticket is printed below, so it can still be selected.
        }
      }}
    >
      {copied ? "Copied" : label}
    </button>
  );
}

function Success({
  booking,
  serviceTitle,
  reference,
  type,
  headingRef,
}: {
  booking: Booking;
  serviceTitle: string;
  reference: string;
  type: RequestType;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const handoff = getHandoff(booking, serviceTitle);
  const nextLines = [
    `Your ticket reference is ${reference}. Keep it for any reply.`,
    type === "check"
      ? `An engineer checks the site and emails the summary to ${booking.email} within ${brand.claims.checkTurnaround}.`
      : // brand.claims.fixedPrice: the price half of this line is the shared copy and goes with the claim.
        `An engineer reads it and replies to ${booking.email}.${brand.claims.fixedPrice ? ` ${claimLine.fixedPrice}.` : ""}`,
    booking.access === "secure-link" && type === "fix"
      ? "A secure link for hosting or admin access comes with that reply. Nothing sensitive goes through this form."
      : "If anything is unclear, we ask before touching the site.",
  ];

  return (
    <div>
      <CheckCircleIcon weight="duotone" className="size-10 text-accent-text" aria-hidden />
      <h2 ref={headingRef} tabIndex={-1} className="mt-4 font-display text-2xl font-bold outline-none">
        Ticket ready
      </h2>
      <ol className="mt-5 space-y-3">
        {nextLines.map((l) => (
          <li key={l} className="flex gap-3 text-sm">
            <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
            <span>{l}</span>
          </li>
        ))}
      </ol>

      <div className="mt-7 rounded-[12px] border border-line-strong bg-surface-2 p-4">
        <p className="text-sm text-muted">{handoff.note}</p>
        {handoff.kind === "copy" ? (
          <CopyButton text={handoff.text} label={handoff.label} />
        ) : (
          <a href={handoff.href} className="btn-primary mt-3 w-full">
            {handoff.label}
          </a>
        )}
      </div>

      {/* Email confirmation stub: nothing is sent from the server yet, so the copy is shown rather than claimed. */}
      <details className="group mt-5">
        {/* The row itself is the 44px target, as the shared Faqs summary is (contract rule 5). */}
        <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-sm font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
          See exactly what gets sent
          <CaretRightIcon weight="duotone" className="size-5 shrink-0 text-muted transition-transform group-open:rotate-90 motion-reduce:transition-none" aria-hidden />
        </summary>
        <pre className="mt-3 overflow-x-auto rounded-[12px] bg-surface-2 p-4 font-mono text-xs whitespace-pre-wrap">{bookingText(booking, serviceTitle)}</pre>
      </details>

      <p className="mt-6 text-sm text-muted">
        Rather talk it through? <ChatButton location={`booking:${type}:success`} service={booking.service || undefined} />
      </p>
    </div>
  );
}
