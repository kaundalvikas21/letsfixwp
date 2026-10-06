import { notFound } from "next/navigation";
import { ProblemTemplate, problemMetadata } from "@/components/ProblemTemplate";
import { getProblemByLegacySlug, legacyProblems } from "@/content/problems";

// Live URLs that keep their SEO equity: /wordpress-hacked-fix, /fix-wordpress-plugin, /fix-wordpress-theme.
export const dynamicParams = false;
export const generateStaticParams = () => legacyProblems.map((p) => ({ legacySlug: p.legacySlug! }));

export async function generateMetadata({ params }: PageProps<"/[legacySlug]">) {
  const p = getProblemByLegacySlug((await params).legacySlug);
  return p ? problemMetadata(p) : {};
}

export default async function LegacyProblemPage({ params }: PageProps<"/[legacySlug]">) {
  const p = getProblemByLegacySlug((await params).legacySlug);
  if (!p) notFound();
  return <ProblemTemplate problem={p} />;
}
