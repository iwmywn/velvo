"use client";

import Link from "next/link";
import Image from "next/image";
import { formatCurrency, getPriceAfterDiscount } from "@lib/utils";
import { useState } from "react";
import { Product } from "@lib/definition";

export default function ProductCard({
  name,
  priceCents,
  images,
  saleOff,
  slug,
}: Product) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const priceAfterDiscount = getPriceAfterDiscount(priceCents, saleOff);

  return (
    <Link
      href={`/product/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => {
        if (images.length > 1) setCurrentImageIndex(1);
      }}
      onMouseLeave={() => setCurrentImageIndex(0)}
    >
      {saleOff > 0 && (
        <div className="absolute left-0 top-0 z-10 rounded-tl-lg bg-red-600 px-3 py-1 text-xs font-bold text-white">
          {saleOff}% OFF
        </div>
      )}
      <div className="flex h-64 items-center justify-center">
        <Image
          src={images[currentImageIndex]}
          alt={name}
          width={240}
          height={240}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 240px"
          className="transition-transform duration-300 group-hover:scale-105"
          priority
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h3 className="truncate text-center text-sm font-semibold uppercase text-gray-900">
          {name}
        </h3>
        <div className="flex items-center justify-center gap-3">
          {saleOff > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ${formatCurrency(priceCents)}
            </span>
          )}
          <span className="text-base font-semibold text-red-500">
            ${priceAfterDiscount}
          </span>
        </div>
      </div>
    </Link>
  );
}
