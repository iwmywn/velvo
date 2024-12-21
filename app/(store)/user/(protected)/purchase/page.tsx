import { fetchCartProducts, fetchInvoiceProducts } from "@/app/lib/data";
import { getUserId } from "@api/auth";
import PurchaseOverview from "@ui/purchase/overview";
import { Metadata } from "next";
import { Suspense } from "react";

export function generateMetadata(): Metadata {
  return { title: "My purchase" };
}

async function PurchaseContent() {
  const userId = await getUserId();
  const [invoiceProducts, cartProducts] = await Promise.all([
    fetchInvoiceProducts(userId),
    fetchCartProducts(userId),
  ]);

  return (
    <PurchaseOverview
      invoiceProducts={invoiceProducts}
      cartProducts={cartProducts}
    />
  );
}

export default function PurchasePage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
        </div>
      }
    >
      <PurchaseContent />
    </Suspense>
  );
}
