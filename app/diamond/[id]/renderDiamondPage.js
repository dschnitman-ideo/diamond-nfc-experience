import { notFound } from "next/navigation";
import { getDiamond, getAdjacentDiamonds } from "@/data/diamonds";
import { getTracrRecord } from "@/data/tracr";
import { getGiaRecord } from "@/data/gia";
import DiamondExperience from "@/components/DiamondExperience";

// Shared by /diamond/[id] and its /editorial variant, which renders the
// same experience with a different stage layout.
export async function diamondMetadata(params) {
  const { id } = await params;
  const diamond = getDiamond(id);
  return {
    title: diamond ? `${diamond.name}: Diamond ${diamond.id}` : "Diamond not found",
  };
}

export async function renderDiamondPage(params, stageLayout) {
  const { id } = await params;
  const diamond = getDiamond(id);
  if (!diamond) notFound();

  const tracrRecord = getTracrRecord(id);
  const giaRecord = getGiaRecord(id);
  const { prev, next } = getAdjacentDiamonds(id);

  return (
    <DiamondExperience
      key={diamond.id}
      diamond={diamond}
      tracrRecord={tracrRecord}
      giaRecord={giaRecord}
      prev={prev}
      next={next}
      stageLayout={stageLayout}
    />
  );
}
