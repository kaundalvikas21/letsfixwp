"use client";

import { Check, CheckCircle, Warning } from "@phosphor-icons/react";
import { useEffect, useId, useReducer, useRef, useState, type ReactNode } from "react";
import { ChatButton } from "@/components/Cta";
import { ctaStyles } from "@/components/cta-styles";
import { brand } from "@/config/brand";
import { CTA } from "@/config/cta";
import { pageCopy } from "@/content/pages";
import { matchKey, matchProblem, type MatchCandidate } from "@/lib/match-problem";
import { track } from "@/lib/track";
import { submitTicket, type FieldErrors, type TicketResult } from "./actions";
import { screenSchemas, ticketScreens, type TicketScreen } from "./booking-schema";

const copy = pageCopy.booking;
const FIELD_SCREEN: Record<string, TicketScreen> = {
  service: "problem", guide: "problem", other: "problem", description: "problem",
  siteUrl: "site", host: "site", access: "site",
  name: "contact", email: "contact", phone: "contact", method: "contact",
};
const DRAFT_KEY = "ticket-draft-v1";

export type ProblemOption = { key: string; title: string; service: string; guide?: string; errorText?: string };

type Draft = {
  service: string;
  guide: string;
  other: boolean;
  description: string;
  siteUrl: string;
  host: string;
  access: "secure-link" | "temp-admin" | "on-call";
  name: string;
  email: string;
  phone: string;
  method: "email" | "phone" | "whatsapp";
  requestId: string;
  company: string;
};

type State = {
  screen: TicketScreen;
  data: Draft;
  errors: FieldErrors;
  status: "idle" | "submitting" | "error" | "done";
  result: Extract<TicketResult, { ok: true }> | null;
};

type Action =
  | { type: "set"; patch: Partial<Draft> }
  | { type: "go"; screen: TicketScreen }
  | { type: "errors"; errors: FieldErrors }
  | { type: "submitting" }
  | { type: "failed"; errors?: FieldErrors }
  | { type: "done"; result: Extract<TicketResult, { ok: true }> }
  | { type: "hydrate"; data: Partial<Draft> };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "set": {
      // Editing a field clears its own error only.
      const errors = { ...s.errors };
      for (const k of Object.keys(a.patch)) delete errors[k];
      return { ...s, data: { ...s.data, ...a.patch }, errors };
    }
    case "go":
      return { ...s, screen: a.screen, errors: {}, status: s.status === "error" ? "idle" : s.status };
    case "errors":
      return { ...s, errors: a.errors };
    case "submitting":
      return { ...s, status: "submitting", errors: {} };
    case "failed":
      return { ...s, status: "error", errors: a.errors ?? {} };
    case "done":
      return { ...s, status: "done", result: a.result };
    case "hydrate":
      return { ...s, data: { ...s.data, ...a.data } };
  }
}

const issuesToErrors = (issues: { path: PropertyKey[]; message: string }[]): FieldErrors =>
  Object.fromEntries(issues.map((i) => [String(i.path[0]), i.message]));

