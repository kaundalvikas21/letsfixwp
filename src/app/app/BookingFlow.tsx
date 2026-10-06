"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { CTA } from "@/config/cta";
import { site } from "@/content/site";
import { track } from "@/lib/track";
import { submitBooking } from "./actions";
import { type Booking, bookingSchema, bookingSteps } from "./booking-schema";

type Option = { slug: string; title: string };

const mailtoFor = (b: Booking, problemTitle: string) => {
  const body = [
    `Problem: ${problemTitle || "Not listed"}`,
    `Site: ${b.siteUrl}`,
    `Name: ${b.name}`,
    `Email: ${b.email}`,
    ...(b.phone ? [`Phone: ${b.phone}`] : []),
    ...(b.description ? ["", b.description] : []),
  ].join("\n");
  const subject = `Fix request: ${problemTitle || b.siteUrl}`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export function BookingFlow({
  options,
  initialProblem,
  initialUrl,
}: {
  options: Option[];
  initialProblem: string;
  initialUrl: string;
}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<Booking | null>(null);
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
    defaultValues: { problem: initialProblem, description: "", siteUrl: initialUrl, name: "", email: "", phone: "" },
  });

  const current = bookingSteps[step];
  const isLast = step === bookingSteps.length - 1;
  const titleOf = (slug: string) => options.find((o) => o.slug === slug)?.title ?? "";

  useEffect(() => {
    track("booking_step", { step: done ? "complete" : current.id });
  }, [current.id, done]);

  const next = async () => {
    if (await trigger([...current.fields])) setStep((s) => s + 1);
  };

  const onSubmit = (data: Booking) => {
    setServerError("");
    startTransition(async () => {
      const res = await submitBooking(data);
      if (!res.ok) return setServerError(res.error);
      track("booking_complete", {});
      setDone(data);
    });
  };

  if (done) {
    return (
      <section aria-labelledby="booking-done">
        <h2 id="booking-done">One last step: send it to our engineers</h2>
        <p>
          Your details are ready. Send them from your email app so an engineer can reply straight to you at{" "}
          {done.email}.
        </p>
        <p>
          <a href={mailtoFor(done, titleOf(done.problem))}>Email this request to {site.email}</a>
        </p>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-labelledby="booking-heading">
      <h2 id="booking-heading">
        Step {step + 1} of {bookingSteps.length}: {current.label}
      </h2>
      <ol aria-label="Booking steps">
        {bookingSteps.map((s, i) => (
          <li key={s.id} aria-current={i === step ? "step" : undefined}>
            {s.label}
          </li>
        ))}
      </ol>

      <fieldset hidden={current.id !== "problem"}>
        <legend>What is wrong?</legend>
        <label htmlFor="problem">Problem</label>
        <select id="problem" defaultValue={initialProblem} {...register("problem")}>
          <option value="">Something else</option>
          {options.map((o) => (
            <option key={o.slug} value={o.slug}>
              {o.title}
            </option>
          ))}
        </select>
        <label htmlFor="description">What do you see? (optional)</label>
        <textarea id="description" rows={5} {...register("description")} />
      </fieldset>

      <fieldset hidden={current.id !== "site"}>
        <legend>Which site?</legend>
        <label htmlFor="siteUrl">Site address</label>
        <input
          id="siteUrl"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="example.com"
          defaultValue={initialUrl}
          aria-invalid={!!errors.siteUrl}
          aria-describedby={errors.siteUrl ? "siteUrl-error" : undefined}
          {...register("siteUrl")}
        />
        {errors.siteUrl && <p id="siteUrl-error">{errors.siteUrl.message}</p>}
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
          <dt>Problem</dt>
          <dd>{titleOf(getValues("problem")) || "Something else"}</dd>
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
          <button type="button" onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        )}{" "}
        {isLast ? (
          <button key="submit" type="submit" disabled={pending}>
            {CTA.BOOK}
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
