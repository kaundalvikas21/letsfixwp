import type { Metadata } from "next";
import { ChatButton } from "@/components/Cta";
import { getProblem, problems } from "@/content/problems";
import { site } from "@/content/site";
import { BookingFlow } from "./BookingFlow";

export const metadata: Metadata = {
  title: "Book a WordPress Fix",
  description: "Tell us what is broken and which site it is on. An engineer picks it up from there.",
  alternates: { canonical: "/app" },
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function BookingPage({ searchParams }: PageProps<"/app">) {
  const sp = await searchParams;
  const problem = getProblem(one(sp.problem))?.slug ?? "";
  const url = one(sp.url).slice(0, 300);

  return (
    <>
      <h1>Book a fix</h1>
      <p>
        Four short steps. Every service carries a {site.guaranteeDays}-day guarantee. Rather talk first?{" "}
        <ChatButton location="booking" />
      </p>
      <BookingFlow
        options={problems.map((p) => ({ slug: p.slug, title: p.title }))}
        initialProblem={problem}
        initialUrl={url}
      />
    </>
  );
}
