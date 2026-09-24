import { diamondMetadata, renderDiamondPage } from "../renderDiamondPage";

export async function generateMetadata({ params }) {
  return diamondMetadata(params);
}

// Same experience as /diamond/[id], with the left-aligned editorial
// stage lockup instead of the centered one.
export default async function EditorialDiamondPage({ params }) {
  return renderDiamondPage(params, "editorial");
}
