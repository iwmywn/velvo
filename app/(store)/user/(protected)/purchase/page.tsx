import Loading from "@/app/ui/loading";
import PurchaseOverview from "@ui/purchase/overview";
import { Metadata } from "next";
import { Suspense } from "react";

export function generateMetadata(): Metadata {
  return { title: "My purchase" };
}

export default function PurchasePage() {
  return (
    <Suspense fallback={<Loading />}>
      <PurchaseOverview />v
    </Suspense>
  );
}
