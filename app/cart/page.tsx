"use client";

import Order from "@/ui/cart/order";
import { useWindowHeight } from "@/hooks/useWindowHeight";

const heads = ["Product", "Price", "Quantity", "Total", "Action"] as const;

export default function CartPage() {
  const minHeight = useWindowHeight();

  return (
    <main
      className="relative z-10 bg-white px-8 py-10 md:px-20"
      style={{ minHeight: minHeight ? `${minHeight}px` : undefined }}
    >
      <h3 className="mb-5 text-xl font-medium">REVIEW YOUR ORDER (mock)</h3>
      <div className="overflow-x-auto text-sm">
        {/* Header */}
        <div className="mb-2 grid min-w-[600px] grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 rounded-lg border text-center font-medium">
          {heads.map((head, index) => (
            <div className="whitespace-nowrap p-2" key={index}>
              {head}
            </div>
          ))}
        </div>
        <Order />
      </div>
    </main>
  );
}
