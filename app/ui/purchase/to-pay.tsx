"use client";

import { formatCurrency } from "@/utils/currency";
import { MdDelete } from "react-icons/md";
import ImageTag from "@ui/image";
import Button from "@ui/button";
import { mockProducts } from "@/lib/placeholder-data";

const heads = ["Product", "Price", "Quantity", "Total", "Action"] as const;

export default function ToPay() {
  return (
    <div className="flex flex-col gap-4">
      <div className="hidden select-none grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 border text-center font-medium sm:grid">
        {heads.map((head) => (
          <div className="p-2" key={head}>
            {head}
          </div>
        ))}
      </div>

      {mockProducts.map(({ src, name, priceCents, quantity }) => (
        <div
          className="flex flex-col gap-4 rounded-md border p-2 text-sm sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_1fr] sm:gap-2 sm:p-0"
          key={src}
        >
          <div className="flex items-center gap-2 sm:flex-col sm:justify-center sm:gap-1 sm:py-1 sm:text-center">
            <ImageTag src={src} alt={name} />
            <span className="line-clamp-2 font-medium">{name}</span>
          </div>

          <div className="hidden items-center justify-center opacity-65 sm:flex">
            ${formatCurrency(priceCents)}
          </div>

          <div className="flex items-center justify-end sm:justify-center">
            <div className="flex w-full max-w-[100px] items-center border">
              <button className="flex-1 border-r py-1 transition-all duration-300 hover:bg-stone-100">
                -
              </button>
              <span className="flex-1 select-none py-1 text-center">
                {quantity}
              </span>
              <button className="flex-1 border-l py-1 transition-all duration-300 hover:bg-stone-100">
                +
              </button>
            </div>
          </div>

          <div className="hidden items-center justify-center opacity-65 sm:flex">
            ${formatCurrency(priceCents * quantity)}
          </div>

          <div className="flex items-center justify-end sm:justify-center">
            <Button
              className="flex items-center justify-center gap-2 px-4 sm:max-w-[100px] sm:flex-1 sm:px-0"
              type="submit"
            >
              <MdDelete />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>

          <div className="flex flex-col gap-2 sm:hidden">
            <div className="flex justify-between">
              <span>Price:</span>
              <span>${formatCurrency(priceCents)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span>${formatCurrency(priceCents * quantity)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
