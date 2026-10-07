"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Warning } from "@phosphor-icons/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { ctaStyles } from "@/components/cta-styles";
import { brand } from "@/config/brand";
import { CTA } from "@/config/cta";
import { pageCopy } from "@/content/pages";
import { track } from "@/lib/track";
import { submitCheck } from "./actions";
import { type CheckRequest, checkSchema } from "./check-schema";

const input =
  "mt-2 h-12 w-full rounded-control border border-line bg-surface-2 px-4 text-base text-text placeholder:text-muted aria-[invalid=true]:border-accent";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-center gap-2 text-[14px] text-accent-ink">
      <Warning size={16} aria-hidden />
      {message}
    </p>
  );
}

/** Minimal check form: site URL, email, main worry. Inline errors under fields; composed success state. */
export function CheckForm() {
  const [done, setDone] = useState<CheckRequest | null>(null);
  const [serverError, setServerError] = useState("");
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckRequest>({ resolver: zodResolver(checkSchema), defaultValues: { siteUrl: "", email: "", worry: "" } });

  const onSubmit = (data: CheckRequest) => {
    setServerError("");
    startTransition(async () => {
      const res = await submitCheck(data);
      if (!res.ok) return setServerError(res.error);
      track("booking_complete", {});
      setDone(data);
    });
  };

  if (done) {
    const s = pageCopy.freeCheck.success;
    const mailto = `mailto:${brand.email}?subject=${encodeURIComponent(`Free site check: ${done.siteUrl}`)}&body=${encodeURIComponent(
      [`Site: ${done.siteUrl}`, `Email: ${done.email}`, ...(done.worry ? ["", done.worry] : [])].join("\n"),
    )}`;
    return (
      <div role="status" className="rounded-card border border-line bg-surface p-6 shadow-card md:p-8">
        <CheckCircle size={28} aria-hidden className="text-text" />
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-text">{s.title}</h2>
        <p className="mt-2 max-w-[52ch] text-[16px] leading-relaxed text-muted">
          {s.body}
          {!brand.claims.checkReportTiming && <span className="ml-2 font-mono text-[13px]">{"{{CONFIRM}}"}</span>}
        </p>
        <a href={mailto} className={`mt-6 ${ctaStyles.solid}`}>
          Send it to {brand.email}
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label={CTA.CHECK}
      className="rounded-card border border-line bg-surface p-6 shadow-card md:p-8"
    >
      <label htmlFor="siteUrl" className="block text-[15px] font-medium text-text">
        Site address
      </label>
      <input
        id="siteUrl"
        type="text"
        inputMode="url"
        autoComplete="url"
        placeholder="example.com"
        aria-invalid={!!errors.siteUrl}
        aria-describedby={errors.siteUrl ? "siteUrl-error" : undefined}
        className={input}
        {...register("siteUrl")}
      />
      <FieldError id="siteUrl-error" message={errors.siteUrl?.message} />

      <label htmlFor="email" className="mt-6 block text-[15px] font-medium text-text">
        Email for the report
      </label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? "email-error" : undefined}
        className={input}
        {...register("email")}
      />
      <FieldError id="email-error" message={errors.email?.message} />

      <label htmlFor="worry" className="mt-6 block text-[15px] font-medium text-text">
        Main worry <span className="text-muted">(optional)</span>
      </label>
      <textarea id="worry" rows={3} className={`${input} h-auto py-3`} {...register("worry")} />

      {serverError && (
        <p role="alert" className="mt-4 text-[14px] text-accent-ink">
          {serverError}
        </p>
      )}

      <button type="submit" disabled={pending} className={`mt-8 w-full ${ctaStyles.solid}`}>
        {CTA.CHECK}
      </button>
    </form>
  );
}
