import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { nodeByPath, nodes, serviceIdOf } from "@/config/routes";
import { getCity, getService } from "@/content";
import { CityHubTemplate, CityTemplate } from "./CityTemplates";
import { HubTemplate } from "./HubTemplate";
import { pageMetadata } from "./parts";
import { ServiceTemplate } from "./ServiceTemplate";

// SITEMAP hubs (/[hub]/), services and the city hub (/[hub]/[service]/) and cities (/[hub]/[service]/[city]/)
// all resolve here by node kind. Pages and collections (/pricing/, /guides/, ...) are static folders and win.
const KINDS = new Set(["hub", "service", "cityHub", "city"]);
const KEYS = ["hub", "service", "city"] as const;

const segments = (path: string) => path.split("/").filter(Boolean);
const lastSegment = (path: string) => segments(path).at(-1)!;

/** generateStaticParams for one route depth: { hub }, { hub, service } or { hub, service, city }. */
export const nodeParams = (depth: 1 | 2 | 3) =>
  nodes
    .filter((n) => KINDS.has(n.kind) && segments(n.path).length === depth)
    .map((n) => Object.fromEntries(segments(n.path).map((s, i) => [KEYS[i], s])));

export const pathFromParams = (p: Partial<Record<(typeof KEYS)[number], string>>) =>
  `/${KEYS.map((k) => p[k]).filter(Boolean).join("/")}/`;

export function nodeMetadata(path: string): Metadata {
  const n = nodeByPath.get(path);
  if (!n) return {};
  if (n.kind === "service") return pageMetadata(getService(serviceIdOf(n.path))!.seo, n.path);
  if (n.kind === "city") return pageMetadata(getCity(lastSegment(n.path))!.seo, n.path);
  const children = nodes.filter((c) => c.parentPath === n.path).map((c) => c.title);
  const description = `${n.title}: ${children.join(", ")}.`;
  return {
    title: n.title,
    description: description.length > 155 ? `${description.slice(0, 152).replace(/[ ,]+\S*$/, "")}...` : description,
    alternates: { canonical: n.path },
  };
}

export function NodePage({ path }: { path: string }) {
  const n = nodeByPath.get(path);
  if (!n || !KINDS.has(n.kind)) notFound();
  if (n.kind === "hub") return <HubTemplate node={n} />;
  if (n.kind === "cityHub") return <CityHubTemplate node={n} />;
  if (n.kind === "city") return <CityTemplate node={n} city={getCity(lastSegment(n.path))!} />;
  return <ServiceTemplate service={getService(serviceIdOf(n.path))!} />;
}