const inputCls =
  "mt-2 h-12 w-full rounded-control border border-line bg-surface-2 px-4 text-base text-text placeholder:text-muted aria-[invalid=true]:border-accent";

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
  children: ReactNode;
}) {
  return (
    <div className="mt-6 first:mt-0">
      <label htmlFor={id} className="block text-[15px] font-medium text-text">
        {label}
      </label>
      {help && (
        <p id={`${id}-help`} className="mt-1 text-[14px] leading-relaxed text-muted">
          {help}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-2 text-[14px] text-accent-ink">
          <Warning size={16} aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, help: boolean, error?: string) =>
  [help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;

function Choice({
  name,
  value,
  checked,
  onChange,
  label,
  help,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  help?: string;
}) {
  const id = `${name}-${value}`;
  return (
    <label
      htmlFor={id}
      className="flex min-h-11 cursor-pointer gap-3 rounded-control border border-line bg-surface-2 px-4 py-3 has-[:checked]:border-accent"
    >
      <input id={id} type="radio" name={name} value={value} checked={checked} onChange={onChange} className="mt-1 size-4 accent-[var(--accent)]" />
      <span>
        <span className="block text-[15px] text-text">{label}</span>
        {help && <span className="mt-0.5 block text-[14px] text-muted">{help}</span>}
      </span>
    </label>
  );
}

/**
 * Emergency ticket: Problem, Your site, Contact, Confirm. Labels above inputs, helper text, inline errors
 * announced via aria-live, focus on each new screen's heading, state in a reducer mirrored to sessionStorage.
 */
export function TicketFlow({
  initial,
  options,
  index,
  common,
  prices,
  handoffLabel,
}: {
  initial: { service: string; guide: string; url: string };
  options: ProblemOption[];
  index: MatchCandidate[];
  common: string[]; // option keys shown before typing
  prices: Record<string, string | null>;
  handoffLabel: string | null;
}) {
  const prefilled = !!(initial.service || initial.guide);
  const [state, dispatch] = useReducer(reducer, null, () => ({
    screen: "problem" as TicketScreen,
    data: {
      service: initial.service,
      guide: initial.guide,
      other: false,
      description: "",
      siteUrl: initial.url,
      host: "",
      access: "secure-link",
      name: "",
      email: "",
      phone: "",
      method: "email",
      requestId: "",
      company: "",
    } satisfies Draft,
    errors: {},
    status: "idle" as const,
    result: null,
  }));
  const { screen, data, errors, status, result } = state;
  const [query, setQuery] = useState("");
  const [choosing, setChoosing] = useState(!prefilled);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const uid = useId();
  const byKey = new Map(options.map((o) => [o.key, o]));
  const selectedKey = data.service ? matchKey({ serviceSlug: data.service, guideSlug: data.guide || undefined }) : "";

  // Restore an unfinished ticket from this tab's session (Back and refresh never lose data). URL prefill wins.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "null") as Partial<Draft> | null;
      if (!saved) return;
      const keep = prefilled ? { service: initial.service, guide: initial.guide, other: false } : {};
      dispatch({ type: "hydrate", data: { ...saved, ...keep, ...(initial.url ? { siteUrl: initial.url } : {}) } });
    } catch {
      // Storage blocked: the flow still works, it just will not survive a refresh.
    }
  }, [prefilled, initial.service, initial.guide, initial.url]);

  useEffect(() => {
    try {
      if (status === "done") sessionStorage.removeItem(DRAFT_KEY);
      else sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch {}
  }, [data, status]);

  // Every transition: report the step and move focus to the new screen's heading.
  useEffect(() => {
    track("booking_step", { step: `ticket:${status === "done" ? "done" : screen}` });
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
  }, [screen, status]);

  const set = (patch: Partial<Draft>) => dispatch({ type: "set", patch });
  const idx = ticketScreens.indexOf(screen);

  const next = () => {
    const parsed = screenSchemas[screen].safeParse(data);
    if (!parsed.success) return dispatch({ type: "errors", errors: issuesToErrors(parsed.error.issues) });
    dispatch({ type: "go", screen: ticketScreens[idx + 1] });
  };

  const submit = async () => {
    if (status === "submitting") return; // double-submit guard (the server also de-duplicates by requestId)
    const requestId = data.requestId || crypto.randomUUID();
    if (!data.requestId) set({ requestId });
    dispatch({ type: "submitting" });
    try {
      const res = await submitTicket({ ...data, requestId });
      if (!res.ok) {
        // Send the visitor back to the first screen with a problem.
        const firstBad = ticketScreens.find((s) => Object.keys(res.fieldErrors).some((f) => FIELD_SCREEN[f] === s));
        if (firstBad) dispatch({ type: "go", screen: firstBad });
        return dispatch({ type: "failed", errors: res.fieldErrors });
      }
      track("booking_complete", {});
      dispatch({ type: "done", result: res });
    } catch {
      dispatch({ type: "failed" });
    }
  };

  const errorCount = Object.keys(errors).length;
  const selected = byKey.get(selectedKey);
  const problemTitle = data.other ? copy.problem.other : (selected?.title ?? "");
  const price = data.service ? prices[data.service] : null;

  if (status === "done" && result) {
    const summary = [
      `Ticket: ${result.ticketId}`,
      `Problem: ${problemTitle}`,
      ...(data.description ? [`Details: ${data.description}`] : []),
      `Site: ${data.siteUrl}`,
      `Contact: ${data.name}, ${data.email}${data.phone ? `, ${data.phone}` : ""}`,
    ].join("\n");
    const mailto = `mailto:${brand.email}?subject=${encodeURIComponent(`Emergency ticket ${result.ticketId}`)}&body=${encodeURIComponent(summary)}`;
    return (
      <section aria-labelledby={`${uid}-done`} className="rounded-card border border-line bg-surface p-6 shadow-card md:p-10">
        <CheckCircle size={32} aria-hidden className="text-text" />
        <h2 id={`${uid}-done`} ref={heading} tabIndex={-1} className="mt-4 text-2xl font-semibold tracking-tight text-text focus:outline-none">
          {copy.success.title}
        </h2>
        <p className="mt-1 font-mono text-[13px] text-muted">{result.ticketId}</p>
        <ol className="mt-6 space-y-2">
          {copy.success.next.map((line, i) => (
            <li key={line} className="flex gap-3 text-[16px] leading-relaxed text-text">
              <Check size={18} aria-hidden className="mt-1 shrink-0 text-muted" />
              <span>
                {line}
                {i === 2 && !brand.claims.quoteBeforeWork && <span className="ml-2 font-mono text-[13px] text-muted">{"{{CONFIRM}}"}</span>}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-8 rounded-card border border-line bg-surface-2 p-5 text-[15px] leading-relaxed text-text">
          {result.emailed ? (
            copy.success.emailSent.replace("{email}", data.email)
          ) : (
            <>
              <p>{copy.success.emailFallback}</p>
              <a href={mailto} className={`mt-4 ${ctaStyles.ghost}`}>
                Email ticket {result.ticketId}
              </a>
            </>
          )}
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {result.handoff.kind === "redirect" && (
            <a href={result.handoff.url} className={ctaStyles.solid}>
              {result.handoff.label}
            </a>
          )}
          <ChatButton location="ticket:done" service={data.service || undefined} variant={result.handoff.kind === "redirect" ? "ghost" : "solid"} />
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby={`${uid}-h`} className="rounded-card border border-line bg-surface p-6 shadow-card md:p-10">
      {/* Progress by screen name, never "Step 1 of 4". Completed screens are buttons back. */}
      <ol aria-label="Ticket progress" className="flex flex-wrap gap-x-6 gap-y-2 border-b border-line pb-6">
        {ticketScreens.map((s, i) => {
          const label = copy.screens[s];
          const done = i < idx;
          return (
            <li key={s} aria-current={s === screen ? "step" : undefined} className="font-mono text-[13px]">
              {done ? (
                <button type="button" onClick={() => dispatch({ type: "go", screen: s })} className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-muted hover:text-text">
                  <Check size={14} aria-hidden />
                  {label}
                </button>
              ) : (
                <span className={`inline-flex min-h-11 items-center ${s === screen ? "text-text" : "text-muted"}`}>{label}</span>
              )}
            </li>
          );
        })}
      </ol>

      <h2 id={`${uid}-h`} ref={heading} tabIndex={-1} className="mt-8 text-2xl font-semibold tracking-tight text-text focus:outline-none">
        {copy.screens[screen]}
      </h2>

      {/* Announces validation and server problems to screen readers. */}
      <div aria-live="polite" className="empty:hidden">
        {(errorCount > 0 || status === "error") && (
          <p role="alert" className="mt-4 flex items-start gap-2 rounded-control border border-accent/60 bg-surface-2 px-4 py-3 text-[15px] text-text">
            <Warning size={18} aria-hidden className="mt-0.5 shrink-0 text-accent-ink" />
            {status === "error" && errorCount === 0 ? copy.errors.server : `${copy.errors.summary} (${errorCount})`}
          </p>
        )}
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (screen === "confirm") void submit();
          else next();
        }}
        className="mt-8"
      >
        {/* Honeypot: hidden from people and assistive tech. */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={data.company} onChange={(e) => set({ company: e.target.value })} />

        {screen === "problem" && (
          <>
            {!choosing && selected ? (
              <div className="rounded-card border border-accent/60 bg-surface-2 p-5">
                <p className="text-lg font-semibold tracking-tight text-text">{selected.title}</p>
                {selected.errorText && <p className="mt-1 font-mono text-[13px] text-muted">{selected.errorText}</p>}
                <p className="mt-3 text-[14px] text-muted">{copy.problem.prefilled}</p>
                <button type="button" onClick={() => setChoosing(true)} className={`mt-4 ${ctaStyles.text}`}>
                  {copy.problem.change}
                </button>
              </div>
            ) : (
              <>
                <Field id="problem-search" label={copy.problem.searchLabel} help={copy.problem.searchHelp}>
                  <input
                    id="problem-search"
                    type="search"
                    autoComplete="off"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-describedby="problem-search-help"
                    className={inputCls}
                  />
                </Field>
                <fieldset className="mt-6" aria-describedby={errors.service ? "service-error" : undefined}>
                  <legend className="text-[14px] text-muted">{query.trim() ? copy.problem.searchLabel : copy.problem.common}</legend>
                  {(() => {
                    const keys = query.trim().length > 1 ? matchProblem(query, index, 6).map(matchKey) : common;
                    return (
                      <div className="mt-3 grid gap-2">
                        {keys.length === 0 && <p className="text-[15px] text-muted">{copy.problem.noMatch}</p>}
                        {keys.map((k) => {
                          const o = byKey.get(k)!;
                          return (
                            <Choice
                              key={k}
                              name="problem"
                              value={k}
                              checked={!data.other && selectedKey === k}
                              onChange={() => set({ service: o.service, guide: o.guide ?? "", other: false })}
                              label={o.title}
                              help={o.errorText}
                            />
                          );
                        })}
                        <Choice name="problem" value="other" checked={data.other} onChange={() => set({ other: true, service: "", guide: "" })} label={copy.problem.other} />
                      </div>
                    );
                  })()}
                  {errors.service && (
                    <p id="service-error" className="mt-2 flex items-center gap-2 text-[14px] text-accent-ink">
                      <Warning size={16} aria-hidden />
                      {errors.service}
                    </p>
                  )}
                </fieldset>
              </>
            )}
            {(data.other || data.description) && (
              <Field id="description" label={copy.problem.otherLabel} help={copy.problem.otherHelp} error={errors.description}>
                <textarea
                  id="description"
                  rows={4}
                  value={data.description}
                  onChange={(e) => set({ description: e.target.value })}
                  aria-invalid={!!errors.description}
                  aria-describedby={describedBy("description", true, errors.description)}
                  className={`${inputCls} h-auto py-3`}
                />
              </Field>
            )}
          </>
        )}

        {screen === "site" && (
          <>
            <Field id="siteUrl" label="Site address" help={copy.site.urlHelp} error={errors.siteUrl}>
              <input
                id="siteUrl"
                type="text"
                inputMode="url"
                autoComplete="url"
                placeholder="example.com"
                value={data.siteUrl}
                onChange={(e) => set({ siteUrl: e.target.value })}
                aria-invalid={!!errors.siteUrl}
                aria-describedby={describedBy("siteUrl", true, errors.siteUrl)}
                className={inputCls}
              />
            </Field>
            <Field id="host" label={copy.site.hostLabel} help={copy.site.hostHelp} error={errors.host}>
              <input
                id="host"
                type="text"
                autoComplete="off"
                value={data.host}
                onChange={(e) => set({ host: e.target.value })}
                aria-invalid={!!errors.host}
                aria-describedby={describedBy("host", true, errors.host)}
                className={inputCls}
              />
            </Field>
            <fieldset className="mt-6" aria-describedby="access-help">
              <legend className="text-[15px] font-medium text-text">{copy.site.accessLabel}</legend>
              <p id="access-help" className="mt-1 text-[14px] text-muted">
                {copy.site.accessHelp}
              </p>
              <div className="mt-3 grid gap-2">
                {copy.site.access.map((a) => (
                  <Choice key={a.value} name="access" value={a.value} checked={data.access === a.value} onChange={() => set({ access: a.value })} label={a.label} help={a.help} />
                ))}
              </div>
            </fieldset>
          </>
        )}

        {screen === "contact" && (
          <>
            <Field id="name" label="Name" help={copy.contact.nameHelp} error={errors.name}>
              <input id="name" autoComplete="name" value={data.name} onChange={(e) => set({ name: e.target.value })} aria-invalid={!!errors.name} aria-describedby={describedBy("name", true, errors.name)} className={inputCls} />
            </Field>
            <Field id="email" label="Email" help={copy.contact.emailHelp} error={errors.email}>
              <input id="email" type="email" autoComplete="email" value={data.email} onChange={(e) => set({ email: e.target.value })} aria-invalid={!!errors.email} aria-describedby={describedBy("email", true, errors.email)} className={inputCls} />
            </Field>
            <Field id="phone" label={copy.contact.phoneLabel} help={copy.contact.phoneHelp} error={errors.phone}>
              <input id="phone" type="tel" autoComplete="tel" value={data.phone} onChange={(e) => set({ phone: e.target.value })} aria-invalid={!!errors.phone} aria-describedby={describedBy("phone", true, errors.phone)} className={inputCls} />
            </Field>
            <fieldset className="mt-6">
              <legend className="text-[15px] font-medium text-text">{copy.contact.methodLabel}</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {copy.contact.methods.map((m) => (
                  <Choice key={m.value} name="method" value={m.value} checked={data.method === m.value} onChange={() => set({ method: m.value })} label={m.label} />
                ))}
              </div>
            </fieldset>
          </>
        )}

        {screen === "confirm" && (
          <dl className="divide-y divide-line border-y border-line">
            {[
              { k: copy.screens.problem, v: problemTitle + (data.description ? `: ${data.description}` : ""), to: "problem" as const },
              { k: copy.screens.site, v: `${data.siteUrl}${data.host ? `, ${data.host}` : ""}`, to: "site" as const },
              { k: "Access", v: copy.site.access.find((a) => a.value === data.access)?.label ?? "", to: "site" as const },
              { k: copy.screens.contact, v: `${data.name}, ${data.email}${data.phone ? `, ${data.phone}` : ""}`, to: "contact" as const },
            ].map((row) => (
              <div key={row.k} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr_auto] sm:items-baseline sm:gap-4">
                <dt className="font-mono text-[13px] text-muted">{row.k}</dt>
                <dd className="text-[15px] text-text">{row.v}</dd>
                <dd>
                  <button type="button" onClick={() => dispatch({ type: "go", screen: row.to })} className={ctaStyles.text}>
                    Edit
                  </button>
                </dd>
              </div>
            ))}
            <div className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="font-mono text-[13px] text-muted">{copy.confirm.priceLabel}</dt>
              <dd className="text-[15px] text-text">
                {price ?? copy.confirm.quote}
                {!price && !brand.claims.quoteBeforeWork && <span className="ml-2 font-mono text-[13px] text-muted">{"{{CONFIRM}}"}</span>}
                {brand.legacy.facts && <span className="mt-1 block text-muted">Every fix carries the {brand.legacy.facts.guaranteeDays}-day guarantee.</span>}
              </dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
              <dt className="font-mono text-[13px] text-muted">{copy.confirm.nextLabel}</dt>
              <dd className="text-[15px] text-text">
                {handoffLabel ?? (
                  <>
                    Payment or scheduling with our provider
                    <span className="ml-2 font-mono text-[13px] text-muted">{"{{CONFIRM}}"}</span>
                  </>
                )}
              </dd>
            </div>
          </dl>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-2">
          {idx > 0 && (
            <button key="back" type="button" onClick={() => dispatch({ type: "go", screen: ticketScreens[idx - 1] })} className={ctaStyles.ghost}>
              Back
            </button>
          )}
          {screen === "confirm" ? (
            <button key="submit" type="submit" disabled={status === "submitting"} aria-busy={status === "submitting"} className={`${ctaStyles.solid} disabled:opacity-60`}>
              {status === "submitting" ? "Sending" : CTA.BOOK}
            </button>
          ) : (
            <button key="next" type="submit" className={ctaStyles.solid}>
              Continue
            </button>
          )}
          {status === "error" && <ChatButton location="ticket:error" service={data.service || undefined} />}
        </div>
      </form>
    </section>
  );
}
