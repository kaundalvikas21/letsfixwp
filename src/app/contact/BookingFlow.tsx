"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { brand } from "@/config/brand";
import { CTA } from "@/config/cta";
import { routes } from "@/config/routes";
import { track } from "@/lib/track";
import { submitBooking } from "./actions";
import { type Booking, bookingSchema, HANDOFF_KEY, type RequestType, stepsFor } from "./booking-schema";

type Option = { id: string; title: string };

const SUBMIT_LABEL: Record<RequestType, string> = { fix: CTA.BOOK, project: CTA.QUOTE, check: CTA.CHECK };
const SUBJECT: Record<RequestType, string> = { fix: "Fix request", project: "Project quote request", check: "Free site check request" };

const mailtoFor = (b: Booking, serviceTitle: string) => {
  const body = [
    `Request: ${SUBJECT[b.type]}`,
    ...(b.type !== "check" ? [`Service: ${serviceTitle || "Not sure yet"}`] : []),
    ...(b.guide ? [`Guide: ${b.guide}`] : []),
    `Site: ${b.siteUrl}`,
    `Name: ${b.name}`,
    `Email: ${b.email}`,
    ...(b.phone ? [`Phone: ${b.phone}`] : []),
    ...(b.description ? ["", b.description] : []),
  ].join("\n");
  const subject = `${SUBJECT[b.type]}: ${serviceTitle || b.siteUrl}`;
  return `mailto:${brand.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export function BookingFlow({
  type,
  options,
  initial,
}: {
  type: RequestType;
  options: Option[];
  initial: { service: string; guide: string; url: string };
}) {
  const router = useRouter();
  const steps = stepsFor(type);
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState("");
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<Booking>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      type,
      service: initial.service,
      guide: initial.guide,
      description: "",
      siteUrl: initial.url,
      name: "",
      email: "",
      phone: "",
    },
  });

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const titleOf = (id: string) => options.find((o) => o.id === id)?.title ?? "";

  useEffect(() => {
    track("booking_step", { step: `${type}:${current.id}` });
  }, [type, current.id]);

  const next = async () => {
    if (await trigger([...current.fields])) setStep((s) => s + 1);
  };

  const onSubmit = (data: Booking) => {
    setServerError("");
    startTransition(async () => {
      const res = await submitBooking(data);
      if (!res.ok) return setServerError(res.error);
      track("booking_complete", {});
      try {
        sessionStorage.setItem(HANDOFF_KEY, mailtoFor(data, titleOf(data.service)));
      } catch {
        // Storage blocked: /contact/thanks/ falls back to showing the email address.
      }
      router.push(routes.contactThanks);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-labelledby="booking-heading">
      <h2 id="booking-heading">
        Step {step + 1} of {steps.length}: {current.label}
      </h2>
      <ol aria-label="Booking steps">
        {steps.map((s, i) => (
          <li key={s.id} aria-current={i === step ? "step" : undefined}>
            {s.label}
          </li>
        ))}
      </ol>

      <input type="hidden" {...register("type")} />
      <input type="hidden" {...register("guide")} />

      {type !== "check" && (
        <fieldset hidden={current.id !== "service"}>
          <legend>What do you need?</legend>
          <label htmlFor="service">Service</label>
          <select id="service" defaultValue={initial.service} {...register("service")}>
            <option value="">Not sure yet</option>
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.title}
              </option>
            ))}
          </select>
          <label htmlFor="description">What do you see, or what do you need built? (optional)</label>
          <textarea id="description" rows={5} {...register("description")} />
        </fieldset>
      )}

      <fieldset hidden={current.id !== "site"}>
        <legend>Which site?</legend>
        <label htmlFor="siteUrl">Site address</label>
        <input
          id="siteUrl"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="example.com"
          defaultValue={initial.url}
          aria-invalid={!!errors.siteUrl}
          aria-describedby={errors.siteUrl ? "siteUrl-error" : undefined}
          {...register("siteUrl")}
        />
        {errors.siteUrl && <p id="siteUrl-error">{errors.siteUrl.message}</p>}
        {type === "check" && (
          <>
            <label htmlFor="description">Anything you want us to look at? (optional)</label>
            <textarea id="description" rows={4} {...register("description")} />
          </>
        )}
      </fieldset>

      <fieldset hidden={current.id !== "contact"}>
        <legend>How do we reach you?</legend>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
        {errors.name && <p id="name-error">{errors.name.message}</p>}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && <p id="email-error">{errors.email.message}</p>}
        <label htmlFor="phone">Phone (optional)</label>
        <input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
      </fieldset>

      {current.id === "review" && (
        <dl>
          {type !== "check" && (
            <>
              <dt>Service</dt>
              <dd>{titleOf(getValues("service")) || "Not sure yet"}</dd>
            </>
          )}
          {getValues("description") && (
            <>
              <dt>Details</dt>
              <dd>{getValues("description")}</dd>
            </>
          )}
          <dt>Site</dt>
          <dd>{getValues("siteUrl")}</dd>
          <dt>Name</dt>
          <dd>{getValues("name")}</dd>
          <dt>Email</dt>
          <dd>{getValues("email")}</dd>
          {getValues("phone") && (
            <>
              <dt>Phone</dt>
              <dd>{getValues("phone")}</dd>
            </>
          )}
        </dl>
      )}

      {serverError && <p role="alert">{serverError}</p>}

      <p>
        {step > 0 && (
          <button key="back" type="button" onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        )}{" "}
        {isLast ? (
          <button key="submit" type="submit" disabled={pending}>
            {SUBMIT_LABEL[type]}
          </button>
        ) : (
          <button key="next" type="button" onClick={next}>
            Continue
          </button>
        )}
      </p>
    </form>
  );
}
