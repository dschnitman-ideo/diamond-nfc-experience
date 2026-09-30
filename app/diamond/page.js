import { redirect } from "next/navigation";
import { getDiamonds } from "@/data/diamonds";

export default async function DiamondIndexRedirect() {
  const diamonds = await getDiamonds();
  redirect(`/diamond/${diamonds[0].id}`);
}
