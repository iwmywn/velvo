import Loading from "@/ui/loading";
import PurchaseOverview from "@/ui/purchase/overview";
import { Suspense } from "react";

export default function PurchasePage() {
  return (
    <Suspense fallback={<Loading />}>
      <PurchaseOverview />
    </Suspense>
  );
}
