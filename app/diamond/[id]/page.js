import { notFound } from "next/navigation";
import { getDiamond, getAdjacentDiamonds } from "@/data/diamonds";
import { getTracrRecord } from "@/data/tracr";
import { getGiaRecord } from "@/data/gia";
import DiamondExperience from "@/components/DiamondExperience";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const diamond = getDiamond(id);
  return {
    title: diamond ? `${diamond.name}: Diamond ${diamond.id}` : "Diamond not found",
  };
}

export default async function DiamondPage({ params }) {
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
    />
  );
}
