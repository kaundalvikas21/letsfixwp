import { notFound } from "next/navigation";
import { GuideTemplate } from "@/components/templates/GuideTemplate";
import { pageMetadata } from "@/components/templates/parts";
import { routes } from "@/config/routes";
import { getGuide, guides } from "@/content";

export const dynamicParams = false;
export const generateStaticParams = () => guides.map((g) => ({ slug: g.slug }));

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">) {
  const g = getGuide((await params).slug);
  return g ? pageMetadata(g.seo, routes.guide(g.slug)) : {};
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  return <GuideTemplate guide={g} />;
}
