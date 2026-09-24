import { diamondMetadata, renderDiamondPage } from "./renderDiamondPage";

export async function generateMetadata({ params }) {
  return diamondMetadata(params);
}

export default async function DiamondPage({ params }) {
  return renderDiamondPage(params);
}
