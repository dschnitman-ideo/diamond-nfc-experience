import { redirect } from "next/navigation";
import { diamonds } from "@/data/diamonds";

export default function DiamondIndexRedirect() {
  redirect(`/diamond/${diamonds[0].id}`);
}
