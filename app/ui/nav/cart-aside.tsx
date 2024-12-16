"use client";

import Link from "next/link";
import { GiShoppingCart } from "react-icons/gi";
import { useCartContext } from "@ui/hooks/cart";

export default function CartSummary() {
  const { quantity } = useCartContext();

  return (
    <Link
      className="relative cursor-pointer"
      href="/cart-overlay"
      scroll={false}
      title="Cart"
    >
      <GiShoppingCart className="text-[22px] md:text-2xl" />
      {quantity > 0 && (
        <span className="pointer-events-none absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full border bg-white text-xs text-black">
          {quantity}
        </span>
      )}
    </Link>
  );
}
