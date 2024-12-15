import { fetchCartProducts, fetchInvoiceProducts } from "@/app/lib/data";
import { getUserId } from "@api/auth";
import Loading from "@ui/loading";
import PurchaseOverview from "@ui/purchase/overview";
import { Metadata } from "next";
import { Suspense } from "react";

export function generateMetadata(): Metadata {
  return { title: "My purchase" };
}

export default async function PurchasePage() {
  const userId = await getUserId();
  const [invoiceProducts, cartProducts] = await Promise.all([
    fetchInvoiceProducts(userId),
    fetchCartProducts(userId),
  ]);
  console.log("userId: ", userId);
  console.log("invoiceProducts: ", invoiceProducts);

  return (
    <Suspense fallback={<Loading />}>
      <PurchaseOverview
        invoiceProducts={invoiceProducts}
        cartProducts={cartProducts}
      />
    </Suspense>
  );
}
