import type { Metadata } from "next";
import { BookLink } from "@/components/Cta";
import { testimonials } from "@/content/testimonials";

export const metadata: Metadata = {
  title: { absolute: "WordPress Testimonials for Fix My WP" },
  description: "Client Testimonials for our Fix WordPress Services",
  alternates: { canonical: "/testimonials" },
};

export default function Testimonials() {
  return (
    <>
      <h1>Testimonials</h1>
      {testimonials.map((t) => (
        <figure key={t.name}>
          <blockquote cite={"url" in t ? t.url : undefined}>
            {t.quote.split("\n\n").map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </blockquote>
          <figcaption>
            {t.name}
            {"role" in t && `, ${t.role}`}, {t.org}
            {"location" in t && `, ${t.location}`}
            {"url" in t && (
              <>
                {" "}
                <a href={t.url}>Read more</a>
              </>
            )}
          </figcaption>
        </figure>
      ))}
      <p>
        <BookLink location="testimonials" />
      </p>
    </>
  );
}
