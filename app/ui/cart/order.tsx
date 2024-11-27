"use client";

import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { GiShoppingCart } from "react-icons/gi";
import { MdDelete } from "react-icons/md";

const heads = ["Product", "Price", "Quantity", "Total", "Action"] as const;

const mockProducts = [
  {
    href: "/men_1.png",
    name: "Young Green College Varsity Jacket",
    priceCents: 4545,
    quantity: 2,
  },
  {
    href: "/women_1.png",
    name: "Cardigan",
    priceCents: 7000,
    quantity: 1,
  },
] as const;

export default function Order() {
  return (
    <>
      {/* Quantity: 0 */}
      <div className="flex min-h-screen flex-col items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-gray-500">
            <GiShoppingCart fontSize={50} />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">
            Your cart is empty
          </h1>
          <p className="text-center text-gray-500">
            Looks like you have not added anything to your cart yet.
          </p>
          <Link
            className="mt-2 rounded-md border border-white bg-black px-5 py-3 text-sm text-white transition-all duration-500 hover:scale-95"
            href="/"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </>
  );
}

function haveQuantity() {
  return (
    <>
      {/* Quantity > 1 */}
      <div className="text-sm">
        {/* Header */}
        <div className="mb-2 grid min-w-[600px] grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 rounded-md border text-center font-medium">
          {heads.map((head, index) => (
            <div className="whitespace-nowrap p-2" key={index}>
              {head}
            </div>
          ))}
        </div>
        {/* Product List */}
        {mockProducts.map(({ href, name, priceCents, quantity }, index) => (
          <div
            className="mb-2 grid min-w-[600px] grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 rounded-md border"
            key={index}
          >
            {/* Product Info */}
            <div className="flex flex-col items-center justify-center gap-2 p-2 text-center sm:flex-row sm:justify-start sm:text-left">
              <span className="relative h-20 w-20 flex-shrink-0 sm:h-24 sm:w-24">
                <Image
                  src={href}
                  alt="product"
                  fill
                  priority
                  style={{ objectFit: "contain" }}
                />
              </span>
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
              <button className="rounded bg-black px-4 py-[6px] text-white transition-all duration-300 hover:scale-95">
                <span className="sm:hidden">
                  <MdDelete />
                </span>
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
