import { NodePage, nodeMetadata, nodeParams, pathFromParams } from "@/components/templates/NodeRoute";

export const dynamicParams = false;
export const generateStaticParams = () => nodeParams(2);
export const generateMetadata = async ({ params }: PageProps<"/[hub]/[service]">) => nodeMetadata(pathFromParams(await params));

export default async function ServicePage({ params }: PageProps<"/[hub]/[service]">) {
  return <NodePage path={pathFromParams(await params)} />;
}
