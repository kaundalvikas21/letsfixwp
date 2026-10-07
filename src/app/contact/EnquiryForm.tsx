"use client";

import { CheckCircle, Warning } from "@phosphor-icons/react";
import { useState } from "react";
import { ChatButton } from "@/components/Cta";
import { ctaStyles } from "@/components/cta-styles";
import { CTA } from "@/config/cta";
import { pageCopy } from "@/content/pages";
import { track } from "@/lib/track";
import { submitEnquiry, type FieldErrors } from "./actions";
import { type Enquiry, enquirySchema } from "./booking-schema";

const copy = pageCopy.booking;
const inputCls =
  "mt-2 h-12 w-full rounded-control border border-line bg-surface-2 px-4 text-base text-text aria-[invalid=true]:border-accent";

function Err({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-2 flex items-center gap-2 text-[14px] text-accent-ink">
      <Warning size={16} aria-hidden />
      {msg}
    </p>
  );
}

/** Project enquiry (routes.quote, type=project): service, budget range, timeline, contact. One screen. */
export function EnquiryForm({ options, initialService }: { options: { id: string; title: string }[]; initialService: string }) {
  const [data, setData] = useState<Omit<Enquiry, "requestId">>({
    service: initialService,
    budget: "",
    timeline: "",
    details: "",
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [requestId] = useState(() => (typeof crypto !== "undefined" ? crypto.randomUUID() : ""));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "done">("idle");
  const [ticketId, setTicketId] = useState("");
  const set = (patch: Partial<typeof data>) => {
    setData((d) => ({ ...d, ...patch }));
    setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => !(k in patch))));
  };

  const submit = async () => {
    if (status === "submitting") return;
    const parsed = enquirySchema.safeParse({ ...data, requestId });
    if (!parsed.success) return setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
    setStatus("submitting");
    try {
      const res = await submitEnquiry(parsed.data);
      if (!res.ok) {
        setErrors(res.fieldErrors);
        return setStatus("error");
      }
      track("booking_complete", {});
      setTicketId(res.ticketId);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <section role="status" className="rounded-card border border-line bg-surface p-6 shadow-card md:p-10">
        <CheckCircle size={32} aria-hidden className="text-text" />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-text">{copy.project.successTitle}</h2>
        <p className="mt-1 font-mono text-[13px] text-muted">{ticketId}</p>
        <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-text">{copy.project.successBody}</p>
        <ChatButton location="enquiry:done" service={data.service} className="mt-8" />
      </section>
    );
  }

  const errCount = Object.keys(errors).length;
  const select = (id: keyof typeof data, label: string, values: readonly string[] | { id: string; title: string }[], help?: string) => (
    <div className="mt-6">
      <label htmlFor={`enq-${id}`} className="block text-[15px] font-medium text-text">
        {label}
      </label>
      {help && (
        <p id={`enq-${id}-help`} className="mt-1 text-[14px] text-muted">
          {help}
        </p>
      )}
      <select
        id={`enq-${id}`}
        value={data[id]}
        onChange={(e) => set({ [id]: e.target.value })}
        aria-invalid={!!errors[id]}
        aria-describedby={[help && `enq-${id}-help`, errors[id] && `enq-${id}-error`].filter(Boolean).join(" ") || undefined}
        className={inputCls}
      >
        <option value="">Choose one</option>
        {values.map((v) => (typeof v === "string" ? <option key={v}>{v}</option> : <option key={v.id} value={v.id}>{v.title}</option>))}
      </select>
      <Err id={`enq-${id}-error`} msg={errors[id]} />
    </div>
  );
  const text = (id: "name" | "email" | "phone", label: string, type: string, auto: string) => (
    <div className="mt-6">
      <label htmlFor={`enq-${id}`} className="block text-[15px] font-medium text-text">
        {label}
      </label>
      <input
        id={`enq-${id}`}
        type={type}
        autoComplete={auto}
        value={data[id]}
        onChange={(e) => set({ [id]: e.target.value })}
        aria-invalid={!!errors[id]}
        aria-describedby={errors[id] ? `enq-${id}-error` : undefined}
        className={inputCls}
      />
      <Err id={`enq-${id}-error`} msg={errors[id]} />
    </div>
  );

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      className="rounded-card border border-line bg-surface p-6 shadow-card md:p-10"
    >
      <p className="max-w-[60ch] text-[16px] leading-relaxed text-muted">{copy.project.intro}</p>
      <div aria-live="polite">
        {(errCount > 0 || status === "error") && (
          <p role="alert" className="mt-6 flex items-start gap-2 rounded-control border border-accent/60 bg-surface-2 px-4 py-3 text-[15px] text-text">
            <Warning size={18} aria-hidden className="mt-0.5 shrink-0 text-accent-ink" />
            {errCount > 0 ? `${copy.errors.summary} (${errCount})` : copy.errors.server}
          </p>
        )}
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={data.company} onChange={(e) => set({ company: e.target.value })} />
      {select("service", copy.project.serviceLabel, options)}
      <div className="grid gap-x-6 sm:grid-cols-2">
        {select("budget", copy.project.budgetLabel, copy.project.budgets, copy.project.budgetHelp)}
        {select("timeline", copy.project.timelineLabel, copy.project.timelines)}
      </div>
      <div className="mt-6">
        <label htmlFor="enq-details" className="block text-[15px] font-medium text-text">
          {copy.project.detailsLabel}
        </label>
        <textarea
          id="enq-details"
          rows={4}
          value={data.details}
          onChange={(e) => set({ details: e.target.value })}
          aria-invalid={!!errors.details}
          aria-describedby={errors.details ? "enq-details-error" : undefined}
          className={`${inputCls} h-auto py-3`}
        />
        <Err id="enq-details-error" msg={errors.details} />
      </div>
      <div className="grid gap-x-6 sm:grid-cols-3">
        {text("name", "Name", "text", "name")}
        {text("email", "Email", "email", "email")}
        {text("phone", "Phone (optional)", "tel", "tel")}
      </div>
      <button type="submit" disabled={status === "submitting"} aria-busy={status === "submitting"} className={`mt-10 ${ctaStyles.solid} disabled:opacity-60`}>
        {status === "submitting" ? "Sending" : CTA.QUOTE}
      </button>
    </form>
  );
}
