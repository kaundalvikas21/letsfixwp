import { NodePage, nodeMetadata, nodeParams, pathFromParams } from "@/components/templates/NodeRoute";

export const dynamicParams = false;
export const generateStaticParams = () => nodeParams(3);
export const generateMetadata = async ({ params }: PageProps<"/[hub]/[service]/[city]">) =>
  nodeMetadata(pathFromParams(await params));

export default async function CityPage({ params }: PageProps<"/[hub]/[service]/[city]">) {
  return <NodePage path={pathFromParams(await params)} />;
}
