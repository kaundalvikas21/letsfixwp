import type { Metadata } from "next";
import { BookLink, ChatButton } from "@/components/Cta";
import { site } from "@/content/site";
import { testimonials } from "@/content/testimonials";

export const metadata: Metadata = {
  title: "About Us",
  description: "FixMyWP repairs broken, hacked and slow WordPress sites on demand.",
  alternates: { canonical: "/about" },
};

export default function About() {
  const press = testimonials[0];
  return (
    <>
      <h1>About {site.name}</h1>
      <p>
        {site.name} repairs WordPress sites that are down, hacked, throwing errors or too slow. Founded by Makis
        Mourelatos.
      </p>
      <p>
        Every service carries a {site.guaranteeDays}-day guarantee. Hacked sites are {site.hackedPromise}.
      </p>
      <figure>
        <blockquote cite={press.url}>
          <p>{press.quote}</p>
        </blockquote>
        <figcaption>
          {press.name}, {press.org} <a href={press.url}>Read the interview</a>
        </figcaption>
      </figure>
      <p>
        <BookLink location="about" /> <ChatButton location="about" />
      </p>
    </>
  );
}
