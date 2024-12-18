import { Suspense } from "react";
import CartOverlay from "@ui/cart/cart-overlay";
import { fetchCartProducts } from "@lib/data";
import { getUserId } from "@api/auth";

async function CartContent() {
  const userId = await getUserId();
  const cartProducts = await fetchCartProducts(userId);

  return <CartOverlay cartProducts={cartProducts} />;
}

export default function CartOverlayPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
        </div>
      }
    >
      <CartContent />
    </Suspense>
  );
}
