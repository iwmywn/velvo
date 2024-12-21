import PurchaseOverview from "@ui/purchase/overview";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return { title: "My purchase" };
}

export default function PurchasePage() {
  return <PurchaseOverview />;
}
