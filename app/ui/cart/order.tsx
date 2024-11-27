"use client";

import { formatCurrency } from "@/utils/currency";
// import EmptyState from "@ui/cart/empty";
import { MdDelete } from "react-icons/md";
import ImageTag from "@ui/image";
import Button from "@ui/button";
import { mockProducts } from "@ui/data/cart";

const heads = ["Product", "Price", "Quantity", "Total", "Action"] as const;

export default function Order() {
  return (
    <>
      {/* Quantity > 1 */}
      <div className="text-sm">
        {/* Header */}
        <div className="mb-2 grid min-w-[600px] grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 rounded-md border text-center font-medium">
          {heads.map((head) => (
            <div className="whitespace-nowrap p-2" key={head}>
              {head}
            </div>
          ))}
        </div>
        {/* Product List */}
        {mockProducts.map(({ href, name, priceCents, quantity }) => (
          <div
            className="mb-2 grid min-w-[600px] grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 rounded-md border"
            key={href}
          >
            {/* Product Info */}
            <div className="flex flex-col items-center justify-center gap-2 p-2 text-center sm:flex-row sm:justify-start sm:text-left">
              <ImageTag href={href} name={name} />
              <span className="md:line-clamp-1">{name}</span>
            </div>
            {/* Price */}
            <div className="flex items-center justify-center">
              ${formatCurrency(priceCents)}
            </div>
            {/* Quantity */}
            <div className="flex items-center justify-center">
              <div className="flex items-center border">
                <button className="border-r px-3 py-1 transition-all duration-300 hover:bg-stone-100">
                  -
                </button>
                <span className="select-none px-3 py-1">{quantity}</span>
                <button className="border-l px-3 py-1 transition-all duration-300 hover:bg-stone-100">
                  +
                </button>
              </div>
            </div>
            {/* Total */}
            <div className="flex items-center justify-center">
              ${formatCurrency(priceCents * quantity)}
            </div>
            {/* Action */}
            <div className="flex items-center justify-center">
              <Button>
                <span className="sm:hidden">
                  <MdDelete />
                </span>
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
