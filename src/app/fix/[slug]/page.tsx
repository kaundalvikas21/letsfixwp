import { notFound } from "next/navigation";
import { ProblemTemplate, problemMetadata } from "@/components/ProblemTemplate";
import { getProblem, problems } from "@/content/problems";

// Problems with a legacySlug are served at their legacy URL; /fix/<slug> 308s there (next.config.ts).
export const dynamicParams = false;
export const generateStaticParams = () =>
  problems.filter((p) => !p.legacySlug).map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: PageProps<"/fix/[slug]">) {
  const p = getProblem((await params).slug);
  return p ? problemMetadata(p) : {};
}

export default async function ProblemPage({ params }: PageProps<"/fix/[slug]">) {
  const p = getProblem((await params).slug);
  if (!p || p.legacySlug) notFound();
  return <ProblemTemplate problem={p} />;
}
