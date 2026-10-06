import { NodePage, nodeMetadata, nodeParams, pathFromParams } from "@/components/templates/NodeRoute";

export const dynamicParams = false;
export const generateStaticParams = () => nodeParams(1);
export const generateMetadata = async ({ params }: PageProps<"/[hub]">) => nodeMetadata(pathFromParams(await params));

export default async function HubPage({ params }: PageProps<"/[hub]">) {
  return <NodePage path={pathFromParams(await params)} />;
}
