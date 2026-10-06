import { notFound } from "next/navigation";
import { CompareTemplate } from "@/components/templates/CompareTemplate";
import { pageMetadata } from "@/components/templates/parts";
import { routes } from "@/config/routes";
import { compares, getCompare } from "@/content";

export const dynamicParams = false;
export const generateStaticParams = () => compares.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: PageProps<"/compare/[slug]">) {
  const c = getCompare((await params).slug);
  return c ? pageMetadata(c.seo, routes.compare(c.slug)) : {};
}

export default async function ComparePage({ params }: PageProps<"/compare/[slug]">) {
  const c = getCompare((await params).slug);
  if (!c) notFound();
  return <CompareTemplate compare={c} />;
}
